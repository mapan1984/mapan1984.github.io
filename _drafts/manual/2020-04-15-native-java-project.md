## JDK(Java Development Kit) 与 JRE(Java Runtime Environment)

JRE 是运行 Java 字节码的虚拟机，JDK 包含 JRE 与编译器，调试器等开发工具。

在安装 Java 之后，在 `JAVA_HOME` 的 `bin` 目录下可以找到 Java 开发相关的工具：
* `java`(JVM)：运行 `java` 可以启动 JVM，并让 JVM 执行指定的字节码
* `javac`(compiler)：可以将 Java 源码文件(`.java`后缀)编译为 Java 字节码文件(`.class`后缀)
* `jar`：把一组 `.class` 文件打包成一个 `.jar` 文件
* `javadoc`：从 Java 源码中自动提取注释并生成文档
* `jdb`：Java 调试器

## 运行单个无依赖文件

## classpath

    javac -cp .:xxx.jar Main.java

    java -cp .:xxx.jar Main

## jar
