---
title: ADB使用
tags: [ADB]
---

## 功能

ADB(Android Debug Bridge)是Android SDK里的一个工具，它的主要功能有：

* 运行设备的shell
* 管理模拟器或设备的端口映射
* 计算机和设备之间上传/下载文件
* 将本地apk软件安装至模拟器或Android设备

## 安装方法

电脑安装客户端(包含在SDK中)，设备不需要安装，只需打开手机的usb debugging

## 常用命令

    adb help

    adb devices     - 查看设备

    adb install <apk-file-path>  - 安装软件
    adb uninstall [-k] <软件名>  - 卸载软件[保留配置和缓存文件]

    adb shell [command]  - 登录shell[直接运行command]

    adb push <本地路径> <远程路径>  - 存电脑发送文件到设备
    adb pull <远程路径> <本地路径>  - 下载文件

