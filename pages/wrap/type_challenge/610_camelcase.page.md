---
date: 1648397724000
title: 'TC-610: CamelCase'
scope: ['Typescript']
buckets: ['wrap', 'type_challenge']
---

Refer: [Medium - CamelCase](https://github.com/type-challenges/type-challenges/blob/master/questions/610-medium-camelcase/README.md)

### Describe

for-bar-baz -> forBarBaz

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CamelCase<'foo-bar-baz'>, 'fooBarBaz'>>,
  Expect<Equal<CamelCase<'foo-Bar-Baz'>, 'foo-Bar-Baz'>>,
  Expect<Equal<CamelCase<'foo-Bar-baz'>, 'foo-BarBaz'>>,
  Expect<Equal<CamelCase<'foo-bar'>, 'fooBar'>>,
  Expect<Equal<CamelCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<CamelCase<'foo--bar----baz'>, 'foo-Bar---Baz'>>,
  Expect<Equal<CamelCase<'a-b-c'>, 'aBC'>>,
  Expect<Equal<CamelCase<'a-b-c-'>, 'aBC-'>>,
  Expect<Equal<CamelCase<'ABC'>, 'ABC'>>,
  Expect<Equal<CamelCase<'-'>, '-'>>,
  Expect<Equal<CamelCase<''>, ''>>,
  Expect<Equal<CamelCase<'😎'>, '😎'>>
]
```

### Solution

```typescript
type CamelCase<S> = S extends `${infer F}-${infer E}`
  ? E extends `${Capitalize<E>}`
    ? `${F}-${CamelCase<E>}`
    : `${F}${CamelCase<Capitalize<E>>}`
  : S
```
