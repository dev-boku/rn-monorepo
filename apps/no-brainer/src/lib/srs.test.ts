import { calculateNextReview, INTERVALS, ReviewRating } from './srs';

describe('SRS Algorithm', () => {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;

  beforeEach(() => {
    // Mock Date.now to have consistent test results
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('calculateNextReview', () => {
    describe('hard rating', () => {
      it('should reset to beginning regardless of current step', () => {
        const result = calculateNextReview(2, 'hard');

        expect(result.stepIndex).toBe(0);
        expect(result.intervalDays).toBe(INTERVALS[0]); // 1 day
        expect(result.dueDate).toBe(now + (1 * msPerDay));
      });

      it('should reset even from the last step', () => {
        const result = calculateNextReview(3, 'hard');

        expect(result.stepIndex).toBe(0);
        expect(result.intervalDays).toBe(1);
      });
    });

    describe('good rating', () => {
      it('should advance to next step', () => {
        const result = calculateNextReview(0, 'good');

        expect(result.stepIndex).toBe(1);
        expect(result.intervalDays).toBe(INTERVALS[1]); // 4 days
        expect(result.dueDate).toBe(now + (4 * msPerDay));
      });

      it('should stay at last step when already there', () => {
        const lastIndex = INTERVALS.length - 1;
        const result = calculateNextReview(lastIndex, 'good');

        expect(result.stepIndex).toBe(lastIndex);
        expect(result.intervalDays).toBe(INTERVALS[lastIndex]); // 14 days
      });
    });

    describe('easy rating', () => {
      it('should jump two steps from beginning', () => {
        const result = calculateNextReview(0, 'easy');

        expect(result.stepIndex).toBe(2);
        expect(result.intervalDays).toBe(INTERVALS[2]); // 7 days
        expect(result.dueDate).toBe(now + (7 * msPerDay));
      });

      it('should not exceed last step', () => {
        const result = calculateNextReview(2, 'easy');
        const lastIndex = INTERVALS.length - 1;

        expect(result.stepIndex).toBe(lastIndex);
        expect(result.intervalDays).toBe(INTERVALS[lastIndex]); // 14 days
      });

      it('should handle edge case near end', () => {
        const result = calculateNextReview(3, 'easy');

        expect(result.stepIndex).toBe(3); // Already at max
        expect(result.intervalDays).toBe(14);
      });
    });

    describe('edge cases', () => {
      it('should handle negative step index', () => {
        const result = calculateNextReview(-1, 'good');

        expect(result.stepIndex).toBe(0);
        expect(result.intervalDays).toBe(INTERVALS[0]);
      });

      it('should handle step index beyond array', () => {
        const result = calculateNextReview(10, 'good');
        const lastIndex = INTERVALS.length - 1;

        expect(result.stepIndex).toBe(lastIndex);
        expect(result.intervalDays).toBe(INTERVALS[lastIndex]);
      });

      it('should handle invalid rating', () => {
        const result = calculateNextReview(1, 'invalid' as ReviewRating);

        // Should maintain current state
        expect(result.stepIndex).toBe(1);
        expect(result.intervalDays).toBe(INTERVALS[1]);
      });
    });
  });

  describe('INTERVALS constant', () => {
    it('should have the correct interval values', () => {
      expect(INTERVALS).toEqual([1, 4, 7, 14]);
    });

    it('should have increasing intervals', () => {
      for (let i = 1; i < INTERVALS.length; i++) {
        expect(INTERVALS[i]).toBeGreaterThan(INTERVALS[i - 1]);
      }
    });
  });

  describe('integration with review states', () => {
    it('should correctly calculate progression through all steps', () => {
      let stepIndex = 0;

      // First review (good) - move from step 0 to 1
      let result = calculateNextReview(stepIndex, 'good');
      expect(result.stepIndex).toBe(1);
      expect(result.intervalDays).toBe(4);
      stepIndex = result.stepIndex;

      // Second review (good) - move from step 1 to 2
      result = calculateNextReview(stepIndex, 'good');
      expect(result.stepIndex).toBe(2);
      expect(result.intervalDays).toBe(7);
      stepIndex = result.stepIndex;

      // Third review (good) - move from step 2 to 3
      result = calculateNextReview(stepIndex, 'good');
      expect(result.stepIndex).toBe(3);
      expect(result.intervalDays).toBe(14);
      stepIndex = result.stepIndex;

      // Fourth review (good) - stay at step 3 (max)
      result = calculateNextReview(stepIndex, 'good');
      expect(result.stepIndex).toBe(3);
      expect(result.intervalDays).toBe(14);
    });

    it('should handle reset and recovery', () => {
      // Start at step 2
      let result = calculateNextReview(2, 'hard');
      expect(result.stepIndex).toBe(0); // Reset to beginning

      // Recover quickly with easy
      result = calculateNextReview(result.stepIndex, 'easy');
      expect(result.stepIndex).toBe(2); // Jump back to step 2
    });
  });
});