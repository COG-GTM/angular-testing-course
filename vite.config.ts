/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Same ports as the legacy dev setup: app on :4200, `/api` proxied to the Express mock API on :9000.
const apiProxy = {
  '/api': {
    target: 'http://localhost:9000',
    changeOrigin: false,
    secure: false,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    strictPort: true,
    proxy: apiProxy,
  },
  // `vite preview` gets the same proxy so the built app works against the local API too
  // (Playwright e2e still mocks every /api/** call with page.route).
  preview: {
    port: 4173,
    strictPort: true,
    proxy: apiProxy,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/test/**'],
      reporter: ['text', 'html'],
    },
  },
});
