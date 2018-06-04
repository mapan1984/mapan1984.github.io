---
title: Flask源码解析
tags: [Python, Flask]
---

### 设计特点

* 微框架：只提供核心功能，但具有非常好的扩展系统。
* 路由设计：使用装饰器注册路由。
* 模块化(Blueprint)：使用蓝图(Blueprint)实现应用的模块化，让应用层次清晰。
* 上下文(Context)：利用上下文将请求等信息变为全局可访问。

### 依赖

#### Jinja2

jinja2是一个功能齐全的模板引擎，这里提供一个简单示例：

``` python
>>> from jinja2 import Template
>>> template = Template('Hello {{name}}!')
>>> template.render(name='John Doe')
u'Hello John Doe!'
```

#### Werkzeug

##### WSGI

在过去，对于新的Pythoner来说，Web框架的选择会是一个问题，因为在过去Web框架经常被设计为只适用于CGI, FastCGI, mod_python， 或者其他一些web server的通用的API，这样Web的框架的选择会限制Web server的选择。

WSGI被创造出来作为一种位于Web Server和Web Application or Framework之间的低层次的接口。

在Python的世界里，通过WSGI约定了Web服务器怎么调用Web应用程序的代码，以及Web应用程序需要符合什么样的规范。只要Web应用程序和Web服务器都遵守WSGI协议，那么，Web应用程序和Web服务器就可以随意的组合。这也就是WSGI存在的原因。

``` python
# 一个WSGI-compatible "Hello World" application
def application(environ, start_response):
    """
    Args:
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
    Args:
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

WSGI有两边，一边是Server或Gateway(比如Apache或Nginx)，另一边是Application或Framework。处理一个请求，Server执行Application并且提供Environment信息和一个Callback function给Application。Application处理请求，用服务器提供的Callback function向Server返回响应。

在Server和Application之间，可能有WSGI middleware，它提供了两边的api。Server接收来自Client的Request并把它向前传递给Middleware，经过处理，Middleware把Request传递给Application。Application的Response经过Middleware传递给Server并最终到达Client。

``` python
# 提供服务
import eventlet

def hello_world(environ, start_response):
    if environ['PATH_INFO'] != '/':
        start_response('400 Not Found', [('Content-Type', 'text/plain')])
        return ['Not Found!\r\n']
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return ['Hello, world!\r\n']

eventlet.wsgi.server(eventlet.listen(('', 8080)), hello_world)
```

上述的例子用eventlet创建了一个简单的WSGI服务器，`eventlet.listen`创建了一个套接字，`eventlet.wsgi.server`监听对应的地址，端口等，将请求传递给WSGI应用`hello_world`处理。

```
$ pip install gunicorn
$ cat myapp.py
  def app(environ, start_response):
      data = b"Hello, World!\n"
      start_response("200 OK", [
          ("Content-Type", "text/plain"),
          ("Content-Length", str(len(data)))
      ])
      return iter([data])
$ gunicorn -w 4 myapp:app
[2014-09-10 10:22:28 +0000] [30869] [INFO] Listening at: http://127.0.0.1:8000 (30869)
[2014-09-10 10:22:28 +0000] [30869] [INFO] Using worker: sync
[2014-09-10 10:22:28 +0000] [30874] [INFO] Booting worker with pid: 30874
[2014-09-10 10:22:28 +0000] [30875] [INFO] Booting worker with pid: 30875
[2014-09-10 10:22:28 +0000] [30876] [INFO] Booting worker with pid: 30876
[2014-09-10 10:22:28 +0000] [30877] [INFO] Booting worker with pid: 30877
```

##### Werkzeug

Werkzeug是一个WSGI工具包，可以作为web框架的底层库。通过Werkzeug，我们可以不必直接处理请求或者响应这些底层的东西，它已经为我们封装好了这些。

请求数据在environ对象中，Werkzeug允许我们以一个轻松的方式访问请求数据。响应对象是一个WSGI应用，提供了更好的方法来创建响应。如下所示：

``` python
from werkzeug.wrappers import Response

def application(environ, start_response):
    response = Response('Hello World!', mimetype='text/plain')
    return response(environ, start_response)
```

### Flask, Werkzeug, WSGI, jinja2之间的关系

Flask是一个基于Python开发并且依赖jinja2模板和Werkzeug WSGI服务的一个微型框架，对于Werkzeug，它只是工具包，其用于接收http请求并对请求进行预处理，然后触发Flask框架，开发人员基于Flask框架提供的功能对请求进行相应的处理，并返回给用户，如果要返回给用户复杂的内容时，需要借助jinja2模板来实现对模板的处理。将模板和数据进行渲染，将渲染后的字符串返回给用户浏览器。

### Flask启动过程

``` python
from flask import Flask
app = Flask(__name__)           # 实例化Flask类，实例为一个WSGI应用

