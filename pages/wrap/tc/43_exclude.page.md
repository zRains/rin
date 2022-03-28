---
title: 'TC-43: Exclude'
wrap: ['tc']
scope: ['Typescript']
---

Refer: [Easy - Exclude](https://github.com/type-challenges/type-challenges/blob/master/questions/43-easy-exclude/README.md)

### Describe

Implement the built-in `Exclude<T, U>`

Exclude from T those types that are assignable to U

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, Exclude<'a' | 'b' | 'c', 'a'>>>,
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a' | 'b'>, Exclude<'a' | 'b' | 'c', 'a' | 'b'>>>,
  Expect<Equal<MyExclude<string | number | (() => void), Function>, Exclude<string | number | (() => void), Function>>>
]
```

### Solution

```typescript
type MyExclude<T, U> = T extends U ? never : T
```
