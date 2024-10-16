import antfu from '@antfu/eslint-config';

export default antfu(
  {},
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts'],
    rules: {
      'no-alert': 0,
      'no-console': 0,
      'semi': ['error', 'always'],
      'style/semi': 0,
    },
  },
);
