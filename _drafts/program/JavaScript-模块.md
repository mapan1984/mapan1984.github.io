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
    console.log(s + ',' + name + '!')
}

module.exports = greet
```

``` javascript
// app.js
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
        console.log(s + ',' + name + '!')
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
