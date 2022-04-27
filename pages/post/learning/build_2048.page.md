---
title: 'Canvas从零开始实现2048'
scope: ['browser', 'canvas']
---

<div style="height:150px;background:#eee4da;text-align:center;user-select:none;line-height:150px;font-size:3em;color:#776e65;font-weight:600">2048</div>

前些阵子些许无聊，借此空闲时间想用 Canvas 实现一个小游戏，选来选去最后决定是 2048（太难容易没巩固的效果，太难打击自信心 🤣）。但让我没想到的是其中 Canvas 涉及的东西并不多。

### 目录

### 新建操作画布

> 工欲善其事，必先利其器。 --- 《论语》

为了防止出现绘制模糊的问题，参考了[Canvas 为什么变得这么模糊？](/post/learning/canvas_blur)里的代码。新建 Canvas 代码如下：

```javascript
/**
 * @type {HTMLCanvasElement}
 */
const CANVAS = document.getElementById('canvas')
const CTX = CANVAS.getContext('2d')
const CH = 500
const CW = 500

// 调整Canvas
CANVAS.style.height = CH + 'px'
CANVAS.style.width = CW + 'px'
CANVAS.height = CH * window.devicePixelRatio
CANVAS.width = CW * window.devicePixelRatio
CTX.scale(window.devicePixelRatio, window.devicePixelRatio)

// Canvas基础样式
CTX.lineWidth = 4
CTX.font = 'normal 600 30px "JetBrains Mono"'
CTX.textAlign = 'center'
CTX.textBaseline = 'middle'
```
