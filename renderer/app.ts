import {
  createSSRApp,
  defineComponent,
  h,
  markRaw,
  provide,
  InjectionKey,
} from 'vue'
import { assign } from '../utils/helpers'
import PageShell from './PageShell.vue'

// Key of PageContext
export const pageContextKey: InjectionKey<PageContext> = Symbol('PageContext')

export function createApp(pageContext: PageContext) {
  const { Page, pageProps = {} } = pageContext
  let rootComponent: InstanceType<typeof PageWithWrapper>
  const PageWithWrapper = defineComponent({
    setup() {
      provide(pageContextKey, pageContext)
    },
    data() {
      return {
        Page: markRaw(Page),
        pageProps: markRaw(pageProps),
      }
    },
    beforeCreate() {
      rootComponent = this
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps)
          },
        }
      )
    },
  })
  return assign(createSSRApp(PageWithWrapper), {
    changePage(pageContext: PageContext) {
      const { Page, pageProps = {} } = pageContext
      rootComponent.Page = markRaw(Page)
      rootComponent.pageProps = markRaw(pageProps)
    },
  })
}
