---
title: JavaScript执行机制
tags: [JavaScript]
---

### Stack

函数调用形成堆栈帧。

### Heap

对象被分配在一个堆中。

### Queue

一个JavaScript运行时包含一个待处理的消息队列，每一个消息与一个函数相关联。当Stack为空时，从队列中取出一个消息出来，调用与这个消息相关联的函数（以及因而创建了一个初始堆栈帧）。当栈再次为空的时候，也就意味着消息处理结束。

### 浏览器/node API

当代码运行

``` javascript
setTimeout(msg => {
    console.log(msg)
}, 5000)
```

由浏览器/node进行计时，计时结束后向**Queue**放入函数`msg => {console.log(msg)}`
