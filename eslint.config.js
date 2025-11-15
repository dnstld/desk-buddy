// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      'react/no-unescaped-entities': 'off',
      // Allow intentional omission of stable callbacks from useMemo dependencies
      // This is a performance optimization to prevent unnecessary re-renders
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
