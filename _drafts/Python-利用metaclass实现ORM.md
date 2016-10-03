---
title: Python 利用metaclass实现ORM 
categories: [linux]
tags: [python, ORM]
---

### type()

type()函数既可以返回一个对象的类型，又可以创建出新的类型，比如，我们可以通过type()函数创建出Hello类，而无需通过class Hello(object)...的定义：

    >>> def fn(self, name='world'): # 先定义函数
    ...     print('Hello, %s.' % name)
    ...
    >>> Hello = type('Hello', (object,), dict(hello=fn)) # 创建Hello class

等价于:

    >>> class Hello(object):
    >>>     def hello(self, name='world'):
    >>>         print('Hello, %s.' % name)


要创建一个class对象，type()函数依次传入3个参数：

1.class的名称；
2.继承的父类集合，注意Python支持多重继承，如果只有一个父类，别忘了tuple的单元素写法；
3.class的方法名称与函数绑定，这里我们把函数fn绑定到方法名hello上。

通过type()函数创建的类和直接写class是完全一样的，因为Python解释器遇到class定义时，仅仅是扫描一下class定义的语法，然后调用type()函数创建出class。

正常情况下，我们都用class Xxx...来定义类，但是，type()函数也允许我们动态创建出类来，也就是说，动态语言本身支持运行期动态创建类，这和静态语言有非常大的不同，要在静态语言运行期创建类，必须构造源代码字符串再调用编译器，或者借助一些工具生成字节码实现，本质上都是动态编译，会非常复杂。

### 自定义mateclass

使用 metaclass 的主要目的就是在创建类的时候自动地改变它。

``` python
# the metaclass will automatically get passed the same argument
# that you usually pass to `type`
def upper_attr(future_class_name, future_class_parents, future_class_attr):
    """
    Return a class object, with the list of its attribute turned 
    into uppercase.
    """

    # pick up any attribute that doesn't start with '__'
    attrs = ((name, value) for name, value in future_class_attr.items() if not name.startswith('__'))
    # turn them into uppercase
    uppercase_attr = dict((name.upper(), value) for name, value in attrs)

    # let `type` do the class creation
    return type(future_class_name, future_class_parents, uppercase_attr)

class Foo(object):
    __metaclass__ = upper_attr # this will affect all classes in the module
    hello = 'hello'

print(Foo.__dict__)
```
