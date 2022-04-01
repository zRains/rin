---
title: '第8天 - 动态规划（简单）'
wrap: ['sword_to_offer']
scope: ['algorithm', 'LeetCode', 'DP']
---

### [剑指 Offer 10- I. 斐波那契数列](https://leetcode-cn.com/problems/fei-bo-na-qi-shu-lie-lcof/)

#### 描述

写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：

```text
F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.
```

斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

#### 解答

70 次左右已经超过 JS 数值类型的安全范围了，需要提前对每个计算进行模运算（Python 好像不需要，数值大小取决于运行内存）：

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  const result = [0, 1]
  if (n <= 1) return result[n]
  for (let i = 0; i < n - 1; i++) {
    let temp = result[0]
    result[0] = result[1]
    result[1] = (temp + result[1]) % 1000000007
  }
  return result[1]
}
```
