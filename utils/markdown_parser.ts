import { Plugin } from 'vite'
import { TransformResult } from 'rollup'
import YAML from 'yaml'

const parser = async (rawText: string) => {
  let documentProps: { [key: string]: any } = Object.create(null)
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
        documentProps = YAML.parse(children[0].value) || Object.create(null)
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

  return { domPress: String(file), documentProps }
}

const parse = async (
  rawText: string,
  filePath: string
): Promise<TransformResult> => {
  if (!filePath.endsWith('.md')) return null
  const { domPress, documentProps } = await parser(rawText)
  return `<template>
  <div class="MDContent">${domPress}</div>
  </template>
  <script lang='ts'>
  import '@style/markdown.scss'
  import 'highlight.js/scss/github.scss'
  import { defineComponent } from 'vue'
  ${
    documentProps['injectComponents'] &&
    documentProps['injectComponents']
      .map(
        (c: { name: string; path: string }) =>
          `import ${c.name} from '${c.path}'\n`
      )
      .join('')
  }
  export default defineComponent({
    components: {${
      documentProps['injectComponents'] &&
      documentProps['injectComponents']
        .map((c: { name: string; path: string }) => c.name)
        .join(',')
    }},
    documentProps: ${JSON.stringify(documentProps)}
  })
  </script>
  `
}

export function markdownParser(): Plugin {
  return {
    name: 'siteParser',
    enforce: 'pre',
    transform(code, id) {
      return parse(code, id)
    },
  }
}
