## 安装

scala 代码会通过 `scalac` 编译为 `.class`，然后通过 `scala` 加载并运行在 jvm 中

``` scala
object Hello {
  def main(args: Array[String]): Unit = {
    println("hello, world!");
  }
}
```

编译：

    scalac Hello.scala

运行；

    scala Hello

1. JDK
2. Scala

        scala> :load module.package

1. sbt

        $ wget https://piccolo.link/sbt-1.2.1.tgz
        $ tar zxvf sbt-1.2.1.tgz
        $ ./sbt
        $ ./bin/sbt
        $ sudo mv sbt /usr/local/

        $ sbt new playframework/play-scala-seed.g8
        $ vim build.sbt
        $ sbt run

        $ sbt new akka/akka-quickstart-scala.g8
        $ vim build.sbt
        $ sbt
        $ sbt run
        $ sbt console

        > help
        > tasks # 最常用的，当前可用的任务
        > tasks -V
        > compiler  # 增量编译代码
        > test      # 增量编译代码，并执行测试
        > clean     # 删除所有已经编译好的构建
        > ~test     # 一旦有文件保存，执行增量编译并运行测试(适用于任务由~前缀的命令)
        > console   # 运行 Scala REPL
        > run       # 执行项目的某一主程序
        > show x    # 显示变量 x 的定义
        > eclipse   # 生成 Eclipse 项目文件
        > exit      # 退出 REPL (control-d)

## 变量

``` scala
// 变量
var x: Int = 1

// 常量，等同于 final
val y: Int = 2

// 类型推断(类型可省略)
var z = 3
```

## 数据类型

Scala 与 Java 有着相同的数据类型，在 Scala 中数据类型都是对象，没有 Java 中的原生类型。

Scala 数据类型分为 2 大类：
* Any
    * AnyVal（值类型）
        - Double
        - Float
        - Long
        - Int
        - Short: `-32768` ~ `32767`
        - Byte: `-128` ~ `127`
        - Boolean: `true`, `false`
        - Char
        - StringOps
        - Unit: 表示无值，类似 `void` 的概念，用作不返回任何结果的方法的结果类型。只有一个实例值，写作 `()`
    * AnyRef（引用类型）
        - Scala collections
        - all java classes
        - Other Scala classes
        - `Null`：只有一个实例值 `null`，可以赋值给任意 `AnyRef` 类型，但是不能赋值给 `AnyVal`
    * `Nothing`: 是任何其他类型的子类型，可以作为没有正常返回值方法的返回类型

### 数字

``` scala
@ 1
res3: Int = 1

@ 1L
res4: Long = 1L

@ 1.1
res5: Double = 1.1

@ 1.1F
res6: Float = 1.1F
```

### String

``` scala
@ "hello, world".substring(1, 3)
res7: String = "el"

@ val x = 1
x: Int = 1

@ val y = 2
y: Int = 2

@ "hello, $x and $y"
res10: String = "hello, $x and $y"

@ s"hello, $x and $y"
res11: String = "hello, 1 and 2"

@ s"hello, ${x + y}"
res12: String = "hello, 3"

@ "hello," + " world"
res13: String = "hello, world"
```

### Tuples

Tuple 可以容纳 1 到 22 个元素，元素类型可以不同。使用 `._1`, `._2` ... 取 Tuple 中的元素(注意下标从 1 开始)。Tuple 数量应该保持在小的范围，如果元素过多容易造成混乱，这时应该考虑使用 `class`。

``` scala
@ val t = (1, true, "hello")
t: (Int, Boolean, String) = (1, true, "hello")

@ t._1
res15: Int = 1

@ t._2
res16: Boolean = true

@ t._3
res17: String = "hello"
```

Tuple 支持拆包

``` scala
@ val t2: (Int, Boolean) = (1, false)
t2: (Int, Boolean) = (1, false)

@ val (a, b) = t2
a: Int = 1
b: Boolean = false

@ a
res20: Int = 1

@ b
res21: Boolean = false
```

### Arrays

数组可以容纳多个相同类型的元素，创建后长度固定，下标从 0 开始。

``` scala
@ val a = Array[Int](1, 2, 3, 4)
a: Array[Int] = Array(1, 2, 3, 4)

@ a(0)
res23: Int = 1

@ a(1)
res24: Int = 2
```

