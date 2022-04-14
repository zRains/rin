import { createSSRApp, defineComponent, h, markRaw, provide, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { assign } from '../utils/helpers'
import PageShell from './PageShell.vue'
import { pageContextKey } from '../utils/constants'

// Global Styles
import './styles/global.scss'
import './styles/nprogress.scss'

// Global Components
import SiteBack from './components/global/site_back.vue'

export default function createApp(pageContext: PageContext) {
  const { Page, Pages, pageProps = {} } = pageContext
  let rootComponent: any
  const pageContextReactive = reactive(pageContext)
  const PageWithWrapper = defineComponent({
    setup() {
      provide(pageContextKey, pageContextReactive)
    },
    data() {
      return {
        Page: markRaw(Page || {}),
        pageProps: markRaw(pageProps)
      }
    },
    created() {
      rootComponent = this
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default: () => h(this.Page, this.pageProps)
        }
      )
    }
  })
  const App = createSSRApp(PageWithWrapper)
  // Register Global Components
  App.component('SiteBack', SiteBack)
  App.component('Icon', Icon)
  return assign(App, {
    changePage(pageContext: PageContext) {
      const { Page, pageProps = {} } = pageContext
      Object.assign(pageContextReactive, pageContext, { Pages })
      rootComponent.Page = markRaw(Page)
      rootComponent.pageProps = markRaw(pageProps)
    }
  })
}
