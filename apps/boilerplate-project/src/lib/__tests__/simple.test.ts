// Simple test to verify Jest is working
describe('Basic Math Operations', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
    expect(2 + 3).toBe(5);
  });

  it('should subtract numbers correctly', () => {
    expect(5 - 3).toBe(2);
    expect(10 - 7).toBe(3);
  });

  it('should multiply numbers correctly', () => {
    expect(3 * 4).toBe(12);
    expect(5 * 6).toBe(30);
  });

  it('should divide numbers correctly', () => {
    expect(10 / 2).toBe(5);
    expect(15 / 3).toBe(5);
  });
});

describe('String Operations', () => {
  it('should concatenate strings', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  it('should check string length', () => {
    expect('test'.length).toBe(4);
    expect('hello'.length).toBe(5);
  });

  it('should convert to uppercase', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });

  it('should convert to lowercase', () => {
    expect('WORLD'.toLowerCase()).toBe('world');
  });
});

describe('Array Operations', () => {
  it('should add items to array', () => {
    const arr = [1, 2, 3];
    arr.push(4);
    expect(arr).toEqual([1, 2, 3, 4]);
  });

  it('should find array length', () => {
    expect([1, 2, 3].length).toBe(3);
    expect([].length).toBe(0);
  });

  it('should filter array', () => {
    const numbers = [1, 2, 3, 4, 5];
    const evens = numbers.filter(n => n % 2 === 0);
    expect(evens).toEqual([2, 4]);
  });

  it('should map array', () => {
    const numbers = [1, 2, 3];
    const doubled = numbers.map(n => n * 2);
    expect(doubled).toEqual([2, 4, 6]);
  });
});

describe('Object Operations', () => {
  it('should create and access object properties', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj.name).toBe('Test');
    expect(obj.value).toBe(42);
  });

  it('should check object keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
  });

  it('should check object values', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(Object.values(obj)).toEqual([1, 2, 3]);
  });
});