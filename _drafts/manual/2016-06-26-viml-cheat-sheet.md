---
title: VimL Cheat Sheet
categories: [Manual]
tags: [vim, VimL]
---

## 变量

### 基本类型

* Number
* Float
* String
* List
* Dictionary
* Funcref

* Special: `v:false`, `v:true`, `v:none`, `v:null`
* Job
* Channel

### Lists

### dictionary

`:help Dictionaries`

``` vim
function Mylen() dict
   return len(self.data)
endfunction

let mydict = {'data': [0, 1, 2, 3], 'len': function("Mylen")}

echo mydict.len()
```

``` vim
let mydict = {'data': [0, 1, 2, 3]}

function mydict.len()
   return len(self.data)
endfunction

echo mydict.len()
```

``` vim
let g:gutentags_debug = get(g:, 'gutentags_debug', 0)
```

### curly-braces-names

	echo my_{&background}_message

### 变量作用域

`:help internal-variables`

* `b:name` 缓冲区作用域，`b:name` 只在指定的缓冲区中有效
* `w:name` 窗口作用域，`w:name` 只在指定的窗口中有效
* `t:name` 标签页作用域
* `g:name` 全局作用域，函数外定义的变量的默认值
* `l:name` 函数内部的局部变量，函数内部定义的变量的默认值
* `s:name` 脚本文件作用域，此时 `s:name` 这个变量只在当前脚本文件中有效，其他的脚本文件中如果也定义了同名的 `s:name` 也没关系，因为这两者彼此独立。这一点与 C 中的 static 关键字类似
* `a:name` 函数参数
* `v:name` Vim 预定义的变量，注意预定义变量不同于 Vim 的选项(option)变量

作用域本身可以被当作字典，比如删除 `s:` 作用域下的所有变量：
``` vim
for k in keys(s:)
    unlet s:[k]
endfor
```

### 其他

* `&option`: 选项
* `$VAR`: 环境变量
* `@r`: 寄存器内容

## 判断

``` vim
expr5 =~ expr5		regexp matches
expr5 !~ expr5		regexp doesn't match

expr5 ==? expr5		equal, ignoring case
expr5 ==# expr5		equal, match case
```

## 流程控制

### for

``` viml
for item in mylist
   call Doit(item)
endfor
```

### while

``` viml
let index = 0
while index < len(mylist)
   let item = mylist[index]
   :call Doit(item)
   let index = index + 1
endwhile
```

## 函数

### 可见性

单独的函数，需要首字母大写

### 调用

``` viml
"
call(Fn, myslist)

"
let Cb = function('Callback', ['foo'], myDict)
call Cb()
call myDict.Callback('foo')
```

### lambda

`:help lambda`

``` vim
let F = {arg1, arg2 -> arg1 - arg2}
echo F(5, 2)
```

``` vim
let F = {-> 'error function'}
echo F()
```

## 面向对象

可以将函数定义在 Dictionary:

``` viml
function dict.init() dict
    let self.val = 0
endfunction
```

``` viml
function Mylen() dict
   return len(self.data)
endfunction

let mydict = {'data': [0, 1, 2, 3], 'len': function("Mylen")}

echo mydict.len()
```

``` viml
let mydict = {'data': [0, 1, 2, 3]}

function mydict.len()
   return len(self.data)
endfunction

echo mydict.len()
```

## 其他

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

`:h {event}` 查看 Vim 中所有事件的列表。

`:help autocommand`

自动命令组可以防止多次 source 一个文件时创建多个相同的自动命令：

``` vim
augroup [name]
    autocmd!
    .....
augroupend
```

### execute normal

* `execute` 命令用来把一个字符串当作 Vimscript 命令执行。
* `normal` 命令简单地接受一串键值并当作是在 normal 模式下输入的。
* `normal!` 可以避免执行按键定义的映射，在写 Vim 脚本时，你应该总是使用 `normal!`，永不使用 `normal`，防止接受的键值已经被用户自定义映射。
* `normal!` 不会解析像 `<cr>` 那样的特殊字符序列。
* 结合 `execute` 和 `normal` 可以解决特殊字符序列的问题，如: `:execute "normal! gg/foo\<cr>dd"`

### 常用内置变量

* `v:version` vim 版本

``` vim
if v:version < 704
    echoerr "gutentags: this plugin requires vim >= 7.4."
    finish
endif
```

### 内置函数

`:help functions`

#### 判断(has, exists, empty)

`:help has()`

* `has({feature})`
* `exists({expr})`

``` vim
if !(has('job') || (has('nvim') && exists('*jobwait')))
    echoerr "gutentags: this plugin requires the job API from Vim8 or Neovim."
    finish
endif

if (exists('g:loaded_gutentags') && !g:gutentags_debug)
    finish
endif

if (exists('g:loaded_gutentags') && g:gutentags_debug)
    echom "Reloaded gutentags."
endif

if (empty($TMUX))
  if (has("nvim"))
    "For Neovim 0.1.3 and 0.1.4 < https://github.com/neovim/neovim/pull/2198 >
    let $NVIM_TUI_ENABLE_TRUE_COLOR=1
    "For Neovim > 0.1.5 and Vim > patch 7.4.1799 < https://github.com/vim/vim/commit/61be73bb0f965a895bfb064ea3e55476ac175162 >
    "Based on Vim patch 7.4.1770 (`guicolors` option) < https://github.com/vim/vim/commit/8a633e3427b47286869aa4b96f2bfc1fe65b25cd >
    " < https://github.com/neovim/neovim/wiki/Following-HEAD#20160511 >
    if (has("termguicolors"))
      set termguicolors
    endif
  endif
endif
```

### 其他

* `/` 和 `?` 搜索命令能接受正则表达式
* Vim 允许你使用单引号来定义可以直接传递字符的字面量字符串。 比如，字符串 `'a\nb'` 有四个字符长。
* 用 `\v` 来引导模式。 这将告诉Vim使用它的"very magic"正则解析模式，而该模式就跟其他语言的非常相似

        :/for .\+ in .\+:
        :execute "normal! gg/for .\\+ in .\\+:\<cr>"
        :execute "normal! gg" . '/for .\+ in .\+:' . "\<cr>"
        :execute "normal! gg" . '/\vfor .+ in .+:' . "\<cr>"
        nnoremap <buffer> ff :<c-u>execute "normal! gg" . '/\vfor .+ in .+:$' . "\r"<cr>

* `<cword>` 是一个 Vim 的 command-line 模式的特殊变量，Vim 会在执行命令之前把它替换为"光标下面的那个词"。
* `expand("<cWORD>")` 以 Vim 字符串的形式返回当前光标下的词
* `shellescape({string})` 转义 `{string}` 以便用作 shell 命令的参数。
* `silent` 命令在运行一个命令的同时隐藏它的正常输出。
* 用 `<c-u>` 来执行"从光标所在处删除到行首的内容"，移除多余文本。

