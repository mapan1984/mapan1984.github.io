### yield from

在Python中

``` python
yield from iterate()
```

相当于

``` python
for value in iterate():
    yield value
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
    while 1:
        _s = yield _y
        try:
            _y = _i.send(_s)
        except StopIteration as _e:
            _r = _e.value
            break
RESULT = _r
```

比如:

``` python
def g1():
    for i in range(5):
        yield i


def g2(g):
    yield from g

for i in g2(g1()):
    print(i)
```

yield from会把内嵌的generator输出作为当前generator输出的一部分

### coroutine

``` python
yield @asyncio.coroutine async
send  yield form         await
```
