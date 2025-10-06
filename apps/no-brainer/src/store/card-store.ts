import { create } from 'zustand';
import type { Card, ReviewState } from '@/src/types';
import { db } from '@/src/lib/database';
import { generateId } from '@/src/lib/id';

interface CardWithReview extends Card {
  reviewState: ReviewState;
}

interface CardStore {
  cards: CardWithReview[];
  loading: boolean;
  error: string | null;

  // Actions
  loadCardsByDeck: (deckId: string) => void;
  createCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  getCardById: (id: string) => CardWithReview | undefined;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  loading: false,
  error: null,

  loadCardsByDeck: (deckId: string) => {
    set({ loading: true, error: null });
    try {
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
        LEFT JOIN review_states rs ON rs.card_id = c.id
        WHERE c.deck_id = ?
        ORDER BY c.created_at DESC
        `,
        [deckId]
      );

      const cardsWithReview: CardWithReview[] = cards.map(card => ({
        id: card.id,
        deckId: card.deckId,
        front: card.front,
        back: card.back,
        tags: card.tags,
        template: card.template as 'basic' | 'basic-reversed',
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        reviewState: {
          cardId: card.cardId || card.id,
          stepIndex: (card.stepIndex || 0) as 0 | 1 | 2 | 3,
          dueDate: card.dueDate || Date.now(),
          lastReviewedAt: card.lastReviewedAt,
          reviewCount: card.reviewCount || 0,
        },
      }));

      set({ cards: cardsWithReview, loading: false });
    } catch (error) {
      console.error('Failed to load cards:', error);
      set({ error: 'Failed to load cards', loading: false });
    }
  },

  createCard: async (cardData) => {
    const id = generateId();
    const now = Date.now();

    try {
      // Insert card
      db.runSync(
        `INSERT INTO cards (id, deck_id, front, back, tags, template, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          cardData.deckId,
          cardData.front,
          cardData.back,
          cardData.tags || null,
          cardData.template || 'basic',
          now,
          now,
        ]
      );

      // Create initial review state (new card, due today)
      db.runSync(
        `INSERT INTO review_states (card_id, step_index, due_date, review_count)
         VALUES (?, ?, ?, ?)`,
        [id, 0, now, 0]
      );

      get().loadCardsByDeck(cardData.deckId);
      return id;
    } catch (error) {
      console.error('Failed to create card:', error);
      throw error;
    }
  },

  updateCard: async (id, updates) => {
    const now = Date.now();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.front !== undefined) {
      fields.push('front = ?');
      values.push(updates.front);
    }
    if (updates.back !== undefined) {
      fields.push('back = ?');
      values.push(updates.back);
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      values.push(updates.tags);
    }
    if (updates.template !== undefined) {
      fields.push('template = ?');
      values.push(updates.template);
    }

    fields.push('updated_at = ?');
    values.push(now);

    try {
      db.runSync(`UPDATE cards SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);

      // Reload cards for current deck
      const card = get().getCardById(id);
      if (card) {
        get().loadCardsByDeck(card.deckId);
      }
    } catch (error) {
      console.error('Failed to update card:', error);
      throw error;
    }
  },

  deleteCard: async (id) => {
    try {
      const card = get().getCardById(id);
      db.runSync('DELETE FROM cards WHERE id = ?', [id]);

      if (card) {
        get().loadCardsByDeck(card.deckId);
      }
    } catch (error) {
      console.error('Failed to delete card:', error);
      throw error;
    }
  },

  getCardById: (id) => {
    return get().cards.find(card => card.id === id);
  },
}));
