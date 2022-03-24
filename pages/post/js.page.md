### 以前只会用一丢丢js处理dom元素，大部分还是靠jquery。趁这段时间好好学一下js。依然来自后盾的向军大叔。

[TOC]

### 基础

#### 引入方式

```html
<!-- 直接内部编写 -->
<script>
	alert('houdunren.com');
</script>

<!-- 或外部引用 -->

<script src="houdunren.js"></script>
```

#### 避免延迟

因为html文件是从上往下加载的，因此会出现延迟现象。如果js在开头加载并且会消耗大量时间，那么网页就会一直处于空白状态直到js加载完成。因此推荐将js放在`<body>`末尾。或者以下几种做法：

```html
<script>
    //待dom加载完成时再加载js
	window.onload=function(){
    // ...
	}
</script>

<!-- 使用defer标签选项延迟加载。注意：defer 属性仅适用于外部脚本。 -->
<script src="test.js" defer></script>
```

#### 变量弱类型

在JS中变量类型由所引用的值决定。

```js
var web = "hdcms";
console.log(typeof web); //string
web = 99;
console.log(typeof web); //number
web = {};
console.log(typeof web); //object
```

#### 变量提升

我对此的理解：js在被执行之前会浏览一遍代码，使用 `var` 声明代码会被提升到前面，将变量声明放在最前面，赋值操作则保留在原位置。实列：

```js
// 原代码
var web = 'houdunren';
console.log(web);
let while = 'hdcms'; //Uncaught SyntaxError: Unexpected token 'while'

// 实际解析后
var web = 'houdunren';
let while;
console.log(web);
while = 'hdcms'; //Uncaught SyntaxError: Unexpected token 'while'
```

这时就会出现报错（while关键字不能作为变量名）。块内也会发生变量提升的现象：

```js
// 原代码
var web = "houdunren";
function hd() {
  if (false) {
    var web = "后盾人";
  }
  console.log(web);
}
hd();

// 实际解析后
var web = "houdunren";
function hd() {
    var web;
  if (false) {
    web = "后盾人";
  }
  console.log(web);
}
hd();
```

#### TDZ特性

TDZ 又称暂时性死区，指变量在作用域内已经存在，但必须在`let/const`声明后才可以使用。实列：

```js
hd = "houdunren";
function run() {
    // 存在TDZ,let声明变量必须先声明后使用，Cannot access 'hd' before initialization
  console.log(hd);
  let hd = "hdcms";
}
run();

// 函数参数于内声明变量相当于let
function hd(a = b, b = 3) {}
hd(); //Cannot access 'b' before initialization
// 正确书写
function hd(b = 3 , a = b) {}
hd();
```

#### 块作用域与变量声明

这个就像其他语言变量的访问，修改范围一样。记录一些比较容易复杂的。

##### var

声明变量特点：声明的变量也存在于 `window`对象中。实列：

```js
var hd = "houdunren";
console.log(window.hd); //houdunren
```

###### 变量污染

使用 `var` 声明的变量存在于最近的函数或全局作用域中，没有块级作用域的机制。但`let/const`则会出现访问限制。实列：

```js
function show() {
// 没有块级作用域限制，同时全局变量没有声明name,因此会污染全局变量，相当于在外面声明了name = "134"。
  name = "134";
}
show();
console.log(name);

// 此时输出0 ~ 10
var i = 99;
for (var i = 0; i < 10; i++) {
  console.log(i);
}
console.log(i);

// 此时输出0 ~ 9，99
var i = 99;
for (let i = 0; i < 10; i++) {
  console.log(i);
}
console.log(i);
```

###### 多js文件变量污染

但这样就存在一个问题：如果一个网页中使用了很多js文件，就有可能出现变量污染。因此可用`let/const`声明块变量，再使用一个特殊变量作为一个对象将其存放在`window`对象里。就像jquery里的`$`一样。示例：

```js
{
  let $ = (window.$ = {});
  $.web = "houdun";
}
console.log($.web);
```

##### let

与 `var` 声明的区别是 `let/const` 拥有块作用域。

- 建议将`let`在代码块前声明
- 用逗号分隔定义多个

##### const

使用 `const` 用来声明常量，这与其他语言差别不大，比如可以用来声明后台接口的URI地址。

- 常量名建议全部大写
- 只能声明一次变量
- 声明时必须同时赋值
- 不允许再次全新赋值
- 可以修改引用类型变量的值
- 拥有块、函数、全局作用域

