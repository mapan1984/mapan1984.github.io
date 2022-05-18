---
title: JavaScript的模块
tags: [JavaScript]
---

### CommonJs模块

一个简单的例子：

``` javascript
// hello.js
let s = 'hello'

function greet(name) {
    console.log(`${s}, ${name}!`)
}

// exports 对象用于导出当前模块的方法或变量
// module 对象代表模块本身，exports 是 module 的属性
module.exports = greet
```

``` javascript
// app.js
// 导入的 greet 的值相当于 exports 的值
let greet = require('./hello')

let name = 'mapan'
greet(name)
```

模块机制对`hello.js`的处理：

``` javascript
let module = {
    id: 'hello',
    exports: {},
}

let load = function(module) {

    // 读取的hello.js代码
    let s = 'hello'

    function greet(name) {
        console.log(`${s}, ${name}!`)
    }

    module.exports = greet
    // hello.js代码结束

    return module.exports
}

let exported = load(module)
save(module, exported)
```

处理`hello.js`之后，相当与`greet`函数被保存在全局变量`module`结构中，使用`id`进行标识。在`app.js`中引入`greet`函数：

``` javascript
let greet = require('./hello')
```

相当于先找到`id`为`hello`的`module`，然后：

``` javascript
let greet = module.exports
```

从模块导出多个变量时，可以使用对象的解构赋值

``` javascript
// 导出
module.exports = {
    foo: 'foo',
    bar: 'bar',
}

// 引入
let {bar, foo} = module.exports
```

### AMD

CommonJs 的模块机制几乎全都是同步的，它适用于 NodeJs，但不适用于前端模块的引入。

AMD(Asynchronous Module Definition) 避免了同步带来的阻塞，在前端场场景中适用。

``` javascript
// define(id?, dependencies?, factory)
define(function() {
    let exports = {}
    exports.sayHello = function() {
        alert('Hello from module: '+module+id)
    }
    return exports
})
```

### CMD

``` javascript
define(function(require, exports, module) {
    // The module code goes here
})
```

### 兼容

``` javascript
;(function (name, definition) {
    // 检测上下文环境是否为 AMD/CMD
    var hasDefine = typeof define === 'function';
    // 检查上下文环境是否为 Node
    var hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
        // AMD/CMD 环境
        define(definition);
    } else if (hasExports) {
        // 定义为 Node 模块
        module.exports = definition();
    } else {
        // 将模块的执行结果绑定在 window 变量中，在浏览器中 this 指向 window 对象
        this[name] = definition();
    }
})(
    'hello',
    function () {
        var hello = function () {};
        return hello;
    }
);
```

### ES6

default:

```javascript
// hello.js
function sayHello() {
    console.log('hello, world!')
}

export default sayHello
```

```javascript
// app.js
import sayHello from './hello'
```


对象：

```javascript
// hello.js
function sayHello() {
    console.log('hello, world!')
}

export {sayHello}
```

```javascript
// app.js
import {sayHello} from './hello'
```
