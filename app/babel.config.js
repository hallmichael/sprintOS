// On integration, add Sprint's Tamagui babel plugin pointing at their tamagui.config,
// e.g. ['@tamagui/babel-plugin', { config: './src/tamagui.config.ts', components: ['tamagui'] }].
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
