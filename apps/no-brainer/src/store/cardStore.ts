import { create } from 'zustand';
import { Card } from '../types/database';
import * as db from '../services/database';

interface CardStore {
  cards: Card[];
  dueCards: Card[];
  currentCard: Card | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadCardsForDeck: (deckId: string) => Promise<void>;
  loadDueCards: (deckId?: string) => Promise<void>;
  createCard: (
    deckId: string,
    type: Card['type'],
    front: string,
    back: string,
    tags?: string
  ) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  setCurrentCard: (card: Card | null) => void;
  setError: (error: string | null) => void;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  dueCards: [],
  currentCard: null,
  loading: false,
  error: null,

  loadCardsForDeck: async (deckId: string) => {
    set({ loading: true, error: null });
    try {
      const cards = await db.getCardsForDeck(deckId);
      set({ cards, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '카드 로드 실패',
        loading: false
      });
    }
  },

  loadDueCards: async (deckId?: string) => {
    set({ loading: true, error: null });
    try {
      const dueCards = await db.getDueCards(deckId);
      set({ dueCards, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '복습 카드 로드 실패',
        loading: false
      });
    }
  },

  createCard: async (
    deckId: string,
    type: Card['type'],
    front: string,
    back: string,
    tags?: string
  ) => {
    try {
      const newCard = await db.createCard(deckId, type, front, back, tags);
      set((state) => ({
        cards: [newCard, ...state.cards],
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '카드 생성 실패'
      });
      throw error;
    }
  },

  updateCard: async (cardId: string, updates: Partial<Card>) => {
    try {
      await db.updateCard(cardId, updates);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId
            ? { ...card, ...updates, updatedAt: Date.now() }
            : card
        ),
        dueCards: state.dueCards.map((card) =>
          card.id === cardId
            ? { ...card, ...updates, updatedAt: Date.now() }
            : card
        ),
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '카드 수정 실패'
      });
      throw error;
    }
  },

  deleteCard: async (cardId: string) => {
    try {
      await db.deleteCard(cardId);
      set((state) => ({
        cards: state.cards.filter((card) => card.id !== cardId),
        dueCards: state.dueCards.filter((card) => card.id !== cardId),
        error: null
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '카드 삭제 실패'
      });
      throw error;
    }
  },

  setCurrentCard: (card: Card | null) => set({ currentCard: card }),
  setError: (error: string | null) => set({ error }),
}));