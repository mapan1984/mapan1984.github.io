---
title: makefile cheat sheet
tags: [makefile]
---

`make` 命令会解释 Makefile (或者 makefile) 文件内容，Makefile 文件一般用于定义工程的构建规则，但是也可以通过执行操作系统命令，定义复杂的功能操作。

## 规则

    target_1 ...: prerequisite_1 ... prerequisite_n
    	command_1
    	...
    	command_n

* `target_1 ...`：可以是构建的目标文件，或者是一个伪目标
* `prerequisite_1 ... prerequisite_n`：生成 `target_1 ...` 所需的文件或者伪目标
* `command_1 ... command_n`：需要执行的命令，可以是任意 shell 命令

整个 Makefile 可以包含多项以上的规则，这些规则定义了项目的依赖关系和构建命令，当执行 `make` 的时候，会依赖这些规则和命令去构建目标文件。根据这些依赖关系，`make` 会自动地根据文件的修改时间来决定哪些 `target` 需要重新生成。

*Makefile 中 command 的缩进需要使用 <tab>，不能使用 <space>*

## 指定参数

`make` 会将 `$()` 中的字符替换为参数

``` make
hello:
	echo "hello, $(name)!"
```

    $ make hello name=world
    echo "hello, world!"
    hello, world!

## 变量

Makefile 中的变量是一个字符串，类似于 C 语言的宏

``` make
OBJS_COMMON = exec.o pgfnames.o psprintf.o relpath.o rmtree.o string.o username.o wait_error.o
main: $(OBJS_COMMON)
	cc -o main $(OBJS_COMMON)

.PHONY: clean
clean:
	rm $(OBJS_COMMON)
```

内置变量 `$@`（表示该步骤的 target）, `$<`（表示该步骤的依赖项）

``` make
.PHONY: echo dep1 dep2
echo: dep1 dep2
	echo $< '-' $@
```

## 不输出命令

`@`

``` make
SHELL := /bin/bash
hello:
	@if [[ -z "$(name)" ]]; then \
		echo "You must set name"; exit 1; fi
	echo "hello, $(name)!"
```

## 指定 shell

``` make
SHELL := /bin/bash
```

## 环境变量

``` make
ifeq "$(PXF_HOME)" ""
    ifneq "$(GPHOME)" ""
        PXF_HOME = "$(GPHOME)/pxf"
    endif
endif

export PXF_HOME
```

## 默认 target

`make` 会将 Makefile 文件中第一个 target 视为默认的最终目标文件（一般会将这个 target 命名为 `all` 或者 `default`）

## 伪 target

``` make
.PHONY: server install tar clean test help
```

`.PHONY` 表示 `server`, `install` 等等都是伪目标，并不对应目标文件，如果目录下刚好有同名的文件，用 `.PHONY` 将其标记为伪目标可以避免 `make` 将这些文件视为目标。

## 指定目录

``` make
submod:
	make -C submod
```

## 引用其他 Makefile

``` make
include <filename> ...
```

`make` 执行时会将引用文件的内容替换到当前位置

## 换行符

`\`

## 通配符

`*`, `?`, `[..]`

``` make
objects = *.o

objects := $(wildcard *.o)
```

## 注释

Makefile 只有行注释，以 `#` 字符开头，需要使用 `#` 字符是要进行转义 `\#`

## 参数

* `-f`: 指定文件
* `-C`: 指定目录
* `-n` 或 `--just-print`: 只显示命令，但不会执行命令，这个功能很有利于我们调试我们的Makefile，看看我们书写的命令是执行起来是什么样子的或是什么顺序的
* `-s` 或 `--slient`：全面禁止命令的显示。

## 参考

* [how-to-write-makefile](https://seisman.github.io/how-to-write-makefile/)

