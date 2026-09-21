import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Mirrors ../proxy.json: /api -> mock Express backend in ../server
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4300,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        secure: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
