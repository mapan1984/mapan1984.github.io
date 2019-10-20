---
title: JavaScript异步编程
tags: [JavaScript]
---

### 事件发布/订阅

```JavaScript
emitter.on('event', function(result) {
    // do somethings with result
})

emitter.emit('event', 'result')
```

### Promise

`Promise`对象的特点：

1. `Promise`对象代表一个一般操作，只会处在三种状态的一种：`pending`, `fulfilled`, `rejected`。
2. `Promise`对象状态改变，只有两种可能：从`pending`到`fulfilled`或到`rejected`。
3. `Promise`对象的状态一旦改变，就不能被更改。

```javascript
const promise = new Promise(function(resolve, reject) {
    // ... some code

    if (/* 异步操作成功 */) {
        resolve(value)
    } else {
        reject(error)
    }
})

promise.then(function(value) {
    // success
}, function(error) {
    // failure
})

promise.then(function(value) {
    // success
}).catch(function(error) {
    // failure
})
```

虽然与`then(x).catch(x)`看起来类似，但却有所不同，不同点在于是否可捕获`then`中发生的错误：

```javascript
.then(function() {
   return Promise.reject(new Error('something wrong happened'));
}).catch(function(e) {
   console.error(e); // something wrong happened
});


.then(function() {
   return Promise.reject(new Error('something wrong happened'));
}, function(e) { // callback handles error coming from the chain above the current `.then`
    console.error(e); // no error logged
});
```

JavaScript 提供了`Promise.resolve`API，是产生 resolve 状态的 `Promise`对象的一种快捷方式：

``` javascript
let similarProm = new Promise(res => res(5))
// 相当于
let prom = Promise.resolve(5)
```

### Iterator 和 for ... of 循环

默认的Iterator接口部署在对象的`Symbol.iterator`属性，`Symbol.iterator`属性本身是一个函数，就是当前对象默认的遍历器生成函数，执行这个函数，就会返回一个遍历器。

```javascript
const obj = {
    [Symbol.iterator]: function() {
        let index = 0
        return {  // 返回遍历器对象
            next: function() {
                if (index < 10) {
                    return { value: index++, done: false }
                } else {
                    return { value: undefined, done: true }
                }
            }
        }
    }
}
```

数组的`Symbol.iterator`属性：

```javascript
let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]()

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

实现类似Python的`range`函数：

```javascript
class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }

  [Symbol.iterator]() { return this }

  next() {
    let value = this.value
    if (value < this.stop) {
      this.value++
      return {done: false, value: value}
    }
    return {done: true, value: undefined}
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop)
}

for (let value of range(0, 3)) {
  console.log(value) // 0, 1, 2
}
```

除了`for ... of`循环，以下操作也会调用`Iterator`接口：

1. 解构赋值

    ```javascript
    let set = new Set().add('a').add('b').add('c')

    let [x, y] = set
    // x='a' y='b'

    let [first, ...rest] = set
    // first='a' rest=['b','c']
    ```

2. 扩展操作符

    ```javascript
    // 例一
    var str = 'hello'
    [...str] //  ['h','e','l','l','o']

    // 例二
    let arr = ['b', 'c']
    ['a', ...arr, 'd']
    // ['a', 'b', 'c', 'd']

    let arr = [...iterable]
    ```

3. `yield*`(类似Python的`yield from`)

    ```javascript
    let generator = function* () {
      yield 1
      yield* [2,3,4]
      yield 5
    }

    let iterator = generator()

    iterator.next() // { value: 1, done: false }
    iterator.next() // { value: 2, done: false }
    iterator.next() // { value: 3, done: false }
    iterator.next() // { value: 4, done: false }
    iterator.next() // { value: 5, done: false }
    iterator.next() // { value: undefined, done: true }
    ```

遍历器除了有`next`方法外，还可以具有`return`和`throw`方法。

如果`for ... of`循环提前退出(出错或有`break`或`continue`语句)，就会调用`return`方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署`return`方法。

`throw`方法主要配合Generator函数使用。

### Generator函数

JavaScript的Generator函数与Python的Generator函数类似，可以理解为一个状态机，封装了多个内部状态，执行Generator函数会返回一个可以依次遍历Generator函数内部每一个状态的遍历器对象。

```javascript
function* helloWorld() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

hw = helloWorld()

hw.next()  // { value: 'hello', done: false }
hw.next()  // { value: 'world', done: false }
hw.next()  // { value: 'ending', done: true }
hw.next()  // { value: undefined, done: true }
```

使用Generator函数可以简便的实现`Symbol.iterator`方法：

```javascript
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1
    yield 2
    yield 3
  }
}
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello'
    yield 'world'
  }
}

for (let x of obj) {
  console.log(x)
}
// "hello"
// "world"
```

``` javascript
function printStr(str){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(str)
            resolve()
        }, 1000)
    })
}

// Generator
function*  printAll() {
    yield printStr('a')
    yield printStr('b')
}
const gen = printAll() // 调用后该函数并不执行, 返回指向内部状态的指针对象
gen.next() // [yield暂停执行 / next恢复执行]


// async/await
async function printAll() {
    await printStr('a')
    await printStr('b')
    await printStr('c')   
}
printAll()
```

### async函数

async函数是Generator函数的语法糖

```javascript
const fs = require('fs')

const readFile = function (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error)
      }
      resolve(data)
    })
  })
}

// Generator函数
const gen = function* () {
  const f1 = yield readFile('/etc/fstab')
  const f2 = yield readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}

// 同等的async函数
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab')
  const f2 = await readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}
```

`await`命令后面，可以是Promise对象或原始类型的值(这时等同于同步操作，如果不是Promise对象，会被转成一个立即`resolve`的Promise对象)。

`async`函数的返回值是Promise对象,可以使用`then`方法添加回调函数。`async`函数内部`return`语句的返回值，会成为`then`方法回调函数的参数。`async`函数内部抛出错误，会导致返回的 Promise 对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。

当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

### 循环


``` javascript
function asyncFun(number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(number)
            resolve()
        }, 1000)
    })
}
```

#### 异步循环

map、forEach 等这些高阶循环方法，循环体里面都是异步的。需要等后续操作完成，才执行循环体中的方法。

``` javascript
async function test() {
    console.log('start')
    const arr = [1, 2, 3]
    arr.map(async(number) => {
        await asyncFun(number)
    })
    console.log('end')
}
// start end 1 2 3
// [total: 1000ms+]
```

#### 同步循环

``` javascript
async function test() {
    console.log('start')
    const arr = [1, 2, 3]
    for (let i = 0, len = arr.length; i < len; i++ ) {
        await asyncFun(arr[i])
    }
    console.log('end')
}

test()

// start 1 2 3 end
// [total: 3000ms]
```

#### 并行循环

``` javascript
async function test() {
    console.log('start')
    const arr = [1, 2, 3]
    const promises = arr.map((number) => {
        return asyncFun(number)
    })
    await Promise.all(promises)
    console.log('end')
}
// start 1 2 3 end
// [total: 1000ms +]
```
