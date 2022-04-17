import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { renderToString } from '@vue/server-renderer'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import readline from 'readline'
import createApp from './App'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['Pages', 'pageProps']

export function onBeforeRender(pageContext: PageContext) {
  const { documentProps } = pageContext.Page
  return {
    pageContext: {
      documentProps
    }
  }
}

function resolveMatterString(filePath: string, symbolStr: string = '---'): Promise<string> {
  return new Promise((resolve) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(filePath)
    })
    let firstLine = true
    const wantedLines: string[] = []
    lineReader.on('line', (line) => {
      const currentLine = line.trim()
      if (firstLine && currentLine !== symbolStr) {
        lineReader.close()
      } else {
        wantedLines.push(currentLine)
        if (!firstLine && currentLine === symbolStr) {
          lineReader.close()
        }
        firstLine = false
      }
    })
    lineReader.on('close', () => {
      resolve(wantedLines[0] === symbolStr && wantedLines[wantedLines.length - 1] === symbolStr ? wantedLines.join('\n') : '')
    })
  })
}

async function resolvePages(context: { _allPageFiles: any }) {
  const pages: Map<string, any> = new Map()
  const pagePath: string[] = context._allPageFiles['.page'].map((p: { filePath: string; loadFile: Function }) => p.filePath)
  /* eslint-disable no-await-in-loop */
  for (let pageIndex = 0; pageIndex < pagePath.length; pageIndex += 1) {
    const fileStat = fs.statSync(path.join(path.resolve(), pagePath[pageIndex]), {})
    if (pagePath[pageIndex].endsWith('.md') && fileStat.isFile()) {
      const { data = null } = matter(await resolveMatterString(path.join(path.resolve(), pagePath[pageIndex])), {})
      if (data) {
        const routePath = pagePath[pageIndex].replace(/pages\/|\.page\.md/g, '')
        pages.set(routePath, {
          path: routePath,
          matter: data,
          ctime: fileStat.birthtime,
          mtime: fileStat.mtime,
          size: fileStat.size
        })
      }
    }
  }
  /* eslint-enable no-await-in-loop */
  return pages
}

export async function render(pageContext: PageContextBuiltIn & PageContext & { _allPageFiles: any }) {
  Object.defineProperty(pageContext, 'Pages', {
    value: await resolvePages(pageContext),
    enumerable: true,
    configurable: true,
    writable: true
  })
  const App = createApp(pageContext)
  const appHtml = await renderToString(App)
  const title = pageContext.documentProps?.title || 'zrain'
  const desc = pageContext.documentProps?.desc || 'Dreaming up ideas and making them come true is where my passion lies.'
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
    documentHtml
  }
}
