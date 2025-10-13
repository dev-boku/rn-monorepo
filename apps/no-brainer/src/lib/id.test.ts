import { generateId } from './id';

describe('generateId', () => {
  it('should generate ID with correct prefix', () => {
    const deckId = generateId('deck');
    expect(deckId).toMatch(/^deck_/);

    const cardId = generateId('card');
    expect(cardId).toMatch(/^card_/);

    const sessionId = generateId('session');
    expect(sessionId).toMatch(/^session_/);
  });

  it('should include timestamp', () => {
    const before = Date.now();
    const id = generateId('test');
    const after = Date.now();

    // Extract timestamp from ID
    const parts = id.split('_');
    const timestamp = parseInt(parts[1], 10);

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });

  it('should include random suffix', () => {
    const id = generateId('test');
    const parts = id.split('_');
    const randomPart = parts[2];

    // Should be alphanumeric and 9 characters long
    expect(randomPart).toMatch(/^[a-z0-9]{9}$/);
  });

  it('should generate unique IDs', () => {
    const ids = new Set();
    const count = 1000;

    for (let i = 0; i < count; i++) {
      ids.add(generateId('test'));
    }

    // All IDs should be unique
    expect(ids.size).toBe(count);
  });

  it('should handle different prefixes', () => {
    const prefixes = ['deck', 'card', 'session', 'review', 'test'];

    prefixes.forEach(prefix => {
      const id = generateId(prefix);
      expect(id).toMatch(new RegExp(`^${prefix}_\\d+_[a-z0-9]{9}$`));
    });
  });

  it('should generate IDs with consistent format', () => {
    const id = generateId('example');
    const pattern = /^example_\d{13,}_[a-z0-9]{9}$/;

    expect(id).toMatch(pattern);
  });

  it('should handle empty prefix', () => {
    const id = generateId('');
    expect(id).toMatch(/^_\d+_[a-z0-9]{9}$/);
  });

  it('should handle special characters in prefix', () => {
    const id = generateId('test-123');
    expect(id).toMatch(/^test-123_\d+_[a-z0-9]{9}$/);
  });

  describe('performance', () => {
    it('should generate IDs quickly', () => {
      const start = performance.now();
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        generateId('perf');
      }

      const end = performance.now();
      const duration = end - start;

      // Should generate 10000 IDs in less than 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('collision resistance', () => {
    it('should have very low collision probability', () => {
      const ids = [];
      const count = 100000;

      // Generate many IDs in rapid succession
      for (let i = 0; i < count; i++) {
        ids.push(generateId('collision'));
      }

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(count);
    });

    it('should maintain uniqueness even with same timestamp', () => {
      // Mock Date.now to return same value
      const fixedTime = 1234567890123;
      jest.spyOn(Date, 'now').mockReturnValue(fixedTime);

      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId('fixed'));
      }

      expect(ids.size).toBe(100);

      jest.restoreAllMocks();
    });
  });
});