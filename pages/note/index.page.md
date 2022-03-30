---
title: '笔记'
index: true
---

# 笔记

> 简短的笔记，也许是我不想写这么多罢了 📝

### 实现最简单的防抖和节流

参考于掘金（具体网址忘了），修复了其中一个 BUG。

```javascript
/**
 * 防抖
 * @param {Function} fn
 * @param {number} time 防抖时间
 * @returns
 */
debounce(fn, time) {
  let task = null
  return (...args) => {
    if (task) {
      clearTimeout(task)
    }
    task = setTimeout(() => fn.apply(this, args), time)
  }
}

/**
 * 节流
 * @param {Function} fn
 * @param {number} time 节流时间
 * @returns
 */
throttle(fn, time) {
  let task = null
  return (...args) => {
    if (!task) {
      task = setTimeout(() => {
        task = null
        fn.apply(this, args)
      }, time)
    }
  }
}
```

---

### 正确使用 TypeScript 检查对象

体现于：[TC-9: Deep Readonly](/wrap/tc/9_deep_readonly)

```typescript
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

---
