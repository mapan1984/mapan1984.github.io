---
title: bash 补全
tags: [bash, complete]
---


## complete 命令

bash 的 `complete` 命令可以注册补全

    $ complete --help
    complete: complete [-abcdefgjksuv] [-pr] [-DE] [-o option] [-A action] [-G globpat] [-W wordlist]  [-F function] [-C command] [-X filterpat] [-P prefix] [-S suffix] [name ...]
        Specify how arguments are to be completed by Readline.

        For each NAME, specify how arguments are to be completed.  If no options
        are supplied, existing completion specifications are printed in a way that
        allows them to be reused as input.

        Options:
          -p        print existing completion specifications in a reusable format
          -r        remove a completion specification for each NAME, or, if no
                    NAMEs are supplied, all completion specifications
          -D        apply the completions and actions as the default for commands
                    without any specific completion defined
          -E        apply the completions and actions to "empty" commands --
                    completion attempted on a blank line

        When completion is attempted, the actions are applied in the order the
        uppercase-letter options are listed above.  The -D option takes
        precedence over -E.

        Exit Status:
        Returns success unless an invalid option is supplied or an error occurs.

### -W wordlist

使用 `-W` 可以注册固定的补全信息：

    $ complete -W "red green blue yellow purple pink orange" color

    $ color <TAB><TAB>
    blue    green   orange  pink    purple  red     yellow
    $ color p<TAB><TAB>
    pink    purple
    $ color pi<TAB> # completes to pink

### -F function

使用 `-F` 可以注册一个函数处理命令行补全，这个函数在运行时需要获取当前命令行的信息，bash 会将这些信息写入环境变量，通过这种方式，补全函数可以在运行时获取信息：

* `$COMP_LINE`：当前命令行内容
* `$COMP_WORDS`：当前命令行内容按词分割的数组
* `$COMP_POINT`：光标的位置

函数执行之后，通过设置环境变量 `$COMPREPLY` 指定补全内容。

``` bash
function _fizzbuzz () {
  length=${#COMP_WORDS[@]}
  number=$((length - 1))
  if   ! ((number % 15)); then COMPREPLY=(fizzbuzz)
  elif ! ((number % 3));  then COMPREPLY=(fizz)
  elif ! ((number % 5));  then COMPREPLY=(buzz)
  else                         COMPREPLY=($number)
  fi
}

complete -F _fizzbuzz fizzbuzz
```

### 查看补全列表

    $ complete

补全列表里可以看到很多通用的 function，比如 `_service`, `_longopt`，可以利用这些 function 为一些命令增加补全，比如：

    complete -F _longopt tar

## 参考

* [how-bash-completion-works](https://tuzz.tech/blog/how-bash-completion-works)
