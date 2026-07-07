import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'storybook-static',
      'node_modules',
      'src/api/**', // generated
      '**/*.gen.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      // --- Critical rules (Technical Architecture Plan §7.3) ---
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/no-cycle': 'error', // architecture guard
      'no-console': 'warn',
      // Features must never import from another feature.
      'no-restricted-imports': ['error', { patterns: ['@/features/*/*', '**/features/*/*'] }],
      // XSS guard: no dangerouslySetInnerHTML.
      'react/no-danger': 'error',
    },
  },
  // Config + test files may use dev conveniences.
  {
    files: ['**/*.{test,spec}.{ts,tsx}', '**/*.stories.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  prettier,
);
