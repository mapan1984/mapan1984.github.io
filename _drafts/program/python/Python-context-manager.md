---
title: Python context manager
tags: [python]
---

``` python
class OpenUrl():
    def __init_(self, request):
        self.request = request

    def _init_response(self):
        try:
            self.response = urlopen(self.request)
        except HTTPError as error:
            print("The server couldn't fulfill the request.")
            print("Error code: ", error.code)
        except URLError as error:
            print("We failed to reach a server.")
            print("Reason: ", error.reason)

    def __enter__(self):
        self._init_response()
        return self.response

    def __exit__(self, exc_type, exc_value, traceback):
        self.response.close()

from urllib.request import Request

request = Request(url)
with OpenUrl(request) as response:
    response.read()
```

``` python
class OpenUrl():
    def __init_(self, request):
        self.request = request

    def _init_response(self):
        try:
            self.response = urlopen(self.request)
        except HTTPError as error:
            print("The server couldn't fulfill the request.")
            print("Error code: ", error.code)
        except URLError as error:
            print("We failed to reach a server.")
            print("Reason: ", error.reason)

    def __call__(self):
        self._init_response()
        return self.response

    def __enter__(self):
        return self.__call__()

    def __exit__(self, exc_type, exc_value, traceback):
        self.response.close()

from urllib.request import Request

request = Request(url)
with OpenUrl(request) as response:
    response.read()
```

``` python
class _OpenUrl():

    def _init_response(self):
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
        self._init_response()
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
