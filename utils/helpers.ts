export function assign<T, K extends { [key: string]: any }>(
  original: T,
  props: K
) {
  Object.entries(props).forEach(([key, value]) => {
    Object.defineProperty(original, key, {
      value,
    })
  })
  return original as T & K
}
