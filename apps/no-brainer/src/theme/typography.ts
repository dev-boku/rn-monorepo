import { TextStyle } from 'react-native';

export const typography = {
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 44,
    display: 52,
  },
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  // 미리 정의된 텍스트 스타일
  styles: {
    h1: {
      fontSize: 32,
      lineHeight: 44,
      fontWeight: '700' as TextStyle['fontWeight'],
    },
    h2: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    h3: {
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    h4: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    body1: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
    body2: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as TextStyle['fontWeight'],
      letterSpacing: 0.5,
    },
    // 카드 관련 텍스트 스타일
    cardFront: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    cardBack: {
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '500' as TextStyle['fontWeight'],
    },
  },
};

export type Typography = typeof typography;