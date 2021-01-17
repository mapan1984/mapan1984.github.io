---
title: vim Script Tips
categories: [Manual]
tags: [vim]
---

### 按键映射

| 递归  | 非递归    | 模式                             |
|-------|-----------|----------------------------------|
| :map  | :noremap  | normal, visual, operator-pending |
| :nmap | :nnoremap | normal                           |
| :xmap | :xnoremap | visual                           |
| :cmap | :cnoremap | command-line                     |
| :omap | :onoremap | operator-pending                 |
| :imap | :inoremap | insert                           |

取消映射：

    :unmap

通过`<nop>`禁用映射：

    :noremap <left> <nop>

### 局部化

| 全局      | 局部                | 作用域       | 帮助文档            |
|-----------|---------------------|--------------|---------------------|
| :set      | :setlocal           | 缓冲区或窗口 | :h local-options    |
| :map      | :map <buffer>       | 缓冲区       | :h :map-local       |
| :autocmd  | :autocmd * <buffer> | 缓冲区       | :h autocmd-buflocal |
| :cd       | :lcd                | 窗口         | :h :lcd             |
| :<leader> | :<localleader>      | 缓冲区       | :h maploacalleader  |

### 自动命令

`:au` 查看所有的自动命令。

`:h {event}` 查看Vim中所有事件的列表。

`:help autocommand`

自动命令组可以防止多次source一个文件时创建多个相同的自动命令：

``` vim
augroup [name]
    autocmd!
    .....
augroupend
```

### 变量作用域

:help internal-variables

* b:name 缓冲区作用域，b:name只在指定的缓冲区中有效
* w:name 窗口作用域，w:name只在指定的窗口中有效
* t:name 标签页作用域
* g:name 全局作用域，函数外定义的变量的默认值
* l:name 函数内部的局部变量，函数内部定义的变量的默认值
* s:name 脚本文件作用域，此时s:name这个变量只在当前脚本文件中有效，其他的脚本文件中如果也定义了同名的s:name也没关系，因为这两者彼此独立。这一点与C中的static关键字类似
* a:name 函数参数
* v:name vim预定义的变量，注意预定义变量不同于vim的选项(option)变量

### execute normal

* `execute` 命令用来把一个字符串当作 Vimscript 命令执行。
* `normal` 命令简单地接受一串键值并当作是在 normal 模式下输入的。
* `normal!` 可以避免执行按键定义的映射，在写 Vim 脚本时，你应该总是使用 `normal!`，永不使用 normal，防止防止接受的键值已经被用户自定义映射。
* `normal!` 不会解析像 `<cr>` 那样的特殊字符序列。
* 结合 `execute` 和 `normal` 可以解决特殊字符序列的问题，如: `:execute "normal! gg/foo\<cr>dd"`

### 其他

* `/` 和 `?` 搜索命令能接受正则表达式
* Vim 允许你使用单引号来定义可以直接传递字符的字面量字符串。 比如，字符串 `'a\nb'` 有四个字符长。
* 用 `\v` 来引导模式。 这将告诉Vim使用它的"very magic"正则解析模式，而该模式就跟其他语言的非常相似

        :/for .\+ in .\+:
        :execute "normal! gg/for .\\+ in .\\+:\<cr>"
        :execute "normal! gg" . '/for .\+ in .\+:' . "\<cr>"
        :execute "normal! gg" . '/\vfor .+ in .+:' . "\<cr>"
        nnoremap <buffer> ff :<c-u>execute "normal! gg" . '/\vfor .+ in .+:$' . "\r"<cr>

* `<cword>`是一个Vim的command-line模式的特殊变量， Vim会在执行命令之前把它替换为"光标下面的那个词"。
* `expand("<cWORD>")`以Vim字符串的形式返回当前光标下的词
* shellescape({string})转义 {string} 以便用作外壳命令的参数。
* silent命令在运行一个命令的同时隐藏它的正常输出。
* 用`<c-u>`来执行"从光标所在处删除到行首的内容"，移除多余文本。
* `==#`: case-sensitive `==?`: case-insensitive
