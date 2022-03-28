import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import markdownParser from './utils/markdown_parser'

export default defineConfig(() => ({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    markdownParser(),
    ssr()
  ],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'renderer/components'),
      '@style': resolve(__dirname, 'renderer/styles')
    }
  }
}))
