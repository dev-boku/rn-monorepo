// 덱 타입
export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  cardCount?: number;
  dueCount?: number;
}

// 카드 타입
export interface Card {
  id: string;
  deckId: string;
  type: 'basic' | 'basic-reversed' | 'cloze';
  front: string;
  back: string;
  tags?: string;
  nextReview: number; // Unix timestamp
  interval: number; // 일 단위
  easeFactor: number; // 난이도 계수 (기본값: 2.5)
  repetitions: number; // 반복 횟수
  createdAt: number;
  updatedAt: number;
}

// 학습 기록 타입
export interface ReviewLog {
  id: string;
  cardId: string;
  reviewedAt: number;
  grade: 'again' | 'hard' | 'good' | 'easy';
  timeSpent: number; // 초 단위
  interval: number; // 복습 간격
}

// 학습 세션 타입
export interface StudySession {
  id: string;
  deckId: string;
  startedAt: number;
  endedAt?: number;
  cardsStudied: number;
  correctCount: number;
}

// 통계 타입
export interface Stats {
  totalCards: number;
  totalDecks: number;
  cardsStudiedToday: number;
  cardsStudiedThisWeek: number;
  streakDays: number;
  averageAccuracy: number;
}

// SRS 계산용 상수
export const SRS_INTERVALS = {
  AGAIN: 1, // 1일
  HARD: 1, // 1일
  GOOD: [1, 4, 7, 14], // 고정 간격
  EASY_MULTIPLIER: 2, // Easy는 Good의 2배
};

// 데이터베이스 스키마 버전
export const DB_VERSION = 1;