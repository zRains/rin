---
title: '一个组件在Vue3中大致经历了什么？'
wrap: ['source_of_vue3']
scope: ['Vue3', 'source']
---

大致总结一下一个组件在 vue3 驱动下如何渲染到页面，肯定省略了不少，以后再慢慢补充吧。

<img src="https://cdn.jsdelivr.net/gh/zrains/images/2022/04/Page%201-f0c713c6c72f0292fb6370d2ad16375f.png"/>

## 出发

### `createApp` - 一切的开始

下面这个代码再熟悉不过了。

```javascript
import { createApp } from 'vue'
import App from './App.js'

createApp(App).mount(document.querySelector('#app'))
```

让我们看看`createApp`都做了什么：

```javascript
// mini-vue: runtime-dom/index.ts
let renderer

function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer({...}))
  )
}

export const createApp = (...args) => {
  return ensureRenderer().createApp(...args)
}
```

### `createRenderer` - 渲染器的诞生

从上面代码可以看出`createApp`帮我们创建了一个渲染器，并使用渲染器里的`createApp`加载组件，也就是上面的`App`。而`ensureRenderer`顾名思义就是确定只有一个渲染器，这就使得我们创建多个组件（包括通过`createApp`）使用的都是**同一个**渲染器。让我们看看`createRenderer({...})`做了什么：

```javascript
// mini-vue: runtime-core/renderer.ts
export function createRenderer(options) {
  // 渲染器对dom的操作
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setText: hostSetText,
    createText: hostCreateText
  } = options

  // 创建一个渲染器
  const render = (vnode, container) => {
    // 调用 patch
    patch(null, vnode, container)
  }

  // patch函数
  function patch(n1, n2, container = null, anchor = null, parentComponent = null) {
    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      // 其中还有几个类型比如： static fragment comment
      case Fragment:
        processFragment(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理 element
          processElement(n1, n2, container, anchor, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理 component
          processComponent(n1, n2, container, parentComponent)
        }
    }
  }

  // 省略了很多很多各种组件处理函数，里面多多少少用到了options里面的方法

  // 返回带mount的createApp
  return {
    createApp: createAppAPI(render)
  }
}
```

很明显`options`是对元素的操作函数，比如创建 dom，设置 dom 的内容，对 dom 的增删等。其实 vue 里面不止这么点对 dom 的操作，vue 是单独封装在`runtime-core/src/nodeOpts.ts`里面，包括获取父节点，克隆节点，挂载静态内容等。

### `patch` - 一个小型的适配器模式

`patch`，补丁，修补的意思。而它主要的作用是对不同类型的组件进行不同的处理，因为最后的最后都要当作`element`类型挂载到 dom 里。这里我们可以看一下有哪些类型，也就是上面的 shapeFlag 枚举：

```typescript
// vue-core: shared/src/shapeFlags.ts
export const enum ShapeFlags {
  ELEMENT = 1, // 普通元素，也可以理解为原生dom，比如div、h1、section
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件，使用function创建的
  STATEFUL_COMPONENT = 1 << 2, // 状态式组件，基于 options 创建的
  TEXT_CHILDREN = 1 << 3, // vnode 的 children 为 string 类型
  ARRAY_CHILDREN = 1 << 4, // vnode 的 children 为数组类型
  SLOTS_CHILDREN = 1 << 5, // vnode 的 children 为 slots 类型
  TELEPORT = 1 << 6, // 传送组件，被<Teleprot></Teleprot>包裹
  SUSPENSE = 1 << 7, // 异步组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
```

我当初在想为什么用位移运算来代替枚举，为什么不直接写个常量，比如`STATEFUL_COMPONENT = 1 << 2`可以替换成`STATEFUL_COMPONENT = 4`。网上也没搜出一个所以然，虽然我知道这里的位运算压根儿消耗不了多少性能，可能是为了辨识，方便增加组件的类型。但至于为什么要这样枚举，查看[**这篇文章**](/post/learning/bit_operation_in_shapeFlags)。

