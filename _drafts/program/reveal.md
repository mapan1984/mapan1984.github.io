## 技术分享——Flask

> Flask is a microframework for Python based on Werkzeug, Jinja 2 and good intentions.

Flask的hello world应用：

``` python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()
```

### 设计特点

* 微框架：只提供核心功能，但具有非常好的扩展系统。
* 路由设计：使用装饰器注册路由。
* 模块化(Blueprint)：使用蓝图(Blueprint)实现应用的模块化，让应用层次清晰。
* 上下文(Context)：利用上下文将请求等信息变为全局可访问。

#### 微框架

设计哲学是Django与Flask之间区别最大的地方，Django提供了一站式的解决方案，从模板，ORM, Session, Authentication，Flask的设计目标是保持核心的精简但是可扩展，提供机制，而不是强加规范。

> “Micro” does not mean that your whole web application has to fit into a single Python file (although it certainly can), nor does it mean that Flask is lacking in functionality. The “micro” in microframework means Flask aims to keep the core simple but extensible. Flask won’t make many decisions for you, such as what database to use. Those decisions that it does make, such as what templating engine to use, are easy to change. Everything else is up to you, so that Flask can be everything you need and nothing you don’t.

#### 依赖

flask依赖jinja2和Werkzeug

##### Jinja2

jinja2是一个功能齐全的模板引擎，这里提供一个简单示例：

``` python
>>> from jinja2 import Template
>>> template = Template('Hello {{name}}!')
>>> template.render(name='John Doe')
u'Hello John Doe!'
```

##### Werkzeug

Werkzeug是一个WSGI工具包，可以作为web框架的底层库。WSGI是一个Web应用和服务器通信的协议，一个WSGI兼容的应用看起来是这样的:

``` python
# 一个WSGI-compatible "Hello World" application
def application(environ, start_response):
    """
    environ: 包含了请求的所有信息
    start_response: application需要调用的函数，参数分别是status和response_headers
    """
    start_response('200 OK', [('Content-Type', 'text/html')])
    return '<h1>Hello, Web!</h1>'
```

Flask的实例(如上面的`app`)就是WSGI兼容的application，

``` python
# 一个调用application的例子
def call_application(app, environ):
    """
    app: application
    environ: 可能包含请求方法等信息
    """
    body = []
    status_headers = [None, None]

    def start_response(status, headers):
        status_headers[:] = [status, headers]
        return body.append(status_headers)

    app_iter = app(environ, start_response)

    try:
        for item in app_iter:
            body.append(item)
    finally:
        if hasattr(app_iter, 'close'):
            app_iter.close()
    return status_headers[0], status_headers[1], ''.join(body)

status, headers, body = call_application(app, {...environ...})
```

通过Werkzeug，我们可以不必直接处理请求或者响应这些底层的东西，它已经为我们封装好了这些。

``` python
from werkzeug.wrappers import Response

def application(environ, start_response):
    response = Response('Hello World!', mimetype='text/plain')
    return response(environ, start_response)
```

#### 路由设计

Django的路由设计是采用集中处理的方法，利用正则匹配。Flask也能这么做，但Flask更推荐采用装饰器注册url到view的映射：

``` python
@app.route("/")
def index():
    return "Index Page"

@app.route('/hello')
def hello():
    return "Hello World!"
```

``` python
class Flask:
    def __init__(self, package_name):
        self.view_functions = {}
        self.url_map = Map()

    def route(rule, **options):
        """
        rule: the URL rule as string
        """
        def decorator(f):
            self.add_url_rule(rule, f.__name__, **options)
            self.view_functions[f.__name__] = f
            return f
        return decorator
```

#### 模块化

Django的模块化是集成在命令中的，通过Django提供的命令初始整个项目的结构以及application的结构，为以后的复用提供了便利。Flask通过蓝图(Blueprint)实现模块化，自己对项目结构进行划分，组织成不同的模块。

``` python
# admin.py
from flask import Blueprint

admin = Blueprint('admin', __name__)

@admin.route('/login')
def admin_login():
    pass
```

``` python
# run.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    pass

# 注册蓝图
from admin import admin
app.register_blueprint(admin, url_prefix='/admin')

if __name__ == '__main__':
    app.run()
```

#### 上下文

在使用Flask的开发过程中，我们可以通过以下方式获得http请求的信息：

