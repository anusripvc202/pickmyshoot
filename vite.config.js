import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: (command === 'serve' || process.env.VERCEL || process.env.VERCEL_ENV) ? '/' : '/pickmyshoot/',
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
}))
