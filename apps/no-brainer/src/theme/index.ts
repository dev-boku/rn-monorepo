import { colors } from './colors';
import { typography } from './typography';
import { spacing, radius, layout } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  layout,
};

export type Theme = typeof theme;

// Re-export for convenience
export { colors } from './colors';
export { typography } from './typography';
export { spacing, radius, layout } from './spacing';