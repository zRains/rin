---
title: '笔记'
index: true
---

# 笔记

> 简短的笔记，也许是我不想写这么多罢了 📝

容易忘记的`Math.random()`

Math.random()方法返回大于等于 0 小于 1 的一个随机数。

产生**1-10**的随机数（两端包含）：

```javascript
var rand1 = Math.floor(Math.random() * 10 + 1)
```

产生**0-10**的随机数（两端包含）：

```javascript
var rand1 = Math.floor(Math.random() * 11)
var rand1 = Math.ceil(Math.random() * 10)
```

---

### 一些有用的 Linux 命令

防止别人 ping 你的服务器

```bash
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
```

查看端口

```bash
ps aux
```

查看所有进程

```bash
netstat -tlunp
```

---

### iframe 标签特性

- iframe 的创建比其它包括 scripts 和 css 的 DOM 元素的创建慢了 1-2 个数量级，使用 iframe 的页面一般不会包含太多 iframe，所以创建 DOM 节点所花费的时间不会占很大的比重。但带来一些其它的问题：onload 事件以及连接池（connection pool）

- 搜索引擎的检索程序无法解读 iframe。另外，iframe 本身不是动态语言，样式和脚本都需要额外导入。

- 绝大部分浏览器，主页面和其中的 iframe 是共享这些连接的。这意味着 iframe 在加载资源时可能用光了所有的可用连接，从而阻塞了主页面资源的加载。如果 iframe 中的内容比主页面的内容更重要，这当然是很好的。但通常情况下，iframe 里的内容是没有主页面的内容重要的。这时 iframe 中用光了可用的连接就是不值得的了。一种解决办法是，在主页面上重要的元素加载完毕后，再动态设置 iframe 的 SRC。

---

### 手动写动画最小时间间隔是多久

多数显示器的默认频率是 60hz,即每秒刷新 60 次。所以理论上的最小间隔是 1/60\*1000ms=16.7ms

---

### `<string.h>` & `<strings.h>`

we don't need and should not read this file if `<string.h>` was already read. The one exception being that if \_USE_MISC isn't defined, then these aren't defined in string.h, so we need to define then here.

```cpp
#ifdef __USE_MISC
#include <strings.h>
```

[stckoverflow](https://stackoverflow.com/a/4291328/14792586): strings.h comes from the BSD branch in the unix evolution. Its content has been standardized by POSIX, but most of it is marked as legacy and can be easily replaced with other functions:

```cpp
int    bcmp(const void *, const void *, size_t); /* LEGACY, see memcmp */
void   bcopy(const void *, void *, size_t); /* LEGACY, see memcpy, memmove */
void   bzero(void *, size_t); /* LEGACY, see memset */
int    ffs(int);
char  *index(const char *, int); /* LEGACY, see strchr */
char  *rindex(const char *, int); /* LEGACY, see strrchr */
int    strcasecmp(const char *, const char *);
int    strncasecmp(const char *, const char *, size_t);
```

---

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
