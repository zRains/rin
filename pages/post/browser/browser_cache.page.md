---
date: 1649942694481
title: '比较好理解的浏览器缓存'
scope: ['browser']
buckets: ['post', 'browser']
---

原文章：[掘金](https://juejin.cn/post/6844903593275817998)

## 缓存基本过程

浏览器与服务器通信的方式为应答模式，即是：浏览器发起 HTTP 请求 – 服务器响应该请求。那么浏览器第一次向服务器发起该请求后拿到请求结果，会根据响应报文中 HTTP 头的缓存标识，决定是否缓存结果，是则将请求结果和缓存标识存入浏览器缓存中，简单的过程如下图：

![img](https://res.zrain.fun/images/2022/03/162db6359673e7d0-tplv-t2oaga2asx-watermark-e6b49ef90e4ce56ae225fac84099e54e.webp)

由上图我们可以知道：

- 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识
- 浏览器每次拿到返回的请求结果都会根据相应字段选择性将该结果和缓存标识存入浏览器缓存中

以上两点结论就是浏览器缓存机制的关键，他确保了每个请求的缓存存入与读取，只要我们再理解浏览器缓存的使用规则，那么所有的问题就迎刃而解了，本文也将围绕着这点进行详细分析。为了方便大家理解，这里我们根据是否需要向服务器重新发起 HTTP 请求将缓存过程分为两个部分，分别是强制缓存和协商缓存。

#### 强制缓存

强制缓存就是向浏览器缓存查找该请求结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程，强制缓存的情况主要有三种(暂不分析协商缓存过程)，如下：

不存在该缓存结果和缓存标识，强制缓存失效，则直接向服务器发起请求（跟第一次发起请求一致），如下图：

![img](https://res.zrain.fun/images/2022/03/162db63596c9de23-tplv-t2oaga2asx-watermark-2eb654151d956117b5923b30ecf20717.webp)

存在该缓存结果和缓存标识，但该结果已失效，强制缓存失效，则使用协商缓存(暂不分析)，如下图：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/19/162db63597182316~tplv-t2oaga2asx-watermark.awebp)

存在该缓存结果和缓存标识，且该结果尚未失效，强制缓存生效，直接返回该结果，如下图：

![img](https://res.zrain.fun/images/2022/03/162db6359acd19d3-tplv-t2oaga2asx-watermark-7bdc469e3befed1535fe386954049309.webp)

那么强制缓存的缓存规则是什么？

当浏览器向服务器发起请求时，服务器会将缓存规则放入 HTTP 响应报文的 HTTP 头中和请求结果一起返回给浏览器，控制强制缓存的字段分别是`Expires`和 Cache-`Control`，其中 Cache-Control 优先级比 Expires 高。

#### Cache-Control

在 HTTP/1.1 中，Cache-Control 是最重要的规则，主要用于控制网页缓存，主要取值为：

- public：所有内容都将被缓存（客户端和代理服务器都可缓存）。
- private：所有内容只有客户端可以缓存，Cache-Control 的默认取值。
- no-cache：客户端缓存内容，但是是否使用缓存则需要经过协商缓存来验证决定，相当于`Cache-Control: max-age=0, must-revalidate。`。
- no-store：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存。
- max-age=xxx (xxx is numeric)：缓存内容将在 xxx 秒后失效。

#### 协商缓存

协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，主要有以下两种情况：

协商缓存生效，返回 304，如下图：

![img](https://res.zrain.fun/images/2022/03/162db635cbfff69d-tplv-t2oaga2asx-watermark-eca6134a4fd8cdda46e9f03c237c14ea.webp)

协商缓存失效，返回 200 和请求结果结果，如下图：

![img](https://res.zrain.fun/images/2022/03/162db635cf070ff5-tplv-t2oaga2asx-watermark-4b90c679dc07e57ccfe85438cec14954.webp)

同样，协商缓存的标识也是在响应报文的 HTTP 头中和请求结果一起返回给浏览器的，控制协商缓存的字段分别有：Last-Modified / If-Modified-Since 和 Etag / If-None-Match，其中 Etag / If-None-Match 的优先级比 Last-Modified / If-Modified-Since 高。

#### 总结

强制缓存优先于协商缓存进行，若强制缓存(Expires 和 Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since 和 Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回 304，继续使用缓存，主要过程如下：

![img](https://res.zrain.fun/images/2022/03/162db635ed5f6d26-tplv-t2oaga2asx-watermark-1027c07971df910c70deaa9a70d6637f.webp)
