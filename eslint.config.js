import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslint from '@eslint/js';
import tseslint from "typescript-eslint";
import svelteConfig from './svelte.config.js';
import globals from "globals";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        svelteConfig,
        parser: '@typescript-eslint/parser',
      },
      globals: { ...globals.browser }
    }
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  {
    ignores: [".vite/*"]
  }
];
