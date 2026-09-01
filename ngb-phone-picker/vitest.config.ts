import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.spec.ts', 'projects/**/*.spec.ts'],
    typecheck: {
      tsconfig: './tsconfig.vitest.json',
    },
  },
});
