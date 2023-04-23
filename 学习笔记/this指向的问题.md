---
type: blog
created: 2021-06-11 21:56:48
updated: 2021-06-19 21:56:48
tags: blog javascript
categories:
---


## this 指向不同对象的原因

```js
let data = {
    num: 1
}
```

上面的代码执行时，会向下图中展示的那样，先在内存中生成一个对象 `{num: 1}`，然后将对象的内存地址赋给变量 `data`。当我们用 `data.num` 去读取对象的属性时，js 引擎会先从变量 `data` 解析出对象的地址，然后从相应位置读取 `num` 属性的值。

![](附件/image/this指向的问题_image_1.png)

再具体一些，对象的属性中存了下面这些内容，其中 `value` 是属性值，其它的三个叫做属性标志，这里不对它们展开解释，只需知道它们是用来描述属性的一些特性即可。

```js
[[value]]: 1
[[writable]]: true
[[enumerable]]: true
[[configurable]]: true
```

![](附件/image/this指向的问题_image_2.png)

当对象的属性值是一个函数时，那么它么 `value` 就不在是一个具体的值，而是函数的地址。

```js
let data = {
    num: 1,
    print: function() {
        console.log(this.num)
    }
}
data.print() // 执行结果为 1
let print = data.print
pirnt() // 执行结果为 undefined
```

![](附件/image/this指向的问题_image_3.png)


通过上面的分析可以知道同一个函数可以赋值给不同对象的属性，也就是说它可以被不同的对象调用，这个对象就成为函数的当前运行环境。当函数内部使用的运行环境中的变量时，它应该指明使用的是哪个运行环境的中的变量，所以引入了 `this` 关键字，它所代表的就是当前调用函数的对象。

## 箭头函数指向

箭头函数它没有自己的 `this`，如果在箭头函数内部使用 `this`，那么 `this` 指向与外部正常函数的指向相同，如下面的箭头函数中的 `this` 与 `fun` 保持一致。

```js
function fun() {
  () => {console.log(this)}
}
```

## call/apply

函数调用的过程中 `this` 会自动指向函数的当前运行环境，这是函数的默认行为，但有的时候这种默认行为并不能很好的满足我们的需求，比如下面使用装饰器的情况：

```js
let person = {
    name: "chang",
    printName: function() {
        console.log(this.name)
    }
}

// 装饰器函数
function decorator(fun) {  
    return function() {
        console.log("添加装饰器")
        fun() 
    }
}

person.printName = decorator(person.printName)
person.printName()
```

上面的代码的运行结果如下，给对象 `printName` 方法添加装饰器后，方法中的 `this` 的指向出现的变化，所以 `name` 属性找不到了。

![](附件/image/this指向的问题_image_4.png)

`this` 指向出现变化的原因与下面的代码类似，在函数传参的过程中 `printName` 原有的运行环境丢失了。

```js
let fun = person.printName()
fun()
```

将装饰器函数做如下修改后可以解决上面的问题：

```js
// 装饰器函数
function decorator(fun) {  
    return function() {
        console.log("添加装饰器")
        fun.call(this)
    }
}

// 装饰器函数
function decorator(fun) {  
    return function() {
        console.log("添加装饰器")
        fun.apply(this)
    }
}
```

`call` 和 `apply` 是两个内建方法，调用方式分别为 `func.apply(this, arguments)` 和 `func.call(this, ...arguments)`，它们两个的作用是一样的，都是给函数传递一个上下文环境并运行该函数。

```js
let person = {
    name: "chang"
}

function printName() {
    console.log(this.name)
}

printName.call(person)
printName.apply(person)
```