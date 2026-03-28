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

不同的一步任务被分为两类：宏任务（macro task）和微任务（micro task）：

1. 宏任务：setTimeout, setInterval, setImmediate, I/O(磁盘读写或网络通信)，UI交互事件(Task Queue)
2. 微任务：process.nextTick，Promise.then(Microtask Queue)

当执行栈中的任务清空，主线程会会先检查微任务队列后检查宏任务队列

### 浏览器/node API(Web API)

定时器的计时功能是在Web API中完成的，计时完成后再将其回调函数排列到事件队列中：

当代码运行

``` javascript
setTimeout(msg => {
    console.log(msg)
}, 5000)
```

由浏览器/node进行计时，计时结束后向**Queue**放入函数`msg => {console.log(msg)}`

