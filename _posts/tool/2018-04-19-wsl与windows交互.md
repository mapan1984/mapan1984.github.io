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

## wsl 与 windows 共享环境变量

通过 `WSLENV` 可以让 windows 与 wsl 共享环境变量，它的值为用 `:` 分隔的需要共享的环境变量，每项环境变量可以通过后缀进一步限定变量在 wsl/win32 之间的转换规则：

* `/p`: 共享环境变量的值为路径(path)，这个值在不同环境下需要转换为 wsl 路径或者 win32 路径
* `/l`: 共享环境变量的值为路径列表(list of paths)，在 wsl 环境下，这个列表以 `:` 进行分隔，在 win32 环境下，这个变量以 `;` 进行分割
* `/u`: 共享环境变量只在从 win32 中调用 wsl 才应该被包含
* `/w`: 共享环境变量只在从 wsl 中调用 win32 才应该被包含


---

    PS> [environment]::SetEnvironmentvariable("WINDOWS_USERNAMES", $env:username, "User")
    PS> [environment]::SetEnvironmentvariable("WSLENV", "WINDOWS_USERNAME:OneDrive/p", "User")


    $ echo $WSLENV
    WINDOWS_USERNAME:OneDrive/p

    $ echo $OneDrive
    /mnt/c/Users/user/OneDrive

    $ export WSLENV=$WSLENV:GOPATH/l
    $ cmd.exe
    '\\wsl$\Ubuntu-18.04\home\mapan'
    用作为当前目录的以上路径启动了 CMD.EXE。
    UNC 路径不受支持。默认值设为 Windows 目录。
    Microsoft Windows [版本 10.0.18363.535]
    (c) 2019 Microsoft Corporation。保留所有权利。

    C:\Windows>set GOPATH
    GOPATH=C:\Users\user\Code\goutils