``` scala
@ val as = Array("hello", "world")
as: Array[String] = Array("hello", "world")

@ as(0)
res26: String = "hello"
```

可以创建指定长度的 Array，但是不初始内容，而是使用类型的默认值。

``` scala
@ val a = new Array[Int](4)
a: Array[Int] = Array(0, 0, 0, 0)
```

支持多维数组

``` scala
@ val ma = Array(Array(1, 2), Array(3, 4))
ma: Array[Array[Int]] = Array(Array(1, 2), Array(3, 4))

@ ma(0)
res31: Array[Int] = Array(1, 2)

@ ma(0)(0)
res32: Int = 1
```

### Option, Some, None

`Option[T]` 可以表示一个 `T` 类型的值可能存在或者可能不存在，如果存在，其为 `Some(v: T)`，不存在则为 `None`

``` scala
@ def hello(title: String, firstName: String, lastNameOpt: Option[String]) = {
    lastNameOpt match {
      case Some(lastName) => println(s"Hello $title. $lastName")
      case None => println(s"Hello $firstName")
    }
  }
defined function hello

@ hello("Mr", "Haoyi", None)
Hello Haoyi


@ hello("Mr", "Haoyi", Some("Li"))
Hello Mr. Li
```

``` scala
@ Some("Li").getOrElse("<unknown>")
res36: String = "Li"

@ None.getOrElse("<unknown>")
res37: String = "<unknown>"
```


`Option` 类似一个只有 0 或 1 个元素的集合，可以遍历其元素

``` scala
@ def hello(name: Option[String]) = {
    for (s <- name) println(s"Hello, $s")
  }
defined function hello

@ hello(None)


@ hello(Some("mapan"))
Hello, mapan
```

``` scala
@ def nameLength(name: Option[String]) = {
    name.map(_.length).getOrElse(-1)
  }
defined function nameLength

@ nameLength(Some("mapan"))
res42: Int = 5

@ nameLength(None)
res43: Int = -1
```

## 集合

* Iterable
  * collection.Set
    * Set
    * mutable.Set
  * collection.Seq
    * Seq
      * List
      * IndexedSeq
        * Vector
    * mutable.IndexedSeq
      * mutable.Buffer
        * mutable.ArrayDeque
      * Array
  * collection.Map
    * Map
    * mutable.Map

### Builders

Builder 可以高效的构造未知长度的集合，非常适合用于 `Array` 这类一旦创建就不能改变长度的集合。

``` scala
@ val b = Array.newBuilder[Int]
b: collection.mutable.ArrayBuilder[Int] = ArrayBuilder.ofInt

@ b += 1
res1: collection.mutable.ArrayBuilder[Int] = ArrayBuilder.ofInt

@ b += 2
res2: collection.mutable.ArrayBuilder[Int] = ArrayBuilder.ofInt

@ b.result()
res3: Array[Int] = Array(1, 2)
```

### Factory Methods

``` scala
@ Array.fill(5)("hello")
res0: Array[String] = Array("hello", "hello", "hello", "hello", "hello")

@ Array.tabulate(5)(n => s"hello $n")
res1: Array[String] = Array("hello 0", "hello 1", "hello 2", "hello 3", "hello 4")

@ Array(1, 2, 3) ++ Array(4, 5, 6)
res2: Array[Int] = Array(1, 2, 3, 4, 5, 6)
```

### Transforms

``` scala
@ val a = Array(1, 2, 3, 4, 5)
a: Array[Int] = Array(1, 2, 3, 4, 5)

@ a.map(i => i * 2)
res1: Array[Int] = Array(2, 4, 6, 8, 10)

@ for (i <- a) yield i * 2
res2: Array[Int] = Array(2, 4, 6, 8, 10)

@ a.filter(i => i % 2 == 1)
res3: Array[Int] = Array(1, 3, 5)

@ for (i <- a; if i % 2 == 1) yield i
res4: Array[Int] = Array(1, 3, 5)
```

``` scala
@ a.take(2)
res5: Array[Int] = Array(1, 2)

@ a.drop(2)
res6: Array[Int] = Array(3, 4, 5)

@ a.slice(1, 4)
res7: Array[Int] = Array(2, 3, 4)
```

