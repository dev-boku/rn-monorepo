export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DeckWithStats extends Deck {
  cardCount: number;
  dueCount: number;
  newCount: number;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CardWithReview extends Card {
  reviewState: ReviewState;
}

export interface ReviewState {
  cardId: string;
  stepIndex: number;
  dueDate: number;
  lastReviewedAt?: number;
  reviewCount: number;
  easeFactor: number;
  intervalDays: number;
}

export interface ReviewSession {
  id: string;
  deckId: string;
  startedAt: number;
  completedAt?: number;
  cardsReviewed: number;
  cardsHard: number;
  cardsGood: number;
  cardsEasy: number;
}

export type ReviewRating = 'hard' | 'good' | 'easy';

export interface StudySession {
  sessionId: string;
  deckId: string;
  cards: CardWithReview[];
  currentIndex: number;
  reviewedCount: number;
  totalCards: number;
  startedAt: number;
}