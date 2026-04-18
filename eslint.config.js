import eslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/', 'node_modules/', '.gsd/'],
  },
  // Note: .astro files are linted by `pnpm build` (Astro's built-in parser).
  // eslint-plugin-astro has a parser bug with certain Astro templates (Layout.astro
  // triggers a crash at the </head><body> boundary). We use ESLint for TypeScript
  // files and let Astro's own build process handle template correctness.
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
