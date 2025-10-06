import { create } from 'zustand';
import type { Card, ReviewState, ReviewRating, ReviewSession } from '@/src/types';
import { db } from '@/src/lib/database';
import { calculateNextReview, getEndOfDay } from '@/src/lib/srs';
import { generateId } from '@/src/lib/id';

interface CardWithReview extends Card {
  reviewState: ReviewState;
}

interface ReviewStore {
  currentSession: ReviewSession | null;
  reviewQueue: CardWithReview[];
  currentCardIndex: number;
  loading: boolean;

  // Actions
  startReviewSession: (deckId: string) => void;
  submitReview: (cardId: string, rating: ReviewRating) => Promise<void>;
  completeSession: () => Promise<void>;
  getCurrentCard: () => CardWithReview | undefined;
  hasMoreCards: () => boolean;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  currentSession: null,
  reviewQueue: [],
  currentCardIndex: 0,
  loading: false,

  startReviewSession: (deckId: string) => {
    set({ loading: true });
    try {
      const endOfToday = getEndOfDay(Date.now());

      // Get cards due for review today
      const cards = db.getAllSync<Card & ReviewState>(
        `
        SELECT
          c.id,
          c.deck_id as deckId,
          c.front,
          c.back,
          c.tags,
          c.template,
          c.created_at as createdAt,
          c.updated_at as updatedAt,
          rs.card_id as cardId,
          rs.step_index as stepIndex,
          rs.due_date as dueDate,
          rs.last_reviewed_at as lastReviewedAt,
          rs.review_count as reviewCount
        FROM cards c
        INNER JOIN review_states rs ON rs.card_id = c.id
        WHERE c.deck_id = ? AND rs.due_date <= ?
        ORDER BY rs.due_date ASC
        `,
        [deckId, endOfToday]
      );

      const reviewQueue: CardWithReview[] = cards.map(card => ({
        id: card.id,
        deckId: card.deckId,
        front: card.front,
        back: card.back,
        tags: card.tags,
        template: card.template as 'basic' | 'basic-reversed',
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        reviewState: {
          cardId: card.cardId,
          stepIndex: card.stepIndex as 0 | 1 | 2 | 3,
          dueDate: card.dueDate,
          lastReviewedAt: card.lastReviewedAt,
          reviewCount: card.reviewCount,
        },
      }));

      const session: ReviewSession = {
        deckId,
        reviewedCards: 0,
        hardCount: 0,
        goodCount: 0,
        easyCount: 0,
        startedAt: Date.now(),
        completedAt: 0,
      };

      set({
        currentSession: session,
        reviewQueue,
        currentCardIndex: 0,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to start review session:', error);
      set({ loading: false });
    }
  },

  submitReview: async (cardId: string, rating: ReviewRating) => {
    const { currentSession, reviewQueue, currentCardIndex } = get();
    if (!currentSession) return;

    try {
      const card = reviewQueue[currentCardIndex];
      if (!card || card.id !== cardId) {
        throw new Error('Card mismatch');
      }

      // Calculate next review
      const nextReview = calculateNextReview(card.reviewState, rating);

      // Update review state in database
      db.runSync(
        `UPDATE review_states
         SET step_index = ?, due_date = ?, last_reviewed_at = ?, review_count = review_count + 1
         WHERE card_id = ?`,
        [nextReview.stepIndex, nextReview.dueDate, Date.now(), cardId]
      );

      // Update session stats
      const updatedSession: ReviewSession = {
        ...currentSession,
        reviewedCards: currentSession.reviewedCards + 1,
        hardCount: currentSession.hardCount + (rating === 'hard' ? 1 : 0),
        goodCount: currentSession.goodCount + (rating === 'good' ? 1 : 0),
        easyCount: currentSession.easyCount + (rating === 'easy' ? 1 : 0),
      };

      set({
        currentSession: updatedSession,
        currentCardIndex: currentCardIndex + 1,
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  },

  completeSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    try {
      const completedSession: ReviewSession = {
        ...currentSession,
        completedAt: Date.now(),
      };

      // Save session to database
      const sessionId = generateId();
      db.runSync(
        `INSERT INTO review_sessions (id, deck_id, reviewed_cards, hard_count, good_count, easy_count, started_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sessionId,
          completedSession.deckId,
          completedSession.reviewedCards,
          completedSession.hardCount,
          completedSession.goodCount,
          completedSession.easyCount,
          completedSession.startedAt,
          completedSession.completedAt,
        ]
      );

      set({
        currentSession: completedSession,
        reviewQueue: [],
        currentCardIndex: 0,
      });
    } catch (error) {
      console.error('Failed to complete session:', error);
      throw error;
    }
  },

  getCurrentCard: () => {
    const { reviewQueue, currentCardIndex } = get();
    return reviewQueue[currentCardIndex];
  },

  hasMoreCards: () => {
    const { reviewQueue, currentCardIndex } = get();
    return currentCardIndex < reviewQueue.length;
  },
}));
