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

let Pages: any[] = []

export async function onBeforeRender(pageContext: PageContext & { _allPageFiles: any }) {
  Pages = Pages.length === 0 ? await resolvePages(pageContext) : Pages
  return {
    pageContext: {
      Pages
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
  const pages: any[] = []
  const pagePath: string[] = context._allPageFiles['.page'].map((p: { filePath: string; loadFile: Function }) => p.filePath)
  /* eslint-disable no-await-in-loop */
  for (let pageIndex = 0; pageIndex < pagePath.length; pageIndex += 1) {
    const fileStat = fs.statSync(path.join(path.resolve(), pagePath[pageIndex]), {})
    if (pagePath[pageIndex].endsWith('.md') && fileStat.isFile()) {
      const { data = null } = matter(await resolveMatterString(path.join(path.resolve(), pagePath[pageIndex])), {})
      if (data && !data.index) {
        const routePath = pagePath[pageIndex].replace(/pages\/|\.page\.md/g, '')
        pages.push({
          path: routePath,
          matter: data,
          btime: data.date,
          mtime: +fileStat.mtime
        })
      }
    }
  }
  /* eslint-enable no-await-in-loop */
  return pages
}

export async function render(pageContext: PageContextBuiltIn & PageContext & { _allPageFiles: any }) {
  const App = createApp(pageContext)
  const appHtml = await renderToString(App)
  const title = pageContext.documentProps?.title || "Hi 👋, I'm zRain"
  const desc = pageContext.documentProps?.desc || '一个以前端为兴趣的学生党的博客。路漫漫其修远兮，吾将上下而摸鱼。'
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/images/avatar.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;400;600;800&display=swap" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
        <meta property="og:title" content="Hi 👋, I'm zRain">
        <meta property="og:description" content="zRain的简陋博客。分享一些技术文章和个人感悟。路漫漫其修远兮，吾将上下而摸鱼。">
        <meta property="og:image" content="https://zrain.fun/images/og_image.png">
        <meta property="og:url" content="https://zrain.fun/">
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://zrain.fun/">
        <meta property="twitter:title" content="Hi 👋, I'm zRain">
        <meta property="twitter:description" content="zRain的简陋博客。分享一些技术文章和个人感悟。路漫漫其修远兮，吾将上下而摸鱼。">
        <meta property="twitter:image" content="https://zrain.fun/images/og_image.png">
        <meta itemprop="name" content="Hi 👋, I'm zRain">
        <meta itemprop="Description" content="路漫漫其修远兮，吾将上下而摸鱼。">
        <meta itemprop="image" content="https://zrain.fun/images/avatar.png">
        <meta name="description" content="${desc}" />
        <meta name="keywords" content="zRain,Blog,博客,技术文章,个人感悟" />
        <meta name="author" content="zRain" />
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