> 到现在还是`createRenderer`里面的一小部分。这个函数可以说是相当夸张，在`mini-vue`里大致**600**行，到了`vue-core`直接飙升到**2000**行。如果真去啃岂不是诸神黄昏！！
>
> ![image-20220405205520985](https://cdn.jsdelivr.net/gh/zrains/images/2022/04/image-20220405205520985-727d65c8faadf9d228ef760773602393.png)

`createRenderer`里面除了`patch`还包含了大量的各种组件处理函数。

### `processComponent` - 初始化组件开始

在 mini-vue 和 vue-core 里这个函数只是短短几行（vue-core 里相较于其它函数来说），这里就截取 mini-vue 里的吧：

```typescript
//mini-vue: runtime-core/renderer.ts
function processComponent(n1, n2, container, parentComponent) {
  // 如果 n1 没有值的话，那么就是 mount
  if (!n1) {
    // 初始化 component，延续上一个函数，parentComponent有可能null。
    mountComponent(n2, container, parentComponent)
  } else {
    updateComponent(n1, n2, container)
  }
}
```

其中，`n1`为`n2`的生成前一个`subTree`，可以理解为后者是前者更新后的 vnode。很简单的逻辑，`n1`为 null 则表明需要挂载，因为你前一次的记录都没有，还怎么更新啊，肯定要先挂载产生一个记录啊。🤣

<img src="https://cdn.jsdelivr.net/gh/zrains/images/2022/04/processComponent-4a486fa454ace19989a2c055a01eb98d.png" alt="processComponent" />

### `mountComponent` - 组件实例被创建

### `setupRenderEffect` - 响应式的开始

这里不得不提一个函数：`setupRenderEffect`。令人胆寒，这个就是组件内部响应式初始化开始的入口：

### `createAppAPI` - 将创造能力给我们

来看看`createRenderer`最后返回给我们什么：

```typescript
// mini-vue: runtime-core/createApp.ts
export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        // 基于根组件创建 vnode
        const vnode = createVNode(rootComponent)
        // 调用 render，基于 vnode 进行开箱。
        render(vnode, rootContainer)
      }
    }

    return app
  }
}
```

`createAppAPI`返回了`createApp`方法，里面返回创建的 app 实例，包含`mount`和`_component`。而`mount`触发`render`渲染器，组件开始处理并挂载到页面上。实际上还有很多属性`mini-vue`没有添加上去：

```typescript
// vue-core: runtime-core/src/apiCreateApp.ts
const app: App = (context.app = {
  // 组件uid
  _uid: uid++,
  // 当前组件
  _component: rootComponent as ConcreteComponent,
  // 属性
  _props: rootProps,
  // 当前组件容器
  _container: null,
  // 当前组件上下文
  _context: context,
  // 当前app实例
  _instance: null,
  // vue版本
  version,

  get config() {
    return context.config
  },

  set config(v) {
    if (__DEV__) {
      warn(`app.config cannot be replaced. Modify individual options instead.`)
    }
  },
  // 使用插件
  use(plugin: Plugin, ...options: any[]) {},
  // 全局属性混入
  mixin(mixin: ComponentOptions) {},
  // 全局组件注册
  component(name: string, component?: Component): any {},
  // 全局探测器注册
  directive(name: string, directive?: Directive) {},
  // 卸载组件
  unmount() {},
  // 属性提供
  provide(key, value) {}
})
```

是不是在上面看到很多熟悉的方法。

### `createVNode` - 装箱与开箱

> vnode 是 vue 中表示虚拟 dom 的一个代称，全名为 Virtual DOM。

注意到`mount`里有个`createVNode`方法。这个方法对传入的组件进行**装箱操作**：

<details>
<summary>展开 mini-vue 中的 createVNode 代码</summary>

```typescript
// mini-vue: runtime-core/vnode.ts
export const createVNode = function (type: any, props?: any, children?: string | Array<any>) {
  const vnode = {
    el: null,
    component: null,
    key: props?.key,
    type,
    props: props || {},
    children,
    shapeFlag: getShapeFlag(type)
  }

  // 基于 children 再次设置 shapeFlag
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }

  normalizeChildren(vnode, children)

  return vnode
}

export function normalizeChildren(vnode, children) {
  if (typeof children === 'object') {
    if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
    } else {
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
    }
  }
}

// 基于 type 来判断是什么类型的组件
function getShapeFlag(type: any) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
```

</details>

> 为了精简篇幅已将部分注释。

`createVNode`是私有方法，正常使用 vue 时是没有这个 API 的，但另一个熟知的方法`h`就是基于它实现的，这也是 vue 考虑周全的地方。其中的`type`参数可能有多个类型：

**String 类型**

类似于`createVNode("div")`，创建一个普通的 dom 元素，归属`ShapeFlags.ELEMENT`。

**Object 类型**

这个可再分为两种类型：如果是普通对象的话，那么就是用户设置的 options，否则就为组件对象，类似于`createVNode(App)`

我们可以看到`createVNode`是通过`getShapeFlag`进行简单的判断，实际上再源码中判断的类型多的多：

```typescript
// vue-core: runtime-core/src/vnode.ts
const shapeFlag = isString(type)
  ? ShapeFlags.ELEMENT
  : __FEATURE_SUSPENSE__ && isSuspense(type)
  ? ShapeFlags.SUSPENSE
  : isTeleport(type)
  ? ShapeFlags.TELEPORT
  : isObject(type)
  ? ShapeFlags.STATEFUL_COMPONENT
  : isFunction(type)
  ? ShapeFlags.FUNCTIONAL_COMPONENT
  : 0
```

`createVNode`还有这样一个函数：`normalizeChildren`。这个函数主要判断组件的子组件类型，并改变组件的 shapeFlag。

根据`getShapeFlag`（vue 源码里是没有这个函数的，这只是个简单实现，代替上面 shapeFlag 的疯狂判断），当`children`的类型为对象时，如果对象被定义为`ShapeFlags.ELEMENT`，那么它的子组件必不可能为`slot`类型，否则将 shapeFlag 添加上`ShapeFlags.SLOTS_CHILDREN`的比特位。

vue 源码中的`normalizeChildren`实现更为复杂，考虑了很多类型的组件和情况，已包含个人的注释：

<details>
<summary>展开 vue-core 中的 normalizeChildren 代码</summary>

```typescript
export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  // 如果children为假值，直接置为null
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    // 当children是数组类型时
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.TELEPORT)) {
      // 下面正是mini-vue判断vnode.shapeFlag & ShapeFlags.ELEMENT后的省略部分
      // vue-core在这里考虑了这样一种情况：h('div', null, { default: () => 'hello' })
      // 上面这种情况就是往普通元素内插入文本，我们可以看作每个元素默认视为包含一个<slot/>
      // 换一个角度讲，普通元素的插槽只有默认插槽一个！
      const slot = (children as any).default
      if (slot) {
        // _c 是在slot部分withCtx()添加的，用于表示这个slot是否是一个已编译的slot
        slot._c && (slot._d = false)
        // slot()就表明如果是插槽的话必须是一个函数，不能有这种写法：h('div', null, { default: 'hello' })
        normalizeChildren(vnode, slot())
        slot._c && (slot._d = true)
      }
      return
    } else {
      // 到这里逻辑就和mini-vue类似了，既然你不是ShapeFlags.ELEMENT，那么此时肯定同时属于ShapeFlags.SLOTS_CHILDREN
      type = ShapeFlags.SLOTS_CHILDREN
      // 省略了一部分代码，大部分是对slot的处理
    }
  } else if (isFunction(children)) {
    // 如果children是函数，则讲children包装为属于default的对象，就和上面一样了。个人认为其实这里只是多一个编写选择。
    children = { default: children, _ctx: currentRenderingInstance }
    type = ShapeFlags.SLOTS_CHILDREN
  } else {
    children = String(children)
    // force teleport children to array so it can be moved around
    if (shapeFlag & ShapeFlags.TELEPORT) {
      type = ShapeFlags.ARRAY_CHILDREN
      children = [createTextVNode(children as string)]
    } else {
      type = ShapeFlags.TEXT_CHILDREN
    }
  }
  vnode.children = children as VNodeNormalizedChildren
  vnode.shapeFlag |= type
}
```

</details>

<img src="https://cdn.jsdelivr.net/gh/zrains/images/2022/04/normalizeChildren-bbeb480aa1970200d25de09b64ac4711.png" alt="normalizeChildren" style="zoom:40%;" />

### 登场

其实在
