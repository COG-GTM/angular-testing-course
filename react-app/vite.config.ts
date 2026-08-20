/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = {
  '/api': {
    target: 'http://localhost:9000',
    secure: false,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    // Replaces the Angular CLI proxy.json: forwards /api to the Express mock backend.
    proxy: apiProxy,
  },
  preview: {
    port: 4200,
    proxy: apiProxy,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
