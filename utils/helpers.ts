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
