import * as SQLite from 'expo-sqlite';
import { Deck, Card, ReviewLog, StudySession, DB_VERSION } from '../types/database';

// 데이터베이스 인스턴스
let db: SQLite.SQLiteDatabase | null = null;

// 데이터베이스 초기화
export async function initDatabase(): Promise<void> {
  try {
    // 데이터베이스 열기
    db = await SQLite.openDatabaseAsync('nobrainer.db');

    // 테이블 생성
    await createTables();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// 테이블 생성
async function createTables(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  // 덱 테이블
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // 카드 테이블
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      type TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      tags TEXT,
      next_review INTEGER NOT NULL,
      interval INTEGER NOT NULL DEFAULT 0,
      ease_factor REAL NOT NULL DEFAULT 2.5,
      repetitions INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
  `);

  // 학습 기록 테이블
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS review_logs (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      reviewed_at INTEGER NOT NULL,
      grade TEXT NOT NULL,
      time_spent INTEGER NOT NULL,
      interval INTEGER NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );
  `);

  // 학습 세션 테이블
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      cards_studied INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
  `);

  // 인덱스 생성
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
    CREATE INDEX IF NOT EXISTS idx_cards_next_review ON cards(next_review);
    CREATE INDEX IF NOT EXISTS idx_review_logs_card_id ON review_logs(card_id);
    CREATE INDEX IF NOT EXISTS idx_study_sessions_deck_id ON study_sessions(deck_id);
  `);
}

// 유틸리티: UUID 생성
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============= 덱 관련 함수 =============

export async function createDeck(name: string, description?: string): Promise<Deck> {
  if (!db) throw new Error('Database not initialized');

  const id = generateId();
  const now = Date.now();

  await db.runAsync(
    'INSERT INTO decks (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [id, name, description || '', now, now]
  );

  return {
    id,
    name,
    description,
    createdAt: now,
    updatedAt: now,
    cardCount: 0,
    dueCount: 0,
  };
}

export async function getDecks(): Promise<Deck[]> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getAllAsync(`
    SELECT
      d.*,
      COUNT(c.id) as card_count,
      COUNT(CASE WHEN c.next_review <= ? THEN 1 END) as due_count
    FROM decks d
    LEFT JOIN cards c ON d.deck_id = c.deck_id
    GROUP BY d.id
    ORDER BY d.updated_at DESC
  `, [Date.now()]);

  return result.map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    cardCount: row.card_count,
    dueCount: row.due_count,
  }));
}

export async function getDeck(deckId: string): Promise<Deck | null> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getFirstAsync(
    'SELECT * FROM decks WHERE id = ?',
    [deckId]
  );

  if (!result) return null;

  return {
    id: (result as any).id,
    name: (result as any).name,
    description: (result as any).description,
    createdAt: (result as any).created_at,
    updatedAt: (result as any).updated_at,
  };
}

export async function updateDeck(deckId: string, name: string, description?: string): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    'UPDATE decks SET name = ?, description = ?, updated_at = ? WHERE id = ?',
    [name, description || '', Date.now(), deckId]
  );
}

export async function deleteDeck(deckId: string): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync('DELETE FROM decks WHERE id = ?', [deckId]);
}

// ============= 카드 관련 함수 =============

