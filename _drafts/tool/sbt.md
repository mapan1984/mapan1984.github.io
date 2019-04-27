## 手动安装 SBT

将 `sbt-launch.jar` 包放到目录 `~/bin` 中

创建一个运行 `jar` 包的脚本 `~/bin/sbt`, 脚本内容为：

``` sh
SBT_OPTS="-Xms512M -Xmx1536M -Xss1M -XX:+CMSClassUnloadingEnabled -XX:MaxPermSize=256M"
java $SBT_OPTS -jar `dirname $0`/sbt-launch.jar "$@"
```

确保脚本有执行权限

    $ chmod u+x ~/bin/sbt

## 构建规则

* 代码源文件可以是 sbt 项目根目录
* 代码源文件可以是 在 src/main/scala 或 src/main/java 目录
* 测试代码目录为 src/test/scala 或 src/test/java 目录
* 数据文件在 src/main/resources 或 src/test/resources
* 依赖的 jars 文件可以放到 lib 目录下

## 配置文件

    build.sbt
    project/
        build.properties
        build.scala
        plugins.sbt

## 目录

    src/
        main/
            resources/
                <包含在main 的jar包中的文件>
            scala/
                <scala源代码>
            java/
                <java 源代码>
        test/
            resources/
                <包含在test 的jar包中的文件>
            scala/
                <scala 源代码>
            java/
                <java 源代码>
    target/
