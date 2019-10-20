## 1. Intro Scala

`abstract class` 抽象类

`apply` 工程方法

`object` 单例

`case` 伴生对象

## 2. Type Less Do More

Scala 大部分变量事实上指向堆内存对象的引用，`var` 和 `val` 关键字只标识引用本身是否可以指向另一个不同的对象，它们并未表明其所引用的对象是否可变（类似指针常量`int * const p = &a`）

**指针常量`const int *p`**

---

**偏函数**（此处的偏函数和函数式编程中常用的偏函数的概念不同）表示它们并不处理所有可能的输入，而只处理那些能与至少有一个 `case` 语句匹配的输入。

`MatchError`

`orElse`

`isDefineAt`

---

`case` 自动创建的 `copy` 方法

---

隐含参数是用 `implicit` 关键字声明的参数，当相应方法被调用时，我们可以显式指定这个参数，或者也可以不指定，这时编译器会在当前作用域中找到一个合适的值作为参数。

隐含参数可以代替参数默认值，而且更加灵活。

只有由 `implicit` 关键字声明的，在当前作用域可见的对象才能用作隐含值；只有被声明为 `implicit` 的函数参数才允许调用时不给出实参，而采用隐含的值。

---

Scala 采用的是局部作用域类型推断，无法推断出递归函数的返回类型。

尾递归一词，表示调用递归函数是该函数中最后一个表达式，该表达式的返回值就是所调用的递归函数的返回值。

`tailrec` 可以标记在你认为是尾递归的递归函数中，如果编译器无法对它做尾递归优化，系统将抛出异常。

---

Tuple 计数从 1 开始

``` scala
(1, "one")

1 -> "one"
```

---

`Any`

`Unit` 相当于 `void`

* `Option`: 抽象类
    * `Some`
    * `None`

由于 `Map.get` 返回了 `Option`，这明显告诉读者 `Map` 中有可能找不到指定的 key，这时会返回 `None`

`Option` 只有两个有效的子类，如果有值，则对应 `Some` 子类，如果没有值，则对应 `None` 子类，没有其他有效的 `Option` 子类型，可以防止用户创建一个他们自己的子类。

``` scala
sealed abstract class Option[+A] ... { ...  }
```

`sealed` 告诉编译器，所有的子类必须在同一个源文件中声明。

`final` 防止用户派生任何子类

---

Scala 不允许在脚本中定义包，脚本被隐含包装在一个对象中。在对象中声明包是不允许的（同样，在类或对象中定义包都不被允许，而且也没有意义）

---

`import` 语句几乎可以放在任何位置上，所以你可以将其可见性限制在需要的作用域中，可以在导入时对类型做重命名，也可以限制不想要的类型的可见性。

``` scala
import java.math.BigInteger.{
    ONE => _, // 限制可见性
    TEN,
    ZERO => JAVAZERO // 重命名
}
```

---

参数化类型（泛型）

``` scala
val strings: List[String] = List("one", "two", "three")
```

协类型：A 之前的 + 表示，如果 B 是 A 的子类，则 List[B] 也是 List[A] 的子类型，这被称为协类型。

``` scala
List[+A]
```

逆类型：A 之前的 - 表示，如果 B 是 A 的子类型，且 Foo[A] 被声明为 Foo[-A]，则 Foo[B] 是 Foo[A] 的父类型。

``` scala
List[-A]
```

---

## 3. 要点详解(Rounding)


所有的操作符都是方法。使用中缀表示法表示单参数方法时，其中的点号和括号可以省略。

``` scala
1 + 2

1.+(2)
```

调用无参数方法时也可以省略点号(后缀表示法)(可选特性)

---

无参数方法：我们在定义无参数方法时可以省略括号，一旦定义无参数方法时省略了括号，那么在调用这些方法时必须省略括号；与之相反，假如在定义无参方法时添加了空括号，那么调用方可以选择省略或保留括号。

``` scala
List.size

List(1, 2, 3).size
List(1, 2, 3).size() // 报错
```

社区习惯：定义那些无副作用的无参方法时省略括号（例如：集合的 `size` 方法）；定义有副作用的方法时则添加括号。

``` scala
def isEven(n: Int) = (n % 2) == 0


List(1, 2, 3, 4).filter((i: Int) ->  isEven(i)).foreach((i: Int) => println(i))
List(1, 2, 3, 4).filter(i => isEven(i)).foreach(i => println(i))
List(1, 2, 3, 4).filter(isEven).foreach(println)
List(1, 2, 3, 4) filter isEven foreach println
```

---

在 Scala 中，任何名字以 `:` 结尾的方法都与右边的对象绑定，其他方法都是左绑定的。

``` scala
val list = List('b', 'c', 'd')
// List[Char] = List(b, c, d)

'a' :: list
// List[Char] = List(a, b, c, d)

// 等价于

list.::('a')
```

---

Scala 中的 `if` 语句和几乎所有的其他语句都是具有返回值的表达式。

