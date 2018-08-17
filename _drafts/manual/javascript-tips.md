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

