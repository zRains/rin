---
date: 1651741386370
title: 'TC-189: Awaited'
scope: ['Typescript']
buckets: ['wrap', 'type_challenge']
---

Refer: [Easy - Awaited](https://github.com/type-challenges/type-challenges/blob/master/questions/189-easy-awaited/README.md)

### Describe

If we have a type which is wrapped type like Promise. How we can get a type which is inside the wrapped type? For example if we have `Promise<ExampleType>` how to get ExampleType?

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>
]

// @ts-expect-error
type error = MyAwaited<number>
```

### Solution

```typescript
type MyAwaited<T extends Promise<any>> = T extends Promise<infer P> ? (P extends Promise<infer K> ? K : P) : never
```
