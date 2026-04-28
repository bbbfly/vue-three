import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/**/*.test.ts', 'src/**/__tests__/**']
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueThree',
      formats: ['es', 'umd'],
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'three'],
      output: {
        globals: {
          vue: 'Vue',
          three: 'THREE'
        },
        exports: 'named'
      }
    },
    sourcemap: true
  }
})
