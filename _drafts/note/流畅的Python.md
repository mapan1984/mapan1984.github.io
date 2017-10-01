### 第1章 Python数据模型

### 第2章 序列构成的数组

对切片赋值改善可读性

### 第3章 字典和集合

### 第4章 文本和字节序列

    bytes -> str     解码(decode)输入的字符序列
    100% str         只处理文本
    str   -> bytes   编码(encode)输出的文本

### 第5章 一等函数

### 第6章 使用一等函数实现设计模式

### 第7章 函数装饰器和闭包

导入时
运行时

Python不要求声明变量，但是假定在函数定义体中赋值的变量是局部变量

### 第8章 对象引用、可变性和垃圾回收

变量是标注，而不是盒子

元组的不可变性其实是指tuple数据结构的物理内容（即保存的引用）不可变，与引用的对象无关

浅复制：复制了最外层容器，副本中的元素是源容器中元素的引用
深复制：副本不共享内部对象的引用

``` python
# 默认参数是函数对象的一个属性，如果它是
In [1]: def acc(a=[]):
   ...:    a.append(1)
   ...:
   ...: acc()
   ...: acc()
   ...: acc.__defaults__
   ...:
Out[1]: ([1, 1],)
```

del语句删除名称，而不是对象

每个对象会统计有多少引用指向自己，当引用计数归零时，对象立即就被销毁。Cpython会在对象上调用`__del__`方法（如果定义了），然后释放分配给对象的内存。

**弱引用不会增加对象的引用数量**。引用的目标对象称为所指对象(referent)。因此我们说，弱引用不会妨碍所指对象被当作垃圾回收。

### 第9章 符合Python风格的对象

``` python
# 设置x为只读属性
class C:

    def __init__(self, x):
        self.__x = float(x)

    @property
    def x(self):
        return self.__x
```

创建可散列的类型，需要正确地实现`__hash__`和`__eq__`方法

实例的私有变量(private)以双下划线开头，只能内部访问，如`__name`, 一般内部访问为`self.__name`，*在外部可用`_类名__name`访问, 通过`dir(实例)`可以查看到*

Python在各个实例中名为`__dict__`的字典里存储实例属性，为了使底层的散列表提升访问速度，字典会消耗大量内存，如果要处理数百万个属性不多的实例，通过`__solts__`类属性，让解释器在元组中存储实例属性，从而节省内存。`__solts__`是一个类属性，它的值为一个由字符串构成的可迭代对象，其中各个元素表示各个实例属性。

类属性`__weakref__`可以让对象支持弱引用(用户自定义的类中默认有`__weakref__`属性)，如果类中定义了`__solts__`属性，为了让实例可以作为弱引用的目标，要把`__weakref__`加入`__solts__`中。

解释器会忽略继承来的`__solts__`

Python有个很独特的特性：类属性可用于为实例属性提供默认值。*但当显式的设置实例属性后，实例属性会覆盖类属性*

### 第10章 序列的修改、散列和切片

Python的序列协议只需要`__len__`和`__getitem__`两个方法。

seq[a:b:c]的工作原理：创建slice(a, b, c)对象，交给`__getitem__`方法处理。

属性查找失败后，解释器会调用`__getattr__`方法。 *__getattr__(self, name)*

多数时候，如果实现了`__getattr__`方法，那么也要实现`__setattr__`方法，以防对象的行为不一致。

### 第11章 接口：从协议到抽象基类

接口是对象公开方法的子集，让对象在系统中扮演特定的角色。(比如实现特定方法的对象，可视为“文件类对象”、“可迭代对象”等。golang的`interface`更能表示这种思想。)

猴子补丁：在运行时修改类或模块，而不改动源码。

``` python
"""猴子补丁示例"""
class C:

    def __init__(self, values):
        self.values = values

## 在控制台运行
>> c = C([1,2,3])
>> def set_value(c, position, value):
..     c.values[position] = value
>> C.__setitem__ = set_value
>> c[0] = 4
>> c.values
[4, 2, 3]
```

