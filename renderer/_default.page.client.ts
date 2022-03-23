import { createApp } from './App'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

let AppInstance: ReturnType<typeof createApp> | null = null
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
  console.log('Page transition start')
  document.querySelector('.content')!.classList.add('page-transition')
}
function onTransitionEnd() {
  console.log('Page transition end')
  document.querySelector('.content')!.classList.remove('page-transition')
}
