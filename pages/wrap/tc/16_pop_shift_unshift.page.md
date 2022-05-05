---
title: 'TC-16: Pop Shift Unshift'
scope: ['Typescript']
buckets: ['wrap', 'type_challenge']
---

Refer: [Medium - Pop Shift Unshift](https://github.com/type-challenges/type-challenges/blob/master/questions/16-medium-pop/README.md)

### Describe

Implement a generic `Pop<T>` that takes an Array T and returns an Array without it’s last element. Include **Extra**.

For example

```typescript
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

Extra: Similarly, can you implement `Shift`, `Push` and `Unshift` as well?

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [Expect<Equal<Pop<[3, 2, 1]>, [3, 2]>>, Expect<Equal<Pop<['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>>]
```

### Solution

```typescript
// my solution (pop)
type Pop<T extends any[]> = T extends [...infer P, infer K] ? P : []

// my solution (shift)
type Pop<T extends any[]> = T extends [infer P, ...infer K] ? K : []

// my solution (unshift)
type Pop<T extends any[], U> = [U, ...T]

// my solution (push)
type Pop<T extends any[], U> = [...T, U]
```
