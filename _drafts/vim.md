---
layout: post 
title: vim操作 
categories: [linux]
tags: [wim]
---

### 1.编辑

#### 
    
    P 在光标上一行paste
    p
    y
    yy
    dd
    x
    

#### di{, yi{, vi{; da{, ya{, va{

    (i == inner)
    删除一个方法{}里所有的代码 di{ 
    把(String abc, int def)清空为() di( 
    清空[] di[ 

    连带着删除[]和它里面的所有东西 da[ 
    复制 把d换成y 
    选定 把d换成v
    
#### 你可以对于查询结果进行复制，删出或者修改： 

    y/search<Enter>
    y?search<Enter>
    d/search<Enter>
    d?search<Enter>
    c/search<Enter>
    c?search<Enter>

#### 各种插入

    i (insert)
    I 在本行第一个字符前插入

    s 清除一个字符插入
    S 清除一行内容插入
    
    a (after)
    A 在行末尾插入, 比如A;
   
    o
    O
    
    cw 删除一个词后插入
    c2w 删除两个词后插入
    C 删除光标后的内容后插入

    r 替换字符 rd
    R 替换字符

#### 缩进

    >> 向右给它进当前行 
    << 向左缩进当前行
    = 缩进当前行 （和上面不一样的是，它会对齐缩进）
    =% 把光标位置移到语句块的括号上，然后按=%，缩进整个语句块（%是括号匹配）
    gg=G 缩进整个文件（G是到文件结尾，gg是到文件开头）

### 2.移动

#### 段落移动

    { — Move to start of previous paragraph or code block.
    } — Move to end of next paragraph or code block.
    Ctrl+F — Move forward one screenful.
    Ctrl+B — Move backward one screenful.
    ctrl+d 向下翻页(down)
    ctrl+u 向上翻页(up)

#### 跳转

    到文件头 gg
    到文件尾 G 
    到这一行的最开头 0 
    到这一行的非空白最开头 ^ 
    到这行的行为 $
    到这一行的非空白行为 g_ 

    到N行 Ngg 
          NG  
          :N   

    【gi】返回上一次插入文本的地方。
    【g;】返回上一个修改位置
    【g,】返回下一个修改位置

##### 跳转可以与v, y, d配合使用

    选定一个词 ve
    复制一个词 ye
    复制当前光标下的词 yw(yank word)
    把一行复制100遍 yy100p
    删除一个词 de,(dw)  
    删除2个 2de 
    y2/foo 拷贝2个“foo”之间的字符串
    0y$ 从行头拷贝到行尾
    从200行选择到541行 200ggv541gg
    v选择之后，y复制，然后jkhl^$到你想要去的地方，p(paste)就可以了
   
#### 查找

    t<char> — Move forward until the next occurrence of the character.
    f<char> — Move forward over the next occurrence of the character.
    T<char> — Move backward until the previous occurrence of the character.
    F<char> — Move backward over the previous occurrence of the character.
    
    * 向后搜索当前光标所在的字
    # 向前搜索当前光标所在的字
    % 括号匹配


    fa 到下一个为a的字符处 (find)
    gd 跳到光标所在位置词(word)的定义位置 g(o)d(efine)
    t, 到下一个为,的符号处
    3fa 在当前行查找第三个出现的a
    F T  与f t 一要，反方向

    dt" 删除所有内容，直到“

### 2.高级话题

#### 浏览

    :E 打开目录(explore)
    -
    D
    R
    s
    x

    :cd <dir> 改变当前目录
    :pwd 查看当前目录

#### 缓冲区

    :ls 查看缓冲区

    :buffer n  切换到4号文件
    :buffer src/http/ngx_http.c 切换到src/http/ngx_http.c

    快速切换
    :bnext      缩写 :bn
    :bprevious   缩写 :bp
    :blast  缩写 :bl
    :bfirst 缩写 :bf

    相关标记
    – （非活动的缓冲区）
    a （当前被激活缓冲区）
    h （隐藏的缓冲区）
    % （当前的缓冲区）
    # （交换缓冲区）
    = （只读缓冲区）
    + （已经更改的缓冲区）

你可以像在Shell中输入命令按Tab键补全一样补全Vim的命令。
也可以用像gdb一样用最前面的几个字符，只要没有冲突。如：buff

#### 窗口分屏

    :Hexplore 下
    :Hexplore! 上
    :Vexplore 左
    :Vexplore! 右

    要让两个分屏中的文件同步移动
    需要到需要同步移动的两个屏中都输入如下命令
    :set scb  (set scrollbind)

    解开
    :set scb!

#### Tab页浏览目录

分屏可能会让你不爽，你可能更喜欢像Chrome这样的分页式的浏览，那么你可以用下面的命令：

    :Te  全称是 :Texplorer

我们要在多个Tabe页中切换，在normal模式下，你可以使用下面三个按键（注意没有冒号）：

    gt   – 到下一个页
    gT  – 到前一个页
    {i} gt   – i是数字，到指定页，比如：5 gt 就是到第5页

你可以以使用 【:tabm {n}】来切换Tab页。

gvim应该是：Ctrl+PgDn 和 Ctrl+PgUp 来在各个页中切换。

如果你想看看你现在打开的窗口和Tab的情况，你可以使用下面的命令：

    :tabs

使用如下命令可以关闭tab：（当然，我更喜欢使用传统的:q, :wq来关闭）

    :tabclose [i] – 如果后面指定了数字，那就关闭指定页，如果没有就关闭当前页

最后提一下，如果你在Shell命令行下，你可以使用 vim 的 -p 参数来用Tab页的方式打开多个文件，比如：

    vim -p cool.cpp shell.cpp haoel.cpp
    vim -p *.cpp

注：如果你想把buffer中的文件全转成tab的话，你可以使用下面的命令

    :bufdo tab split

#### 保存会话

如果你用Tab或Window打开了好些文件的文件，还设置了各种滚屏同步，或是行号……，那么，你可以用下面的命令来保存会话：（你有兴趣你可以看看你的 mysession.vim文件内容，也就是一个批处理文件）

    :mksession ~/.mysession.vim

如果文件重复，vim默认会报错，如果你想强行写入的话，你可以在mksession后加! ：

    :mksession! ~/.mysession.vim

于是下次，你可以这样打开这个会话：

    vim -S ~/.mysession.vim

保存完会话后，你也没有必要一个一个Tab/Windows的去Close。你可以简单地使用：

    :qa   – 退出全部 
    :wqa  -保存全部并退出全部

#### Quickfix

假如我们有一个hello.cpp文件和一个makefile，于是我们可以直接在vim下输入 :make ，于是就可以make这个hello.cpp文件，如果出错了，我们需要按回车返回，这个时候，我们可以使用下面的命令来把出错显到在vim的分屏中：

    :cw

你可以使用像浏览文件那样用j, k在quckfix窗屏中上下移动到相应的错误上然后按回车，然后就可以在上面的窗屏里定位到相应的源文件的代码行。但是，如果是这样的话， 你要定位下一条错误还得用Ctrl +W 回到quickfix屏中来然后重复来过。

你可以使用下面的命令而不用回到quickfix中来：

    :cp 跳到上一个错误
    :cn 跳到下一个错误
    :cl 列出所有错误
    :cc 显示错误详细信息

下面我们来看另一个quickfix的功能。

如果你用过vim的cscope插件，你就知道cscope可以用来查找相当的代码，但cscope需要事先生成一个数据库，对一些简单的查找，其实，我们用vim的grep命令就可以了，不需要专门为之生成数据库。vim的grep命令和shell的几乎一样。

比如我们正在浏览nginx的代码，这时，我想看看哪里用到了nginx的NGX_HTTP_VAR_INDEXED宏。于是，我可以在vim里输入如下的命令：

    :grep -r –include=”*.[ch]” NGX_HTTP_VAR_INDEXED src/

上面这个命令意思是递归查询src目录下所有的.c和.h文件，其中包括NGX_HTTP_VAR_INDEXED宏。然后，你就会看到vim到shell里去执行并找到了相关的文件，按回车返回vim后，别忘了用 【:cw 】把grep的输出取回来，于是我们就有下面的样子：

然后同上面一样，你可以用 j，k 键移动quickfix里的光标到相应的行，然后按回车定位文件，或是使用【:cn】或【:cp】来移动到定位。（这样，你会把多个文件打开到缓冲区，别忘了【:ls】来查看缓冲区）

#### 关键字补全

在insert模式下，我们可以按如下快捷键：

    Ctrl + N  – 当你按下这它时，你会发现Vim就开始搜索你这个目录下的代码，搜索完成了就会出现一个下拉列表
    Ctrl + P – 接下来你可以按这个键，于是回到原点，然后你可以按上下光标键来选择相应的Word。

我们按下了Ctrl+P后，光标回到了一开始输入的位置，然后你可以干两件事，一个是继续输入（这可以帮助过滤关键词），另一个是用“光标键”上移或下移来选择下拉列表中的关键字，选好后回车，就补全了。

与此类似的，还有更多的补齐，都在Ctrl +X下面：

    Ctrl + X 和 Ctrl + D 宏定义补齐
    Ctrl + X 和 Ctrl + ] 是Tag 补齐
    Ctrl + X 和 Ctrl + F 是文件名 补齐
    Ctrl + X 和 Ctrl + I 也是关键词补齐，但是关键后会有个文件名，告诉你这个关键词在哪个文件中
    Ctrl + X 和 Ctrl +V 是表达式补齐
    Ctrl + X 和 Ctrl +L 这可以对整个行补齐，变态吧。

#### 标记和宏(macro)

    ma 将当前位置标记为a，26个字母均可做标记，mb、mc等等
    'a 跳转到a标记的位置
    这是一组很好的文档内标记方法，在文档中跳跃编辑时很有用
    qa 将之后的所有键盘操作录制下来，直到再次在命令模式按下q，并存储在a中
    @a 执行刚刚记录在a里面的键盘操作
    @@ 执行上一次的macro操作

宏操作是VIM最为神奇的操作之一，需要慢慢体会其强大之处

#### buffer, window, tab-page

    :ls
    :buffer n
    :bn :bp 进行文件的跳转

    :split filename
    :vsplit filename
    <C-w>_ <C-w>|
    <C-w>+ <C-w>-

    :tabedit filename
    gt
    gT

#### nerdtree

    和编辑文件一样，通过h j k l移动光标定位
    o 打开关闭文件或者目录，如果是文件的话，光标出现在打开的文件中
    go 效果同上，不过光标保持在文件目录里，类似预览文件内容的功能
    i和s可以水平分割或纵向分割窗口打开文件，前面加g类似go的功能
    t 在标签页中打开
    T 在后台标签页中打开
    u 到上层目录
    P 到根目录
    K 到同目录第一个节点
    J 到同目录最后一个节点
    m 显示文件系统菜单（添加、删除、移动操作）
    ? 帮助
    q 关闭

### 3.奇技淫巧

##### 执行脚本

在任何格式的文本中，想插入一些数据，只需要写一小段代码，然后选中这段代码，执行!python 

Tada! 这段代码的执行结果就被插入在了这段代码所在的位置。连删除这段代码的操作都不需要了。比如

    新年倒计时开始：
    for i in range(10, 0, -1):
        print(i, '!')
            
选中的代码，并按下『！python』:

    新年倒计时开始：
        10 !
        9 !
        8 !
        7 !
        6 !
        5 !
        4 !
        3 !
        2 !
        1 !
   
#####

    :%TOhtml 转换为HTML文件
    

##### 字符相关

    guu – 把一行的文字变成全小写。或是【Vu】
    gUU – 把一行的文件变成全大写。或是【VU】
    按v键进入选择模式，然后移动光标选择你要的文本，按u转小写，按U转大写
    gU 变大写
    gu 变小写

    ga 查看光标处的ascii码
    g8 查看光标处的utf-8编码


##### 这两个快捷键很有用，可以在Tab页和Windows中向前和向后trace你的光标键，这也方便你跳转光标。

    Ctrl + O 向后回退你的光标移动
    Ctrl + I 向前追赶你的光标移动
    
#####

    :%s/a/b/g
    
    :cd %:p:h

    ctrl-o zz

    ctrl-w 在insert模式下删除一个词

    J 合并下一行与当前行

    :r!date
    (:r 是:read的缩写，!是表明要运行一个shell命令，意思是我要把shell命令的输出读到vim里来)

    gf 打开光标处的文件（这个命令在打到#include头文件时挺好用的，当然，仅限于有路径的）