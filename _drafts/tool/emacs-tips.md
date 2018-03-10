---
title: Emacs使用
tags: [emacs]
---

### 编辑

    剪切: C-w
    复制: M-w
    粘贴: C-y

    撤销: C-x u

    保存: C-x s
    保存，不提示: C-x C-s

    C-x C-f "find"文件, 即在缓冲区打开/新建一个文件
    C-x C-w 使用其他文件名另存为文件
    C-x i 在当前光标处插入文件

    剪切光标到行尾: C-k
    删除下一个字符: C-d

    全选: C-x h

    退出: C-x C-c
    取消命令: C-g

### 移动

    上一行: C-p
    下一行: C-n
    左移一个字符: C-b
    右移一个字符: C-f
    后一个单词: M-f
    前一个单词: M-b
    行首: C-a
    行尾: C-e
    向下翻一页: C-v
    向上翻一页: M-v
    到文件开头: M-<
    到文件末尾: M->

    文章开头: M-S-,
    文章结尾: M-S-.

### 搜索

    向上搜索: C-r
    向下搜索: C-s
    替换：M-S-5

### 窗口

    切分成两个窗口: C-x 2
    关闭其他窗口: C-x 1
    切换窗口: C-x o


    显示所有buffer：C-mouse
    关闭当前buffer：C-x k

    C-x b 新建/切换缓冲区
    C-x C-b 显示缓冲区列表
    C-x k 关闭当前缓冲区
    C-x C-v 关闭当前缓冲区文件并打开新文件

    C-z 挂起emacs

### 求值

    C-x C-e 求值文本中的Lisp代码
    M-x eval-buffer(ev-b)  求值整个buffer