``` python
from flask import request

@app.route('/')
def hello():
    # 获得请求的`name`参数
    name = request.args.get('name', None)
```

``` python
class Local(object):
    """提供了多线程/协程隔离的属性访问"""
    def __init__(self):
        # 数据保存在__storage__中，后续访问都是对该属性的操作
        object.__setattr__(self, '__storage__', {})
        object.__setattr__(self, '__ident_func__', get_ident)

    def __relase_local__(self):
        """清空当前线程下保存的所有数据"""
        self.__storage__.pop(self.__ident_func__(), None)

    # 下面三个方法实现了属性的访问、设置和删除。
    # 注意到，内部都调用 `self.__ident_func__` 获取当前线程或者协程的 id，然后再访问对应的内部字典。
    # 如果访问或者删除的属性不存在，会抛出 AttributeError。
    # 这样，外部用户看到的就是它在访问实例的属性，完全不知道字典或者多线程/协程切换的实现
    def __getattr__(self, name):
        try:
            return self.__storage__[self.__ident_func__()][name]
        except KeyError:
            raise AttributeError(name)

    def __setattr__(self, name, value):
        ident = self.__ident_func__()
        storage = self.__storage__
        try:
            storage[ident][name] = value
        except KeyError:
            storage[ident] = {name: value}

    def __delattr__(self, name):
        try:
            del self.__storage__[self.__ident_func__()][name]
        except KeyError:
            raise AttributeError(name)
```

```
__storage__ = {
    'thread_id_1': {name: value, name: value, ..., name: value},
    'thread_id_2': {name: value, name: value, ..., name: value},
    'thread_id_3': {name: value, name: value, ..., name: value},
}
```

``` python
class LocalStack(object):
    """基于Local实现的栈结构，提供了线程隔离的栈访问"""
    def __init__(self):
        self._local = Local()

    def __relase_local__(self):
        """清空当前线程的栈数据"""
        self._local.__relase_local__()

    # push、pop 和 top 三个方法实现了栈的操作，
    # 可以看到栈的数据是保存在 self._local.stack 属性中的
    def push(self, obj):
        rv = getattr(self._local, 'stack', None)
        if rv is None:
            self._local.stack = rv = []
        rv.append(obj)
        return rv

    def pop(self):
        stack = getattr(self._local, 'stack', None)
        if stack is None:
            return None
        elif len(stack) == 1:
            release_local(self._local)
            return stack[-1]
        else:
           return stack.pop()

    @property
    def top(self):
        try:
            return self._local.stack[-1]
        except (AttributeError, IndexError):
            return None
```

```
_local.__storage__ = {
    `thread_id_1`: {'stack': [a, b, c, ...]},
    `thread_id_2`: {'stack': []},
    `thread_id_3`: {'stack': []},
}
```

LocalProxy则是一个典型的代理模式实现，它在构造时接受一个callable的参数（比如一个函数），这个参数被调用后的返回值本身应该是一个Thread Local对象。对一个LocalProxy对象的所有操作，包括属性访问、方法调用（当然方法调用就是属性访问）甚至是二元操作都会转发到那个callable参数返回的Thread Local对象上。

``` python
class LocalProxy(object):
    """Local对象的代理，负责把所有对自己的操作转发给内部的Local对象"""
    def __init__(self, local, name=None):
        object.__setattr__(self, '_LocalProxy__local', local)
        object.__setattr__(self, '__name__', name)

    def _get_current_object(self):
        """获得当前线程对应的对象"""
        if not hasattr(self.__local, '__release_local__'):
            return self.__local
        try:
            return getattr(self.__local, self.__name__)
        except AttributeError:
            raise RuntimeError('no object bound to %s' % self__name__)

    def __getattr__(self, name):
        if name == '__members__':
            return dir(self._get_current_object())
        return getattr(self._get_current_object(), name)

    def __setitem__(self, key, value):
        self._get_current_object()[key] = value

    @property
    def __dict__(self):
        try:
            return self._get_current_object().__dict__
        except RuntimeError:
            raise AttributeError('__dict__')
```

``` python
{
    880: {'stack': [<flask._RequestContext object>]},
    13232: {'stack': [<flask._RequestContext object>]}
}
```

``` python
_request_ctx_stack = LocalStack()

request = LocalProxy(lambda: _request_ctx_stack.top.request)
```