export async function createCard(
  deckId: string,
  type: Card['type'],
  front: string,
  back: string,
  tags?: string
): Promise<Card> {
  if (!db) throw new Error('Database not initialized');

  const id = generateId();
  const now = Date.now();

  const card: Card = {
    id,
    deckId,
    type,
    front,
    back,
    tags,
    nextReview: now,
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    createdAt: now,
    updatedAt: now,
  };

  await db.runAsync(
    `INSERT INTO cards (
      id, deck_id, type, front, back, tags,
      next_review, interval, ease_factor, repetitions,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      card.id, card.deckId, card.type, card.front, card.back, card.tags || '',
      card.nextReview, card.interval, card.easeFactor, card.repetitions,
      card.createdAt, card.updatedAt
    ]
  );

  return card;
}

export async function getCardsForDeck(deckId: string): Promise<Card[]> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getAllAsync(
    'SELECT * FROM cards WHERE deck_id = ? ORDER BY created_at DESC',
    [deckId]
  );

  return result.map((row: any) => ({
    id: row.id,
    deckId: row.deck_id,
    type: row.type,
    front: row.front,
    back: row.back,
    tags: row.tags,
    nextReview: row.next_review,
    interval: row.interval,
    easeFactor: row.ease_factor,
    repetitions: row.repetitions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getDueCards(deckId?: string): Promise<Card[]> {
  if (!db) throw new Error('Database not initialized');

  const now = Date.now();
  let query = 'SELECT * FROM cards WHERE next_review <= ?';
  const params: any[] = [now];

  if (deckId) {
    query += ' AND deck_id = ?';
    params.push(deckId);
  }

  query += ' ORDER BY next_review ASC';

  const result = await db.getAllAsync(query, params);

  return result.map((row: any) => ({
    id: row.id,
    deckId: row.deck_id,
    type: row.type,
    front: row.front,
    back: row.back,
    tags: row.tags,
    nextReview: row.next_review,
    interval: row.interval,
    easeFactor: row.ease_factor,
    repetitions: row.repetitions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function updateCard(cardId: string, updates: Partial<Card>): Promise<void> {
  if (!db) throw new Error('Database not initialized');

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
    values.push(updates.tags);
  }
  if (updates.nextReview !== undefined) {
    fields.push('next_review = ?');
    values.push(updates.nextReview);
  }
  if (updates.interval !== undefined) {
    fields.push('interval = ?');
    values.push(updates.interval);
  }
  if (updates.easeFactor !== undefined) {
    fields.push('ease_factor = ?');
    values.push(updates.easeFactor);
  }
  if (updates.repetitions !== undefined) {
    fields.push('repetitions = ?');
    values.push(updates.repetitions);
  }

  fields.push('updated_at = ?');
  values.push(Date.now());
  values.push(cardId);

  await db.runAsync(
    `UPDATE cards SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteCard(cardId: string): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync('DELETE FROM cards WHERE id = ?', [cardId]);
}

// ============= 학습 기록 관련 함수 =============

export async function createReviewLog(
  cardId: string,
  grade: ReviewLog['grade'],
  timeSpent: number,
  interval: number
): Promise<ReviewLog> {
  if (!db) throw new Error('Database not initialized');

  const id = generateId();
  const now = Date.now();

  await db.runAsync(
    'INSERT INTO review_logs (id, card_id, reviewed_at, grade, time_spent, interval) VALUES (?, ?, ?, ?, ?, ?)',
    [id, cardId, now, grade, timeSpent, interval]
  );

  return {
    id,
    cardId,
    reviewedAt: now,
    grade,
    timeSpent,
    interval,
  };
}

// ============= 통계 관련 함수 =============

export async function getStats(): Promise<any> {
  if (!db) throw new Error('Database not initialized');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoTimestamp = weekAgo.getTime();

  const totalDecks = await db.getFirstAsync('SELECT COUNT(*) as count FROM decks');
  const totalCards = await db.getFirstAsync('SELECT COUNT(*) as count FROM cards');

  const todayStudied = await db.getFirstAsync(
    'SELECT COUNT(DISTINCT card_id) as count FROM review_logs WHERE reviewed_at >= ?',
    [todayTimestamp]
  );

  const weekStudied = await db.getFirstAsync(
    'SELECT COUNT(DISTINCT card_id) as count FROM review_logs WHERE reviewed_at >= ?',
    [weekAgoTimestamp]
  );

  return {
    totalDecks: (totalDecks as any)?.count || 0,
    totalCards: (totalCards as any)?.count || 0,
    cardsStudiedToday: (todayStudied as any)?.count || 0,
    cardsStudiedThisWeek: (weekStudied as any)?.count || 0,
  };
}