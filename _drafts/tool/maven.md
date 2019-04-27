## 定义文件

`pom.xml`(Project Object Model)

**约定优于配置** 开发者不需要自己创建构建过程 

* project dependencies
* plugins
* goals
* build profiles
* project version
* developers
* mailing list

配置工程：

- project
    - groupId
    - artifactId
    - version

### super pom

所有的 pom 都继承自一个父 pom，被称为 super pom

    $ mvn help:effective-pom

## 工程结构

Maven 会创建默认的工程结构

| 配置项             | 默认值                        |
|--------------------|-------------------------------|
| source code        | ${basedir}/src/main/java      |
| resources          | ${basedir}/src/main/resources |
| Tests              | ${basedir}/src/test           |
| Complied byte code | ${basedir}/target             |
| distributable JAR  | ${basedir}/target/classes     |

## 环境变量

``` sh
export M2_HOME=/usr/local/apache-maven/apache-maven-3.2.5
export M2=$M2_HOME/bin
export MAVEN_OPTS=-Xms256m -Xmx512m
```

    $ mvn --version

## 生命周期

| 阶段              | 处理     | 描述                                                 |
|-------------------|----------|------------------------------------------------------|
| prepare-resources | 资源拷贝 | 本阶段可以自定义需要拷贝的资源                       |
| compile           | 编译     | 本阶段完成源代码编译                                 |
| package           | 打包     | 本阶段根据 pom.xml 中描述的打包配置创建 JAR / WAR 包 |
| install           | 安装     | 本阶段在本地 / 远程仓库中安装工程包                  |


## 工程依赖
