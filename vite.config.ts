/// <reference types="vitest" />
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  plugins: [
    checker({
      typescript: true,
      overlay: false,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint ./src',
      },
    }),
  ],
});
