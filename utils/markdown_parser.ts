import { Plugin } from 'vite'
import { TransformResult } from 'rollup'

const highlight = async (rawHtml: string) => {
  const hljs = await import('highlight.js/lib/core')
  const re = /<pre><code([\s\w-"=]+?(\w+)")?>([\d\D]*?)<\/code><\/pre>/g
  let codeChunk, result
  // import languages
  const javascript = await import('highlight.js/lib/languages/javascript')
  const typescript = await import('highlight.js/lib/languages/typescript')
  const html = await import('highlight.js/lib/languages/xml')
  const json = await import('highlight.js/lib/languages/json')
  const java = await import('highlight.js/lib/languages/java')
  const go = await import('highlight.js/lib/languages/go')
  const kotlin = await import('highlight.js/lib/languages/kotlin')
  const markdown = await import('highlight.js/lib/languages/markdown')
  const python = await import('highlight.js/lib/languages/python')
  const plaintext = await import('highlight.js/lib/languages/plaintext')
  const rust = await import('highlight.js/lib/languages/rust')
  const scss = await import('highlight.js/lib/languages/scss')
  const bash = await import('highlight.js/lib/languages/bash')
  const c = await import('highlight.js/lib/languages/c')
  // install langages
  hljs.default.registerLanguage('js', javascript.default)
  hljs.default.registerLanguage('javascript', javascript.default)
  hljs.default.registerLanguage('jsx', javascript.default)
  hljs.default.registerLanguage('typescript', typescript.default)
  hljs.default.registerLanguage('html', html.default)
  hljs.default.registerLanguage('json', json.default)
  hljs.default.registerLanguage('java', java.default)
  hljs.default.registerLanguage('go', go.default)
  hljs.default.registerLanguage('kotlin', kotlin.default)
  hljs.default.registerLanguage('markdown', markdown.default)
  hljs.default.registerLanguage('python', python.default)
  hljs.default.registerLanguage('plaintext', plaintext.default)
  hljs.default.registerLanguage('rust', rust.default)
  hljs.default.registerLanguage('scss', scss.default)
  hljs.default.registerLanguage('bash', bash.default)
  hljs.default.registerLanguage('c', c.default)

  return rawHtml.replace(re, function (match, langCode, lang, code) {
    return `<pre><code class="language-${lang}">${hljs.default.highlight(code, { language: lang }).value}</code></pre>`
  })
}

const parser = async (rawText: string) => {
  const { micromark } = await import('micromark')
  // Plugin
  const { gfm, gfmHtml } = await import('micromark-extension-gfm')

  return micromark(rawText, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  })
}

const parse = async (
  rawText: string,
  filePath: string
): Promise<TransformResult> => {
  if (!filePath.endsWith('.md')) return null
  const dom = await parser(rawText)
  return `<template><div class="MDContent">${await highlight(
    dom
  )}</div></template>`
}

export default function (): Plugin {
  return {
    name: 'siteParser',
    enforce: 'pre',
    transform(code, id) {
      return parse(code, id)
    },
  }
}
