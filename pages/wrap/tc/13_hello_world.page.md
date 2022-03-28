---
title: 'TC-13: Hello World'
warp: ['TC']
scope: ['Typescript']
---

Refer: [Warm-up - Hello World](https://github.com/type-challenges/type-challenges/blob/master/questions/13-warm-hello-world/README.md)

### Describe

Hello, World!

In Type Challenges, we use the type system itself to do the assertion.

For this challenge, you will need to change the following code to make the tests pass (no type check errors).

```typescript
// expected to be string
type HelloWorld = any

// you should make this work
type test = Expect<Equal<HelloWorld, string>>
```

### Test Cases

```typescript
import { Equal, Expect, NotAny } from '@type-challenges/utils'

type cases = [Expect<NotAny<HelloWorld>>, Expect<Equal<HelloWorld, string>>]
```

### Solution

```typescript
type HelloWorld = string
```