``` scala
@ Array(1, 2, 2, 3, 3, 3, 4, 4, 5).distinct
res8: Array[Int] = Array(1, 2, 3, 4, 5)
```

### Queries

``` scala
@ Array(1, 2, 3, 4, 5, 6, 7).find(i => i % 2 == 0 && i > 4)
res0: Option[Int] = Some(6)

@ Array(1, 2, 3, 4, 5, 6, 7).find(i => i % 2 == 0 && i > 10)
res1: Option[Int] = None

@ Array(1, 2, 3, 4, 5, 6, 7).find(i => i % 2 == 0 && i > 2)
res2: Option[Int] = Some(4)

@ Array(1, 2, 3, 4, 5, 6, 7).exists(x => x > 1)
res3: Boolean = true

@ Array(1, 2, 3, 4, 5, 6, 7).exists(_ < 0)
res4: Boolean = false
```

### Aggregations

mkString

``` scala
@ Array(1, 2, 3, 4, 5).mkString(",")
res0: String = "1,2,3,4,5"

@ Array(1, 2, 3, 4, 5).mkString("[", ",", "]")
res1: String = "[1,2,3,4,5]"
```

foldLeft

``` scala
@ Array(1, 2, 3, 4, 5).foldLeft(0)((x, y) => x + y)
res2: Int = 15

@ Array(1, 2, 3, 4, 5).foldLeft(1)((x, y) => x * y)
res3: Int = 120

@ Array(1, 2, 3, 4, 5).foldLeft(1)(_ * _)
res4: Int = 120

@ {
    var total = 0
    for (i <- Array(1, 2, 3, 4, 5)) total += i
    total
  }
total: Int = 15
```

groupBy

``` scala
@ val grouped = Array(1, 2, 3, 4, 5, 6, 7).groupBy(_ % 2)
grouped: Map[Int, Array[Int]] = Map(0 -> Array(2, 4, 6), 1 -> Array(1, 3, 5, 7))

@ grouped(0)
res6: Array[Int] = Array(2, 4, 6)

@ grouped(1)
res7: Array[Int] = Array(1, 3, 5, 7)
```

### Converters

`Array` 使用 `to` 方法可以转化为其他集合类型比如 `Vector`, `Set`

``` scala
@ Array(1, 2, 3).to(Vector)
res0: Vector[Int] = Vector(1, 2, 3)

@ Vector(1, 2, 3).to(Array)
res1: Array[Int] = Array(1, 2, 3)

@ Array(1, 2, 2, 3, 3, 3).to(Set)
res2: Set[Int] = Set(1, 2, 3)
```

### Views

使用 `view` 和 `to` 避免链式操作产生的临时中间结果，提高效率。

``` scala
@ val a = Array(1, 2, 3, 4, 5, 6, 7, 8, 9)
a: Array[Int] = Array(1, 2, 3, 4, 5, 6, 7, 8, 9)

@ a.map(x => x + 1).filter(x => x % 2 == 0).slice(1, 3)
res1: Array[Int] = Array(4, 6)

@ a.view.map(_ + 1).filter(_ % 2 == 0).slice(1, 3).to(Array)
res2: Array[Int] = Array(4, 6)
```

### Immutable Vectors

`Vector` 是定长，不可变的序列，对更新，增加，减少元素都会生成一个新的 `Vector`。

`Vector` 数据结构的实现是通过树结构去做的，因此其操作的复杂度大多是 O(log n)，即树的高度。

当对 `Vector` 进行更新时，新的 `Vector` 会和旧 `Vector` 共享没有改变的树节点，只生成改变的树节点。

