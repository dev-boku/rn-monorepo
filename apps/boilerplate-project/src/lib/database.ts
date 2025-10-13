import * as SQLite from 'expo-sqlite';

const DB_NAME = 'nobrainer.db';

export const db = SQLite.openDatabaseSync(DB_NAME);

export async function initDatabase() {
  try {
    // Create tables
    await db.execAsync(`
      -- Decks table
      CREATE TABLE IF NOT EXISTS decks (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      -- Cards table
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY NOT NULL,
        deck_id TEXT NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        tags TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
      );

      -- Review states table
      CREATE TABLE IF NOT EXISTS review_states (
        card_id TEXT PRIMARY KEY NOT NULL,
        step_index INTEGER DEFAULT 0,
        due_date INTEGER NOT NULL,
        last_reviewed_at INTEGER,
        review_count INTEGER DEFAULT 0,
        ease_factor REAL DEFAULT 2.5,
        interval_days INTEGER DEFAULT 1,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
      );

      -- Review sessions table (for statistics)
      CREATE TABLE IF NOT EXISTS review_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        deck_id TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        completed_at INTEGER,
        cards_reviewed INTEGER DEFAULT 0,
        cards_hard INTEGER DEFAULT 0,
        cards_good INTEGER DEFAULT 0,
        cards_easy INTEGER DEFAULT 0,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
      CREATE INDEX IF NOT EXISTS idx_review_states_due_date ON review_states(due_date);
      CREATE INDEX IF NOT EXISTS idx_review_sessions_deck_id ON review_sessions(deck_id);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper functions for common database operations
export const DatabaseHelpers = {
  async getAllDecks() {
    return await db.getAllAsync<any>('SELECT * FROM decks ORDER BY updated_at DESC');
  },

  async getDeck(id: string) {
    return await db.getFirstAsync<any>('SELECT * FROM decks WHERE id = ?', [id]);
  },

  async createDeck(deck: { id: string; name: string; description?: string }) {
    const now = Date.now();
    await db.runAsync(
      'INSERT INTO decks (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [deck.id, deck.name, deck.description || null, now, now]
    );
  },

  async updateDeck(id: string, updates: { name?: string; description?: string }) {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }

    fields.push('updated_at = ?');
    values.push(Date.now());
    values.push(id);

    await db.runAsync(
      `UPDATE decks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deleteDeck(id: string) {
    await db.runAsync('DELETE FROM decks WHERE id = ?', [id]);
  },

  async getCardsByDeck(deckId: string) {
    return await db.getAllAsync<any>(
      `SELECT c.*, rs.due_date, rs.review_count, rs.step_index
       FROM cards c
       LEFT JOIN review_states rs ON c.id = rs.card_id
       WHERE c.deck_id = ?
       ORDER BY c.created_at DESC`,
      [deckId]
    );
  },

  async createCard(card: {
    id: string;
    deck_id: string;
    front: string;
    back: string;
    tags?: string[];
  }) {
    const now = Date.now();
    await db.runAsync(
      'INSERT INTO cards (id, deck_id, front, back, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [card.id, card.deck_id, card.front, card.back, JSON.stringify(card.tags || []), now, now]
    );

    // Initialize review state
    await db.runAsync(
      'INSERT INTO review_states (card_id, due_date, step_index, review_count) VALUES (?, ?, 0, 0)',
      [card.id, now]
    );
  },

  async updateCard(id: string, updates: { front?: string; back?: string; tags?: string[] }) {
    const fields = [];
    const values = [];

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
      values.push(JSON.stringify(updates.tags));
    }

    fields.push('updated_at = ?');
    values.push(Date.now());
    values.push(id);

    await db.runAsync(
      `UPDATE cards SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deleteCard(id: string) {
    await db.runAsync('DELETE FROM cards WHERE id = ?', [id]);
  },

  async getDueCards(deckId?: string) {
    const now = Date.now();
    const query = deckId
      ? `SELECT c.*, rs.* FROM cards c
         INNER JOIN review_states rs ON c.id = rs.card_id
         WHERE c.deck_id = ? AND rs.due_date <= ?
         ORDER BY rs.due_date ASC`
      : `SELECT c.*, rs.* FROM cards c
         INNER JOIN review_states rs ON c.id = rs.card_id
         WHERE rs.due_date <= ?
         ORDER BY rs.due_date ASC`;

    const params = deckId ? [deckId, now] : [now];
    return await db.getAllAsync<any>(query, params);
  },

  async updateReviewState(cardId: string, updates: {
    step_index?: number;
    due_date?: number;
    last_reviewed_at?: number;
    review_count?: number;
    ease_factor?: number;
    interval_days?: number;
  }) {
    const fields = [];
    const values = [];

    if (updates.step_index !== undefined) {
      fields.push('step_index = ?');
      values.push(updates.step_index);
    }
    if (updates.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(updates.due_date);
    }
    if (updates.last_reviewed_at !== undefined) {
      fields.push('last_reviewed_at = ?');
      values.push(updates.last_reviewed_at);
    }
    if (updates.review_count !== undefined) {
      fields.push('review_count = ?');
      values.push(updates.review_count);
    }
    if (updates.ease_factor !== undefined) {
      fields.push('ease_factor = ?');
      values.push(updates.ease_factor);
    }
    if (updates.interval_days !== undefined) {
      fields.push('interval_days = ?');
      values.push(updates.interval_days);
    }

    values.push(cardId);

    await db.runAsync(
      `UPDATE review_states SET ${fields.join(', ')} WHERE card_id = ?`,
      values
    );
  },

  async createReviewSession(session: {
    id: string;
    deck_id: string;
  }) {
    const now = Date.now();
    await db.runAsync(
      'INSERT INTO review_sessions (id, deck_id, started_at) VALUES (?, ?, ?)',
      [session.id, session.deck_id, now]
    );
  },

  async updateReviewSession(id: string, updates: {
    completed_at?: number;
    cards_reviewed?: number;
    cards_hard?: number;
    cards_good?: number;
    cards_easy?: number;
  }) {
    const fields = [];
    const values = [];

    if (updates.completed_at !== undefined) {
      fields.push('completed_at = ?');
      values.push(updates.completed_at);
    }
    if (updates.cards_reviewed !== undefined) {
      fields.push('cards_reviewed = ?');
      values.push(updates.cards_reviewed);
    }
    if (updates.cards_hard !== undefined) {
      fields.push('cards_hard = ?');
      values.push(updates.cards_hard);
    }
    if (updates.cards_good !== undefined) {
      fields.push('cards_good = ?');
      values.push(updates.cards_good);
    }
    if (updates.cards_easy !== undefined) {
      fields.push('cards_easy = ?');
      values.push(updates.cards_easy);
    }

    values.push(id);

    await db.runAsync(
      `UPDATE review_sessions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },
};