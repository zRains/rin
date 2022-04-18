---
title: 'JS的二进制家族'
injectComponents: [{ name: 'BlobViewImg', path: '@components/post/blob_view_img.vue' }]
scope: ['JS']
---

<div style="display:flex; justify-content:center">
<img src="https://res.zrain.fun/images/2022/04/js%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6-d83a0110d6395f3b8ddf71ae705f948b.png" alt="js的二进制" style="zoom:45%;" /></div>

在了解[关于 NodeJS 中的流（Stream）](/post/learning/about_node_stream)这篇 post 出现多次`<Buffer xx xx>`，借此机会了解一下 JS 中的二进制操作。

### 概述

与 JS 的二进制操作相关的类有`Blob`和`ArrayBuffer`。在 node 里则是`Buffer`：

- **Blob**: 前端的一个专门用于支持文件操作的二进制对象

- **ArrayBuffer**：前端的一个通用的二进制缓冲区，类似数组，但在 API 和特性上却有诸多不同

- **Buffer**：Node.js 提供的一个二进制缓冲区，常用来处理 I/O 操作

<div style="display:flex; justify-content:center">
<img src="https://res.zrain.fun/images/2022/04/js%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6-508f4ff8201c8420c8e918ec282a5935.png" alt="二进制操作关系图" style="zoom:40%;" /></div>

### Blob

Blob(binary large object)，二进制类文件大对象，是一个可以存储二进制文件的“容器”，HTML5 中的 Blob 对象除了存放二进制数据外还可以设置这个数据的 MIME 类型。File 接口基于 Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

> 所以在我们看来，File 对象可以看作一种特殊的 Blob 对象。

在前端工程中，我们在这些操作中可以获得 File 对象：

- `<input type="file">`标签上所选取的文件。

- 拖拽中生成的`DataTransfer`对象。

File 对象是一种特殊的 Blob 对象，那么它自然就可以直接调用 Blob 对象的方法：

- 文件下载：通过`URL.createObjectURL(blob)`生成 Blob URL，赋给 a 标签的 download 属性。

- 图片显示：通过`URL.createObjectURL(blob)`生成 BlobRL，赋给 img 标签的 src 属性。

- 资源分段：通过`blob.slice`可以分割二进制数据为子 Blob 上传。

- 读取本地文件：`FileReader`的 API 可以将 Blob 或 File 转化为文本/ArrayBuffer/Data URL 等。

下面是 Blob 的几个具体运用例子。

#### 构造一个 Blob URL

Blob() 构造函数允许通过其它对象创建 Blob 对象。比如，用字符串构建一个 blob：

```javascript
const debug = { hello: 'world' }
const blob = new Blob([JSON.stringify(debug, null, 2)], { type: 'application/json' })
```

通过 `window.URL.createObjectURL` 方法可以把一个 blob 转化为一个 Blob URL，并且用做文件下载或者图片显示的链接：

```javascript
window.URL.createObjectURL(blob)
// 输出： 'blob:chrome://new-tab-page-third-party/8f0149c3-df2e-4a65-b7b3-203b6a198c9e'
```

和冗长的 Base64 格式的 Data URL 相比，Blob URL 的长度显然不能够存储足够的信息，这也就意味着它只是类似于一个浏览器内部的“引用“。从这个角度看，Blob URL 是一个浏览器自行制定的一个**伪协议**。

#### 利用 Blob URL 实现文件的下载

我们可以通过 `window.URL.createObjectURL`，接收一个 Blob（File）对象，将其转化为 Blob URL，然后赋给 a 标签的 download 属性，然后在页面上点击这个链接就可以实现下载了：

```html
<!-- html部分 -->
<a id="h">点此进行下载</a>
<!-- js部分 -->
<script>
  var blob = new Blob(['Hello World'])
  var url = window.URL.createObjectURL(blob)
  var a = document.getElementById('h')
  a.download = 'helloworld.txt'
  a.href = url
</script>
```

#### Blob 实现图片本地显示

window.URL.createObjectURL 生成的 Blob URL 还可以赋给 img.src，从而实现图片的显示：

```html
<!-- html部分 -->
<input type="file" id="f" />
<img id="img" style="width: 200px;height:200px;" />
<!-- js部分 -->
<script>
  document.getElementById('f').addEventListener(
    'change',
    function (e) {
      var file = this.files[0]
      const img = document.getElementById('img')
      const url = window.URL.createObjectURL(file)
      img.src = url
      img.onload = function () {
        // 释放一个之前通过调用 URL.createObjectURL创建的 URL 对象
        window.URL.revokeObjectURL(url)
      }
    },
    false
  )
</script>
```

<BlobViewImg/>

#### Blob 实现文件分片上传

在处理大文件上传时常用的一个功能，将 blob 分成小块并发上传，可以大大提高上传的效率：

```javascript
/**
 * 大文件分片
 * @param {File} file
 * @param {number} size
 * @returns
 */
function createFileChunk(file, size = 100) {
  const fileChunkList = []
  file.arrayBuffer()
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push(file.slice(cur, cur + size))
    cur += size
  }
  return fileChunkList
}
```

#### FileReader 读取本地文件内容

如果想要读取 Blob 或者文件对象并转化为其他格式的数据，可以借助 FileReader 对象的 API 进行操作：

- **`FileReader.readAsText(Blob)`**：将 Blob 转化为文本字符串。

- **`FileReader.readAsArrayBuffer(Blob)`**： 将 Blob 转为 ArrayBuffer 格式数据。

- **`FileReader.readAsDataURL(Blob)`**: 将 Blob 转化为 Base64 格式的 Data URL。

上面介绍了 Blob 的用法，我们不难发现，Blob 是针对文件的，或者可以说它就是一个文件对象，同时呢我们发现 Blob 欠缺对二进制数据的细节操作能力，比如如果如果要具体修改某一部分的二进制数据，Blob 显然就不够用了，而这种细粒度的功能则可以由下面介绍的 ArrayBuffer 来完成。

### ArrayBuffer

ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个**字节数组**，通常在其他语言中称为“byte array”。说它是一个数组，但我们并不能对其进行常规操作，需要借用类型数组对象（TypeArray）或 DataView。ArrayBuffer 和 Blob 可以相互转化：
