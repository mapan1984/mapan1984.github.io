---
title: Windows cheat sheet
tags: [Windows]
---

## Shortcut key

### 窗口操作

    Win+Tab：显示所有已打开的应用和桌面；
    Alt+Tab：切换窗口
    Win+逗号：启动Aero Peek，窥探桌面 ；
    Win+Shift+上：在垂直方向最大化窗口
    Win+上/下：使应用窗口在最大化，正常状态以及最小化之间进行切换；
    Win+左/右：使应用窗口在占据左/右半边屏幕以及正常状态之间进行切换；
    Win+左/右 > Win+上/下：使应用窗口占据屏幕四个角落1/4的屏幕区域；
    Win+M：最小化所有窗口，
    Win+Shift+M用于取消最小化所有窗口；
    Win+Home 最小化除当前窗口的所有窗口

### 桌面操作

    Win+D 显示桌面
    Win+Ctrl+D：新建桌面；
    Win+Ctrl+F4：关闭正在使用的桌面；
    Win+Ctrl+左/右：在已打开的桌面之间进行切换；
    Win+Shift+左/右：将应用窗口移动到左边或右边的显示器中；

### 日常操作

    Win+V：打开剪贴板

    Win+E：打开资源管理器窗口；

    Win+X：左下角菜单

    Win+L：锁定电脑；

    Win+W：Ink工作区

    Win+空格：切换输入法 ；

    Win+Pause：打开系统属性；

    Win+Shift+S：截图到剪切板
    Win+PrintScreen：截屏并保存到用户图片文件夹下；

    Ctrl+Alt+Del：
    Ctrl+Shift+Esc：任务管理器

    Ctrl+Space：切换输入法

    Ctrl+C/V/X：复制/粘贴/剪切

    Ctrl+W 关闭当前页面

    Ctrl+Shift+T 快速恢复已关的网页

    Ctrl+Z 复原

    Win++++ 放大

### 搜索

    Win+S：打开Cortana(最开始是Search的意思)
    Win+Q：打开Cortana

### XBOX(录屏)

    Win+G：打开游戏录制工具；
    Win+Alt+R：开始录制游戏；
    Win+Alt+G：录制游戏最近30秒；
    Win+Alt+PrintScreen：对游戏进行截屏；
    Win+Alt+T：显示或隐藏录制时间计时器；

## 手势(触控板)操作

常见：

    一根手指点击表示鼠标左键单击
    两根手指点击表示鼠标右键单击
    点击两次并拖动以进行多重选择
    两个手指滑动，滚轮

多指操作：

    (1). 三指下滑：最小化所有窗口
    (2). 三指上滑：如果在(1)之后，则为恢复所有窗口；否则为任务视图(等同Win+Tab)
    (3). 三指左/右滑：滑动时切换应用，松开手指以确定选择(等同Alt+Tab)
    (4). 三指点击：唤醒小娜

    (1). 四指下滑：最小化所有窗口
    (2). 四指上滑：如果在(1)之后，则为恢复所有窗口；否则为任务视图(等同Win+Tab)
    (3). 四指左/右滑：滑动时切换窗口，松开手指以确定选择(等同Win+Ctrl+左/右)
    (4). 四指点击：打开操作中心

## 其他

### attrib命令用来显示或更改文件属性。

    $ ATTRIB [+R | -R] [+A | -A ] [+S | -S] [+H | -H] [[drive:] [path] filename] [/S [/D]]

* +设置属性。
* – 清除属性。
* r 只读文件属性。
* a 存档文件属性。
* s 系统文件属性。
* h 隐藏文件属性。
* [drive:][path][filename] 指定要处理的文件属性。
* /S 处理当前文件夹及其子文件夹中的匹配文件。
* /D 也处理文件夹。

这句命令就是设置E盘的SECRET文件夹为存档文件、系统文件、只读文件、隐藏文件。

    $ attrib +a +s +r +h e:/SECRET

    $ attrib +a +s +r +h g:/Indescribable

取消隐藏

    $ attrib -h -s e:/SECRET

### mklink 文件链接

    C:\WINDOWS\system32>mklink
    创建符号链接。

    MKLINK [[/D] | [/H] | [/J]] Link Target

            /D      创建目录符号链接。默认为文件符号链接。
            /H      创建硬链接而非符号链接。
            /J      创建目录联接。
            Link    指定新的符号链接名称。
            Target  指定新链接引用的路径(相对或绝对)。

    C:\WINDOWS\system32>mklink /J C:\Users\mapan\OneDrive\_drafts C:\Users\mapan\Code\mapan1984\_drafts
    为 C:\Users\mapan\OneDrive\_drafts <<===>> C:\Users\mapan\Code\mapan1984\_drafts 创建的联接

    C:\WINDOWS\system32>mklink /J C:\Users\mapan\OneDrive\_posts C:\Users\mapan\Code\mapan1984\_posts
    为 C:\Users\mapan\OneDrive\_posts <<===>> C:\Users\mapan\Code\mapan1984\_posts 创建的联接

### 设置开机自启动

1. 针对所有用户：

    将程序的快捷方式放到 `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp` 文件夹中

2. 针对当前用户：
    1. `win + r` 打开运行窗口
    2. 输入 `shell:Startup` 打开开机会运行的文件窗口
    3. 在开文件夹下创建脚本文件 start.bat
    4. 编辑文件

        ``` bash
        # python 后面填写脚本地址
        python D:\project\GitHub\win-lockfetch\win-lockfetch.py
        ```

### Win+R 命令

* 清理系统: Win+R，输入“cleanmgr”回车
* 优化启动项: Win+R，输入“msconfig”回车
* 定时关机: Win+R，输入“shutdown -s -t xxx”(这里的xxx代表xxx秒后关机)
* 定时关机的另一种用法: Win+R，输入“at xx:xx shutdown -s”，比方说在下午五点关机则是“at 17:00 shutdown -s”，取消则是“shutdown -a”，
* 修改注册表:Win+R，输入“regedit”回车
* 特殊字符: Win+R, 输入“charmap”
* 步骤记录: Win+R, 输入“PSR”

### 多线程复制

    robocopy 原文件路径 目标路径 /MT:利用的线程数

### 批量修改文件名

    选择所有文件，按F2，输入修改名
