module.exports = {
  extends: ['@repo/eslint-config/react-native'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Custom rules for this project
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-native/no-inline-styles': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};