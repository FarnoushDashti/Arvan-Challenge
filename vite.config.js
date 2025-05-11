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
        target: 'https://api-3281216083-arvancloud-challenge.apps.ir-central1.arvancaas.ir',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    }
  }
})
