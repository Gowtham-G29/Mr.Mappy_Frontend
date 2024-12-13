import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@services': '/src/services'
    }
  },
  build: {
    outDir: 'dist', // This should point to the correct directory
  }, rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';  // Creates a separate 'vendor' chunk for node_modules
        }
      },
    },
  },
  chunkSizeWarningLimit: 1000, // Increases the warning limit to 1000 KB (1 MB)

})

