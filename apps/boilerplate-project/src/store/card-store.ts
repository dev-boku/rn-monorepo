import { create } from 'zustand';
import { DatabaseHelpers } from '@/lib/database';
import type { Card, CardWithReview } from '@/types';

interface CardStore {
  cards: CardWithReview[];
  loading: boolean;
  error: string | null;

  loadCards: (deckId: string) => Promise<void>;
  createCard: (card: { deckId: string; front: string; back: string; tags?: string[] }) => Promise<string>;
  updateCard: (id: string, updates: { front?: string; back?: string; tags?: string[] }) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  getCard: (id: string) => CardWithReview | undefined;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  loading: false,
  error: null,

  loadCards: async (deckId) => {
    set({ loading: true, error: null });
    try {
      const cards = await DatabaseHelpers.getCardsByDeck(deckId);

      const cardsWithReview: CardWithReview[] = cards.map((card) => ({
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
          dueDate: card.due_date || Date.now(),
          lastReviewedAt: card.last_reviewed_at,
          reviewCount: card.review_count || 0,
          easeFactor: card.ease_factor || 2.5,
          intervalDays: card.interval_days || 1,
        },
      }));

      set({ cards: cardsWithReview, loading: false });
    } catch (error) {
      console.error('Failed to load cards:', error);
      set({ error: 'Failed to load cards', loading: false });
    }
  },

  createCard: async ({ deckId, front, back, tags }) => {
    const id = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      await DatabaseHelpers.createCard({
        id,
        deck_id: deckId,
        front,
        back,
        tags,
      });

      // Refresh cards for the current deck
      await get().loadCards(deckId);
      return id;
    } catch (error) {
      console.error('Failed to create card:', error);
      throw error;
    }
  },

  updateCard: async (id, updates) => {
    try {
      await DatabaseHelpers.updateCard(id, updates);

      // Update local state
      set(state => ({
        cards: state.cards.map(card =>
          card.id === id
            ? { ...card, ...updates, updatedAt: Date.now() }
            : card
        )
      }));
    } catch (error) {
      console.error('Failed to update card:', error);
      throw error;
    }
  },

  deleteCard: async (id) => {
    try {
      await DatabaseHelpers.deleteCard(id);

      // Update local state
      set(state => ({
        cards: state.cards.filter(card => card.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete card:', error);
      throw error;
    }
  },

  getCard: (id) => {
    return get().cards.find(card => card.id === id);
  },
}));