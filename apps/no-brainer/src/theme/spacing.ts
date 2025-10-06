export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const layout = {
  padding: {
    screen: 16,
    card: 16,
    button: 12,
    input: 12,
  },
  margin: {
    small: 8,
    medium: 16,
    large: 24,
  },
  cardHeight: 200,
  buttonHeight: 48,
  inputHeight: 48,
  tabBarHeight: 80,
  headerHeight: 56,
};

export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Layout = typeof layout;