关于const判断是否允许改变内容的细节大叔也是讲了的。const实际不允许改变的是原变量的存储地址。实列：

```js
/* 
数值类型：
当a赋予新的值时，相当于在内存中开辟一个存储了新值新的区域再把地址给a
相当于改变了a的地址，这才是const不允许的
*/
const a="123";
a="456"

/* 
引用类型：
因为a是对象，a.port='443'只是改变对象内的内容，并没有改变a所指向的空间
因此是可行的
*/
const a = {
  url: 'https://www.houdunren.com',
  port: '8080'
};
a.port = '443';
console.log(a);
```

如果想要对象的值在任何时候不能修改，则可以使用` Object.freeze`.示例：

```js
// 使用严格模式，强制要求规范代码，否者修改变量时不会报错
"use strict"
const a = {
  url: 'https://www.houdunren.com',
  port: '8080'
};
Object.freeze(a);
a.port = '443';
console.log(a);
```

###### 变量的重复定义

`var`允许在同一作用域内重复定义，以变量提升后最后定义的为基准。`let/const`则不允许重复定义。

#### 传值与传址

这顶就有点像Java中的字符串赋值的概念了。

基本数据类型指数值、字符串等简单数据类型。引用类型指对象数据类型。关于传值就是把旧变量的值放到一个新的空间里，并把地址赋给新变量中，因此改变旧变量的值不会影响新变量的值。而传值则是把旧地址传给新变量，两个变量一起管理这个数据，非常像java中的字符串添加"管理员"的行为。

#### 3个比较特殊的值

##### undefined

- 对声明但未赋值的变量返回类型为 `undefined` 表示值未定义。

- 对未声明的变量使用会报错，但判断类型将显示 `undefined`。
- 我们发现未赋值与未定义的变量值都为 `undefined` 。

这里大叔建议在声明变量时同时设置初始值，这样就可以区分出变量状态了。实列：

```js
// 字符串=>设置为空字符串
let string = "";

// 数值=> 0
let num = 0;
```

- 函数参数或无返回值是为`undefined`

##### null

`null` 用于定义一个空对象，即如果变量要用来保存引用类型，可以在初始化时将其设置为null。实列：

```js
// hd为空对象
var hd = null;
console.log(typeof hd);
```

##### NaN

表示无效的数值。

#### 严格模式

严格模式可以让我们及早发现错误，使代码更安全规范，推荐在代码中一直保持严格模式运行。实列：

```js
/*
在非严格模式下直接对一个未声明的变量赋值是不会报错的，浏览器会自动帮我们声明。
但在严格模式下会报错。
*/
"use strict";
url = 'houdunren.com';
```

严格模式的声明也受作用域影响。

### 运算符与流程控制

关于这一节基本和c语言的运算一致，只记录js特有的。

#### 短路运算

形如`a || b `的称为短路运算，中间是逻辑符。短路运算在赋值时很有用(或操作，与操作就没必要了，个人觉得)，减少大量不必要的代码。

```js
// 或操作
// 下例中 a 为真值，就已经知道结果了就不会再判断 f 的值了。
let a = true,f = false;
console.log(a || f);

// 与操作
// 当 a 和 f 均为真时才输出true
let a = true,f = false;
console.log(a && f);
```

短路运算中赋值的运用:

```js
// 与操作
// 两个值均为true，则输出最后一个，即f
let a = "test",
  f = "zrain";
let result = a && f;
console.log(result, typeof result);
// 只有第一个为false，则输出false
let a = false,
  f = "zrain";
let result = a && f;
console.log(result, typeof result);

// 或存操作，或操作简单，哪个真就输出哪个，都真则输出第一个，都假就false
let a = fasle,
  f = "zrain";
let result = a || f;
console.log(result, typeof result);
```

#### for in

用于遍历对象的所有属性，`for/in`主要用于遍历对象，不建议用来遍历数组。如果使用`for( let key in list )`来遍历数组，其中key就相当于数组元素的编号，使用时还需`list[key]`来获取元素，效率不高，遍历数组建议用`map`。遍历对象：

```js
let info = {
  name: "后盾人",
  url: "houdunren.com"
};
// key就相当于键
for (const key in info) {
  if (info.hasOwnProperty(key)) {
    console.log(info[key]);
  }
}
```

