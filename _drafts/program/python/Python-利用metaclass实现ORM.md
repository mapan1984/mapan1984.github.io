---
title: Python 利用metaclass实现ORM
tags: [python, ORM]
---

### 类是一种对象

Python的类本身是一种对象，这种对象用来创建其他对象。当用`class Foo`声明Foo类时，其实创建了这种特殊对象，因此可以像创建对象一样，动态的创建类。

    [instance] ---is instance of--> [class] ---is instance of--> [metaclass]

### type()

我们通常将`type`视为一个函数，它可以返回一个对象的类型。然而`type`是一个类，当成类使用时，传入三个参数创建出新的类型。比如，我们可以通过`type`创建出Hello类，而无需通过`class Hello(object)...`的定义：

    >>> def fn(self, name='world'): # 先定义函数
    ...     print('Hello, %s.' % name)
    ...
    >>> Hello = type('Hello', (object,), dict(hello=fn)) # 创建Hello class

等价于:

    >>> class Hello(object):
    >>>     def hello(self, name='world'):
    >>>         print('Hello, %s.' % name)


要创建一个class对象，依次向`type`传入3个参数：

    type(name:str, bases:tuple, attr:dict) -> object

1. str类型: class的名称；
2. tuple类型: 继承的父类集合，注意Python支持多重继承，如果只有一个父类，别忘了tuple的单元素写法；
3. dict类型: class的属性与值的绑定，这里我们把函数fn绑定到方法名hello上。

通过type()函数创建的类和直接写class是完全一样的，class语句只是Python提供的语法糖。

### 自定义mateclass

metaclass就是创建类的东西，`type`就是Python在底层用来创建所有类的mateclass。使用metaclass的主要目的就是在创建类的时候自动地改变它。

在Python2中，声明并赋值类属性`__metaclass__`时，Python2就会使用`__metaclass__`创建类，否则使用`type`创建类。

在Python3中，在类定义时加入关键字参数`metaclass`，如果不指定`metaclass`，`metaclass`的默认值为`type`。

``` python
# the metaclass will automatically get passed the same argument
# that you usually pass to `type`
def upper_attr(future_class_name, future_class_parents, future_class_attr):
    """
    Return a class object, with the list of its attribute turned
    into uppercase.
    """

    # pick up any attribute that doesn't start with '__'
    attrs = ((name, value)
             for name,value in future_class_attr.items()
             if not name.startswith('__'))
    # turn them into uppercase
    uppercase_attr = dict((name.upper(), value) for name,value in attrs)

    # let `type` do the class creation
    return type(future_class_name, future_class_parents, uppercase_attr)


class Foo(metaclass=upper_attr): # global __metaclass__ won't work with "object" though
  # but we can define __metaclass__ here instead to affect only this class
  # and this will work with "object" childrend
  bar = 'bip'

print(hasattr(Foo, 'bar'))
# Out: False
print(hasattr(Foo, 'BAR'))
# Out: True

f = Foo()
print(f.BAR)
# Out: 'bip'
```

### __new__

`__new__`方法创建并返回对象，之后`__init__`初始化属性。

    Foo.__new__用来创建Foo的实例。

`type`是一个类，它拥有`__call__`方法，所以Python可以把它当成一个函数来来调用，实际`type.__call__`调用了`type.__new__`根据参数数量(一个或三个)来返回参数的type或者初始化一个`type`类的实例。

    type.__new__用来创建Foo

所以自定义metaclass时，让metaclass继承type，并修改`__new__`方法。

``` python
# remember that `type` is actually a class like `str` and `int`
# so you can inherit from it
class UpperAttrMetaclass(type):
    # __new__ is the method called before __init__
    # it's the method that creates the object and returns it
    # while __init__ just initializes the object passed as parameter
    # you rarely use __new__, except when you want to control how the object
    # is created.
    # here the created object is the class, and we want to customize it
    # so we override __new__
    # you can do some stuff in __init__ too if you wish
    # some advanced use involves overriding __call__ as well, but we won't
    # see this
    def __new__(upperattr_metaclass, future_class_name,
                future_class_parents, future_class_attr):

        attrs = ((name, value)
                 for name, value in future_class_attr.items()
                 if not name.startswith('__'))
        uppercase_attr = dict((name.upper(), value) for name, value in attrs)

        return type(future_class_name, future_class_parents, uppercase_attr)
```

### Object Relational Mapping