鸭子类型：对象的类型无关紧要，只要实现了特定的协议，就可进行相应的操作。(比如实现了`__iter__`方法，就可视为实现了“迭代器协议”，就可用`for _ in _`进行迭代操作)

抽象基类中的具体方法只能依赖抽象基类定义的接口(即只能使用抽象基类中的其他具体方法、抽象方法或特性)

子类必须实现抽象方法

白鹅类型：借助白鹅类型，可以使用抽象基类声明接口，而且类可以子类化抽象基类或使用抽象基类注册。即使不继承，也有办法把一个类注册为抽象的虚拟子类。这样做时，我们保证注册的类忠实的实现了抽象基类定义的接口。(即使不注册，抽象基类也能把一个类识别为虚拟子类)

魔法方法`__subclasshook__`可以让抽象基类识别没有注册为子类的类。

类的继承关系在一个特殊的类属性中指定————`__mro__`，即Method Resolution Order。这个属性按顺序列出类及其超类，Python会按照这个顺序搜索方法。

* 强类型和弱类型:

        如果一门语言很少隐式转换类型，说明他是强类型语言；如果经常这么做，说明它是弱类型语言。Java、C++和Python是强类型语言。PHP、JavaScript和Perl是弱类型语言。

* 静态类型和动态类型

        在编译时检查类型的语言是静态类型语言，在运行时检查类型的语言是动态类型语言。静态类型需要声明类型（有些现代语言使用类型推导避免部分类型声明）。

*Python是动态强类型语言*

### 第12章 继承的优缺点

直接子类化内置类型(如dict、list或str)容易出错，因为内置类型的方法通常会忽略用户覆盖的方法。不要子类化内置类型，用户自定义的类应该继承collections模块中的类，例如UserDict、UserList和UserString。

``` python
# 超类中的方法可以直接调用，此时要把实例作为显式参数传入。
class C:
    def ping(self):
        print('ping', self)

class D(C):
    pass

d = D()
C.ping(d)
```

类都有一个名为`__mro__`的属性，它的值是一个元组，按照Method Resolution Order列出各个超类，从当前类一直向上，直到object类。

若想把方法调用委托给超类，推荐使用内置的`super().method()`/`super(SonName, self).method()`。然而，有时可能需绕过方法解析顺序，直接调用某个超类的方法，此时可以使用`Parent.method(self)`。

方法解析顺序不仅考虑继承图，还考虑子类声明中列出超类的顺序。

