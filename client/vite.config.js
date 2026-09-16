import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Forward /api calls to our Express backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
