import * as SQLite from 'expo-sqlite';

const DB_NAME = 'nobrainer.db';

// Initialize database
export const db = SQLite.openDatabaseSync(DB_NAME);

// Create tables
export function initDatabase() {
  // Decks table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      notification_enabled INTEGER DEFAULT 0,
      notification_time TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Cards table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY NOT NULL,
      deck_id TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      tags TEXT,
      template TEXT DEFAULT 'basic',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
  `);

  // Review states table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS review_states (
      card_id TEXT PRIMARY KEY NOT NULL,
      step_index INTEGER DEFAULT 0,
      due_date INTEGER NOT NULL,
      last_reviewed_at INTEGER,
      review_count INTEGER DEFAULT 0,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );
  `);

  // Review sessions table (for statistics)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS review_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      deck_id TEXT NOT NULL,
      reviewed_cards INTEGER DEFAULT 0,
      hard_count INTEGER DEFAULT 0,
      good_count INTEGER DEFAULT 0,
      easy_count INTEGER DEFAULT 0,
      started_at INTEGER NOT NULL,
      completed_at INTEGER NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
  `);

  // Create indexes for performance
  db.execSync('CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_review_states_due_date ON review_states(due_date);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_review_sessions_deck_id ON review_sessions(deck_id);');

  console.log('✅ Database initialized');
}

// Reset database (for development)
export function resetDatabase() {
  db.execSync('DROP TABLE IF EXISTS review_sessions;');
  db.execSync('DROP TABLE IF EXISTS review_states;');
  db.execSync('DROP TABLE IF EXISTS cards;');
  db.execSync('DROP TABLE IF EXISTS decks;');
  initDatabase();
  console.log('✅ Database reset');
}
