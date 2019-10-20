---
title: Shell Script Tips
categories: [Manual]
tags: [Shell]
---

### 基本数据类型

1. 变量：
    ``` bash
    fun() {
        local local_var="hello, world!"  # only in function
    }

    export export_var="hello, world!"

    readonly CONST_VAR="hello, world!"

    str="hello, world!"
    echo $str
    echo ${str}
    ```

2. 数组：
    ``` bash
    # 声明与赋值
    array[0]=val
    array[1]=val

    array=([1]=val, [0]=val)

    array=(val val)

    # 获取数组中元素
    ${array[index]}

    # 获取数组长度
    ${#array[@]}
    ${#array[*]}

    # 第 index 个元素的长度
    ${#array[index]}

    # 数组全部元素
    for i in "${array[@]}"
    do
        # do some
    done
    ```

3. map:
    ``` bash
    declare -A animals
    animals=(["moo"]="cow" ["woof"]="dog")

    declare -A animals=(["moo"]="cow" ["woof"]="dog")

    ${animals[moo]}
    ```

3. ternary condition:
    ``` bash
    ${varname:-word}  # 如果varname存在且不为null，返回$varname；否则返回word
    ${varname:=word}  # 如果varname存在且不为null，返回$varname；否则赋值varname=word，并返回word
    ${varname:+word}  # 如果varname存在且不为null，返回word; 否则返回null
    ${varname:offset:length}  # 将$varname看作字符串，返回${varname[offset:offset+length]}
    ```

4. string substitution:
    ``` bash
    ${variable#pattern}         # if the pattern matches the beginning of the variable's value, delete the shortest part that matches and return the rest
    ${variable##pattern}        # if the pattern matches the beginning of the variable's value, delete the longest part that matches and return the rest
    ${variable%pattern}         # if the pattern matches the end of the variable's value, delete the shortest part that matches and return the rest
    ${variable%%pattern}        # if the pattern matches the end of the variable's value, delete the longest part that matches and return the rest
    ${variable/pattern/string}  # the longest match to pattern in variable is replaced by string. Only the first match is replaced
    ${variable//pattern/string} # the longest match to pattern in variable is replaced by string. All matches are replaced
    ${#varname}     # returns the length of the value of the variable as a character string
    ```

### 条件表达式

1. 数字比较：

        -eq: [eq]ual to
        -ne: [n]ot [e]qual
        -gt: [g]reater [t]han
        -lt: [l]ess [t]han
        -ge: [g]reater or [e]qual to
        -le: [l]ess or[e]qual to

2. 字符串比较：

        [[ $str1 == $str2 ]] 或 [[ $str1 = $str2 ]]
        [[ $str1 =~ pattern ]] : pattern是正则表达式
        [[ $str1 != $str2 ]]
        [[ $str1 < $str2 ]]
        [[ $str1 > $str2 ]]
        [[ -z $str ]]: str是空字符
        [[ -n $str ]]: str不是空字符

3. 逻辑运算：

        [[ statement1 && statement2 ]]
        [[ statement1 || statement2 ]]

4. 文件系统：

        [ -f $file_var ]: 正常文件路径或文件名
        [ -d $var ]: 目录
        [ -e $var ]: 文件存在
        [ -a $var ]: 文件存在，与-e相同
        [ -s $var ]: 文件存在，并且不是空白文件
        [ -c $var ]: 字符设备
        [ -b $var ]: 块设备文件
        [ -L $var ]: 符号链接
        [ -r $var ]: 可读文件
        [ -w $var ]: 可写文件
        [ -x $var ]: 可执行文件
        [ -N $var ]: 文件已经被修改自从它最后被读
        [ -O $var ]: 你自己的文件
        [ -G $var ]: 你所属组的文件

### 控制语句

> 请将`; do`、`; then`和`while`、`for`、`if` 放在同一行

1. 条件判断：

    ``` bash
    #### if
    if condition; then
        commands;
    elif condition; then
        commands;
    else
        commands;
    fi

    #### ?:
    [[ condition ]] && echo "true" || echo "false"

    #### case
    case expression in
        pattern1 )
            statements ;;
        pattern2 )
            statements ;;
        ...
    esac
    ```

