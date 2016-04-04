### 1.编辑

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
    
    c c2w 删除两个词后插入
    C 删除光标后的内容后插入

    r 替换字符 rd
    R 替换字符

#### 缩进

    >> 向右缩进
    << 向左缩进
    =
    =% 缩进括号内的代码

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

#### 1

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
   
#### 2

    :%TOhtml 转换为HTML文件
    
#### 3

    gU 变大写
    gu 变小写

    ga 查看光标处的ascii码
    g8 查看光标处的utf-8编码

    gf 打开光标处的文件
    
    :r!date

    :%s/a/b/g
    
    :cd %:p:h

    ctrl-o zz
    ctrl-w 在insert模式下删除一个词

    J 合并下一行与当前行
