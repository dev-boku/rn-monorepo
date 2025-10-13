import { cn } from './utils';

describe('cn utility function', () => {
  it('should combine multiple class names', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', false && 'conditional', 'always');
    expect(result).toBe('base always');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle nested arrays', () => {
    const result = cn('base', ['nested1', ['nested2', 'nested3']], 'end');
    expect(result).toBe('base nested1 nested2 nested3 end');
  });

  it('should handle empty strings', () => {
    const result = cn('', 'class1', '', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should return empty string when no valid classes provided', () => {
    const result = cn(false, null, undefined, '');
    expect(result).toBe('');
  });

  it('should handle object notation (clsx style)', () => {
    const result = cn({
      'active': true,
      'disabled': false,
      'highlighted': true,
    });
    expect(result).toBe('active highlighted');
  });

  it('should handle mixed types', () => {
    const result = cn(
      'base',
      { active: true, hidden: false },
      ['array-class'],
      undefined,
      'end'
    );
    expect(result).toBe('base active array-class end');
  });

  it('should trim extra spaces', () => {
    const result = cn('  class1  ', '  class2  ');
    expect(result).toBe('class1 class2');
  });
});