``` scala
@ val v = Vector(1, 2, 3, 4, 5)
v: Vector[Int] = Vector(1, 2, 3, 4, 5)

@ v(0)
res1: Int = 1

@ val v2 = v.updated(2, 10)
v2: Vector[Int] = Vector(1, 2, 10, 4, 5)

@ v2
res3: Vector[Int] = Vector(1, 2, 10, 4, 5)

@ v
res4: Vector[Int] = Vector(1, 2, 3, 4, 5)

@ val v3 = v :+ 1
v3: Vector[Int] = Vector(1, 2, 3, 4, 5, 1)

@ v3
res6: Vector[Int] = Vector(1, 2, 3, 4, 5, 1)

@ v
res7: Vector[Int] = Vector(1, 2, 3, 4, 5)

@ val v4 = 6 +: v
v4: Vector[Int] = Vector(6, 1, 2, 3, 4, 5)

@ v4
res9: Vector[Int] = Vector(6, 1, 2, 3, 4, 5)

@ v
res10: Vector[Int] = Vector(1, 2, 3, 4, 5)

@ val v5 = v.tail
v5: Vector[Int] = Vector(2, 3, 4, 5)

@ v5
res12: Vector[Int] = Vector(2, 3, 4, 5)

@ v
res13: Vector[Int] = Vector(1, 2, 3, 4, 5)
```

### Immutable Sets

`Set` 是一个由无序、不重复的元素组成的集合，其大多操作是 O(log n) 的。

``` scala
@ val s = Set(1, 2, 3)
s: Set[Int] = Set(1, 2, 3)

@ s.contains(2)
res1: Boolean = true

@ s.contains(4)
res2: Boolean = false

@ val s2 = s + 4 + 5
s2: Set[Int] = HashSet(5, 1, 2, 3, 4)

@ s2
res4: Set[Int] = HashSet(5, 1, 2, 3, 4)

@ s
res5: Set[Int] = Set(1, 2, 3)

@ val s3 = s - 2
s3: Set[Int] = Set(1, 3)

@ val s4 = s ++ Set(2, 3, 4)
s4: Set[Int] = Set(1, 2, 3, 4)
```

### Immutable Maps

`Map` 是一个由无序的 key-value 组成的集合，其大多操作是 O(log n) 的。

``` scala
@ val m = Map("one" -> 1, "two" -> 2, "three" -> 3)
m: Map[String, Int] = Map("one" -> 1, "two" -> 2, "three" -> 3)

@ m.contains("two")
res1: Boolean = true

@ m("two")
res2: Int = 2

@ m.get("one")
res3: Option[Int] = Some(1)

@ m.get("four")
res4: Option[Int] = None

@ Vector(("one", 1), ("two", 2), ("three", 3)).to(Map)
res5: Map[String, Int] = Map("one" -> 1, "two" -> 2, "three" -> 3)

@ Map[String, Int]() + ("one" -> 1) + ("three" -> 3)
res6: Map[String, Int] = Map("one" -> 1, "three" -> 3)

@ for ((k, v) <- m) println(k + " " + v)
one 1
two 2
three 3
```

### Immutable Lists

单向列表，以 `Nil` 结尾。

取头节点，在列表头端增加元素等操作，复杂度为 O(1)；根据下标取值，在列表尾端增加元素等操作复杂度为 O(n)。

``` scala
@ val l = List(1, 2, 3, 4, 5)
l: List[Int] = List(1, 2, 3, 4, 5)

@ l.head
res1: Int = 1

@ val lt = l.tail
lt: List[Int] = List(2, 3, 4, 5)

@ val l2 = 0 :: l
l2: List[Int] = List(0, 1, 2, 3, 4, 5)

@ val l3 = -1 :: l
l3: List[Int] = List(-1, 1, 2, 3, 4, 5)

@ l(0)
res5: Int = 1

@ List(1, 2) ::: List(2, 3)
res6: List[Int] = List(1, 2, 2, 3)

@ List(1, 2, 3) ++ Set(5, 6, 7)
res7: List[Int] = List(1, 2, 3, 5, 6, 7)
```

### Mutable ArrayDeques

``` scala
@ val ad = collection.mutable.ArrayDeque(1, 2, 3, 4, 5)
ad: collection.mutable.ArrayDeque[Int] = ArrayDeque(1, 2, 3, 4, 5)

@ ad.removeHead()
res1: Int = 1

@ ad.append(6)
res2: collection.mutable.ArrayDeque[Int] = ArrayDeque(2, 3, 4, 5, 6)

@ ad.removeHead()
res3: Int = 2

@ ad
res4: collection.mutable.ArrayDeque[Int] = ArrayDeque(3, 4, 5, 6)
```

### Mutable Sets

