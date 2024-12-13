import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@services': '/src/services', // Alias for your services
    },
  },
  build: {
    outDir: 'dist', // This specifies the output directory for build files
    base: '/', // This specifies the base public path for the application
  },
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';  // Create a separate chunk for node_modules
        }
      },
    },
  },
  chunkSizeWarningLimit: 1000, // Increases the warning limit for chunk size to 1000 KB (1MB)
});
