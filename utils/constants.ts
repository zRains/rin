import type { InjectionKey } from 'vue'

// Key of PageContext
export const pageContextKey: InjectionKey<PageContext> = Symbol('PageContext')

// Header Links
export const headerLinks = [
  {
    path: '/',
    name: 'home',
    label: 'home',
    disable: false
  },
  {
    path: '/post',
    name: 'post',
    label: 'post',
    disable: false
  },
  {
    path: '/wrap',
    name: 'wrap',
    label: 'wrap',
    disable: false
  },
  {
    path: '/note',
    name: 'note',
    label: 'note',
    disable: false
  },
  {
    path: '/sandbox',
    name: 'sandbox',
    label: 'sandbox',
    disable: true
  }
]

export const sponsors = [
  {
    range: 1,
    name: 'deelter',
    avatar: 'https://www.deelter.com/images/avatar.png',
    link: 'https://www.deelter.com',
    desc: '从博客页面下方实时动态爬取，更新间隔周期为1小时。'
  }
]
