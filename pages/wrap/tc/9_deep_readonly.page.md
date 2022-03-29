---
title: 'TC-9: Deep Readonly'
wrap: ['tc']
scope: ['Typescript']
---

Refer: [Medium - Deep Readonly](https://github.com/type-challenges/type-challenges/blob/master/questions/9-medium-deep-readonly/README.md)

### Describe

Implement a generic `DeepReadonly<T>` which make every parameter of an object - and its sub-objects recursively - readonly.

You can assume that we are only dealing with Objects in this challenge. Arrays, Functions, Classes and so on are no need to take into consideration. However, you can still challenge your self by covering different cases as many as possible.

For example

```typescript
type X = {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = {
  readonly x: {
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey'
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

### Test Cases

```typescript
import { Equal, Expect } from '@type-challenges/utils'

type cases = [Expect<Equal<DeepReadonly<X>, Expected>>]

type X = {
  a: () => 22
  b: string
  c: {
    d: boolean
    e: {
      g: {
        h: {
          i: true
          j: 'string'
        }
        k: 'hello'
      }
    }
  }
}

type Expected = {
  readonly a: () => 22
  readonly b: string
  readonly c: {
    readonly d: boolean
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true
          readonly j: 'string'
        }
        readonly k: 'hello'
      }
    }
  }
}
```

### Solution

Question: `Record<string, any>` would got error?

```typescript
// my solution
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends { [key: string | number]: unknown } ? DeepReadonly<T[P]> : T[P]
}

// other solution
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}

// Note: Record<string, any> accept all types:
// https://github.com/microsoft/TypeScript/issues/41746
const a1: Record<string, any> = [22]
const a2: Record<string, any> = /\d/
const a3: Record<string, any> = {}
let a4: Record<string, any> = { name: '张三' }
a4 = []
const a5: Record<string, any> = new Map()
const a6: Record<string, any> = new Set()
const a7: Record<string, any> = class Person {}
const a8: Record<string, any> = new Promise(() => {})

// Record<string, unknown> only accept obj:
const b: Record<string, unknown> = () => 22 // error
const b1: Record<string, unknown> = [22] // error
const b2: Record<string, unknown> = /\d/ // error
const b3: Record<string, unknown> = {}
let b4: Record<string, unknown> = { name: '张三' }
b4 = [] // error
const b5: Record<string, unknown> = new Map() // error
const b6: Record<string, unknown> = new Set() // error
const b7: Record<string, unknown> = class Person {} // error
const b8: Record<string, unknown> = new Promise(() => {}) // error
```
