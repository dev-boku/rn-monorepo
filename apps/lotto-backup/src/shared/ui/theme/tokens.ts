// 로또 앱 색상 시스템 - 통일된 브랜드 컬러
export const colors = {
  // 메인 브랜드 컬러 (보라색 계열)
  primary: '#7F57F1',
  primaryLight: '#9B7CF5',
  primaryDark: '#6D47E8',

  // 보조 컬러
  secondary: '#1E40AF',
  accent: '#F59E0B',

  // 로또 번호 컬러 시스템
  lotto: {
    yellow: '#FFC107', // 1-9
    blue: '#2196F3', // 10-19
    red: '#F44336', // 20-29
    gray: '#9E9E9E', // 30-39
    green: '#4CAF50', // 40-45
    bonus: '#FF9800', // 보너스
  },

  // 시스템 컬러
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',

  // 상태 컬러
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const spacing = [4, 8, 12, 16, 20, 24];
export const radius = { sm: 8, md: 12, lg: 16, full: 999 };
