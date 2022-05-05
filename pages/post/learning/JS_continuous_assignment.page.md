---
date: 1649942694483
title: 'JS连续赋值执行分析'
scope: ['JS']
buckets: ['post', 'learning']
---

一个很经典的问题，下面一段代码输出是？

```javascript
let a = { n: 2 }
let b = a
a.x = a = { l: 2 }

console.log(a.x)
console.log(b.x)
```

我第一次是这样想的：

- 最初`a`和`b`共同指向同一个堆地址，即`{ n: 2 }`。
- 当遇到连续赋值时，先看最右边，执行`a = { l: 2 }`，此时`a`已经指向新的堆地址，即`{ l: 2 }`。
- 之后执行`a.x = a`，这样看来产生了循环引用。
- 最后得出`a.x`的值为`{ l: 2, x: a }`，而`b.x`的值为`{ l: undefined }`

但看了答案才发现自己再第三点想错了，下面用图说明：

当执行完`let b = a`时，变量情况如下：

<p align="center">
<img  src="https://res.zrain.fun/images/2022/04/image-20220403165852196-3491d2ad5094c3dbced4af1bb535ede3.png" alt="image-20220403165852196" style="zoom:60%;" />
</p>

之后执行`a.x = a = {n:2}`，首先进行一遍**左查找**。这里得提一个概念：结合性。

> 所谓结合性，是指表达式中同一个运算符出现多次时，是左边的优先计算还是右边的优先计算。赋值表达式是右结合的。这意味着：
>
> ```text
> A1 = A2 = A3 = A4
> ```
>
> 等价于
>
> ```text
> A1 = (A2 = (A3 = A4))
> ```

此时语句可变成：`a.x = (a = {n:2})`，首先对`a.x`进行左查找，发现`x`不存在，那就先赋个`undefined`：

<p align="center">
<img src="https://res.zrain.fun/images/2022/04/image-20220403172527865-342f8ceffb552264c458972f6964be4a.png" alt="image-20220403172527865" style="zoom:65%;" />
</p>

然后现在进行右查找，右查找是个赋值表达式`a = {n: 2}`，所以得先处理这个赋值表达式。而前面的`a.x`还在等待后面表达式处理返回的结果。

<p align="center">
<img src="https://res.zrain.fun/images/2022/04/image-20220403173411601-1058ecfd3e62754c10510f9abf9e5bac.png" alt="image-20220403173411601" style="zoom:67%;" />
</p>

重要的是，此时的`a.x`已经指向了内存中的`{ n: 1, x: undefined }`中的`x`，目前他正等待被赋值，所以下面在处理赋值表达式`a = {n: 2}`时候，即使 a 发生了指向的变化，**但也不再影响此刻的`a.x`了**，因为已经对`a.x`进行了指向的确定，只不过他现在正在等待被赋值。

因为赋值操作符的返回值，是返回右边的部分，对`a.x`的赋值操作也变成了：

```javascript
a.x = { l: 2 }
```

现在答案应该清楚了：

```javascript
console.log(a.x) // undefined
console.log(b.x) // { l: 2 }
```

### 参考

[javascript 面试题，关于连续赋值的坑？ - 知乎](https://www.zhihu.com/question/41220520)

[由 ES 规范学 JavaScript(二)：深入理解“连等赋值”问题 - 思否](https://segmentfault.com/a/1190000004224719)
