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
func sum(args ...int) int {
    total := 0
    for _, val := range args {
        total +=  val
    }

    return total
}

func main() {
    arr := []int{2, 4}
    fmt.Println(sum(1, 2, 3))
    fmt.Println(sum(arr...))
}
```
