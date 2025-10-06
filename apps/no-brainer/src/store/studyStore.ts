import { create } from 'zustand';
import { Card, ReviewLog, SRS_INTERVALS } from '../types/database';
import * as db from '../services/database';

interface StudyStore {
  studyQueue: Card[];
  currentCardIndex: number;
  currentCard: Card | null;
  sessionStartTime: number | null;
  cardStartTime: number | null;
  sessionStats: {
    studied: number;
    correct: number;
    wrong: number;
  };

  // Actions
  startStudySession: (deckId?: string) => Promise<void>;
  showAnswer: () => void;
  reviewCard: (grade: 'again' | 'hard' | 'good' | 'easy') => Promise<void>;
  endSession: () => void;
  reset: () => void;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  studyQueue: [],
  currentCardIndex: 0,
  currentCard: null,
  sessionStartTime: null,
  cardStartTime: null,
  sessionStats: {
    studied: 0,
    correct: 0,
    wrong: 0,
  },

  startStudySession: async (deckId?: string) => {
    try {
      const dueCards = await db.getDueCards(deckId);

      if (dueCards.length === 0) {
        throw new Error('복습할 카드가 없습니다');
      }

      set({
        studyQueue: dueCards,
        currentCardIndex: 0,
        currentCard: dueCards[0],
        sessionStartTime: Date.now(),
        cardStartTime: Date.now(),
        sessionStats: { studied: 0, correct: 0, wrong: 0 },
      });
    } catch (error) {
      throw error;
    }
  },

  showAnswer: () => {
    // 답변 표시 시간 기록 (UI에서 처리)
  },

  reviewCard: async (grade: 'again' | 'hard' | 'good' | 'easy') => {
    const state = get();
    const { currentCard, cardStartTime, studyQueue, currentCardIndex } = state;

    if (!currentCard || !cardStartTime) return;

    // 시간 계산
    const timeSpent = Math.floor((Date.now() - cardStartTime) / 1000);

    // 새로운 간격 계산 (Phase 1 MVP: 고정 간격)
    let newInterval: number;
    let nextReview: number;

    if (grade === 'again' || grade === 'hard') {
      newInterval = SRS_INTERVALS.AGAIN; // 1일
    } else if (grade === 'good') {
      // 고정 간격: 1 -> 4 -> 7 -> 14
      const currentInterval = currentCard.interval;
      if (currentInterval < 4) {
        newInterval = 4;
      } else if (currentInterval < 7) {
        newInterval = 7;
      } else if (currentInterval < 14) {
        newInterval = 14;
      } else {
        newInterval = 14; // 최대 14일
      }
    } else { // easy
      // Easy는 Good의 2배 또는 14일 중 작은 값
      const currentInterval = currentCard.interval;
      if (currentInterval < 4) {
        newInterval = 7;
      } else {
        newInterval = 14;
      }
    }

    nextReview = Date.now() + (newInterval * 24 * 60 * 60 * 1000);

    // 데이터베이스 업데이트
    await db.updateCard(currentCard.id, {
      nextReview,
      interval: newInterval,
      repetitions: currentCard.repetitions + 1,
    });

    // 리뷰 로그 생성
    await db.createReviewLog(currentCard.id, grade, timeSpent, newInterval);

    // 통계 업데이트
    const newStats = { ...state.sessionStats };
    newStats.studied++;
    if (grade === 'good' || grade === 'easy') {
      newStats.correct++;
    } else {
      newStats.wrong++;
    }

    // 다음 카드로 이동
    const nextIndex = currentCardIndex + 1;
    const hasMoreCards = nextIndex < studyQueue.length;

    set({
      currentCardIndex: nextIndex,
      currentCard: hasMoreCards ? studyQueue[nextIndex] : null,
      cardStartTime: hasMoreCards ? Date.now() : null,
      sessionStats: newStats,
    });

    // 세션 종료 체크
    if (!hasMoreCards) {
      get().endSession();
    }
  },

  endSession: () => {
    const state = get();
    console.log('Session ended:', state.sessionStats);
    // 여기서 세션 통계를 저장할 수 있음
    set({
      studyQueue: [],
      currentCardIndex: 0,
      currentCard: null,
      sessionStartTime: null,
      cardStartTime: null,
    });
  },

  reset: () => {
    set({
      studyQueue: [],
      currentCardIndex: 0,
      currentCard: null,
      sessionStartTime: null,
      cardStartTime: null,
      sessionStats: {
        studied: 0,
        correct: 0,
        wrong: 0,
      },
    });
  },
}));