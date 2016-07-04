---
title: python3 Tips
categories: [Manual]
tags: [Python]
---

### str和bytes的转换

文本以str类型表示，二进制数据以bytes类型表示


       --> encdoe('utf-8') --> 
      /                       \
    string                   bytes
      \                       /
       <-- decode('utf-8') <--


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
