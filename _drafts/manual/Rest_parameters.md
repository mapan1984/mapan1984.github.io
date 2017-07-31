### JavaScript

``` javascript
function f(a, b ...args) {
    // ...
}

f(1, 2, 3, 4, 5)
f(1, 2, ...[3, 4, 5])
f(...[1, 2, 3, 4, 5])
```

### Python

``` python
def fun(a, b, *args):
    pass

fun(1, 2, 3, 4, 5)
fun(1, 2, *[3, 4, 5])
fun(*[1, 2, 3, 4, 5])
```

### Go

``` go
func fun(args ...int) int {
    sum := 0
    for _, v := range args {
        sum = sum + v
    }

    return sum
}

func main() {
    arr := []int{2, 4}
    sum := fun(arr...)
}
```
