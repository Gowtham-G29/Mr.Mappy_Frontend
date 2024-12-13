import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@services': '/src/services', // Alias for your services
    },
  },
  build: {
    outDir: 'dist', // Ensure this points to the correct output directory
    base: '/', // Base public path for the application
  },
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';  // Creates a separate chunk for node_modules
        }
        
        // Example of further chunk splitting, adjust based on your code structure
        if (id.includes('src/components/')) {
          return 'components'; // Creates a separate chunk for components
        }

        if (id.includes('src/pages/')) {
          return 'pages'; // Creates a separate chunk for pages
        }
      },
    },
  },
  chunkSizeWarningLimit: 3000, // Increases the warning limit for chunk size to 1000 KB (1MB)
});
