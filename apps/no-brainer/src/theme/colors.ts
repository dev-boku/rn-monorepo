export const colors = {
  primary: {
    main: '#5B6CF3', // 메인 블루 (이미지 참고)
    light: '#8B95FF',
    dark: '#3B4CC3',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#F3F4F6',
    light: '#FFFFFF',
    dark: '#E5E7EB',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
  },
  divider: '#E5E7EB',
  shadow: {
    light: 'rgba(0, 0, 0, 0.04)',
    medium: 'rgba(0, 0, 0, 0.08)',
    dark: 'rgba(0, 0, 0, 0.12)',
  },
  // 카드 난이도별 색상
  difficulty: {
    hard: '#EF4444',
    good: '#10B981',
    easy: '#3B82F6',
    again: '#F59E0B',
  },
  // 달력 관련 색상 (이미지 참고)
  calendar: {
    completed: '#5B6CF3',
    today: '#F3F4F6',
    future: '#E5E7EB',
  },
};

export type Colors = typeof colors;