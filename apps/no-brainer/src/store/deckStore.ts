import { create } from 'zustand';
import { Deck } from '../types/database';
import * as db from '../services/database';

interface DeckStore {
  decks: Deck[];
  loading: boolean;
  error: string | null;

  // Actions
  loadDecks: () => Promise<void>;
  createDeck: (name: string, description?: string) => Promise<void>;
  updateDeck: (deckId: string, name: string, description?: string) => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  loading: false,
  error: null,

  loadDecks: async () => {
    set({ loading: true, error: null });
    try {
      const decks = await db.getDecks();
      set({ decks, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '덱 로드 실패',
        loading: false
      });
    }
  },

  createDeck: async (name: string, description?: string) => {
    try {
      const newDeck = await db.createDeck(name, description);
      set((state) => ({
        decks: [newDeck, ...state.decks],
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '덱 생성 실패'
      });
      throw error;
    }
  },

  updateDeck: async (deckId: string, name: string, description?: string) => {
    try {
      await db.updateDeck(deckId, name, description);
      set((state) => ({
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? { ...deck, name, description, updatedAt: Date.now() }
            : deck
        ),
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '덱 수정 실패'
      });
      throw error;
    }
  },

  deleteDeck: async (deckId: string) => {
    try {
      await db.deleteDeck(deckId);
      set((state) => ({
        decks: state.decks.filter((deck) => deck.id !== deckId),
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '덱 삭제 실패'
      });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
}));