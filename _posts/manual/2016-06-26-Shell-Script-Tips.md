---
title: Shell Script Tips
categories: [Manual]
tags: [Shell]
---

### 引号

1. 单引号': 不对包含字符作任何处理；
2. 双引号“: 对包含字符中的特殊字符作处理(`$、\、”`)；
3. 反引号\`: 执行引用命令，用命令的输出代替\`包含的内容

        cmd_output=$(COMMANDS)
        cmd_output=`COMMANDS`

*保留命令输出的空格和和换行: `cmd_output="$(COMMANDS)"`*

### 比较

#### 算术

* -eq: [eq]ual to
* -ne: [n]ot [e]qual
* -gt: [g]reater [t]han
* -lt: [l]ess [t]han
* -ge: [g]reater or [e]qual to
* -le: [l]ess or[e]qual to

#### 文件系统

* [ -f $file_var ]: 正常文件路径或文件名
* [ -x $var ]: 可执行文件
* [ -d $var ]: 目录
* [ -e $var ]: 文件存在
* [ -c $var ]: 字符设备
* [ -b $var ]: 块设备文件
* [ -w $var ]: 可写文件
* [ -r $var ]: 可读文件
* [ -L $var ]: 符号链接

#### 字符串

* [[ $str1 == $str2]] 或 [[ $str1 = $str2 ]]
* [[ $str1 != $str2 ]]
* [[ $str1 \< $str2 ]]
* [[ $str1 > $str2 ]]
* [[ -z $str ]]: str是空字符
* [[ -n $str ]]: str不是空字符

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

### 一般语句

#### for

``` sh
for var in list;
do
    commands; # 使用var
done

for var in list; do actions; done;

# c语言格式风格

for((i=0;i<10;i++))
{
    commands; # 使用变量$i
}
```

`list` can be a string, or a sequence. string使用IFS作为定界符。

生成sequence：`{1..50}`、`{a..z}`

#### while

``` sh
while condition
do
    commands;
done
```

#### until

``` sh
x=0;
until [ $x -eq 9 ];
do
    let x++;
    echo $x;
done
```

#### if

``` sh
if condition; then
    commands;
elif condition; then
    commands;
else
    commands;
fi
```
### 算术运算

#### let

``` sh
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
```

#### []

``` sh
result=$[ no1 + no2 ]
result=$[ $no1 + 5]
```

#### (())

``` sh
result=$(( no1 + 50 ))
```

#### expr

``` sh
result=`expr 3+4` 
result=$(expr $no1 + 5)
```

#### bc

``` sh
result=`echo "$no * 1.5" | bc`
```
