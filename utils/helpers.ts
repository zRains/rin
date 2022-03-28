import relativeTime from 'dayjs/plugin/relativeTime'
import local from 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)
dayjs.locale(local)

export function getRelativeTime(date: Date | number) {
  return dayjs().from(date)
}

export function assign<T, K extends { [key: string]: any }>(original: T, props: K) {
  Object.entries(props).forEach(([key, value]) => {
    Object.defineProperty(original, key, {
      value
    })
  })
  return original as T & K
}

export function debounce(fn: Function, time: number) {
  let task: any = null
  return (...args: any[]) => {
    if (task) {
      clearTimeout(task)
    }
    task = setTimeout(() => fn(...args), time)
  }
}

export function throttle(fn: Function, time: number) {
  let task: any = null
  return (...args: any[]) => {
    if (!task) {
      task = setTimeout(() => {
        task = null
        fn(...args)
      }, time)
    }
  }
}