#### for of

用来遍历 Arrays（数组）, Strings（字符串）, Maps（映射）, Sets（集合）等可迭代的数据结构。与 `for/in` 不同的是 `for/of` 每次循环取其中的值而不是索引。相较于`for in`，这个则直接把元素一个个单独遍历。各有各优点。

### 数据基本类型

#### 数据类型检测

**`typeof`** 用于返回以下原始类型（局限性）

- 基本类型：number/string/boolean
- function
- object
- undefined

示例就不必了。typeof判断类型是有局限性的。因为列表和对象都属于object。因此使用typeof无法区分。

**`instanceof`** 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
let hd = [];
let houdunren = {};
console.log(hd instanceof Array); //true
console.log(houdunren instanceof Array); //false

let c = [1, 2, 3];
console.log(c instanceof Array); //true

let d = { name: "houdunren.com" };
console.log(d instanceof Object); //true

// 自定义构造函数
function User() {}
let hd = new User();
console.log(hd instanceof User); //true
```

#### 值类型与对象之间的隐式转换

关于这一点就很神奇，用不同方法声明这个字符串后使用`typeof`返回的类型却不一样：

```js
let hd = "houdunren";
let cms = new String("hdcms"); 
console.log(typeof hd, typeof cms); //string object
```

#### String

##### 常用方法

**`length`**:此属性可以获取字符串长度

```js
console.log("houdunren.com".length)
```

**`toUpperCase/toLowerCase`**:将字符转换成大写格式

```js
console.log('houdunren.com'.toUpperCase()); //HOUDUNREN.COM
console.log('houdunren.com'.toLowerCase()); //houdunren.com
```

**`trim`**:移除空白

关于这个在`Js 去除空白符`里已有详细介绍，这里粗略记一下

```js
let str = '   houdunren.com  ';
// 删除字符串左右的空白字符
console.log(str.trim().length);

let name = " houdunren ";
// 顾名思义，删除字符串左边，右边的空白字符
console.log(name.trimLeft());
console.log(name.trimRight()); 
```

**`slice、substr、substring`** :截取字符串。

- slice、substring 第二个参数为截取的结束位置
- substr 第二个参数指定获取字符数量

```js
let hd = 'houdunren.com';
console.log(hd.slice(3)); //dunren.com
console.log(hd.substr(3)); //dunren.com
console.log(hd.substring(3)); //dunren.com

console.log(hd.slice(3, 6)); //dun
console.log(hd.substring(3, 6)); //dun
console.log(hd.substring(3, 0)); //hou 较小的做为起始位置
console.log(hd.substr(3, 6)); //dunren

console.log(hd.slice(3, -1)); //dunren.co 第二个为负数表示从后面算的字符
console.log(hd.slice(-2));//om 从末尾取
console.log(hd.substring(3, -9)); //hou 负数转为0
console.log(hd.substr(-3, 2)); //co 从后面第三个开始取两个
```

**`repeat`**:重复生成字符/字符串

- 参数为重复次数

```js
function star(num = 3) {
	return '*'.repeat(num);
}
console.log(star());
```

**`split`**:分隔字符串

```js
console.log("1,2,3".split(",")); //[1,2,3]
```

#### Boolen

##### 隐式转换

`Js 隐式转换`已包含一部分内容，这里就当补全。基本上所有类型都可以隐式转换为 Boolean类型。

| 数据类型  | true             | false            |
| --------- | ---------------- | ---------------- |
| String    | 非空字符串       | 空字符串         |
| Number    | 非0的数值        | 0 、NaN          |
| Array     | 数组不参与比较时 | 参与比较的空数组 |
| Object    | 所有对象         | 无               |
| undefined | 无               | undefined        |
| null      | 无               | null             |
| NaN       | 无               | NaN              |

#### Number

##### 常用方法

**`isInteger`**:判断数字是否为整数。

- 参数为要判断的数字

```js
console.log(Number.isInteger(1.2)); // false
```

**`toFixed`**:四舍五入结果。

- 参数为要保留的位数。

```js
console.log((16.556).toFixed(2)); // 16.56
```

**`Number`**:将大部分非数值类型转化为数值类型。

- 参数为要转换的数值

```js
console.log(Number('houdunren')); //NaN
console.log(Number(true));	//1
console.log(Number(false));	//0
console.log(Number('9'));	//9
console.log(Number([]));	//0
console.log(Number([5]));	//5
console.log(Number([5, 2]));	//NaN
console.log(Number({}));	//NaN
```

**`parseInt`**:提取字符串开始去除空白后的数字转为整数（四舍五入）。

```js
// 从左到右开始解析。遇到无法解析立即结束解析。如果一开始就解析失败，则返回NaN
console.log(parseInt('  99houdunren'));	//99
console.log(parseInt('18.55'));	//18
```

##### Number精度问题

大部分编程语言在浮点数计算时都会有精度误差问题，js中的表现形式:

```js
let hd = 0.1 + 0.2
console.log(hd)// 结果：0.30000000000000004
```

第一次见到这个是在B站上，当时没怎么弄明白，感觉挺神奇。这里向军大叔给了解释：

计算机以二进制处理数值类型，上面的0.1与0.2转为二进制后是无穷的

```js
console.log((0.1).toString(2)) //0.0001100110011001100110011001100110011001100110011001101
console.log((0.2).toString(2)) //0.001100110011001100110011001100110011001100110011001101
```

**解决方法**

一种方式使用toFixed 方法进行小数截取

```js
console.log((0.1 + 0.2).toFixed(2)) //0.3

