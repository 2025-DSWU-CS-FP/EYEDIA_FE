import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 5000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
