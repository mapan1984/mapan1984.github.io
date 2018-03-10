---
title: Python context manager
tags: [python]
---

想要的效果：

``` python
url = 'http://xxx'

# 方式1：__new__, 返回实例为response
response = OpenUrl(url)
response.read()
response.close()

# 方式2：上下文管理
with OpenUrl(url) as response:
    response.read()

# 方式3：__call__, 返回实例为可调用的返回response的函数
request = OpenUrl(url)
response = request()
response.read()
response.close()
```

实现1：使用`__new__`方法使类的实例是(file-like)的response

``` python
```

实现2：可用上下文管理，但实例不是(file-like)的response

``` python
from urllib.request import Request

class OpenUrl():
    def __init_(self, request):
        self.request = request

    def _get_response(self):
        try:
            self.response = urlopen(self.request)
        except HTTPError as error:
            print("The server couldn't fulfill the request.")
            print("Error code: ", error.code)
        except URLError as error:
            print("We failed to reach a server.")
            print("Reason: ", error.reason)

    def __enter__(self):
        self._get_response()
        return self.response

    def __exit__(self, exc_type, exc_value, traceback):
        self.response.close()

request = Request(url)
with OpenUrl(request) as response:
    response.read()
```

实现3：类的实例是可调用的函数，返回response

``` python
from urllib.request import Request

class OpenUrl():
    def __init_(self, request):
        self.request = request

    def _get_response(self):
        try:
            self.response = urlopen(self.request)
        except HTTPError as error:
            print("The server couldn't fulfill the request.")
            print("Error code: ", error.code)
        except URLError as error:
            print("We failed to reach a server.")
            print("Reason: ", error.reason)

    def __call__(self):
        self._get_response()
        return self.response

request = Request(url)
response = request()
response.read()
response.close()
```

(?) 结合实现2、3：

``` python
from urllib.request import Request

class _OpenUrl():

    def _get_response(self):
        try:
            self.response = urlopen(self.request)
        except HTTPError as error:
            print("The server couldn't fulfill the request.")
            print("Error code: ", error.code)
        except URLError as error:
            print("We failed to reach a server.")
            print("Reason: ", error.reason)

    def __call__(self, request):
        self.request = request
        self._get_response()
        return self.response

    def __enter__(self, request):
        return self.__call__(request)

    def __exit__(self, exc_type, exc_value, traceback):
        self.response.close()

open_url = _OpenUrl()

response = open_url(request)
response.read()
response.close()

with open_url(request) as response:
    response.read()
```
