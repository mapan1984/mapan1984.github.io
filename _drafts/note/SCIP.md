### 过程

* 将若干简单过程组合为复杂过程
* 将两个过程放在一起对照，得到它们的相互关系
* 将过程与那些在实际中和它们同在的所有其他过程隔离开来

### 构造抽象数据

复杂的对象由一些部分组成，以便去模拟真实世界里那些具有若干侧面的现象

* 构造函数: 用于创建数据对象
* 选择函数: 用于访问复合数据对象中的各个部分

数据抽象，将对对象操作的程序与对象表示的部分隔离开来

### 消息传递

对任何对象x和y，如果z是(cons x y)，那么(car z)是x，(cdr z)是y

``` scheme
(define (cons x y)
  (define (dispath m)
    (cond ((= m 0) x)
          ((= m 1) y))
          (else (error "")))
  dispath)

(define (car z) (z 0))

(define (cdr z) (z 1))
```

*数据与过程：只要满足数据应有的特性，那它就可以被当作数据看待*

``` scheme
(define (point x y)
  (define (dispath m)
    (cond ((eq? m 'x) x)
          ((eq? m 'y) y)))
  dispath)

(define (x-point point) (point 'x))

(define (y-point point) (point 'y))
```

### 闭包

* 某种组合数据对象的操作满足闭包性质，那就是说，通过它组合起数据对象得到的结果本身还可以通过同样的操作在进行组合
* 为表示带有自由变量的过程而用的实现过程

### 数据导向

允许我们孤立的设计每一种数据表示，而后用**添加**的方式将它们组合进来

* 将条件判断别为表格查找
* 可加性

#### 有穷状态机

M = {S, S0, SA, op}

op(S, c) = S

|op|0 |1...9|other|
|--|--|-----|-----|
|s0|s1| s2  |  se |
|s1|se| se  |  se |
|s2|s2| s2  |  se |
|s3|se| se  |  se |

``` c
c = next_char();
state = s0;

while (c != eof && state != se) {
    state = op(state, c);
    c = next_char();
}

if (state in SA) {
    report acceptance;
} else {
    report failure;
}
```

### 带有通用型操作的系统

* 抽象数据
* 数据导向

### 环境模型

对环境模型的解释也是对**词法作用域**的解释

### 可以改变的复合数据对象

* 构造
* 选择
* 改变

### 共享和相等

共享和相等的区别可能在有值的改变时造成错误

* 共享: 引用
* 相等:

理解赋值和赋引用

在Python中赋引用十分常见，对一个对象的修改可能会影响那些恰好共享着被修改了的序对的结构

### 事务驱动

进行一个动作时触发下一个动作，比如设置wire值时触发wire的action，这要求wire保存自己的cation

### 约束的传播

### 流

Python迭代对象，生成器，惰性求值