``` scala
val configFile = new java.io.File("somefile.txt")

val configFilePath = if (configFile.exists()) {
        configFile.getAbsolutePath()
    } else {
        configFile.createNewFile()
        configFile.getAbsolutePath()
    }
```

---

``` scala
for (i <- 1 to 10) println(i)

for (i <- 1 to 10 if i % 2 == 0) println(i)

for (i <- 1 to 10 if i % 2 == 0) yield i

for {
    i <- 1 to 10
    if i % 2 == 0
    j = i * i
} yield j
```

---

Scala 的 `for` 推导式并不提供 `break` 和 `continue` 功能。

---

Scala 将反射列为可选特性，使用需要在代码中添加 `import` 语句

``` scala
import scala.language.reflectiveCalls
```

---

`<:` 表示 `A` 是 `B` 的子类型

``` scala
A <: B
```

---

传名参数(by-name parameter)：`(conditional: => Boolean)`

``` scala
// src/main/scala/progscala2/rounding/call-by-name.sc

@annotation.tailrec                                                  // <1>
def continue(conditional: => Boolean)(body: => Unit) {               // <2>
  if (conditional) {                                                 // <3>
    body                                                             // <4>
    continue(conditional)(body)
  }
}

var count = 0                                                        // <5>
continue(count < 5) {
  println(s"at $count")
  count += 1
}
```

---

惰性赋值：求值只会在需要时进行，而且只执行一次（因此 `lazy` 不会修饰 `var`，只会修饰 `val`）

``` scala
// src/main/scala/progscala2/rounding/lazy-init-val.sc

object ExpensiveResource {
  lazy val resource: Int = init()
  def init(): Int = {
    // do something expensive
    0
  }
}

```

`trait`

`with`

`override`

---

## 4. PatternMatching

当尝试去匹配一个没有 `case` 语句的值时，编译前抛出 `MatchError`

---

编写 `case` 字句时，有一些规则和陷阱需要注意：在被匹配或提取的值中，编译器假定以大写字母开头的为类型名，以小写字母开头的为变量名

在 `case` 字句中，以小写字母开头的标识符被认为时用来提取待匹配值的新变量。如果需要引用之前已经定义的变量时，应使用反引号将其包围。与此相对，以大写字母开头的标识符被认为是类型名称。

---

`Seq`: `+:`, `::`

---

`Nil` 对象可以匹配所有的空序列

---

`List` 和 `Vecotr` 是 `Seq` 的子类型

---

`case class`:
1. 生成伴生对象
2. 生成 `apply` 和 `upapply` 方法

`case class` 类的特性就是为了更便捷的进行模式匹配而设计的。

---

包含有两个类型参数的类型可以写为中缀表达式。

Scala 库定义了一个特殊的单例对象，名为 `+:`，这个类型只有一个方法，即编译器用来在 `case` 语句中进行提取操作的 `unapply` 方法

``` scala
def unapply[T, Coll](collection: Coll): Option[(T, Coll)]
```

``` scala
case head +: tail => ....

case +:.unapply()

case +:(head, tail) => ...
```

---

`:+`

---

除了 `apply` 方法以外，`Seq` 的伴随对象还实现了 `unapplySeq` 方法，而不是普通伴随对象的 `unapply` 方法：

---

匹配可变参数列表的语法 `name @ _*`

---

`case` 语句中的变量绑定 `name @ pattern`

---

在父类型中，不带参数的抽象方法可以在子类中用 `val` 变量实现

---

## 5. Implicits

使用 `implicit` 关键字标记那些用户无需显式提供的方法参数，调用方法时，如果未输入隐式参数且代码所处作用域中存在类型兼容值时，类型兼容值会从作用域中调用并被使用，反之，系统将会抛出编译器错误。

---

隐式证据

`<:<`：`A <:< B` 代表 `A` 必须 `A <: B`

`=:=`

---

* 隐式方法
* 隐式值
* 隐式类

---

`@inline`

`@noinline`

## 6. FP

**纯函数**：在数学里，函数没有副作用。以下是经典的 `sin(x)` 函数：

```
y = sin(x)
```

无论 `sin(x)` 做了多少计算，它的所有结果都是函数返回并赋值给了 `y`。在 `sin(x)` 内部，没有任何全局状态被修改。这样，我们就称改函数是无副作用函数，即纯函数。

---

当一个函数采用其他函数作为变量或返回值时，它被称为**高阶函数**。在数学里，微积分中有两个高阶函数的例子————微分和积分。

---

不可变变量

---

线程安全，透明引用

---

在尾递归中，函数可以调用自身，并且该调用时函数的最后一个（“尾部”）操作。

---

**偏应用函数**表示表达式中使用了函数，但并未给出所需的所有参数列表。所以，系统返回了一个新的函数，该函数的参数列表是原函数中没有给出的剩下的那部分参数列表。

``` scala
def cat1(s1: String)(s2: String) = s1 + s2

val hello = cat1("hello ") _
```

---

**偏函数**带一个某类型参数，但函数并未对该类型的所有值实现相应处理逻辑。

---

Curry 将一个带有多参数的函数转换为一系列函数，每个函数都只有一个参数。

