import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

const PORT = 8000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        // target: `http://ec2-3-36-56-62.ap-northeast-2.compute.amazonaws.com:${PORT}/`,
        target: `http://localhost:${PORT}/`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