@app.route("/")                 # 注册路由和相应的处理函数
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()                   # 运行
```

Flask类保存了所有应用需要的信息：

``` python
class Flask:
    def __init__(self, package_name):
        self.package_name = package_name
        self.root_path = _get_package_path(self.package_name)

        self.view_functions = {}
        self.error_handlers = {}
        self.before_request_funcs = []
        self.after_request_funcs = []
        self.url_map = Map()
```

用route装饰器注册url到view的映射：

``` python
def route(self, rule):
    def decorator(fun):
        self.add_url_rule(rule, fun.__name__, **options)
        self.view_functions[fun.__name__] = fun
        return fun
    return decorator
```

app启动时的调用堆栈：

``` python
app.run()
    run_simple(host, port, self, **options)
        __call__(self, environ, start_response)
            wsgi_app(self, environ, start_response)
```

wsgi_app是什么：

``` python
def wsgi_app(self, environ, start_response):
    """ The actual WSGI application. """
    # 创建请求上下文，并把它压栈。这个在后面会详细解释
    ctx = self.request_context(environ)
    ctx.push()
    error = None

    try:
        try:
            # 正确的请求处理路径，会通过路由找到对应的处理函数
            response = self.full_dispatch_request()
        except Exception as e:
            # 错误处理，默认是 InternalServerError 错误处理函数，客户端会看到服务器 500 异常
            error = e
            response = self.handle_exception(e)
        return response(environ, start_response)
    finally:
        if self.should_ignore_error(error):
            error = None
        # 不管处理是否发生异常，都需要把栈中的请求 pop 出来
        ctx.auto_pop(error)
```

dispatch_request函数，有flask的错误处理逻辑：

``` python
def dispatch_request(self):
    try:
        endpoint, values = self.match_request()
        return self.view_functions[endpoint](**values)
    except HTTPException as e:
        handler = self.error_handlers.get(e.code)
        if handler is None:
            return e
        return handler(e)
    except Exception as e:
        handler = self.error_handlers.get(500)
        if self.debug or handler is None:
            raise
        return handler(e)
```

### 路由设计

Flask更采用装饰器注册url到view的映射：

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
        def decorator(fun):
            self.add_url_rule(rule, fun.__name__, **options)
            self.view_functions[fun.__name__] = fun
            return fun
        return decorator
```

### 模块化

Flask通过蓝图(Blueprint)实现模块化，自己对项目结构进行划分，组织成不同的模块。

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

### 上下文

在使用Flask的开发过程中，我们可以通过以下方式获得http请求的信息：

``` python
from flask import request

@app.route('/')
def hello():
    # 获得请求的`name`参数
    name = request.args.get('name')
```

request看起来像是一个全局变量，但是一个全局变量为什么可以在一个多线程环境中随意使用呢？

``` python
_request_ctx_stack = LocalStack()

current_app = LocalProxy(lambda: _request_ctx_stack.top.app)
request = LocalProxy(lambda: _request_ctx_stack.top.request)
session = LocalProxy(lambda: _request_ctx_stack.top.session)
g = LocalProxy(lambda: _request_ctx_stack.top.g)
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

在多线程环境下，实际的`__storage__`属性看起来如下：

``` python
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

在多线程环境下，`_local`属性看起来如下：

``` python
_local.__storage__ = {
    `thread_id_1`: {'stack': [a, b, c, ...]},
    `thread_id_2`: {'stack': []},
    `thread_id_3`: {'stack': []},
}
```

Flask实际的`_request_ctx_stack`

``` python
{
    880: {'stack': [<flask._RequestContext object>]},
    13232: {'stack': [<flask._RequestContext object>]}
}
```

LocalProxy则是一个典型的代理模式实现，它在构造时接受一个callable的参数（比如一个函数），这个参数被调用后的返回值本身应该是一个Thread Local对象。对一个LocalProxy对象的所有操作，包括属性访问都会转发到那个callable参数返回的Thread Local对象上。

``` python
class LocalProxy(object):
    """Local对象的代理，负责把所有对自己的操作转发给内部的Local对象"""
    def __init__(self, local, name=None):
        # 注意`_LocalProxy__local`是为了找到类的私有属性`__local`
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

我们可以直接对`LocalStack`进行操作，但向上面的情况，在请求为发生时`LocalStack`还为空，而**`LocalProxy`可以让我们把对`LocalStack`的访问推迟到进行具体操作(比如属性访问)的时候**，这样的话我们可以做到在开始就引入`request`，在视图函数中(即`LocalStack`已经有请求对象时)进行访问就会取到我们要的值。
