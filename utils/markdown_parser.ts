import { Plugin } from 'vite'
import { TransformResult } from 'rollup'
import YAML from 'yaml'

const parser = async (rawText: string) => {
  let domComponents: { name: string; path: string }[] = []
  const { remark } = await import('remark')
  const stringWidth = await import('string-width')
  const remarkRehype = await import('remark-rehype')
  const remarkFrontmatter = await import('remark-frontmatter')
  const remarkParse = await import('remark-parse')
  const remarkGfm = await import('remark-gfm')
  const remarkToc = await import('remark-toc')
  const remarkLicense = await import('remark-license')
  const rehypeStringify = await import('rehype-stringify')
  const rehypeSlug = await import('rehype-slug')
  const rehypeAutolinkHeadings = await import('rehype-autolink-headings')
  const rehypeHighlight = await import('rehype-highlight')
  const file = await remark()
    .use(remarkParse.default)
    .use(remarkFrontmatter.default, ['yaml'])
    .use(() => ({ children }) => {
      if (children[0] && children[0].type === 'yaml') {
        domComponents = YAML.parse(children[0].value)['injectComponents'] || []
      }
    })
    .use(remarkGfm.default, { stringLength: stringWidth.default })
    .use(remarkToc.default)
    .use(remarkLicense.default)
    .use(remarkRehype.default, {
      footnoteLabel: '脚注',
      footnoteBackLabel: '返回内容',
      allowDangerousHtml: true,
    })
    .use(rehypeHighlight.default)
    .use(rehypeSlug.default)
    .use(rehypeAutolinkHeadings.default, {})
    .use(rehypeStringify.default, { allowDangerousHtml: true })
    .process(rawText)

  return { domPress: String(file), domComponents }
}

const parse = async (
  rawText: string,
  filePath: string
): Promise<TransformResult> => {
  if (!filePath.endsWith('.md')) return null
  const { domPress, domComponents } = await parser(rawText)
  return `<template>
  <div class="MDContent">${domPress}</div>
  </template>
  <script lang='ts' setup>
  ${domComponents.map(c => `import ${c.name} from '${c.path}'\n`).join('')}
  </script>`
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
