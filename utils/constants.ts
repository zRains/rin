import type { InjectionKey } from 'vue'

// Key of PageContext
export const pageContextKey: InjectionKey<PageContext> = Symbol('PageContext')

// Header Links
export const headerLinks = [
  {
    path: '/',
    name: 'home',
    label: 'home',
    disable: false,
  },
  {
    path: '/about',
    name: 'about',
    label: 'about',
    disable: false,
  },
]
