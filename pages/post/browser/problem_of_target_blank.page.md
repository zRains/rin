---
title: '危险的target="_blank"'
scope: ['browser']
buckets: ['post', 'browser']
---

### target = "\_blank"有哪些问题？

通过 target = "\_blank"点开的窗口活着标签页，子窗口能捕获 opener 句柄：

```html
<a href="https://zrain.fun" target="_blank">打开标签页</a>
```

通过`window.open`也能达到上述效果：

```html
<button id="openTab">打开新标签</button>

<script>
  window.openTab.onclick = function () {
    window.open('https://www.baidu.com')
  }
</script>
```

具体信息如下：

![image-20220328000707155](https://res.zrain.fun/images/2022/03/image-20220328000707155-8f7c6e839b46c77ce852360e89d64cdf.png)

此时通过`opener`可以修改父标签的一些行为，就比如重定向操作：

```javascript
window.opener.location.href = 'https://zrain.fun'
```

这可能会让你重定向到模仿度很高的恶意网站。新打开的窗口与原页面窗口共用一个进程，若是新页面有性能不好的代码也会影响原页面(不过，有些浏览器对性能做了优化，即使不加这个属性，新窗口也会在独立进程打开)。

### 解决方案

**rel="noopener"**：阻止新页面访问 window.opener 属性，并确保它在单独的进程中运行。

**rel="noreferrer"**：具有相同的效果，但还会阻止将 Referer 标头发送到新页面 。

因此，我们可以：当使用`target = "_blank"`时，带上以上的两个属性。当使用`window.open`时，可以显示将`opener`置为`null`:

```javascript
const openTab = window.open('https://www.baidu.com')
openTab.opener = null
```

在我测试中，发现子页面的`opener`为`null`，原来，新版的 Chrome [^newchrome]默认解决了此问题：

> 从 Chromium 88 版开始，默认情况下，带有 target="\_blank" 的锚点会自动获得 noopener 行为。rel="noopener" 的显式规范有助于保护旧版浏览器（包括 Edge Legacy 和 Internet Explorer）的用户。

[^newchrome]: [指向跨源目的地的链接不安全](https://web.dev/external-anchors-use-rel-noopener/)
