import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import path from 'path'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@vue-three/vue-three': path.resolve(__dirname, '../vue-three/src/index.ts')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
