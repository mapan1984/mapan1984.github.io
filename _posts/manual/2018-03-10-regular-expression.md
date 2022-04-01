---
title: regular expression
tags: [regex]
---

### 元字符

    . ^ $ * + ? { [ ] } \ | ( )

    .  (除换行外的)任意字符
    ^  行开头
    $  行结束
    [] 用来包括一类(class)字符，如[abc]；也可用[a-c]代替；元字符在括号内不代表任何特殊意义; '^'如果在类开头则是非的意思，如[^5]表示匹配除'5'外任何字符
    () 用来包括一组(group)字符，可以使用`\index`在同一个正则表达式中代替同一匹配
    |  或者
    \  转义字符

### 字符匹配

    \d [0-9]
    \D [^0-9]
    \s [ \t\n\r\f\v] 任何空白字符
    \S [^ \t\n\r\f\v]
    \w regex pattern is expressed in bytes: [a-zA-Z0-9_]
       regex pattern is a string: all the characters marked as letters in the Unicode database
    \W [^a-zA-Z0-9_]

    \A matches only at the start of the string
    \Z matches only at the end of the string
    \b word boundary
    \B not word boundary

### 重复

    {m,n} - 重复m到n次
    {m, } - 至少重复m次

    *     - {0,}
    +     - {1,}
    ?     - {0,1}

### 贪婪匹配

    var re = /^(\d+)(0*)$/;
    re.exec('102300'); //('102300', '102300', '')

### 非贪婪匹配

    var re = /^(\d+?)(0*)$/;
    re.exec('102300'); //('102300', '1023', '00')

非贪婪匹配在重复后加`?`即可:

    {m,n}?
    {m, }?

    *?
    +?
    ??

### 组

    (?:p) - 无法使用`\index`找到子模式

#### lookahead and lookbehind

正向先行断言(zero-width positive lookahead assertion)：

    (?=p) - 要求字符串与 p 匹配，但结果集并不包含匹配 p 的字符

负向先行断言(zero-width negative lookahead assertion)：

    (?!p) - 要求字符串不与 p 匹配


    bar(?=bar)     finds the 1st bar ("bar" which has "bar" after it)
    bar(?!bar)     finds the 2nd bar ("bar" which does not have "bar" after it)
    (?<=foo)bar    finds the 1st bar ("bar" which has "foo" before it)
    (?<!foo)bar    finds the 2nd bar ("bar" which does not have "foo" before it)

- https://stackoverflow.com/questions/2973436/regex-lookahead-lookbehind-and-atomic-groups
- https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a

### 示例

匹配url

    ^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$

8～32位字符，英文字母、数字和符号必须同时存在，符号仅限!@#$%^*()

    ^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*()])[A-Za-z\d!@#$%^*()]{8,32}$

英文字母开头，4～16位字符，只能包含英文字母，数字，下划线(_)

    ^[a-zA-Z][a-zA-Z0-9_]{3,15}$
