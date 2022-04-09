---
title: 'Canvas 为什么变得这么模糊？'
injectComponents: [{ name: 'CanvasBlur', path: '@components/post/canvas_blur.vue' }]
scope: ['browser', 'canvas']
---

当我使用 canvas 进行绘制时，发现总是会变的模糊不清（肯定不是因为我的近视 🤣），就像加了一层滤镜。就如下面这个例子，我画了一些东西：

<CanvasBlur/>

可能看不出模糊的效果，下面这是修复后的：

<CanvasBlur fixed/>

是不是清晰了许多？为了理解上述产生的问题，我们需要了解两个概念：

- 设备像素比
- canvas 的 css 宽高与上下文宽高

### 设备像素比 - devicePixelRatio(DPR)

举个简单的例子，在 iPhone3G 时代，屏幕宽度是 320px，其宽度上的物理像素也是 320px；而到了 4s 时代，屏幕宽度依然是 320px，但是宽度上的物理像素却变成了 640px，是宽度的两倍。屏幕宽度没变，物理像素却增加了，所以为了屏幕显示的内容不改变，原先需要一个像素绘制的点，现在会用两个像素来绘制。

<img src="https://cdn.jsdelivr.net/gh/zrains/images/2022/04/New%20Page-08388adc8c5e2751827a91cfe4ec80ab.png" alt="devicePixelRatio" style="zoom:40%;" />

为了表示这种屏幕的特性，浏览器全局对象下就有了这样一个属性——devicePixelRatio 设备像素比，它的计算方式是：

<p style="text-align:center;font-size:1.1em;font-weight:bold">devicePixelRatio = 物理像素 / 屏幕宽度的像素</p>

所以 3G 的设备像素比为 1 ， 4s 为 2，而现在 iPhone 的 plus 型号手机的设备像素比为 3，甚至部分出现了比值为 4 的安卓设备。

回到 canvas 上的问题上，当我们想要绘制一条 1px 的线时，由于当前浏览器的设备像素比是 2，所以实际上是通过 2 个像素点来绘制的，但是即便是 2 个像素绘制的线条也不应该出现模糊的问题，而现在确实模糊了，这又是为什么呢？

### Canvas 宽高与上下文宽高

修复前渲染出的代码是这样的：

```html
<canvas height="200" width="800"></canvas>
```

其实，canvas 标签中的 width 和 height 属性并不是 css 中的宽高，而是 canvas 绘图上下文（绘图区域）的宽高，当不设置 canvas 的 css 宽高时，canvas 会将 width 和 height 的值作为 css 宽高，而 css 宽高使元素在页面上的可见尺寸。

但是 canvas 的上下文宽高略奇怪，它可不管像素比是 1 是 2 还是 3，它就是会将整个 canvas 绘图区域塞进 css 宽高中并且填满，绘图的时候会将绘制的图形的宽高按照塞进 css 时宽与高的缩放比率分别进行缩放（所以如果缩放比率不同，就会导致绘制的图形变形），当然，这不是导致模糊的原因，这个只会引起形变。下面这个才是导致模糊的元凶：

canvas 绘图时，会从两个物理像素的中间位置开始绘制并向两边扩散 0.5 个物理像素。当设备像素比为 1 时，一个 1px 的线条实际上占据了两个物理像素（每个像素实际上只占一半），由于不存在 0.5 个像素，所以这两个像素本来不应该被绘制的部分也被绘制了，于是 1 物理像素的线条变成了 2 物理像素，视觉上就造成了模糊。

### 解决

首先分别声明 canvas 的 css 宽高和上下文宽高，同时上下文宽高应该是 css 宽高的 devicePixelRatio 倍：

```html
// 假设devicePixelRatio = 2，上面canvas里的DPR是你当前设备的真实DPR 🙌
<style>
  canvas {
    width: 200px;
    height: 200px;
  }
</style>
<canvas id="canvas" width="400" height="400"></canvas>
```

虽然是 1px 的边框，但是由于绘制在 400px \* 400px 的区域上，而画布又等比缩放在 200px \* 200px 的 canvas 标签内，导致 1px 变成了 0.5 px，但因为无法绘制 0.5px 所以依然是通过 2 个物理像素绘制。

下一步，我们需要将 canvas 的绘图区域扩大一倍（因为 devicePixelRatio = 2），这样才能让视觉上的效果正常：

```javascript
CTX.scale(2, 2)
```

此时原先 0.5px 的线条变成了 1px，依然通过 2 个物理像素绘制，所以虽然扩大了一倍，但是边框宽度并不会改变。而且因为两个像素是可以绘制的，因此模糊 的问题就解决了。

canvas 部分代码：

```javascript
const CANVAS = document.getElementById('canvas')
const CTX = CANVAS.getContext('2d')
const CH = window.innerHeight
const CW = window.innerWidth

CANVAS.style.height = CH + 'px'
CANVAS.style.width = CW + 'px'
CANVAS.height = CH * window.devicePixelRatio
CANVAS.width = CW * window.devicePixelRatio
CTX.scale(window.devicePixelRatio, window.devicePixelRatio)
```

### 参考

[Canvas 绘图模糊问题解析 - 知乎](https://zhuanlan.zhihu.com/p/31426945)
