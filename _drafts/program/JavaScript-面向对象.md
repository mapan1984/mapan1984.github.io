---
title: JavaScript面向对象
tags: [JavaScript]
---

JavaScript使用原型来实现面向对象，虽然ES6中增加了`class`的经典的声明方式，但其只不过是JavaScript为原型提供的语法糖，我们永远都无法绕开prototype，因为这是JavaScript里对象的本质。

### __proto__

当查找一个对象`obj`的属性`p`时，会依次从`obj`, `obj.__proto__`, `obj.__proto__.__proto__`...中去找相应的属性，直到找到属性`p`或`__proto__`为`null`，这条由`__proto__`组成的链被称为原型链。

`obj.__proto__ = constructor.prototype`，即一个对象的`__proto__`是这个对象的构造函数的`prototype`的简写。

``` javascript
let o = {a: 1};
// o ---> Object.prototype ---> null
o.__proto__ === Object.prototype  // true


let a = [1, 2, 3];
// a ---> Array.prototype ---> Object.prototype ---> null
a.__proto__ === Array.prototype  // true


function f() {
    return 42;
}
// f ---> Function.prototype ---> Object.prototype ---> null
f.__proto__ === Function.prototype  // true
```
`__proto__`是对象的属性，指向它的原型，而`prototype`是构造函数的属性。`prototype`一般被赋值为一个对象，而这个对象的属性和方法被这个构造函数所创造的对象共享。

### 构造器

构造器是一个普通的函数，当使用`new`操作符来作用这个函数时，它就可以被称为构造方法。

``` javascript
function Graph() {
  this.vertices = [];
  this.edges = [];
}

// 将共享属性放在构造函数的prototype中
Graph.prototype = {
  addVertex: function(v) {
    this.vertices.push(v);
  }
};

let g = new Graph();
// g是生成的对象，他的自身属性有'vertices'和'edges'
// 在g被实例化时，g.__proto__指向了Graph.prototype
// 所以g可以找到addVertex方法(属性)
// g ---> Graph.prototype ---> Object.prototype ---> null
g.__proto__ === Graph.prototype  // true

// Graph是函数
// Graph ---> Function.prototype ---> Object.prototype ---> null
Graph.__proto__ === Function.prototype  // true

// Graph.prototype是对象
// Graph.prototype  ---> Object.prototype ---> null
Graph.prototype.__proto__ === Object.prototype  // true
```

`Graph`相当于Python中的`__init__`函数，用来初始化对象；而`Graph.prototype`中的内容，相当与Python类中定义类方法以及属性，用于所有对象共享。

`new`操作相当于:

``` javascript
// let g = new Graph()

let g = new Object();
g.__proto__ = Graph.prototype;
Graph.call(g)
```

`Graph.call`将`Graph`中的`this`设置为`g`，然后执行`Graph`。

### Object.create

调用`Object.create()`创建一个新对象，新对象的原型就是调用`create`方法是传入的第一个参数

``` javascript
let o1 = {a: 1};
// o1 ---> Object.prototype ---> null

let o2 = Object.create(o1);
// o2 ---> o1 ---> Object.prototype ---> null
console.log(o2.a); // 1 (继承而来)

let o3 = Object.create(o3);
// o3 ---> o2 ---> o1 ---> Object.prototype ---> null

let o4 = Object.create(null);
// o4 ---> null
console.log(o4.hasOwnProperty); // undefined, 因为d没有继承Object.prototype
```

### this关键字

JavaScript的函数，都有一个默认的隐含参数，这个参数就是`this`。

``` javascript
let obj = {
    show: function() {
        console.log(this)
    }
}

var oth = obj.show
obj.show()  // obj
oth()  // window
```

``` javascript
func(p1, p2)
obj.child.method(p1, p2)
func.call(context, p1, p2)
```

其实`call`才是函数的正常调用形式，
1. 当`context`是`null/undefined`时，`windows`就是默认的`context`(strict模式下`context`是`undefined`)
    ```javascript
    func(...args)
    func.call(undefined, ...args)
    ```
2. 对象调用函数时，`context`是对象本身。
    ```javascript
    obj.func(...args)
    func.call(obj, ...args)
    ```
3. 函数数组的`this`
    ```javascript
    let arr = [func1, func2]

    arr[0](...args)
    arr.0(...args)
    arr.0.call(arr, ...args)
    ```
4. 事件绑定，`this`的值是触发事件的元素的引用，与传递给回调函数的`event`参数的`currentTarget`属性的值一样
    ```javascript
    btn.addEventListerner('click', function handler(event) {
        console.log(this)
    })

    handler.call(event.currentTarget, event)
    ```

其他设定`this`值的方法：

``` javascript
func.apply(context, [argsArray])
func.bind(context)
```

### class关键字

``` javascript
class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(sideLength) {
    super(sideLength, sideLength);
  }
  get area() {
    return this.height * this.width;
  }
  set sideLength(newLength) {
    this.height = newLength;
    this.width = newLength;
  }
}

let square = new Square(2);
```

