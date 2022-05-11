---
date: 1652156716000
title: '使用TS实现async/await'
scope: ['ES6', 'TS']
buckets: ['wrap', 'code_snippet']
---

![async_await](https://res.zrain.fun/images/2022/05/async_await-941574ea5f3cc6be82f9a417b6c2b390.png)

async/await 是 Js 异步解决方案之一，让我们以同步的方式编写异步代码，使异步处理逻辑更清晰明了。这篇文章就来探索一下它背后的实现原理。

### 什么是 async/await

先用代码体验一下这种处理方式和其它方式的区别，首先是回调方式：

```typescript
// cb 为回调函数
function getCompany(cb: (data: string) => void) {
  // 模拟请求服务
  setTimeout(() => {
    const userDataFromServer = '用户数据'
    cb(userDataFromServer)
  }, 3000)
}

getCompany((data) => {
  console.log('来自Server的数据', data) // 来自Server的数据 用户数据
})
```

之后是 Promise/then 方式：

```typescript
function getCompany() {
  new Promise((resolve, reject) => {
    // 模拟请求服务
    setTimeout(() => resolve('用户数据'), 3000)
  }).then((userData) => {
    console.log('来自Server的数据', userData) // 来自Server的数据 用户数据
  })
}

getCompany()
```

最后是 async/await 方式：

```typescript
function serverRequest(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 模拟请求服务
    setTimeout(() => resolve('用户数据'), 3000)
  })
}

async function getCompany(): Promise<void> {
  let userData = await serverRequest()
  console.log('来自Server的数据', userData) // 来自Server的数据 用户数据
}

getCompany()
```

可以很明显的看到，`await` 是等待后面的异步操作完成后才返回给 `userData`。如果没有等待操作 `userData` 将会是 `undefined`。

async 函数是使用 async 关键字声明的函数。 async 函数是 `AsyncFunction` 构造函数的实例， 并且其中允许使用 await 关键字。async 和 await 关键字让我们可以用一种更简洁的方式写出基于 Promise 的异步行为，而无需刻意地链式调用 Promise。async 函数一定会返回一个 Promise 对象。如果一个 async 函数的返回值看起来不是 Promise，那么它将会被隐式地**包装在一个 Promise 中**[^1]。在所有异步解决方案中，它有以下优点：

- 级联调用：即调用依次发生的场景，比如通过书名获取一本书的作者的其它书籍信息信息：先获取作者的信息，通过作者信息查找全部的书籍信息，再通过指定的书籍信息获取具体书籍的信息。以上每一步都是异步操作且连续（当然后台可以一步到位，SQL 写的好的话 😆），使用 Promise 会使得代码非常长，而 async 却不会出现。

- 符合编写习惯： Promise 使用 then 函数进行链式调用，是一种从左向右的横向写法；async 从上到下，顺序执行，就像写同步代码一样，更符合代码编写习惯。

- 多参数传递： Promise 的 then 函数只能传递一个参数，虽然可以通过包装成对象来传递多个参数，但是会导致传递冗余信息，频繁的解析又重新组合参数，比较麻烦；async/await 没有这个限制。

- 同异步结合： 使用 Promise 的时候最好将同步代码和异步代码放在不同的 then 节点中，这样结构更加清晰；async 整个书写习惯都是同步的，不需要纠结同步和异步的区别，当然，异步过程需要包装成一个 Promise 对象放在 await 关键字后面。

[^1]: [async 函数 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
