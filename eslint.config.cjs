const baseConfig = require('@shelf/eslint-config/typescript').default;

module.exports = [
  {
    ignores: ['coverage/**', 'lib/**', 'renovate.json', 'tsconfig.json'],
  },
  ...baseConfig,
  {
    files: [
      'eslint.config.cjs',
      'jest-preset.js',
      'jest-preset.cjs',
      'src/config.ts',
      'src/setup.ts',
      'src/teardown.ts',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
