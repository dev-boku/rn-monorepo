import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-2', 'py-4');
    expect(result).toContain('px-2');
    expect(result).toContain('py-4');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'active', false && 'inactive');
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('inactive');
  });
});
