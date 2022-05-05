---
date: 1651741386363
title: 'TC-116: Replace'
scope: ['Typescript']
buckets: ['wrap', 'type_challenge']
---

Refer: [Medium - Replace](https://github.com/type-challenges/type-challenges/blob/master/questions/116-medium-replace/README.md)

### Describe

Implement `Replace<S, From, To>` which replace the string `From` with `To` once in the given string `S`.

For example

```typescript
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Replace<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', 'foo'>, 'foofoobar'>>,
  Expect<Equal<Replace<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'foobarbar', 'bra', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'', '', ''>, ''>>
]
```

### Solution

```typescript
type Replace<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer P}${From}${infer K}`
  ? `${P}${To}${K}`
  : S
```
