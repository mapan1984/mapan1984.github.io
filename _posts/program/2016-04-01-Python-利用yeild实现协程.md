---
title: Python 利用yeild实现协程(coroutine)
categories: [Program]
tags: [Python, Coroutine]
---

### 协程

子程序，或者称为函数，在所有语言中都是层级调用，比如A调用B，B在执行过程中又调用了C，C执行完毕返回，B执行完毕返回，最后是A执行完毕。

所以子程序调用是通过栈实现的，一个线程就是执行一个子程序。

子程序调用总是一个入口，一次返回，调用顺序是明确的。而协程的调用和子程序不同。

协程看上去也是子程序，但执行过程中，在子程序内部可中断，然后转而执行别的子程序，在适当的时候再返回来接着执行。

所以不同点在于程序只有一个调用入口起始点，返回之后就结束了，而协程入口既可以是起始点，又可以从上一个返回点继续执行，也就是说协程之间可以通过`yield`方式转移执行权，对称（symmetric）、平级地调用对方，而不是像例程那样上下级调用关系。

### 相关语法

在Python中`yield`语句既可以返回一个值，也可以接收调用者发出的参数，同样，使用`generator.send()`可以接收一个值，也可以向`yield`传递一个值

比如定义一个`generator`：

``` python
def generator():
    n = 0
    while True:
        yield n
        n = n + 1
```

可以使用`for`迭代访问数据:

``` python
for value in generator():
    pritn(value)
```

等价于使用`next(generator)`:

``` python
it = generator()
while True:
    try:
        print(next(it))
    except StopIteration:
        break
```

等价于使用`generator.send(None)`:

``` python
it = generator()
while True:
    try:
        print(it.send(None))
    except StopIteration:
        break
```

即`next(generator)`相当于`generator.send(None)`, 而且`send`函数可以给`generator`传递参数

{% highlight python linenos %}
def generator():
    print('step 1, line 2')
    a = yield 1
    print("a = %s" % a)
    print('step 2, line5')
    b = yield 2
    pritn(b)

g = generator()
m = g.send(None)             # 激活g, 运行至line3, 输出 'step 1, line2'，yeild返回1，m = 1
print("m = %d" % m)          # 输出 'm = 1'
n = g.send('x')              # 向g发送‘x’, g重新从line3开始运行，yeild接收‘x’，即a='x',
                             # 输出 'a = x'
                             # 输出 'step 2, line5', yeild返回2 ，n = 2
print("n = %d" % n)          # 输出 'n = 2'
{% endhighlight %}

输出结果：

    step 1, line2
    m = 1
    a = x
    step 2, line5
    n = 2

### 使用协程

在生产者-消费者模型使用协程:

``` python
def consumer():
    r = ''
    while True:
        n = yield r
        if not n:
            return
        print('[CONSUMER] Consuming %s...' % n)
        r = '200 OK'

def produce(c):
    c.send(None)
    n = 0
    while n < 5:
        n = n + 1
        print('[PRODUCER] Producing %s...' % n)
        r = c.send(n)
        print('[PRODUCER] Consumer return: %s' % r)
    c.close()

c = consumer()
produce(c)
```
