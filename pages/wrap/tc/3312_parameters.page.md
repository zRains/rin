---
title: 'TC-3312: Parameters'
wrap: ['tc']
scope: ['Typescript']
---

Refer: [Easy - Parameters](https://github.com/type-challenges/type-challenges/blob/master/questions/3312-easy-parameters/README.md)

### Describe

Implement the built-in Parameters generic without using it.

### Test Cases

```typescript
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

const foo = (arg1: string, arg2: number): void => {}
const bar = (arg1: boolean, arg2: { a: 'A' }): void => {}
const baz = (): void => {}

type cases = [
  Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
  Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
  Expect<Equal<MyParameters<typeof baz>, []>>
]
```

### Solution

```typescript
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never
```
