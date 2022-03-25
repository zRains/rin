---
injectComponents: [{ name: 'Calc', path: '@post/calc.vue' }]
author: 'zRain'
---

# A demo of `react-markdown`

`react-markdown` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

- Follows [CommonMark](https://commonmark.org)
- Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
- Renders actual React elements instead of using `dangerouslySetInnerHTML`
- Lets you define your own components (to render `MyHeading` instead of `h1`)
- Has a lot of plugins

Here is an example of a plugin in action
([`remark-toc`](https://github.com/remarkjs/remark-toc)).
This section is replaced by an actual table of contents.

## Syntax highlighting

Here is an example of a plugin to highlight code:
[`rehype-highlight`](https://github.com/rehypejs/rehype-highlight).

```js
import React from 'react'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

ReactDOM.render(
  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
    {'# Your markdown here'}
  </ReactMarkdown>,
  document.querySelector('#content')
)
```

Pretty neat, eh?

## GitHub flavored markdown (GFM)

For GFM, you can _also_ use a plugin:
[`remark-gfm`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

|    Feature | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
|        GFM | 100% w/ `remark-gfm` |

~~strikethrough~~

- [ ] task list
- [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
use [`rehype-raw`](https://github.com/rehypejs/rehype-raw).
You should probably combine it with
[`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize).

> 👆 Use the toggle above to add the plugin.

## Components

You can pass components to change things:

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

---

A component by [Espen Hovlandsdal](https://espen.codes/)

| Alpha | Bravo   |
| ----- | ------- |
| 中文  | Charlie |
| 👩‍❤️‍👩    | Delta   |

```js
var reverseList = function (head) {
  let nodeTemp = new ListNode()
  let currentHead = nodeTemp
  while (head !== null) {
    let nextNode = head.next
    // 判断是否有第一个节点，如果没有头节点则表明是第一个节点，即需要将其next置为null
    if (currentHead.next) {
      // 如果有节点，则将当前的节点的next指向头节点的下一个节点
      head.next = currentHead.next
    } else {
      head.next = null
    }
    // 将头节点的下一个节点指向当前节点
    currentHead.next = head
    head = nextNode
  }
  return nodeTemp.next
}
```

<Calc/>

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS mouse-out transition effect" src="https://codepen.io/pocket-gad/embed/abwapXB?default-tab=result&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
</iframe>

Using footnotes is fun![^1] They let you reference relevant information without disrupting the flow of what you’re trying to say.[^bignote]

[^1]: This is the first footnote.
[^bignote]: Here’s one with multiple paragraphs and code.
