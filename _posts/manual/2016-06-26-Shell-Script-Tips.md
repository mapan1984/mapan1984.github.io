---
title: Shell Script Tips
categories: [Manual]
tags: [Shell]
---

### 基本类型

1. 变量
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
2. 数组
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
    ```
3. map
    ``` bash
    declare -A animals
    animals=(["moo"]="cow" ["woof"]="dog")

    declare -A animals=(["moo"]="cow" ["woof"]="dog")

    ${animals[moo]}
    ```
3. ternary condition
    ``` bash
    ${varname:-word}  # 如果varname存在且不为null，返回$varname；否则返回word
    ${varname:=word}  # 如果varname存在且不为null，返回$varname；否则赋值varname=word，并返回word
    ${varname:+word}  # 如果varname存在且不为null，返回word; 否则返回null
    ${varname:offset:length}  # 将$varname看作字符串，返回${varname[offset:offset+length]}
    ```
4. string substitution
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

1. 算术

        -eq: [eq]ual to
        -ne: [n]ot [e]qual
        -gt: [g]reater [t]han
        -lt: [l]ess [t]han
        -ge: [g]reater or [e]qual to
        -le: [l]ess or[e]qual to

2. 字符串

        [[ $str1 == $str2 ]] 或 [[ $str1 = $str2 ]]
        [[ $str1 =~ pattern ]] : pattern是正则表达式
        [[ $str1 != $str2 ]]
        [[ $str1 < $str2 ]]
        [[ $str1 > $str2 ]]
        [[ -z $str ]]: str是空字符
        [[ -n $str ]]: str不是空字符

3. 逻辑

        [[ statement1 && statement2 ]]
        [[ statement1 || statement2 ]]

4. 文件系统

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

请将`; do`、`; then`和`while`、`for`、`if` 放在同一行。

``` sh
#### if

if condition; then
    commands;
elif condition; then
    commands;
else
    commands;
fi

#### case

case expression in
    pattern1 )
        statements ;;
    pattern2 )
        statements ;;
    ...
esac

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
```

### 算术运算

``` sh
#### let

#!/bin/bash
no1=4; #字符串
no2=5; #字符串

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

### 函数与参数

``` sh
# 函数定义为

function fname() {
    statements;
}

# 或者

fname() {
    statements;
}

# 执行函数

fname;

# 执行函数并传递参数

fname arg1 arg2;
```

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

``` sh
# 默认重定向stdout
# 重定向stderr
2 >
# 将stderr转换为stdout
2 > &1
```

``` sh
# 重定向无关信息到/dev/null
$ some_command 2 > /dev/null
```

``` sh
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

### ~

POSIX shell中，`~`必须出现在复合表达式的最前面，否则它只是不同字符，不能代表家目录。

``` sh
# 错误
export PATH=$PATH:~/bin
# 正确
export PATH=$PATH:$HOME/bin
```

### 执行方式

1. `./script.sh`: 父进程会fork一个子进程，shell script在子进程中执行，对环境的改变(如设置环境变量、跳转到其他目录)只在子进程中生效，只有子进程的输出文本打印当前shell。
2. `source`: 在原进程中执行，不会fork子进程；
3. `sh`: 父进程会fork一个子进程，shell script在子进程中执行；
    * `-n`: 语法检查
    * `-x`: 语句逐条跟踪
4. `exec`: 不启动新的shell，而是用要被执行的命令替换当前的 shell 进程
