import { createApp } from './App'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import nprogress from 'nprogress'

let AppInstance: ReturnType<typeof createApp> | null = null
nprogress.configure({
  showSpinner: false,
})
const { hydrationPromise } = useClientRouter({
  render(pageContext: PageContextBuiltInClient & PageContext) {
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

hydrationPromise.then(() => {
  console.log('Hydration finished; page is now interactive.')
})

function onTransitionStart() {
  nprogress.start()
}
function onTransitionEnd() {
  nprogress.done()
}
