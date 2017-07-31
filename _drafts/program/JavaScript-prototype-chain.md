### __proto__

``` javascript
var o = {a: 1};
// o ---> Object.prototype ---> null
o.__proto__ === Object.prototype  // true


var a = [1, 2, 3];
// a ---> Array.prototype ---> Object.prototype ---> null
a.__proto__ === Array.prototype  // true


function f(){
    return 42;
}
// f ---> Function.prototype ---> Object.prototype ---> null
f.__proto__ === Function.prototype  // true
```

### 使用构造器

构造器是一个普通的函数，当使用new操作符来作用这个函数时，它就可以被称为构造方法

``` javascript
function Graph() {
  this.vertices = [];
  this.edges = [];
}

// 将共享属性放在构造函数的prototype中
Graph.prototype = {
  addVertex: function(v){
    this.vertices.push(v);
  }
};

var g = new Graph();
// g是生成的对象,他的自身属性有'vertices'和'edges'.
// 在g被实例化时,g.[[Prototype]]指向了Graph.prototype.
g.__proto__ === Graph.prototype  // true
Graph.__proto__ === Function.prototype  // true
Graph.prototype.__proto__ === Object.prototype  // true
// g ---> Graph.prototype ---> Object.prototype ---> null
```

`Graph`相当于Python中的`__init__`函数，用来初始化对象；而`Graph.prototype`中的内容，相当与Python类中定义类方法以及属性，用于所有对象共享。

new操作相当于:

``` javascript
// var g = new Graph()

var g = new Object();
g.__proto__ = Graph.prototype;
Graph.call(g)
```

Graph.call将Graph中的this设置为g，然后执行Graph。

### 使用Object.create

调用Object.create()创建一个新对象，新对象的原型就是调用create方法是传入的第一个参数

``` javascript
var a = {a: 1};
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (继承而来)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty); // undefined, 因为d没有继承Object.prototype
```

### 使用class关键字

``` javascript
"use strict";

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

var square = new Square(2);

```
