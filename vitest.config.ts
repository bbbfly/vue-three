import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/vue-three/src/**/*.ts', 'packages/vue-three/src/**/*.vue']
    }
  },
  resolve: {
    alias: {
      '@vue-three/core': resolve(__dirname, 'packages/vue-three/src')
    }
  }
})