方法解析顺序使用[C3算法计算](https://www.python.org/download/releases/2.3/mro/)

### 第11章 正确重载运算符

实现一元运算符和中缀运算符的特殊方法一定不能修改操作数。使用这些运算符的表达式期待的结果是新对象。

对`a+b`，先检查`a`有`__add__`方法且返回值不是`NotImplemented`，调用`a.__add__(b)`；否则检查`b`有`__radd__`方法且返回值不是`NotImplemented`，调用`b.__radd__(a)`；否则抛出`TypeError`。

*`NotImplemented`是特殊的单例值，`return`；`NotImplementedError`是与异常，`raise`*

`__eq__`的后备机制是返回`id(a) == id(b)`；`__ne__`的后备机制是返回`not (a == b)`

如果一个类没有实现就地运算符，增量赋值运算符就只是语法糖：`a += b`的作用与`a = a + b`完全一样。对不可变类型来说，这是预期的行为(创建了新实例)。

增量赋值特殊方法(?就地运算)返回`self`

一般来说，如果中缀运算符的正向方法（如`__mul__`）只处理与`self`属于同一类型的操作数，那就无需实现对应的反向方法（如`__rmul__`），因为按照定义，反向向方法是为了处理类型不同的操作数。

### 第14章 可迭代的对象、迭代器和生成器

Python解释器需要迭代对象x时，会自动调用`iter(x)`。

内置的`iter`函数有以下作用：
1. 检查对象是否实现了`__iter__`方法，如果实现了就调用它，获取一个迭代器。
2. 如果没有实现`__iter__`方法，但是实现了`__getitem__`方法，Python会创建一个迭代器，尝试按顺序（从索引0开始）获取元素。
3. 如果尝试失败，Python抛出`TypeError`异常，通常会提示"C object is not iterable"。

任何Python序列可迭代的原因是，它们都实现了`__getitem__`方法，标准的序列也都实现了`__iter__`方法。

从Python 3.4开始，检查对象x能否迭代，最准确的办法是：调用`iter(x)`函数，如果不可迭代，再处理`TypeError`异常。

可迭代的对象(Iterable)：对象实现了能返回**迭代器**的`__iter__`方法，或对象实现了`__getitem__`方法，而且其参数是从0开始的索引。

迭代器(Iterator)：实现了`__next__`和`__iter__`方法。

Python从可迭代的对象中获取迭代器。

``` python
s = 'ABC'
for char in s:
    print(char)

# 上述代码相当于

s = 'ABC'
it = iter(s)
while True:
    try:
        print(next(it))
    except StopIteration:
        del it
        break
```

Iterable有个`__iter__`方法，每次都实例化一个新的Iterator；而Iterator要实现`__next__`方法，返回单个元素，此外还要实现`__iter__`方法，返回Iterator本身。

    Iterable[__iter__]
        |
        |构建
        v
    Iterator[__next__, __iter__]

Iterator的`__iter__`方法返回`self`，以便在应该使用Iterable对象的地方使用迭代器。

检查对象x是否为Iterator最好的方法是调用`isinstance(x, abc.Iterator)`。

生成器函数定义体内的`return`语句会触发生成器对象抛出`StopIteration`异常。

### 第15章 上下文管理器和else块

EAFP(easier to ask for forgiveness than permission)：先假定(`try`)存在有效的键或属性，如果假定不成立，那么捕获异常(`except`)。

LBYL(look before you leap)：在调用函数或查找属性或键之前显式测试(`if`)前提条件。

与函数和模块不同，`with`块没有定义新的作用域。

`__enter__(self)`、`__exit__(self, exc_type, exc_value, traceback)`

在使用`@contextmanager`装饰的生成器中，`yield`语句的作用是把函数的定义体分成两个部分：`yield`语句前面的所有代码在`with`块开始时(即解释器调用`__enter__`方法时)执行，`yield`语句后面的代码在`with`语句结束时(即调用`__exit__`方法时)执行。

### 协程

*从根本上把`yield`视为流程控制的方式，这样就好理解协程了。关键的一点是，协程在`yield`关键字所在的位置暂停执行*

预激(prime)：最先调用`next(coro)`函数这一步，让协程向前执行到第一个`yield`表达式，准备好作为活跃的协程使用。

``` python
# 预激协程的装饰器
from functools import wraps

def coroutine(func):
    @wraps(func)
    def primer(*args, **kwargs):
        gen = func(*args, **kwargs)
        next(gen)
        return gen
    return primer
```

使用`yield from`句法调用协程时，会自动预激，因此与上例的`@coroutine`装饰器不兼容。`asyncio.coroutine`装饰器(`async`)不会预激协程，因此兼容`yield from`句法(`await`)。

协程中未处理的异常会向上冒泡，传给`next`函数或`send`方法的调用方（即触发协程的对象）。

协程发生并抛出异常后，协程会终止。试图重新激活协程会抛出`StopIteration`异常。

``` python
# 致使生成器在暂停的yield表达式处抛出异常。
generator.throw(exc_type[, exc_value[, traceback]])

# 致使生成器在暂停的yield表达式处抛出GeneratorExit异常。如果生成器没有处理这个异常，或抛出StopIteration异常，调用方不会报错。
generator.close()
```

生成器中的`return result`语句会抛出`StopIteration(result)`异常，这样调用方可以从异常的`value`属性中获取`result`。(`yield from`能自动处理)

``` python
# 从`StopIteration`的`value`中获取协程用`return`返回的值。
try:
    coro.send(None)
except StopIteration as exc:
    result = exc.value
```

`yield from`结构会在内部自动捕获`StopIteration`异常，还会把value属性的值变成`yield from`表达式的值。

* 子生成器(用`yield from`激活)
* 委派生成器(在定义体中使用`yield from`)
* 客户代码(使用`send`, `next`, `throw`, `close`驱动整个过程)

```
    客户代码          委派生成器            子生成器
    +------+         +----------+          +--------+
    |      |--send-->|          |--------->|        |
    |      |<--------|          |<-yield---|        |
    |      |--throw->|          |--------->|        |
    |      |--close->|          |--------->|        |
    +------+         +----------+          +--------+

```

``` python
RESULT = yield from EXPR

# 相当于如下伪码：

_i = iter(EXPR)
try:
    _y = next(_i)
except StopIteration as _e:
    _r = _e.value
else:
    while True:
        _s = yield _y
        try:
            _y = _i.send(_s)
        except StopIteration as _e:
            _r = _e.value
            break
RESULT = _r
```

事件驱动框架的运作方式：在单个线程中使用一个主循环驱动协程执行并发活动。使用协程做面向事件编程时，协程会不断把控制权让步给主循环，激活并向前运行其他协程，从而执行各个并发活动。

协作式多任务：协程显式自主地把控制权让步给中央调度程序。

抢占式多任务(多线程)：调度程序可以在任何时刻暂停线程（即使在执行一个语句的过程中），把控制权让给其他线程。

### 第17章 使用期物(future)处理并发

*期物(future)：期物指一种对象，表示异步执行的操作。*

*defer, promise*

**GIL**: Global Interpreter Lock

CPython解释器本身就不是线程安全的，因此有全局解释器锁(GIL)，一次只允许使用一个线程执行Python字节码。

标准库中所有执行阻塞型I/O操作的函数，在等待操作系统返回结果时都会释放GIL。

### 第18章 使用asyncio包处理并发

asyncio包使用事件循环驱动的协程实现并发。

调度程序任何时候都能中断线程，需要使用锁来保护程序中的重要部分，防止多步操作在执行的过程中中断，防止数据处于无效状态；而协程只会在`yield`处中断，任意时刻只有一个协程在运行，具有自同步的能力。

能够安全地取消协程的原因：按照定义协程只能在暂停`yield`处取消，因此可以处理`CancelledError`异常，执行清理操作。

在asyncio包中，`yield from`的作用是把控制权还给事件循环。

在一个单线程程序中使用主循环依次激活队列里的协程，各个协程向前执行几步，然后把控制权让给主循环，主循环在激活队列里的下一个协程。

使用asyncio包时，我们编写的异步代码中包含由asyncio本身驱动的协程（即委派生成器），而生成器最终把职责委托给asyncio包或第三方库（如aiohttp）中的协程。

有两种方法能避免阻塞型调用中止整个应用程序的进程：
* 在单独的线程中运行各个阻塞型操作
* 把每个阻塞型操作转换成非阻塞的异步调用
    * 回调
    * 协程

### 第19章 动态属性和特性

在Python中，数据的属性和处理数据的方法统称属性（attribute）。其实，方法只是可调用的属性。

仅当无法使用常规的方式获取属性（即在实例、类或超类中找不到指定的属性），解释器才会调用特殊的`__getattr__`方法。

用于构建实例的是特殊方法`__new__`：这是个类方法（使用特殊方式处理，因此不必使用`@classmethod`装饰器），必须返回一个实例。返回的实例会作为第一个参数（即`self`）传给`__init__`方法。因此调用`__init__`方法时要传入实例，而且禁止返回任何值，所以`__init__`方法其实是“初始化方法”。真正的构造方法是`__new__`。

`__new__`方法也可以返回其他类的实例，此时，解释器不会调用`__init__`方法。

``` python
# 构建对象的伪代码
def object_maker(the_class, some_arg):
    new_object = the_class.__new__(some_arg)
    if isinstance(new_object, the_class):
        the_class.__init__(new_object, some_arg)
    return new_object

# 下述两个语句的作用基本等效
x = Foo('bar')
x = object_maker(Foo, 'bar')
```

对象的`__dict__`属性中存储着对象的属性——前提是类中没有声明`__slots__`属性。因此，更新实例的`__dict__`属性，把值设为一个映射，能快速地在那个实例中创建一堆属性。

### 第20章 属性描述符

### 第21章 类元编程