2. 循环：

    ``` bash
    #### for
    # list can be a string, or a sequence. string使用IFS作为定界符。
    # 生成sequence：`{1..50}`、`{a..z}`
    for var in list; do
        commands;  # 使用$var
    done

    for var in list; do actions; done;

    # c语言格式风格
    for ((i=0; i<10; i++)) {
        commands;  # 使用变量$i
    }


    #### while
    while condition; do
        commands;
    done

    #### until
    x=0;
    until [ $x -eq 9 ];
    do
        let x++;
        echo $x;
    done


    #### while read
    while read line; do
        # do something with line

    done < $filepath;

    #### while read
    cur_dir=$(cd `dirname $0`; pwd)

    while read line
    do
        if [[ ${line} == \#* || -z ${line} ]]; then
          echo skip comment line: $line
          continue
        fi

        # echo $line
        # host_ip=$line
        # scp -C $cur_dir/down.sh root@${host_ip}:/data/
        # ssh -n root@${host_ip} "cd /data; sh down.sh"
    done < hosts.data


    #### Infinite while Loop
    while :
    do
      echo "Press <CTRL+C> to exit."
      sleep 1
    done
    ```

### heredoc

``` sh
sshpass -p "$kpasswd1" ssh root@$khost1_ipv6 << EOF
    mkdir -p $ZK_LOG_DIR
    rm -rf /data/zookeeper/* >/dev/null 2>&1
    echo "1" > /data/zookeeper/myid
    service zookeeper-server restart >/dev/null 2>&1
EOF
```


``` sh
$ sql=$(cat <<EOF
SELECT foo, bar FROM db
WHERE foo='baz'
EOF
)
```

``` sh
$ cat <<EOF > print.sh
#!/bin/bash
echo \$PWD
echo $PWD
EOF
```

``` sh
$ cat <<EOF | grep 'b' | tee b.txt
foo
bar
baz
EOF
```

heredoc的结尾`EOF`不能缩进，必须在行首，可以使用`<<-`代替`<<`来使用缩进，此时缩进必须使用`<tab>`

``` sh
if [ 1 ]; then
    cat <<-EOF
        indented
    EOF
fi
echo Done
```

### 算术运算

1. 运算符:
    * 加、减、乘、除、取余：`+ - * / %`
    * 与、或、非、异或： `& | ! ^`

2. 运算操作:
    ``` bash
    no1=4; #字符串
    no2=5; #字符串

    #### let
    # 使用let时，变量名之前不需在加$
    let result=no1+no2; #让字符串做算术运算
    echo $result

    # 其他方式
    let no1++
    let no1--
    let no+=6
    let no-=6

    #### []
    result=$[ no1 + no2 ]
    result=$[ $no1 + 5 ]

    #### (())
    result=$(( no1 + 50 ))

    #### expr
    result=`expr 3+4`
    result=$(expr $no1 + 5)

    #### bc
    result=`echo "$no * 1.5" | bc`
    ```

3. 进制转换：
    ``` bash
    # $((N#xxx))  N 表示进制，xxx为改进制下的数值

    $((2#110))

    $((16#2a))
    ```

### 函数与参数

1. 函数定义：
    ``` bash
    function fname() {
        statements;
    }

    fname() {
        statements;
    }
    ```

2. 执行函数：
    ``` bash
    # 无参数
    fname;

    # 执行函数并传递参数
    fname arg1 arg2;
    ```

3. 参数表示：
    ``` bash
    $#  # 为参数个数
    $0  # 表示当前脚本的名字
    $1 $2 ... $n   # 分别为第1个、第2个...第n个参数
    $@  # 表示所有参数分别被双引号包含，"$1","$2"....; 如果参数中有被双引号包裹起来并含有空格时，使用"$@"
    $*  # 表示所有参数被一对双引号包含, "$1c$2c$3"，其中c为IFS的第一个字符
    $$  # 表示当前的进程号
    $?  # 表示上一条命令的返回值(通常用0表示正常执行)
    ```

### 引号

