import { createApp } from './App'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import nprogress from 'nprogress'

let AppInstance: ReturnType<typeof createApp> | null = null
const { hydrationPromise } = useClientRouter({
  render(pageContext: PageContextBuiltInClient & PageContext) {
    if (!pageContext.isHydration) {
      document.title = pageContext.Page.documentProps['title'] || 'zrain | site'
    }
    if (!AppInstance) {
      AppInstance = createApp(pageContext)
      AppInstance.mount('#app')
    } else {
      AppInstance.changePage(pageContext)
    }
  },
  ensureHydration: true,
  prefetchLinks: true,
  onTransitionStart,
  onTransitionEnd,
})

nprogress.configure({
  showSpinner: false,
})

function onTransitionStart() {
  nprogress.start()
}
function onTransitionEnd() {
  nprogress.done()
}
