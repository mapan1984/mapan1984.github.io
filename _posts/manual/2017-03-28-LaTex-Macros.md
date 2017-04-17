---
title: LaTex Macros
tags: [LaTex]
---

### newcommand

使用以下命令定义一个新的命令：

``` plaintex
\newcommand{name}[num]{definition}
```

*name*是新命令的名字，*num*指出新命令的参数个数，默认是0，*definition*是定义的内容，将来要替换LaTex文档中出现的*name*命令。

在*definition*中，使用`#1`,`#2`...等代表参数。

LaTex不允许定义同一个命令多次，但提供了一个特殊的命令用来重写之前定义的命令：

``` plaintex
\renewcommand{name}[num]{definition}
```

`renewcommand`与`newcommand`的用法一致。

`providecommand`命令与`newcommand`的用法一致，但如果`providecommand`定义的命令已经存在，LaTex会忽视新定义的命令。

在LaTex2e中，允许增加默认参数：

``` plaintex
\newcommand{name}[num][default]{definition}
```

使用默认参数时，*definition*中的`#1`代表第一个默认参数。

调用命令：

``` plaintex
name[present_default_arguments]{argument}
```

### newenvironmet

使用以下命令定义一个新环境：

``` plaintex
\newenvironmet{name}[num][default]{before}{after}
```

*name*是新环境的名称，*num*是环境的参数个数，在*before*和*after*中使用`#1`, `#2`...等代表形参。

使用新环境：

``` plaintex
\begin{name}[present_default_arguments]{argument}
something
\end{name}
```

环境定义中的*before*会代替`\begin{name}`，*after*会代替`\end{name}`。

`renewenvironment`会重写之前定义的环境。

### declare command within new environment

新命令可以定义在新的环境中，这时为了不与环境的参数混淆，命令的形参使用`##1`, `##2`...等代替。

``` plaintex
\newenvironmet{topics}
{ % before
\newcommand{\topic}[2]{\item{##1 / ##2\}}
Topics:
\begin{itemize}
}
{ % after
\end{itemize}
}
```

### hook

LaTex提供了两个hooks:

* `\AtBeginDocument`会执行一组命令当遇到`\begin{document}`
* `\AtEndDocument`会执行一组命令当遇到`\end{document}`

