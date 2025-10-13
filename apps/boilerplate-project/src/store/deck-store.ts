import { create } from 'zustand';
import { DatabaseHelpers } from '@/lib/database';
import type { Deck, DeckWithStats } from '@/types';

interface DeckStore {
  decks: DeckWithStats[];
  loading: boolean;
  error: string | null;

  loadDecks: () => Promise<void>;
  createDeck: (deck: { name: string; description?: string }) => Promise<string>;
  updateDeck: (id: string, updates: { name?: string; description?: string }) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  getDeck: (id: string) => DeckWithStats | undefined;
  refreshDeckStats: (deckId: string) => Promise<void>;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  loading: false,
  error: null,

  loadDecks: async () => {
    set({ loading: true, error: null });
    try {
      const decks = await DatabaseHelpers.getAllDecks();

      // Calculate stats for each deck
      const decksWithStats: DeckWithStats[] = await Promise.all(
        decks.map(async (deck) => {
          const cards = await DatabaseHelpers.getCardsByDeck(deck.id);
          const now = Date.now();

          return {
            id: deck.id,
            name: deck.name,
            description: deck.description,
            createdAt: deck.created_at,
            updatedAt: deck.updated_at,
            cardCount: cards.length,
            dueCount: cards.filter(c => c.due_date && c.due_date <= now).length,
            newCount: cards.filter(c => !c.review_count || c.review_count === 0).length,
          };
        })
      );

      set({ decks: decksWithStats, loading: false });
    } catch (error) {
      console.error('Failed to load decks:', error);
      set({ error: 'Failed to load decks', loading: false });
    }
  },

  createDeck: async ({ name, description }) => {
    const id = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      await DatabaseHelpers.createDeck({ id, name, description });
      await get().loadDecks();
      return id;
    } catch (error) {
      console.error('Failed to create deck:', error);
      throw error;
    }
  },

  updateDeck: async (id, updates) => {
    try {
      await DatabaseHelpers.updateDeck(id, updates);
      await get().loadDecks();
    } catch (error) {
      console.error('Failed to update deck:', error);
      throw error;
    }
  },

  deleteDeck: async (id) => {
    try {
      await DatabaseHelpers.deleteDeck(id);
      await get().loadDecks();
    } catch (error) {
      console.error('Failed to delete deck:', error);
      throw error;
    }
  },

  getDeck: (id) => {
    return get().decks.find(deck => deck.id === id);
  },

  refreshDeckStats: async (deckId) => {
    try {
      const deck = await DatabaseHelpers.getDeck(deckId);
      if (!deck) return;

      const cards = await DatabaseHelpers.getCardsByDeck(deckId);
      const now = Date.now();

      const deckWithStats: DeckWithStats = {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        createdAt: deck.created_at,
        updatedAt: deck.updated_at,
        cardCount: cards.length,
        dueCount: cards.filter(c => c.due_date && c.due_date <= now).length,
        newCount: cards.filter(c => !c.review_count || c.review_count === 0).length,
      };

      set(state => ({
        decks: state.decks.map(d => d.id === deckId ? deckWithStats : d)
      }));
    } catch (error) {
      console.error('Failed to refresh deck stats:', error);
    }
  },
}));