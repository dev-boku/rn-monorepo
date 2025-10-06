module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@shared': './src/shared',
            '@entities': './src/entities',
            '@features': './src/features',
            '@widgets': './src/widgets',
            '@pages': './src/pages',
            '@app': './src/app',
          },
        },
      ],
      // Reanimated plugin must be the last one
      'react-native-reanimated/plugin',
    ],
  };
};