``` scala
@ val s = collection.mutable.Set(1, 2, 3)
s: collection.mutable.Set[Int] = HashSet(1, 2, 3)

@ s.contains(2)
res1: Boolean = true

@ s.contains(4)
res2: Boolean = false

@ s.add(4)
res3: Boolean = true

@ s.remove(1)
res4: Boolean = true

@ s
res5: collection.mutable.Set[Int] = HashSet(2, 3, 4)
```

### Mutable Maps

``` scala
@ val m = collection.mutable.Map("one" -> 1, "two" -> 2, "three" -> 3)
m: collection.mutable.Map[String, Int] = HashMap("two" -> 2, "three" -> 3, "one" -> 1)

@ m.remove("two")
res1: Option[Int] = Some(2)

@ m("five") = 5

@ m
res3: collection.mutable.Map[String, Int] = HashMap("five" -> 5, "three" -> 3, "one" -> 1)

@ m.getOrElseUpdate("three", -1)
res4: Int = 3

@ m
res5: collection.mutable.Map[String, Int] = HashMap("five" -> 5, "three" -> 3, "one" -> 1)

@ m.getOrElseUpdate("four", -1)
res6: Int = -1

@ m
res7: collection.mutable.Map[String, Int] = HashMap("five" -> 5, "three" -> 3, "four" -> -1, "one" -> 1)
```

### Range

``` scala
@ 1 to 5
res0: Range.Inclusive = Range(1, 2, 3, 4, 5)

@ 1 until 6
res1: Range = Range(1, 2, 3, 4, 5)

@ 1 to 10 by 2
res2: Range = Range(1, 3, 5, 7, 9)
```

### 与 Java 的集合互相转换

``` scala
@ import scala.collection.JavaConverters._
import scala.collection.JavaConverters._

@ val sl = List(1, 2, 3, 4)
sl: List[Int] = List(1, 2, 3, 4)

@ val jl = sl.asJava
jl: java.util.List[Int] = SeqWrapper(List(1, 2, 3, 4))

@ val sll = jl.asScala
sll: collection.mutable.Buffer[Int] = Buffer(1, 2, 3, 4)

@ var slll = sll.toList
slll: List[Int] = List(1, 2, 3, 4)
```

## 流程控制

### 分支

``` scala
if () {

} else if () {

} else {

}
```

`if-else` 可以被当作表达式

``` scala
val a = if (true) 1 else 2
```

### for

``` scala
@ val a = Array(1, 2, 3, 4)
a: Array[Int] = Array(1, 2, 3, 4)

@ for (i <- a) println(i)
1
2
3
4
```

``` scala
@ for (i <- Range(0, 5)) println(i)
0
1
2
3
4
```

``` scala
for (a <- 1 to 10) {
    println( "Value of a: " + a );
}


for (a <- 1 until 10) {
    println( "Value of a: " + a );
}
```

遍历嵌套数组

``` scala
@ val aas = Array(Array(1, 2, 3), Array(4, 5, 6))
aas: Array[Array[Int]] = Array(Array(1, 2, 3), Array(4, 5, 6))

@ for (a <- aas) {
      for (i <- a) {
          println(i)
      }
  }
1
2
3
4
5
6

// 可以将不同层循环写在一起
@ for (a <- aas; i <- a) println(i)
1
2
3
4
5
6

// 如果想分开不同行，可以用 for {}
@ for {
  a <- aas
  i <- a
} println(i)
1
2
3
4
5
6
```

可以使用 `if` 过滤元素

``` scala
@ val aas = Array(Array(1, 2, 3), Array(4, 5, 6))
aas: Array[Array[Int]] = Array(Array(1, 2, 3), Array(4, 5, 6))

@ for (a <- aas; i <- a; if i % 2 == 0) println(i)
2
4
6
```

### for yield

`for` 搭配 `yield` 可以方便的根据已有 collection 生成新的 collection

``` scala
@ val a = Array(1, 2, 3, 4)
a: Array[Int] = Array(1, 2, 3, 4)

@ var b = Array("hello", "world")
b: Array[String] = Array("hello", "world")

@ val aa = for (i <- a) yield i * i
aa: Array[Int] = Array(1, 4, 9, 16)

@ var ab = for (i <- a; j <- b) yield i + j
ab: Array[String] = Array("1hello", "1world", "2hello", "2world", "3hello", "3world", "4hello", "4world")

@ val c = for (i <- a if i % 2 == 0) yield i
c: Array[Int] = Array(2, 4)
```

