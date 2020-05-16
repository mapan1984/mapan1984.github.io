## 安装

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

// 常量
val y: Int = 2

// 类型推断(类型可省略)
var z = 3
```

## 函数

1. Lambda Function
2. Closure
3. Partial Function
4. Higher-order Function

``` scala
// 函数定义，`=` 后可以为「块定义」或 「表达式」
def f(x: Int) = { x * x }
def y(x: Int) = x + 1

// 调用函数
f(2)
f  // 无参数的函数调用可以省略括号

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

// call-by-value
def f(x: R)
// call-by-name(lazy parameters)
def f(x: => R)

// lambda 表达式
def y = (x: Int) => x + 1
(x: Int) => x + 1

// 块风格的匿名函数
def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))
val f = compose({_*2}, {_-1})

val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd     //currying, obvious syntax.
def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd     //currying, obvious syntax
def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd       //currying, 语法糖，也叫参数分组. 但是必须按照下面的语法调用:
val normer = zscore(7, 0.4)_         //需要尾部的下划线，仅限于上面一行的语法糖

// 可变参数
def sum(args: Int*) = args.reduceLeft(_+_)

// 闭包
var x = 1
def fn(y: Int) = x + y

def fn(y: Int) = {
  var x = 1
  def fnn(z: Int) = {
    x + y + z
  }
}

// 偏函数
Int => Int
def signal: PartialFunction[Int, Int] = {
  case 0 => 0
  case x if x > 0 => x - 0
  case x if x < 0 => x + 1
}

def add1(x: Int) = x + 1

// 柯里化
// 把一个有 n 个参数的函数变成只有一个参数的函数
def add(x: Int) ={
  (y: Int) => x + y
}

var inc = add(1)
var dev = add(-1)

inc(1)
dev(1)

// 偏函数
// 固定了函数的某一个或几个参数，返回一个新的函数，
// 接收剩下的参数
def add(x: Int, y: Int, z: Int) = x + y + z

var addBySeven = Partial(Add, 7)

addBySeven(5, 10) // return 22



///
def log(a: Int)(b: String) = {
  println(a + b)
}
// Int => String => Unit
var l = log _
// String => Unit
var log1 = l(1)
log1("a")
```

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

## 集合/容器

Traversable
|
Iterable
|
Seq                   Set                 Map
|                     |                   |
IndexSeq LinearSeq    SortedSet BitSet    SortedMap


``` scala
// tuple
(1, 2, 3)
var (x, y, z) = (1, 2, 3)


// list
1::List(2, 3)
List(1, 2) ::: List(2, 3)
List(1, 2, 3) ++ Set(5, 6, 5)

// set
Set(1, 2, 3)


Map("a" -> 1)

// rage
1 to 5 same as 1 until 6
1 to 10 by 2

// 容器
// Option[T] => Some(value) => None
val a: Option[String] = Option("Hello world")
a.getOrElse("default value")

val b = None
b.getOrElse("default value")


// 与 Java 的集合互换
import scala.collection.JavaConverters

val sl = List(1, 2, 3, 4)
val jl = sl.asJava

val sll = jl.asScala
val slll = sll.toList

// compose

```

### 下划线

``` scala
// 替代
(1 to 5).map(_*2)
(1 to 5).reduceLeft( _+_ )


(1 to 5).map(2*)
(1 to 5).map(2* _)

(1 to 5).map { val x=_*2; println(x); x }
(1 to 5) filter {_%2 == 0} map {_*2}

```
