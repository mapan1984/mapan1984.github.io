---
title: Win10与wsl交互
tags: [Win10, wsl]
---

## 在Windows命令行中唤醒wsl

### wsl

使用`wsl`invoke默认distro，工作路径为当前路径。

使用`wslconfig`可管理不同的Linux发行版。

    > wslconfig /?
    在 Linux Windows 子系统上执行管理操作

    用法:
        /l, /list [/all] - 列出已注册的分发内容。
            /all - 有选择地列出所有分发内容，包括目前
                   正安装或未安装的分发内容。
        /s, /setdefault <DistributionName> - 将指定的分发内容设置为默认值。
        /u, /unregister <DistributionName> - 注销分发内容。

### <distroname>

For example: `ubuntu`，会将工作路径更改到distribution的用户目录。

### bash

启动默认distro的bash。

## 执行命令

在Windows命令行中执行wsl命令

    > <distroname> -c [command]
    > bash -c [command]
    > wsl [command]

可以结合Windows命令与wsl命令

    > wsl ls -la | findstr "foo"
    > dir | wsl grep foo

在wsl中执行Windows命令

    $ [binary name].exe

    $ ipconfig.exe | grep IPv4 | cut -d: -f2

## 挂载盘符

    $ sudo mkdir /mnt/g
    $ sudo mount -t drvfs G: /mnt/g
    $ sudo umount /mnt/g
