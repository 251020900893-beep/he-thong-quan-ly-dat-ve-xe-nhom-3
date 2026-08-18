import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Đổi port theo đúng Backend Java/Node của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
});