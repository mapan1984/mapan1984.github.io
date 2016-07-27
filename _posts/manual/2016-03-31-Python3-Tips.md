---
title: python3 Tips
categories: [Manual]
tags: [Python]
---

### @functools.wraps

使用装饰器，一定记得加`@functools.wraps`，平时不注意，觉得被装饰函数的`__name__`属性改变也没什么，等到定义路由时就发现，`__name__`一变，路由处理函数就就找不到了。

``` python
import functools

def all_computers_refresh(func): # 定义装饰器，更新所有电脑信息
    @functools.wraps(func)
    def wrapper(*args, **kw):
        computer_list = Computer.query.all()
        for computer in computer_list:
            computer.refresh()
            db.session.add(computer)
        return func(*args, **kw)
    return wrapper

@manage.route('/all_computers')
@all_computers_refresh
def all_computers():
    return render_template('manage/all_computers.html', 
                           computer_list=Computer.query.all())
```

我在上面的路由处理函数中遇到的问题，直接粘过来。

### 错误处理

自定义错误与抛出错误,`Exception`All built-in, non-system-exiting exceptions are derived from this class. All user-defined exceptions should also be derived from this class

``` python
class NotFound(Exception):
    pass

def getheadnum(idlist, head):
    i = 0
    for id in idlist:
        if head in id:
            return i
        i = i+1
    raise NotFound('not found head: %s' % head)
```

``` python
try:
    pass
except NotFound as e:
    print('except:', e)
except Anther as e:
    pass
else:
    pass
finally:
    pass

```

### List Comprehension

``` python
[x*x for x in range(0, 10)]
[x*x for x in range(0, 10) if x%2 != 0]
[m+n for m in range(0, 10) for n in range[0, 10]]
[k+'='+v for k, v in d.items()]
[s.lower() for s in my_string]
```
对比

``` python
def geridlist():
    l = []
    with open('iid.xml', 'r') as f:
        for line in f.readlines():
            l.append(line.strip())
    return l
```

``` python
def getidlist():
    with open('iid.xml', 'r') as f:
        return [line.strip() for line in f.readlines()]
```


### Generator Expression

将列表生成式的[]换为()

``` python
(x*x for x in range(0, 10))
```

### Iterable Iterator

凡是可作用于for循环的对象都是Iterable类型；

凡是可作用于next()函数的对象都是Iterator类型，它们表示一个惰性计算的序列；

集合数据类型如list、dict、str等是Iterable但不是Iterator，不过可以通过iter()函数获得一个Iterator对象。

Python的for循环本质上就是通过不断调用next()函数实现的，例如：

``` python
for x in [1, 2, 3, 4, 5]:
    pass
```

实际上完全等价于：

``` python
# 首先获得Iterator对象:
it = iter([1, 2, 3, 4, 5])
# 循环:
while True:
    try:
        # 获得下一个值:
        x = next(it)
    except StopIteration:
        # 遇到StopIteration就退出循环
        break
```

使用iter()，的第二个参数，检测到''则停止

``` python
with open('mydata.txt') as fp:
    for line in iter(fp.readline, ''):
        process_line(line)
```

包含__next__()方法的类为可迭代对象，可通过next()方法调用。类如果定义__iter__()方法返回一个可迭代对象，则可以使用`for ... in class`，会不断调用该可迭代对象的__next__()方法，直到遇到StopIteration错误时退出循环(复杂的generator)

``` python
class Fib(object):
    def __init__(self):
        self.a, self.b = 0, 1 # 初始化两个计数器a，b

    def __iter__(self):
        return self # 实例本身就是迭代对象，故返回自己

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b # 计算下一个值
        if self.a > 100000: # 退出循环的条件
            raise StopIteration();
        return self.a # 返回下一个值

for n in Fib():
    print(n)
```

### 函数式常用方法

1. Iterator = map(fn, Iterable)

``` python
r = map(abs, [-x for x in range(10)])
list(r)
```

2. reduce

