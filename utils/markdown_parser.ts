import { Plugin } from 'vite'
import { TransformResult } from 'rollup'

const parser = async (rawText: string) => {
  const { micromark } = await import('micromark')
  // Plugin
  const { gfmTable, gfmTableHtml } = await import(
    'micromark-extension-gfm-table'
  )
  return micromark(rawText, {
    extensions: [gfmTable],
    htmlExtensions: [gfmTableHtml],
  })
}

const parse = async (
  rawText: string,
  filePath: string
): Promise<TransformResult> => {
  if (!filePath.endsWith('.md')) return null
  return `<template><div class="MDContent">${await parser(
    rawText
  )}</div></template>`
}

export const plugin = (options: any): Plugin => {
  return {
    name: 'siteParser',
    enforce: 'pre',
    transform(code, id) {
      return parse(code, id)
    },
  }
}

export default plugin
