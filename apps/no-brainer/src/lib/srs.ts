import type { ReviewRating, ReviewState } from '@/src/types';

// Phase 1 MVP: Fixed intervals (1/4/7/14 days)
const SRS_INTERVALS = [1, 4, 7, 14] as const;

/**
 * Calculate next review date based on current step and rating
 *
 * Rules:
 * - Hard: Reset to +1 day (stepIndex = 0)
 * - Good: Move to next step (1→4→7→14)
 * - Easy: Jump steps (1→7, 4→14, 7→14, 14 stays)
 */
export function calculateNextReview(
  currentState: ReviewState,
  rating: ReviewRating
): Pick<ReviewState, 'stepIndex' | 'dueDate'> {
  const now = Date.now();
  let nextStepIndex: 0 | 1 | 2 | 3;

  switch (rating) {
    case 'hard':
      // Hard: Reset to step 0 (+1 day)
      nextStepIndex = 0;
      break;

    case 'good':
      // Good: Move to next step (max step 3)
      nextStepIndex = Math.min(currentState.stepIndex + 1, 3) as 0 | 1 | 2 | 3;
      break;

    case 'easy':
      // Easy: Jump steps
      if (currentState.stepIndex === 0) {
        nextStepIndex = 2; // 1d → 7d
      } else if (currentState.stepIndex === 1) {
        nextStepIndex = 3; // 4d → 14d
      } else {
        nextStepIndex = 3; // 7d → 14d, 14d → 14d
      }
      break;
  }

  const intervalDays = SRS_INTERVALS[nextStepIndex];
  const dueDate = now + intervalDays * 24 * 60 * 60 * 1000;

  return {
    stepIndex: nextStepIndex,
    dueDate,
  };
}

/**
 * Get cards due for review today
 */
export function getCardsForToday(reviewStates: ReviewState[]): ReviewState[] {
  const endOfToday = getEndOfDay(Date.now());
  return reviewStates.filter(state => state.dueDate <= endOfToday);
}

/**
 * Get end of day timestamp
 */
export function getEndOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/**
 * Get start of day timestamp
 */
export function getStartOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Check if a card is new (never reviewed)
 */
export function isNewCard(reviewState: ReviewState): boolean {
  return reviewState.reviewCount === 0;
}

/**
 * Get interval description for current step
 */
export function getIntervalDescription(stepIndex: 0 | 1 | 2 | 3): string {
  const days = SRS_INTERVALS[stepIndex];
  return `${days}일`;
}

/**
 * Format due date for display
 */
export function formatDueDate(dueDate: number): string {
  const now = Date.now();
  const diff = dueDate - now;
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));

  if (days < 0) {
    return `${Math.abs(days)}일 지남`;
  } else if (days === 0) {
    return '오늘';
  } else if (days === 1) {
    return '내일';
  } else {
    return `${days}일 후`;
  }
}
