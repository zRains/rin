import matter from 'gray-matter'
import type { Plugin } from 'vite'
import type { TransformResult } from 'rollup'

const parser = async (rawText: string) => {
  const { remark } = await import('remark')
  const stringWidth = await import('string-width')
  const remarkRehype = await import('remark-rehype')
  const remarkParse = await import('remark-parse')
  const remarkFrontmatter = await import('remark-frontmatter')
  const remarkGfm = await import('remark-gfm')
  const remarkToc = await import('remark-toc')
  const remarkLicense = await import('remark-license')
  const rehypeStringify = await import('rehype-stringify')
  const rehypeSlug = await import('rehype-slug')
  const rehypeAutolinkHeadings = await import('rehype-autolink-headings')
  const rehypeHighlight = await import('rehype-highlight')
  const file = await remark()
    .use(remarkParse.default)
    .use(remarkGfm.default, { stringLength: stringWidth.default })
    .use(remarkFrontmatter.default)
    .use(remarkToc.default)
    .use(remarkLicense.default, { heading: /^licen[cs]e:?$|^许可：?$/i })
    .use(remarkRehype.default, {
      footnoteLabel: '脚注',
      footnoteBackLabel: '返回内容',
      allowDangerousHtml: true
    })
    .use(rehypeHighlight.default, { subset: false })
    .use(rehypeSlug.default)
    .use(rehypeAutolinkHeadings.default, {})
    .use(rehypeStringify.default, { allowDangerousHtml: true })
    .process(rawText)

  return String(file)
}

const parse = async (rawText: string, filePath: string): Promise<TransformResult> => {
  if (!filePath.endsWith('.md')) return null
  const { data: documentProps } = matter(rawText)
  const domPress = await parser(rawText)
  return `<template>
  <div class="MDContent">${domPress}</div>
  </template>
  <script lang='ts'>
  import '@style/markdown.scss'
  import 'highlight.js/scss/github.scss'
  import { defineComponent } from 'vue'
  ${
    documentProps.injectComponents &&
    documentProps.injectComponents.map((c: { name: string; path: string }) => `import ${c.name} from '${c.path}'\n`).join('')
  }
  export default defineComponent({
    components: {${
      documentProps.injectComponents && documentProps.injectComponents.map((c: { name: string; path: string }) => c.name).join(',')
    }},
    documentProps: ${JSON.stringify(documentProps)}
  })
  </script>
  `
}

export default function markdownParser(): Plugin {
  return {
    name: 'markdownParser',
    enforce: 'pre',
    transform(code, id) {
      return parse(code, id)
    }
  }
}
