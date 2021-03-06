---
title: 构建 Java 项目（不使用构建工具/IDE）
tags: [Java]
---

## JDK 与 JRE

JRE (Java Runtime Environment) 是运行 Java 字节码的虚拟机(JVM + Runtime Library)，JDK (Java Development Kit) 包含了 JRE 与编译器，调试器等开发工具。

在安装 Java 之后，在 `JAVA_HOME` 的 `bin` 目录下可以找到 Java 开发相关的工具：
* `java`(JVM)：启动 JVM，并让 JVM 执行指定的字节码
* `javac`(compiler)：将 Java 源码文件(`.java`)编译为 Java 字节码文件(`.class`)
* `jar`：把一组 `.class` 文件打包成一个 `.jar` 文件
* `javadoc`：从 Java 源码中自动提取注释并生成文档
* `jdb`：Java 调试器

### classpath

classpath 是 JVM 搜索 .class 文件或者其他资源的路径列表(目录、jar 包、zip 包)，默认为当前目录(`.`)，可以通过 `-cp` 参数进行设置：

    javac -cp .:xxx.jar Main.java

    java -cp .:xxx.jar Main

### javac

    javac <options> <source files>

options:
* `-d`：编译时根据 package 名生成目录结构，将编译好的 .class 文件放到匹配的目录下
* `-cp`/`-classpath`: 指定 classpath

### java

execute a class

    java [-options] class [args...]

execute a jar file

    java [-options] -jar jarfile [args...]

options:
* `-D`: 指定 property，例如：

        java -Dtest="true" -jar myApplication.jar

    ``` java
    if ("true".equalsIgnoreCase(System.getProperty("test"))) {
       //Do something
    }
    ```

* `-server`:

        -server       to select the "server" VM
                      The default VM is server,
                      because you are running on a server-class machine.

* `-cp`/`-classpath`: 指定 class path

示例：

``` bash
java \
    -Xmx1024m \
    -server \
    -Datlas.log.dir=/var/log/myapp/logs \
    -Datlas.log.file=application.log \
    -classpath .:./lib/*:./classes:./conf \
    io.myapp.Main \
    [args...]
```

### jar

jar 文件(Java Archive)其实是一个 zip 格式的压缩文件，目的是将一个 package 各目录下的 .class 文件和资源文件打包为一个文件，方便分发和使用。

把 jar 包添加到 classpath 中，JVM 可以在动在 jar 包中搜索使用到的类。

jar 包中可以包含 `/META-INF/MANIFEST.MF` 文件，通过这个文件指定 `Main-Class` 后，JVM 会启动 `Main-Class` 指定的类。

Usage:

    jar {ctxui}[vfmn0PMe] [jar-file] [manifest-file] [entry-point] [-C dir] files ...

Options:

    -c  create new archive
    -t  list table of contents for archive
    -x  extract named (or all) files from archive
    -u  update existing archive
    -v  generate verbose output on standard output
    -f  specify archive file name
    -m  include manifest information from specified manifest file
    -n  perform Pack200 normalization after creating a new archive
    -e  specify application entry point for stand-alone application
        bundled into an executable jar file
    -0  store only; use no ZIP compression
    -P  preserve leading '/' (absolute path) and ".." (parent directory) components from file names
    -M  do not create a manifest file for the entries
    -i  generate index information for the specified jar files
    -C  change to the specified directory and include the following file


示例：

    If any file is a directory then it is processed recursively.
    The manifest file name, the archive file name and the entry point name are
    specified in the same order as the 'm', 'f' and 'e' flags.

    Example 1: to archive two class files into an archive called classes.jar:
           jar cvf classes.jar Foo.class Bar.class

    Example 2: use an existing manifest file 'mymanifest' and archive all the
               files in the foo/ directory into 'classes.jar':
           jar cvfm classes.jar mymanifest -C foo/ .

    解压：
           jar -xf

## 示例

### 运行单个无依赖文件

``` java
// Hello.java
public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
```

javac 编译：

    $ javac Hello.java

java 运行：

    $ java Hello
    Hello, World!

增加 package 名

``` java
// Hello.java
package io.github.mapan1984;

public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
```

增加 package 名后，用 javac 编译时使用 `-d` 参数生成符合 package 路径的目录：

    $ javac -d . Hello.java

java 运行：

    $ java io.github.mapan1984.Hello
    Hello, World!

### 增加依赖关系

``` java
// Greet.java
package io.github.mapan1984;

public class Greet {
  public void greet(String name) {
    System.out.println("Hello, " + name + "!");
  }
}
```

``` java
// Hello.java
package io.github.mapan1984;

public class Hello {
  public static void main(String[] args) {
    Greet greet = new Greet();
    greet.greet("World");
  }
}
```

    $ javac -d . Hello.java Greet.java

    $ java io.github.mapan1984.Hello
    Hello, World!

### 组织项目结构

``` bash
$ tree .
.
├── lib
├── resources
├── src
│   └── io
│       └── github
│           └── mapan1984
│               ├── Greet.java
│               └── Hello.java
└── target
    └── io
        └── github
            └── mapan1984
                ├── Greet.class
                └── Hello.class
```

javac 编译：

    $ javac -cp lib/* -d target $(find src -name "*.java")

java 运行：

    $ java -cp lib/*:target io.github.mapan1984.Hello
    Hello, World!

makefile：

``` make
JFLAGS = -g -d
TARGETPATH = target
CLASSPATH = ".:lib/*:target"
SOURCES := $(shell find src -name "*.java")
MAIN = io.github.mapan1984.Hello

all:
	@-mkdir -p $(TARGETPATH)
	@-javac -cp $(CLASSPATH) $(JFLAGS) $(TARGETPATH) $(SOURCES)
	@-java -cp $(CLASSPATH) $(MAIN)

run: ./src
	@javac -cp $(CLASSPATH) $(JFLAGS) $(TARGETPATH) $(SOURCES)
	@java -cp $(CLASSPATH) $(MAIN)

clean:
	@rm -rf $(TARGETPATH)/*
```
