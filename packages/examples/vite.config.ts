import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  publicDir: 'lib',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@vue-three/vue-three': path.resolve(__dirname, '../vue-three/src/index.ts')
    }
  },
  server: {
    port: 5174
  }
})
