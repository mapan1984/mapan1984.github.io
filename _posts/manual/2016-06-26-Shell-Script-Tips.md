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

    # 导出函数
    export -f fun

    export export_var="hello, world!"

    # 常量
    readonly CONST_VAR="hello, world!"

    # 常量并且导出为环境变量
    declare -xr CONST_ENV_VAR='hello, world'

    str="hello, world!"
    echo $str
    echo ${str}
    ```

2. 数组：
    ``` bash
    # 声明与赋值
    array[0]=val
    array[1]=val

    array=([1]=val [0]=val)

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

    # 随机选择数据元素
    declare -a server_ips=('10.66.170.71' '10.66.170.72')
    server_ip=${server_ips[$RANDOM % ${#server_ips[@]}]}
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
        [[ $str1 =~ pattern ]] : pattern是正则表达式(不要加双引号)
        [[ $str1 != $str2 ]]
        [[ $str1 < $str2 ]]
        [[ $str1 > $str2 ]]
        [[ -z $str ]]: str是空字符
        [[ -n $str ]]: str不是空字符

3. 逻辑运算：

        [[ statement1 && statement2 ]]
        [[ statement1 || statement2 ]]
        [[ ! statement ]]

4. 文件系统：

        [ -f $var ]: 文件存在，并且是regular file
        [ -d $var ]: 文件存在，并且是目录
        [ -e $var ]: 文件存在
        [ -a $var ]: 与 -e 相同
        [ -s $var ]: 文件存在，并且不是空白文件
        [ -c $var ]: 字符设备
        [ -b $var ]: 块设备文件
        [ -L $var ]: 符号链接
        [ -h $var ]: 与 -L 相同
        [ -r $var ]: 可读文件
        [ -w $var ]: 可写文件
        [ -x $var ]: 可执行文件
        [ -N $var ]: 文件已经被修改自从它最后被读
        [ -O $var ]: 你自己的文件
        [ -G $var ]: 你所属组的文件


        [ ! -f $var ]: 文件不存在

> `[` 是 linux 命令，等同 `test` 命令；`[[  ]]` 是 shell 语法

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
            command1
            ...
            commandN
            ;;
        pattern2 )
            statements ;;
        ...
        *)
            echo "not found"
            ;;
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

    #### while read (comment)
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
    $_  # 代表上一个命令的最后一个参数

    $$  # 表示当前的进程号(PID)
    $!  # 表示最后执行的后台命令的PID
    $?  # 表示上一条命令的返回值(通常用0表示正常执行)
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

POSIX shell中，`~`必须出现在复合表达式的最前面，否则它只是普通字符，不能代表家目录。

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

[启动类型](https://cjting.me/2020/08/16/shell-init-type/)

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

### 自动输入

``` sh
echo y | command

yes | command

printf '%s\n' y n n y y n | command

command << 'EOF'
y
n
n
y
y
n
EOF
```

### string 拼接/切割

1. 拼接

    ```  sh
    #!/bin/bash
    
    message=$@
    
    echo '{"subject": "udw warn", "content": "'"${message}"'", "message_type": 1}' \
      | curl -X POST -d @- http://172.18.176.244:22003/message/inner/245 --header "Content-Type:application/json"
    
    ```

2. 切割

    ``` sh
    line="host1,name1"
    
    # 通过 cut 切割
    host=$(echo $line | cut -d',' -f1)
    name=$(echo $line | cut -d',' -f2)
    echo $host
    echo $name
    
    # 通过数组切割
    # declare -a info="(${line/,/ })"
    declare -a info="(${line//,/ })"
    echo ${info[0]}
    echo ${info[1]}
    ```

### 从路径获取目录名与文件名

``` sh
$ VAR=/home/me/mydir/file.c

$ DIR=$(dirname "${VAR}")

$ echo "${DIR}"
/home/me/mydir

$ basename "${VAR}"
file.c
```

### 获取函数名

* Executed script: ${FUNCNAME[0]} is main
* Sourced script: ${FUNCNAME[0]} is source
* Shell function: ${FUNCNAME[0]} is the function's name

``` sh
#!/bin/bash

function test_func()
{
    echo "Current $FUNCNAME, \$FUNCNAME => (${FUNCNAME[@]})"
    another_func
    echo "Current $FUNCNAME, \$FUNCNAME => (${FUNCNAME[@]})"
}

function another_func()
{
    echo "Current $FUNCNAME, \$FUNCNAME => (${FUNCNAME[@]})"
}

echo "Out of function, \$FUNCNAME => (${FUNCNAME[@]})"
test_func
echo "Out of function, \$FUNCNAME => (${FUNCNAME[@]})"
```

### 获取当前目录

``` sh
# source 执行时 $0 为 -bash，不是脚本名，因此不推荐使用
cur_dir=$(cd `dirname $0`; pwd)

# 适用于 source 和 直接执行
cur_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
```

### 获取数字序列

```
seq LAST
seq FIRST LAST
seq FIRST INCREMENT LAST
```

``` bash
for i in $(seq 5)
do
  echo "Welcome $i times"
done
```

``` bash
#!/bin/bash
for ((a=1; a <= 5 ; a++))
do
   echo "Welcome $a times."
done


for i in {1..10}; do
  echo $i
done
```

### set

修改 shell 环境的运行参数

* `set -u` / `set -o nounset`：脚本遇到不存在的变量报错，并停止执行
* `set -x` / `set -o xtrace`：在运行结果之前，先输出执行的那一行命令
* `set -e` / `set -o errexit`：脚本只要发生错误(返回非 0)，就终止执行
    * 使用 `set +e` 关闭 `-e` 选项
    * 使用 `command || true` 使得这一语句总是执行成功
* `set -o pipefail`：只要一个子命令失败，整个管道命令就失败

http://www.ruanyifeng.com/blog/2017/11/bash-set.html

### 判断脚本是通过 source 执行还是直接执行

1. 通过 `FUNCNAME` 判断
    ``` bash
    if [[ ${FUNCNAME[0]} == "main" ]]; then
        # 直接执行脚本
    fi
    if [[ ${FUNCNAME[0]} == "source" ]]; then
        # source 脚本
    fi
    ```
2. 通过 `BASH_SOURCE` 与 `$0` 判断
    ``` bash
    if [[ "$BASH_SOURCE" == "$0" ]]; then
        # 直接执行脚本，2 个变量都是脚本名
    else
        # source 脚本，`$BASH_SOURCE` 还是脚本名，`$0` 一般为 `-bash`
    fi
    ```

