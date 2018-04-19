---
title: Jupyter cheat sheet
tags: [Jupyter]
---

## 安装与启动

    pip install jupyter
    jupyter notebook

## 常见操作

    ctrl-shift-p    - command palette

### Command mode

    Esc   - 进入command mode
    j/k   - 上/下
    a     - 在当前cell之上插入新的cell
    b     - 在当前cell之下插入新的cell
    m     - 改变当前cell为Markdown模式
    y     - 改变当前cell为Code模式
    dd    - 删除当前cell

    shift-j/k    - 向上/下选择多个cell，选中后可以将其视作整体进行删除/复制/剪切/粘贴/运行
    shift-m      - 合并选中的cell

    Enter        - 进入Edit mode

### Edit mode

    ctrl-enter   - 执行代码
    shift-enter  - 执行当前代码，并进入/创建下一个格子
    alt-enter    - 执行当前代码，在当前格子后插入一个新的格子

    shift-tab    - 显示Docstirng(documentation)

    单击输出区域左侧   - 收拢输出
    双击输出区域左侧   - 收起全部输出

## Magic魔法操作符

运行`%lsmagic`得到所有Magic命令的列表，使用`%`开始一个单行Magic命令，使用`%%`开始一个多行Magic命令。

快速查看某个流程执行所花费时间，在格子最前面使用`%%time`魔法操作符，当当前格子执行完成，它将输出执行的耗时。

在notebook中执行命令行语句，在语句前加一个感叹号`!`。

`% env`列出环境变量

`!`运行一个shell命令，例如`!pip freeze`

`%run`

`%load`

### 运行不同类型的代码

`%%bash`将这cell内容解释bash脚本

`%%latex`将当前cell内容当做LaTeX

`%%HTML`将当前cell内容当做HTML
