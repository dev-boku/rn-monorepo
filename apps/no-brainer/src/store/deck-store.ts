import { create } from 'zustand';
import type { Deck, DeckWithStats } from '@/src/types';
import { db } from '@/src/lib/database';
import { generateId } from '@/src/lib/id';

interface DeckStore {
  decks: DeckWithStats[];
  loading: boolean;
  error: string | null;

  // Actions
  loadDecks: () => void;
  createDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  getDeckById: (id: string) => DeckWithStats | undefined;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  loading: false,
  error: null,

  loadDecks: () => {
    set({ loading: true, error: null });
    try {
      // Get all decks
      const decksRaw = db.getAllSync<any>(
        `SELECT * FROM decks ORDER BY updated_at DESC`
      );

      const decksWithStats: DeckWithStats[] = decksRaw.map(deck => {
        // Get card count
        const cardCount = db.getFirstSync<{ count: number }>(
          `SELECT COUNT(*) as count FROM cards WHERE deck_id = ?`,
          [deck.id]
        );

        // Get due today count
        const dueToday = db.getFirstSync<{ count: number }>(
          `SELECT COUNT(*) as count FROM review_states rs
           INNER JOIN cards c ON c.id = rs.card_id
           WHERE c.deck_id = ? AND rs.due_date <= ?`,
          [deck.id, Date.now()]
        );

        // Get new cards count
        const newCards = db.getFirstSync<{ count: number }>(
          `SELECT COUNT(*) as count FROM review_states rs
           INNER JOIN cards c ON c.id = rs.card_id
           WHERE c.deck_id = ? AND rs.review_count = 0`,
          [deck.id]
        );

        return {
          id: deck.id,
          name: deck.name,
          description: deck.description,
          notificationEnabled: deck.notification_enabled === 1,
          notificationTime: deck.notification_time,
          createdAt: deck.created_at,
          updatedAt: deck.updated_at,
          totalCards: cardCount?.count || 0,
          dueToday: dueToday?.count || 0,
          newCards: newCards?.count || 0,
        };
      });

      set({ decks: decksWithStats, loading: false });
    } catch (error) {
      console.error('Failed to load decks:', error);
      set({ error: 'Failed to load decks', loading: false });
    }
  },

  createDeck: async (deckData) => {
    const id = generateId();
    const now = Date.now();

    try {
      db.runSync(
        `INSERT INTO decks (id, name, description, notification_enabled, notification_time, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          deckData.name,
          deckData.description || null,
          deckData.notificationEnabled ? 1 : 0,
          deckData.notificationTime || null,
          now,
          now,
        ]
      );

      get().loadDecks();
      return id;
    } catch (error) {
      console.error('Failed to create deck:', error);
      throw error;
    }
  },

  updateDeck: async (id, updates) => {
    const now = Date.now();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.notificationEnabled !== undefined) {
      fields.push('notification_enabled = ?');
      values.push(updates.notificationEnabled ? 1 : 0);
    }
    if (updates.notificationTime !== undefined) {
      fields.push('notification_time = ?');
      values.push(updates.notificationTime);
    }

    fields.push('updated_at = ?');
    values.push(now);

    try {
      db.runSync(`UPDATE decks SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
      get().loadDecks();
    } catch (error) {
      console.error('Failed to update deck:', error);
      throw error;
    }
  },

  deleteDeck: async (id) => {
    try {
      db.runSync('DELETE FROM decks WHERE id = ?', [id]);
      get().loadDecks();
    } catch (error) {
      console.error('Failed to delete deck:', error);
      throw error;
    }
  },

  getDeckById: (id) => {
    return get().decks.find(deck => deck.id === id);
  },
}));
