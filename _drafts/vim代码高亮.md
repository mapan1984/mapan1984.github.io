
### 避免重复加载

``` vim
if exists("b:current_syntax")
    finish
endif

echom "Our syntax highlighting code will go here."

let b:current_syntax = "code"
```

### 高亮关键字

``` vim
syntax keyword potionKeyword loop times to while
syntax keyword potionKeyword if elsif else
syntax keyword potionKeyword class return

syntax keyword potionFunction print join string

highlight link potionKeyword Keyword
highlight link potionFunction Function
```

### 正则匹配

``` vim
syntax match potionComment "\v#.*$"
highlight link potionComment Comment
```

Python代码超出80个字符显示为错误信息：

``` vim
syntax match OverLength "\v^.{80,}$"
highlight link OverLength ErrorMsg
```

### 

``` vim
syntax region potionString start=/\v"/ skip=/\v\\./ end=/\v"/
highlight link potionString String
```