## 函数

### 基本使用

``` scala
// 函数定义，`=` 后可以为「块定义」或「表达式」
@ def f(x: Int) = { x * x }
defined function f

@ def y() = println("fun y")
defined function y

// 调用函数
@ f(2)
res71: Int = 4

// 可以显式的指定传递的参数
@ f(x = 3)
res72: Int = 9

// 单个参数的函数可以使用 {} 调用
@ f{4}
res73: Int = 16

// 无参数的函数调用可以省略括号
@ y
fun y
```

函数定义可以指定参数默认值

``` scala
@ def f2(x: Int = 5)  = { x * x }
defined function f2

@ f2(x = 4)
res75: Int = 16

@ f2()
res76: Int = 25
```

### lambda 表达式

使用 `=>` 也可以定义函数

``` scala
@ def y = (x: Int) => x + 1
defined function y

@ y(1)
res81: Int = 2
```

进一步，不使用 `def` 语法

``` scala
@ var g: Int => Int = i => i + 1
g: Int => Int = ammonite.$sess.cmd90$$$Lambda$2011/1255692518@3b53625

@ g(10)
res91: Int = 11

@ g = i => i * 2

@ g(10)
res93: Int = 20
```

像 `g = i => i * 2` 这类表达可以进一步简化：

``` scala
@ g = _ * 3

@ g(3)
res95: Int = 9
```

``` scala
@ var h = (x: Int, y: Int) => x * y
h: (Int, Int) => Int = ammonite.$sess.cmd96$$$Lambda$2028/692250571@1e400e08

@ h(2, 3)
res97: Int = 6

@ h = _ + _


@ h(2, 3)
res99: Int = 5
```

块风格的匿名函数

``` scala
@ def compose(g: Int => Int, h: Int => Int) = (x: Int) => g(h(x))
defined function compose

@ val f = compose({_ * 2}, {_ - 1})
f: Int => Int = ammonite.$sess.cmd82$$$Lambda$1988/1010757476@6811bfe3

@ f(1)
res85: Int = 0

@ f(3)
res86: Int = 4
```

### infix 写法

``` scala
// infix 写法
names foreach (n => println(n))
mames mkString ","
optStr getOrElse "<empth>"

class MyBool(x: Boolean) {
    def and(that: MyBool): MyBool = if (x) that else this
    def or(that: MyBool): MyBool = if (x) this else that
    def negate: MyBool = new MyBool(!x)

    def not(x: MyBool) = x negate; // semicolon required here
    def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
}

// 更多例子
5.+(3); 5 + 3
(1 to 5) map (_*2)

// 用空格代替 `.`
1 + 2 + 3
(1).+(2).+(3)
```

### call-by-value, call-by-name

函数定义可以分 2 种方式：
* call-by-value
* call-by-name

call-by-value 即调用函数时接受参数的值

``` scala
// 定义
def f(x: String) = println(x)

// 调用
f("hello")

// 即使传表达式，在传参前也会先求值
f("hello " + " world")
```

call-by-name 参数(`: => T`) 可以做到对参数的惰性计算(lazy parameters)，即实际使用时才计算参数的值。

``` scala
// 定义
def f(x: => R)
```

#### Avoiding Evaluation

``` scala
@ var logLevel = 1
logLevel: Int = 1

@ def log(level: Int, msg: => String) = {
    if (level > logLevel) println(msg)
  }
defined function log

@ log(2, "hello " + 123 + " world")
hello 123 world

@ logLevel = 3

@ log(2, "hello " + 123 + " world")
```

#### Wrapping Evaluation

#### Repeating Evaluation

### Implicit Parameters

隐式参数通过 `implicit` 定义，当函数没有指定参数时，会在环境中找默认的实现。

``` scala
@ class Foo(val value: Int)
defined class Foo

@ def bar(implicit foo: Foo) = foo.value + 10
defined function bar

@ bar
cmd10.sc:1: could not find implicit value for parameter foo: ammonite.$sess.cmd8.Foo
val res10 = bar
            ^
Compilation Failed

@ implicit val foo: Foo = new Foo(1)
foo: Foo = ammonite.$sess.cmd8$Foo@3069a360

@ bar
res11: Int = 11

@ bar(foo)
res12: Int = 11
```

