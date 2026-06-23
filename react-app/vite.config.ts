import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Mirror the Angular proxy.json: forward /api to the Node REST backend on :9000
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4300,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
