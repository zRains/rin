declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

declare type PageContext = {
  Page: any
  pageProps?: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
  [key: string]: any
}
