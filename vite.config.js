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
  },
})