``` scala
def cat2(s1: String) = (s2: String) => s1 + s2

val hello2 = cat2("hello ")
```

---

`::`：在 `List` 头部添加

`Nil` `List.empty[Nothing]`

`++`：连接两个序列 `Seq`

`+:`：在 `Seq` 头部追加元素

`:+`：在 `Seq` 尾部追加元素

*`:`总是靠近集合类型*

---

`#::`

---

左方向递归式尾递归，右方向递归则可以提前截断，以处理无限长的、需要惰性求值的数据流。

---

## 7. Forcomps


## 8. Scala 面向对象编程

`final`：避免从一个类中派生出其他类

`abstract`：阻止类的实例化

一个实例可以用 `this` 关键字指代它本身

---

**方法重载** 需要方法的完整签名唯一，签名包含返回类型，方法名称和参数类型的列表（参数的名称不重要）

---

如果一个对象和一个类具有相同的名称，并在同一文件中定义，他们的关系就是伴随的。

---

所有引用类型都是 `AnyRef` 的子类型。`AnyRef` 是 `Any` 的子类型，而 `Any` 是 Scala 类型层次的根类型。

所有值类型均是 `AnyVal` 的子类型，`AnyVal` 也是 `Any` 的子类型。

`Any` 仅有 `AnyRef` 和 `AnyVal` 这两个直接的子类型。

---

用带 `apply` 方法的对象创建引用类型的实例是很常见的做法，`apply` 方法起到工厂的作用（这种方法必须在内部调用 `new` 或对应的字面量语法）

---

`Short`, `Int`, `Long` `Float`, `Double`, `Boolean`, `Char`, `Byte` 和 `Unit` 类型称为值类型，分别对应 JVM 的原型 `short`, `int`, `long`, `float`, `double`, `boolean`, `char`, `byte` 和 `void` 关键字。

---

如果不指定父类，默认父类是 `AnyRef`

---

主构造器，次级构造器，辅助构造器

---

编译器不会自动为 `case` 类的次级构造器创建 `apply` 方法

---

``` scala
class Name(var value: String)

// 等价于

class Name(s: String) {
  private var _value: String = s
  def value: String = _value
  def value_=(newValue: String): Unit = _value = newValue
}
```

---

对于非 `case` 类，如果我们向构造器传递参数时不希望参数成为类的字段，可以在构造器中省略 `val` 或 `var`

---

一元方法

``` scala
case class Complex(real: Double, imag: Double) {
  def unary_- : Complex = Complex(-real, imag)
  def -(other: Complex) = Complex(real - other.real, imag - other.image)
}


val c1 = Complex(1.1, 2.2)
val c2 = -c1
val c3 = c1.unary_-
val c4 = c1 - Complex(0.5, 1.0)
```

---

`Predef` `require` `ensuring` `assume`

---

派生类的主构造器必须调用父类的构造器，可以是父类的主构造器或次级构造器。

``` scala
ChildClass(...) extends ParentClass(...)
```

尽管像在 Java 中一样，`super` 可以用来调用被覆盖的父类方法，但它不能用来调用父类的构造器。

---

我们可以从一个 `case` 类派生出一个非 `case` 类，或者反过来，但是我们无法从一个 `case` 类派生出另一个 `case` 类。这是因为，自动生成的 `toString`, `equals` 和 `hashCode` 方法在子类中无法正常工作。

---

## 10. Scala 对象系统（1）

参数化类型（泛型）

协变：`List[T_sub]` 是 `List[T]` 的子类
逆变：`List[T^sup]` 是 `List[T]` 的子类
非转换继承：不能用 `List[T_sub]` 或 `List[T^sup]` 替代 `List[T]`

---

匿名函数是 `FunctionN` ( N 是一个介于 0 和 22 之间的数字) 的匿名子类

``` scala
List(1, 2, 3, 4) map (i => i + 3)


val f: Int => Int = new Function1[Int, Int] {
    def apply(i: Int): Int = i + 3
}
List(1, 2, 3, 4) map (f)
```

---

``` scala
package scala
abstract final class Null extends AnyRef
```

``` scala
package scala
abstract final class Nothing extends Any
```

``` scala
package scala.collection.immutable
object Nil extends List[Nothing] with Product with Serializable
```

---

``` scala
package scala

object Predef {
    def ??? : Nothing = throw new NotImplementedError
}
```

---

所有 `TupleN` 类型都继承了对应的 `ProductN` 特征，并提供了 `_1` 到 `_N` 方法的具体实现，`N` 最大可为 22

``` scala
package scala

trait Product2[+T1, +T2] extends Product {
    abstract def _1: T1
    abstract def _2: T2
}
```

---

`hashCode`

`equals`

`==` `!=`

`eq` `ne`

`sameElements`

---

## 17. Concurrency

`scala.sys.process`

---

`Future`

---

`Async`

``` scala
def async[T](body: => T): Future[T]

def await[T](future: Future[T]): T
```

---

`Actor`

## 20. DSL


## 其他

`unit` 字面量 `()`


