## 单例

``` javascript
// 单例构造函数
function CreateSingleton (name) {
    this.name = name;
    this.getName();
};

// 获取实例的名字
CreateSingleton.prototype.getName = function() {
    console.log(this.name)
};
// 单例对象
var Singleton = (function(){
    var instance;
    return function (name) {
        if(!instance) {
            instance = new CreateSingleton(name);
        }
        return instance;
    }
})();

// 创建实例对象1
var a = new Singleton('a');
// 创建实例对象2
var b = new Singleton('b');

console.log(a===b);
```

## 超时

``` javascript
function loadImage(url, maxTime, data, fnSuccess, fnFail) {
    var img = new Image();

    var timer = setTimeout(function() {
        timer = null;
        fnFail(data, url);
    }, maxTime);

    img.onLoad = function() {
        if (timer) {
            clearTimeout(timer);
            fnSuccess(data, img);
        }
    }

    img.onAbort = img.onError = function() {
        clearTimeout(timer);
        fnFail(data, url);
    }

    img.src = url;
}
```
## 深拷贝

``` javascript
let obj = {
  a: 1,
  b: {
    c: 2,
  },
}
let newObj = JSON.parse(JSON.stringify(obj));
obj.b.c = 20;
console.log(obj); // { a: 1, b: { c: 20 } }
console.log(newObj); // { a: 1, b: { c: 2 } } (New Object Intact!)


function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(obj[i] != null &&  typeof(obj[i])=="object")
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}
```

## 自增id

``` javascript
let times = (() => {
    let time = 0
    return () => {
        return time++
    }
})()
```

## Iterable/iterator

可作用于`for of`循环的对象都是 Iterable 类型，for 循环先调用 对象的 `Symbol.iterator` 函数获取一个迭代器（实现 `next()` 方法（返回`value`和`done`））

``` javascript
const obj = {
    name: 'pan',
    age: 23,
    [Symbol.iterator]: function() {
        let age = 23
        const iterator = {
            next() {
                return {
                    value: age,
                    done: age++ > 24
                }
            }
        }
        return iterator
    }
}
```

``` javascript
const obj = {
    name: 'pan',
    age: 23,
    [Symbol.iterator]: function* () {
        while (this.age <= 24) {
            yield this.age++
        }
    }
}
```

## 分号

真正会导致上下行解析出问题的 token 有 5 个：括号，方括号，正则开头的斜杠，加号，减号。我还从没见过实际代码中用正则、加号、减号作为行首的情况，所以总结下来就是一句话：一行开头是括号或者方括号的时候加上分号就可以了，其他时候全部不需要。其实即使是这两种情况，在实际代码中也颇为少见。

* `(`
* `[`
* `/`
* `+`
* `-`

如果在`return`、`break`、`continue`、`throw`等关键字后面换行，javascript 会在换行处填补分号


