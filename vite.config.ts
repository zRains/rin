import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import { defineConfig } from 'vite'
import markdownParser from './utils/markdown_parser'

export default defineConfig(() => {
  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      markdownParser(),
      ssr(),
    ],
  }
})
