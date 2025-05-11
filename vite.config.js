import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'https://api.realworld.io',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    }
  }
})
