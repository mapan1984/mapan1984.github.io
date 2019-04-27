## Monoid

1. class (object)
2. class (map morphism)
3. axioms
    * associative (结合律)

            m1: 1 -> 2
            m2: 2 -> 3
            m3: 3 -> 4

            (m1 . m2) . m3 == m1 . (m2 . m3)

    * identity (同一律)

            id . m1 = m1
            m1 . id = m1

### monoids

``` f#
x: int
f: int -> int

----------------

x: a
f: a -> a

g: a -> a

-----------------

f(g(a))
g(f(a))

-----------------

f(g^a)
g(f^a)

(f · g) a = f(g^a)

(f · g) = h: a -> a
```

monoids：将两(多)个输入输出类型一致的函数结合成一个同样输入输出类型的函数。

### 为这种结合增加规则

Clock:

(x + y) % 12

结合律：
(x + (y + z)) = (x + y) + z

同一律：
x + 12 = x
12 + x = x

### 证明

1. (f · g) · h  = f · (g · h)

        f(g(h(a)))  = f(g(h(a)))

2. (f · id) = (id · f)

        id: a -> a
        id a = a

        f(id(a)) = f(a)
        id(f(a)) = f(a)

### monad

    x: a
    f: a -> Ma
    g: a -> Ma
    h: a -> Ma

    \a -> (f a)  >>= \a -> (g a)
            Ma        a ->   Ma

            return: a -> Ma
                         Ienumerable<a>

### 其他

    g: a -> b
    f: b -> c
    (f · g): a -> c
    (f · g) = f(g a)

### 其他

    g: a -> Mb
    f: b -> Mc

    \a -> (g a) >>= \b -> (f b)

          Mb -> (b -> Mc) -> Mc

     a -------------------> Mc