``` python
>>> from functools import reduce
>>> def add(x, y):
...     return x + y
...
>>> reduce(add, [1, 3, 5, 7, 9])
25
```

3. Iterator = filter(fn, Iterable)

Construct an iterator from those elements of iterable for which function returns true

``` python
def is_odd(n):
    return n % 2 == 1

list(filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15]))
# 结果: [1, 5, 9, 15]
#(item for item in iterable if fn(item))
```

4. lambda

``` python
lambda x: x * x
```

### 变量命名

1. 实例的私有变量(private)以双下划线开头，只能内部访问，如`__name`, 一般内部访问为`self.__name`
    *一般在外部可用`_类名__name`访问, 通过`dir(类名)`可以查看到*
2. 以双下划线开头和结尾的变量为特殊变量，不是私有变量，外部可访问，如`__name__`
3. 以单下划线开头的变量可以外部访问，但其约定为私有变量，如`_name`

### oop

1. `@classmethod`修饰的类方法，类内部方法使用`cls.property`访问类属性，以`cls`为第一参数，可以被类或实例调用
2. `@staticmethod`修饰的方法，不以`self`或`cls`为第一参数，而是任意参数，可以被类或实例调用
2. 使用`self.property`访问实例属性
3. 使用`__slots__`限制类属性:

        class Student(object):
            __slots__ = ('name', 'age') # 用tuple定义允许绑定的属性名称

    使用__slots__要注意，__slots__定义的属性仅对当前类实例起作用，对继承的子类是不起作用的：
    除非在子类中也定义__slots__，这样，子类实例允许定义的属性就是自身的__slots__加上父类的__slots__。

4. 使用`@property`

        class Student(object):
        
            @property
            def birth(self):
                return self._birth
        
            @birth.setter
            def birth(self, value):
                self._birth = value
        
            @property
            def age(self):
                return 2015 - self._birth

5. 记得多重继承是优先使用Mixin
6. 类的特殊方法:
    * `__str__`: print(class)时调用
    * `__repr__`: class时调用
    * `__iter__`、`__next__`
    * `__getitem__`
    * `__call__`

### global

Python中在函数外定义的变量，如函数内无同名变量，可在函数内引用(reference)

``` python
s = "hello"

def foo():
    print(s)    # 引用外部变量s

def bar():
    s = 'world' # 新定义了内部变量s
```

但如果即想引用，又想在原有基础上修改，可以使用`global`在函数内声明为global变量

``` python
s = "hello"

def change_it(n):
    global s         # 声明s为global变量
    s = s + 'world'  # 先引用s，之后修改s
```

如果不进行声明，会报错`UnboundLocalError: local variable 's' referenced before assignment`

建议无论是什么情况，使用global变量一定进行声明

### 点滴

1. 使用`isinstance`判断类型
2. 比较：
    1. 可以直接使用`1<x<9`
    2. `is`、`is not`
    3. `in`、`not in`
3. `1, 2, 3 ....`不用加括号，即为tuple，所以可以使用`return 1, 2, 3`或`yield 1, 2, 3`会返回tuple`(1, 2, 3)`，长度任意，同时可实现`a, b = b, a`完成交换
4. ("spam " "eggs") == "spam eggs"，可以用来将长字符串分割为多行
5. `x if x<y else y`等同于C中`x<y ? x:y`
6. 文本以str类型表示，二进制数据以bytes类型表示

           --> encdoe('utf-8') --> 
          /                       \
        string                   bytes
          \                       /
           <-- decode('utf-8') <--

7. 使用 \ 分割过长的行（Shell Script、Python在分割的第一行，vimscript在分割的第二行）
8. docstring:
    1. """triple  double  quotes"""
    2. Use  r"""raw  triple double  quotes"""   if you use any backslashes in your docstrings
    3. For Unicode docstrings, use  u"""Unicode   triple-quoted   strings"""
9. 我的Python安装目录为`D:\Python35`第三方扩展安装目录为`D:\Python35\Lib\site-packages`
10. `python3 -m http.server 8080`
