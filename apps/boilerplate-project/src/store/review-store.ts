import { create } from 'zustand';
import { DatabaseHelpers } from '@/lib/database';
import type { CardWithReview, ReviewRating, StudySession } from '@/types';

// SRS Algorithm: Fixed intervals (1, 4, 7, 14 days)
const INTERVALS = [1, 4, 7, 14];

function calculateNextReview(currentStepIndex: number, rating: ReviewRating): {
  stepIndex: number;
  dueDate: number;
  intervalDays: number;
} {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;

  let newStepIndex: number;
  let intervalDays: number;

  switch (rating) {
    case 'hard':
      // Reset to beginning
      newStepIndex = 0;
      intervalDays = INTERVALS[0];
      break;

    case 'good':
      // Move to next step
      newStepIndex = Math.min(currentStepIndex + 1, INTERVALS.length - 1);
      intervalDays = INTERVALS[newStepIndex];
      break;

    case 'easy':
      // Jump two steps
      newStepIndex = Math.min(currentStepIndex + 2, INTERVALS.length - 1);
      intervalDays = INTERVALS[newStepIndex];
      break;

    default:
      newStepIndex = currentStepIndex;
      intervalDays = INTERVALS[currentStepIndex];
  }

  return {
    stepIndex: newStepIndex,
    dueDate: now + (intervalDays * msPerDay),
    intervalDays,
  };
}

interface ReviewStore {
  currentSession: StudySession | null;
  currentCard: CardWithReview | null;
  loading: boolean;
  error: string | null;

  startSession: (deckId: string) => Promise<void>;
  submitReview: (cardId: string, rating: ReviewRating) => Promise<void>;
  endSession: () => Promise<void>;
  skipCard: () => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  currentSession: null,
  currentCard: null,
  loading: false,
  error: null,

  startSession: async (deckId) => {
    set({ loading: true, error: null });
    try {
      const dueCards = await DatabaseHelpers.getDueCards(deckId);

      if (dueCards.length === 0) {
        set({ loading: false, error: 'No cards due for review' });
        return;
      }

      const cardsWithReview: CardWithReview[] = dueCards.map((card) => ({
        id: card.id,
        deckId: card.deck_id,
        front: card.front,
        back: card.back,
        tags: card.tags ? JSON.parse(card.tags) : [],
        createdAt: card.created_at,
        updatedAt: card.updated_at,
        reviewState: {
          cardId: card.id,
          stepIndex: card.step_index || 0,
          dueDate: card.due_date,
          lastReviewedAt: card.last_reviewed_at,
          reviewCount: card.review_count || 0,
          easeFactor: card.ease_factor || 2.5,
          intervalDays: card.interval_days || 1,
        },
      }));

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const session: StudySession = {
        sessionId,
        deckId,
        cards: cardsWithReview,
        currentIndex: 0,
        reviewedCount: 0,
        totalCards: cardsWithReview.length,
        startedAt: Date.now(),
      };

      await DatabaseHelpers.createReviewSession({
        id: sessionId,
        deck_id: deckId,
      });

      set({
        currentSession: session,
        currentCard: cardsWithReview[0],
        loading: false,
      });
    } catch (error) {
      console.error('Failed to start session:', error);
      set({ error: 'Failed to start review session', loading: false });
    }
  },

  submitReview: async (cardId, rating) => {
    const session = get().currentSession;
    const currentCard = get().currentCard;

    if (!session || !currentCard || currentCard.id !== cardId) {
      console.error('Invalid review submission');
      return;
    }

    try {
      // Calculate next review
      const { stepIndex, dueDate, intervalDays } = calculateNextReview(
        currentCard.reviewState.stepIndex,
        rating
      );

      // Update review state in database
      await DatabaseHelpers.updateReviewState(cardId, {
        step_index: stepIndex,
        due_date: dueDate,
        last_reviewed_at: Date.now(),
        review_count: currentCard.reviewState.reviewCount + 1,
        interval_days: intervalDays,
      });

      // Update session statistics
      const statsUpdate: any = {
        cards_reviewed: session.reviewedCount + 1,
      };

      if (rating === 'hard') statsUpdate.cards_hard = (session as any).cardsHard || 0 + 1;
      if (rating === 'good') statsUpdate.cards_good = (session as any).cardsGood || 0 + 1;
      if (rating === 'easy') statsUpdate.cards_easy = (session as any).cardsEasy || 0 + 1;

      await DatabaseHelpers.updateReviewSession(session.sessionId, statsUpdate);

      // Move to next card
      const newSession = {
        ...session,
        currentIndex: session.currentIndex + 1,
        reviewedCount: session.reviewedCount + 1,
      };

      const nextCard = session.cards[newSession.currentIndex] || null;

      set({
        currentSession: newSession,
        currentCard: nextCard,
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      set({ error: 'Failed to submit review' });
    }
  },

  endSession: async () => {
    const session = get().currentSession;

    if (!session) return;

    try {
      await DatabaseHelpers.updateReviewSession(session.sessionId, {
        completed_at: Date.now(),
      });

      set({
        currentSession: null,
        currentCard: null,
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  },

  skipCard: () => {
    const session = get().currentSession;

    if (!session) return;

    const newSession = {
      ...session,
      currentIndex: Math.min(session.currentIndex + 1, session.cards.length - 1),
    };

    const nextCard = session.cards[newSession.currentIndex] || null;

    set({
      currentSession: newSession,
      currentCard: nextCard,
    });
  },
}));