console.log(1.0 - 0.9) //0.09999999999999998
console.log((1.0 - 0.9).toFixed(2)) //0.10
```

下面向军大叔给的方法震惊到我了：好家伙，直接新建一个方法到原型上，利用整数运算不会出现问题来解决：

```js
Number.prototype.add = function (num) {
	//取两个数值中小数位最大的
  let n1 = this.toString().split('.')[1].length
  let n2 = num.toString().split('.')[1].length
  
  //得到10的N次幂
  let m = Math.pow(10, Math.max(n1, n2))

  return (this * m + num * m) / m
}
console.log((0.1).add(0.2))
```

当然也有许多优秀的计算库，这也是大叔推荐的：

市面上已经存在很多针对数学计算的库 [mathjs](https://mathjs.org/examples/browser/basic_usage.html.html) 、[decimal.js](http://mikemcl.github.io/decimal.js) 等，我们就不需要自己构建了。

#### Math

与其说是一个“类型”，不如说是一个库：`Math` 对象提供了众多方法用来进行数学计算。

##### 取极限值

使用 `min` 与 `max` 可以取得最小与最大值。

```js
console.log(Math.min(1, 2, 3));
console.log(Math.max(1, 2, 3));

// 使用`apply` 来从数组中取值
console.log(Math.max.apply(Math, [1, 2, 3]));
```

##### 取整

关于这部分在`Js 运算`已有完整体现。

##### 取随机数

**`random`** :返回 >=0 且 <1 的随机数（包括0但不包括1）。这个经常用到。

```js
// 下面取2~5的随机数（不包括5）公式为：Math.floor(Math.random()*(Max-min))+min
const number = Math.floor(Math.random() * (5 - 2)) + 2;
console.log(number);

// 下面取2~5的随机数（包括5）公式为：Math.floor(Math.random()*(Max-min+1))+min
const number = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
console.log(number);
```

#### Date

顾名思义，日期类型。在博客方面可能检测用到。

##### 声明日期

获取当前日期时间

```js
let now = new Date();
console.log(now);
console.log(typeof now); //object
console.log(now * 1); //获取时间戳(毫秒)

//直接使用函数获取当前时间
console.log(Date());
console.log(typeof Date()); //string

//获取当前时间戳单位毫秒
console.log(Date.now());
```

根据指定的日期与时间定义日期对象

```js
let now = new Date('2028-02-22 03:25:02');
console.log(now);

now = new Date(2028, 4, 5, 1, 22, 16);
console.log(now);
```

##### 类型转换

将日期转为数值类型就是转为时间戳单位是毫秒:

```js
let hd = new Date("2020-2-22 10:33:12");
console.log(hd * 1);
console.log(Number(hd));
console.log(hd.valueOf())
console.log(hd.getTime());
```

##### moment.js

向军大叔推荐了一个专门应付时间类型的javascript库`Moment.js`例子就没摘录过来了:Moment.js是一个轻量级的JavaScript时间库，它方便了日常开发中对时间的操作，提高了开发效率。访问中文官网 [http://momentjs.cn](http://momentjs.cn/) 或 英文官网 [https://momentjs.com](https://momentjs.com/)。