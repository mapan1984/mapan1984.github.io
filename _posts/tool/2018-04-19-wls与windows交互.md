---
title: Win10与wsl交互
tags: [Win10, wsl]
---

## 在Windows命令行中唤醒wsl

### wsl

使用`wsl`invoke默认distro，工作路径为当前路径；`wslconfig`可配置wsl

### <distroname>

For example: `ubuntu`

### bash

启动默认distro的bash。

## 执行命令

在Windows命令行中执行wsl命令

    > <distroname> -c [command]
    > bash -c [command]
    > wsl [command]

在wsl中执行Windows命令

    $ [binary name].exe

## 挂载盘符

    $ sudo mkdir /mnt/g
    $ sudo mount -t drvfs G: /mnt/g
    $ sudo umount /mnt/g
