import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://wallet-application-iglo.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