### currying

``` scala
// currying, obvious syntax.
@ var volume = (length: Int, width: Int) => (height: Int) => length * width * height
volume: (Int, Int) => Int => Int = ammonite.$sess.cmd0$$$Lambda$1330/1574029810@22875539

@ volume(2, 3)(4)
res1: Int = 24

// currying, obvious syntax
@ def volume2(length: Int, width: Int) = (height: Int) => length * width * height
defined function volume2

@ volume2(2, 3)(4)
res3: Int = 24

// currying, 语法糖，也叫参数分组
@ def volume3(length: Int, width: Int)(height: Int) = length * width * height
defined function volume3

@ volume3(2, 3)(4)
res5: Int = 24

// 固定前 2 个参数，需要尾部的下划线，仅限于参数分组
@ val normerSquare = volume3(5, 5) _
normerSquare: Int => Int = ammonite.$sess.cmd6$$$Lambda$1619/353296011@4e1ce44

@ normerSquare(5)
res7: Int = 125
```

``` scala
// 把一个有 n 个参数的函数变成只有一个参数的函数
def add(x: Int) = {
  (y: Int) => x + y
}

var increase = add(1)
var decrease = add(-1)

increase(1)
decrease(1)
```

``` scala
@ def log(a: Int)(b: String) = {
  println(a + b)
  }
defined function log

@ var l = log _
l: Int => String => Unit = ammonite.$sess.cmd1$$$Lambda$1349/803893384@61884cb1

@ var log1 = l(1)
log1: String => Unit = ammonite.$sess.cmd1$$$Lambda$1369/1906947271@226f885f

@ log1("a")
1a
```

### 可变参数

``` scala
def sum(args: Int*) = args.reduceLeft(_+_)

sum(1, 2, 3, 4)
```

###  闭包

``` scala
// 闭包
var x = 1
def fn(y: Int) = x + y

def fn(y: Int) = {
  var x = 1
  def fnn(z: Int) = {
    x + y + z
  }
}
```

###  偏函数

``` scala
// 偏函数
// Int => Int
@ def signal: PartialFunction[Int, Int] = {
  case 0 => 0
  case x if x > 0 => x - 0
  case x if x < 0 => x + 1
  }
defined function signal

@ signal(0)
res1: Int = 0

@ signal(1)
res2: Int = 1

@ signal(-1)
res3: Int = 0

@ signal(-2)
res4: Int = -1
```

## 对象

https://stackoverflow.com/questions/29207230/class-object-trait-sealed-trait-in-scala

### object

对象用 `object` 定义，其是单例对象，并且可以继承自 `trait` 或者 `class`

``` scala
trait Bird
object Duck extends Bird
```

对象分为 2 种：
1. 未关联到特定类的单例对象
2. 关联到一个类上的单例对象，与该类有相同的名字，这种对象称为伴生对象(companion object)，对应类称为伴生类。伴生类和伴生对象写在同一个文件中。伴生对象有以下作用：
    1. scala 没有静态成员，通过伴生对象完成类一级的属性和操作，伴生对象内部的属性和方法类似于 java 类中的 `Static` 属性或方法，可以直接调用
    2. 伴生对象与其伴生类可以互相访问对方的 `private` 属性和方法
        ``` scala
        class Dog(val name: String) {
          def eat(food: String) = {
            if (Dog.preferredFoods.contains(food)) {
              println(s"eat $food, yummy!")
            } else {
              println(s"eat $food")
            }
          }
        }

        object Dog {
          private val preferredFoods = List("Ribeye", "DogFood", "Banana")
          def walk(dog: Dog) = println(s"${dog.name} walking")
        }

        var d = new Dog("cat")

        d.eat("DogFood")

        Dog.walk(d)
        ```

### class

### trait

interface + abstract class

### sealed trait

`sealed trait` 只能被同文件内的 `class` 继承，因为只有固定数量的 `class` 继承自 `sealed trait`，因此适用于模式匹配。

