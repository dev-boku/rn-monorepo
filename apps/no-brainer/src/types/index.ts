// Phase 1 MVP Types

export type CardTemplate = 'basic' | 'basic-reversed';

export interface Deck {
  id: string;
  name: string;
  description?: string;
  notificationEnabled: boolean;
  notificationTime?: string; // HH:mm format
  createdAt: number;
  updatedAt: number;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags?: string; // comma-separated
  template: CardTemplate;
  createdAt: number;
  updatedAt: number;
}

export interface ReviewState {
  cardId: string;
  stepIndex: 0 | 1 | 2 | 3; // 0=1day, 1=4days, 2=7days, 3=14days
  dueDate: number; // timestamp
  lastReviewedAt?: number;
  reviewCount: number;
}

export type ReviewRating = 'hard' | 'good' | 'easy';

export interface ReviewSession {
  deckId: string;
  reviewedCards: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  startedAt: number;
  completedAt: number;
}

export interface DeckWithStats extends Deck {
  totalCards: number;
  dueToday: number;
  newCards: number;
}