1. 单引号': 不对包含字符作任何处理(但是在单引号内，两个单引号被转义为一个单引号，如`'I''m angry!'`)
2. 双引号": 对包含字符中的特殊字符(`$、\、"`)作处理；
3. 反引号\`: 执行引用命令，用命令的输出代替\`包含的内容

        cmd_output=$(COMMANDS)
        cmd_output=`COMMANDS`

    保留命令输出的空格和和换行: `cmd_output="$(COMMANDS)"`，推荐使用`$(commands)`而不是\`commands\`

### 重定向

1. 重定向 stdout:
    ``` sh
    # 默认重定向 stdout
    ls > list.txt
    ls 1> list.txt
    ```
2. 重定向 stderr:
    ``` sh
    ls 2> error.log
    ```
    ``` sh
    # 重定向无关信息到/dev/null
    mkdir newdir 2> /dev/null
    ```
3. 合并 stdout 与 stderr:
    > `&` 发信号通知 Bash `1` 是目标文件描述符

    ``` sh
    # 将stderr转换为stdout
    2 > &1
    ```

    ``` sh
    find /etc -iname "*.service" 1> services.txt 2>&1
    find /etc -iname "*.service" &> services.txt
    ```
4. 标准输入：
    ``` sh
    # 标准输入
    0<

    # 将文件重定向到命令
    $ cmd < file
    ```

### IFS

IFS(Internal Field Separator)是用于特定用途的定界符，它是存储定界符的环境变量。

``` sh
data="name,sex,rollno,location"

oldIFS=$IFS
IFS=,

for item in $data;
do
    echo Item: $item
done

IFS=$oldIFS
```

IFS的默认值为空白字符（换行符、制表符或者空格）

### `~` 符号

POSIX shell中，`~`必须出现在复合表达式的最前面，否则它只是不同字符，不能代表家目录。

``` sh
# 错误
export PATH=$PATH:~/bin
# 正确
export PATH=$PATH:$HOME/bin
```

### 执行方式

1. `./script.sh`: 父进程会fork一个子进程，shell script在子进程中执行，对环境的改变(如设置环境变量、跳转到其他目录)只在子进程中生效，只有子进程的输出文本打印当前shell。
2. `source`: 在原进程中执行，不会fork子进程，效果和直接敲里面的命令一样，处于交互模式。
3. `sh`: 父进程会fork一个子进程，shell script在子进程中执行，非交互模式。
    * `-n`: 语法检查
    * `-x`: 语句逐条跟踪
4. `exec`: 不启动新的shell，而是用要被执行的命令替换当前的 shell 进程

### 交互模式/非交互模式

交互模式(interactive mode)是指用户输入`bash`或`ssh`登录到主机后的那种模式，出现`$ `的Prompt,等待用户的输入指令。

非交互模式(non-interactive mode)是指使用`bash`运行一个命令或脚本，运行完成`bash`就退出。

可以通过环境变量`$-`中是否有字符`i`来测试是否为交互模式

    $ [[ $- == *i* ]] && echo "Interactive" || echo "Not Interactive"
    Interactive
    $ bash -c '[[ $- == *i* ]] && echo "Interactive" || echo "Not Interactive"'
    Not Interactive

写一个脚本`check_interactive.sh`：

``` sh
[[ $- == *i* ]] && echo "Interactive" || echo "Not Interactive"
```

    $ source check_interactive.sh
    Interactive
    $ bash check_interactive.sh
    Not Interactive
    $ bash -c "source check_interactive.sh"
    Not Interactive

bash 配置是针对交互模式的，所以在`.bashrc`开头就有判断代码：

``` sh
[[ $- != *i* ]] && return
```

### Login/Non-Login

1. Login：终端登录、ssh 连接、 `su --login <username>`
2. Non-Login：直接运行bash、`su <username>`

判断是否为Login：

    $ shopt -q login_shell && echo "Login shell" || echo "Not login shell"
    Not login shell
    $ bash -c 'shopt -q login_shell && echo "Login shell" || echo "Not login shell"'
    Not login shell
    $ bash --login -c 'shopt -q login_shell && echo "Login shell" || echo "Not login shell"'
    Login shell

登录模式：只加载`~/.bash_profile`，如果`~/.bash_profile`不存在，尝试加载`~/.bashrc`
非登录模式：只加载`~/.bashrc`

### extglob

`shopt`(shell option) 设置 shell 的可选参数

    $ shopt [-psu] [optname...]

    -s  开启选项
    -u  关闭选项
    -p  列出所有可设置选项

`extglob`：shell 启用模式匹配

    $ shopt extglob
    $ shopt -s extglob
    $ shopt -u extglob

删除除了 logs 意外的目录：

    $ echo rm -rf ./!(logs)