``` scala
@ {
  sealed trait Point
  case class Point2D(x: Double, y: Double) extends Point
  case class Point3D(x: Double, y: Double, z: Double) extends Point
  }
defined trait Point
defined class Point2D
defined class Point3D

@ def hypotenuse(p: Point) = p match {
    case Point2D(x, y) => math.sqrt(x * x + y * y)
    case Point3D(x, y, z) => math.sqrt(x * x + y * y + z * z)
  }
defined function hypotenuse

@ val points: Array[Point] = Array(Point2D(1, 2), Point3D(4, 5, 6))
points: Array[Point] = Array(Point2D(1.0, 2.0), Point3D(4.0, 5.0, 6.0))

@ for (p <- points) println(hypotenuse(p))
2.23606797749979
8.774964387392123
```

### case class

定义 `case class` 会同时生成一个伴生对象，这个伴生对象中定义了 `apply` 与 `unapply` 方法

``` scala
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```

实例化 `case class` 时不需要使用关键字 `new`，这是因为 `case class` 的伴生对象实现了 `apply` 方法。

`case class` 实例化之后，属性是公共的(`public`), 不可变的(`val`)，因此不能对其属性重新赋值。

`case class` 支持模式匹配（`case`）

`case class` 在比较时是按值进行比较，而非按引用进行比较。

## package

``` scala
import scala.collection._     //通配符导入，类似java中的.*
import scala.collection.Vector
import scala.collection.{Vector, Sequence}     //导入多个
import scala.collection.{Vector => Vec28}     //别名.
import java.util.{Date => _, _}     //除了Date,其它都导入

package pkg at start of file
package pkg { ... }
```

### 访问范围

访问修饰符有 `private`, `protected`, `public`

没有指定访问修饰符，默认情况下访问级别是 `public`

可以通过限定词强调：

``` scala
// x 指某个所属的包、类或单例对象，表示这个成员处理对 x 中的类及它们的伴生对象可见外，对其他所有类都是 private
private[x]

//
protected[x]
```

## 下划线

与集合操作结合，简写 lambda 表达

``` scala
(1 to 5).map(_ * 2)
(1 to 5).reduceLeft(_ + _)
(1 to 5) filter {_ % 2 == 0} map {_ * 2}

(1 to 5).map(x => x * 2)
(1 to 5).reduceLeft((x, y) => x + y)
(1 to 5) filter {x => x % 2 == 0} map {x => x * 2}
```

赋值时代表默认值：

``` scala
var s: String = _
var f: Float = _
```

case 匹配时表示匹配任何：

``` scala
type Receive = PartialFunction[Any, Unit]

var receive: Receive = {
    case "hello" => println("hello")
    case "ok" => println("ok")
    case _ => println("default")
}
```

## 标识符

scala 可以使用一个或多个操作符作为标识符，如 `+=`, `++`, `--`, `++*` 等

## 关键字

``` scala
package, import, class, object, trait, extends, with, type, forSome

private, pretected, abstract, sealed, final, implicit, lazy, override

try, catch, finally, throw

if, else, match, case, do, while, for, return, yield

def, val, var

this, super

new

true, false, null
```
## apply, unapply

将对象以函数的方式进行调用时，scala 会隐式地将调用改为在对象上调用 `apply` 方法

``` scala
object Greeting {
    def apply(name: Sring) = "Hello " + name
}
// 以下行为等价
Greeting.apply("Bob")
Greeting("Bob")
```

scala 数组可以用 `var as = Array(1, 2)` 初始化，本质上是调用 Array 伴生对象对应的 apply 方法

``` scala
class Array() {

}

object Array {

  // Subject to a compiler optimization in Cleanup, see above.
  def apply(x: Int, xs: Int*): Array[Int] = {
    val array = new Array[Int](xs.length + 1)
    array(0) = x
    val iterator = xs.iterator
    var i = 1
    while (iterator.hasNext) {
      array(i) = iterator.next(); i += 1
    }
    array
  }
}

var as = Array(1, 2, 3);  // 这里其实调用了伴生对象的 apply
```

scala 数组使用 `()` 而不是 `[]` 访问元素，本质上是调用数组对象的 `apply` 方法，类似：

``` scala
class IndexedString(val str: String) {
  def apply(charIndex: Int) = str.charAt(charIndex)
}


val indexed = new IndexedString("Hello world")
indexed(0) //结果为H, 等价于indexed.apply(0)
```

- https://www.handsonscala.com/table-of-contents.html
