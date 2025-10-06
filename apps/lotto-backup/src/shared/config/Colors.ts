/**
 * 로또 앱 통합 색상 시스템 - theme/tokens.ts와 일관성 유지
 */

import { colors } from '@/src/shared/ui/theme/tokens';

const tintColorLight = colors.primary;
const tintColorDark = colors.primaryLight;

export const Colors = {
  light: {
    text: colors.text,
    background: colors.surface,
    tint: tintColorLight,
    icon: colors.textMuted,
    tabIconDefault: colors.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
