import { createApp } from './App'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { renderToString } from '@vue/server-renderer'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pagesMatter', 'pageProps']

export async function render(
  pageContext: PageContextBuiltIn & PageContext & { _allPageFiles: any }
) {
  pageContext.pagesMatter = resolvePagesMatter(pageContext)
  const App = createApp(pageContext)
  const appHtml = await renderToString(App)
  const title = 'zrain | site'
  const desc = 'zrain 小屋'
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/images/avatar.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;400;600;800&display=swap" rel="stylesheet">
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
  return {
    documentHtml,
    pageContext: {},
  }
}

function resolvePagesMatter(context: { _allPageFiles: any }) {
  const pagesMatter: Map<string, any> = new Map()
  const pagePath: string[] = context._allPageFiles['.page'].map(
    (p: { filePath: string; loadFile: Function }) => p.filePath
  )

  pagePath.forEach(pagePath => {
    const fileStat = fs.statSync(path.join(path.resolve(), pagePath))
    if (pagePath.endsWith('.md') && fileStat.isFile()) {
      const { data = null } = matter(
        fs.readFileSync(path.join(path.resolve(), pagePath), 'utf-8'),
        {}
      )
      if (data) {
        pagesMatter.set(pagePath.replace(/pages\/|\.page\.md/g, ''), {
          matter: data,
          ctime: fileStat.ctime,
          mtime: fileStat.mtime,
          size: fileStat.size,
        })
      }
    }
  })
  return pagesMatter
}
