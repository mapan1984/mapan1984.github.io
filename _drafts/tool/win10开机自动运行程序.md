---
title: Win10开机自启动
tags: [Win10]
---

## 设置开机自启动

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
