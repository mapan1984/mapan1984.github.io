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
