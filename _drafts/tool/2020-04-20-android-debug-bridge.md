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


    adb reboot bootloader - 在 bootloader 模式下重启
    adb push - 将文件从本地系统复制到 Android 手机的位置
    adb pull - 将文件从 Android 复制到您的系统
    adb devices - 显示所有连接的 adb 兼容设备
    adb backup - 备份 Android 设备
    adb install - 将应用程序从系统的 apk 文件位置安装到 Android 设备上
    adb reboot - 在正常模式下重新启动 Android 手机
    adb connect - 通过 WiFi 网络使用adb命令
    adb shell screencap - 获取设备的屏幕截图

常用 Fastboot 命令

    fastboot devices - 显示连接的 Android 设备的序列号
    fastboot oem unlock - 解开 bootloader 锁（Android 5.0 及以下）
    fastboot oem lock - 恢复 bootloader 锁（Android 5.0 及以下）
    fastboot flashing unlock - 解开 bootloader 锁（Android 6.0 及以上）
    fastboot flashing lock - 恢复 bootloader 锁
    fastboot flash recovery (filename) - 在 bootloader 模式中向设备刷入文件

## 刷机

https://wiki.lineageos.org/devices/capricorn/install

## 禁用/启用应用

进入 adb shell:

    adb shell

显示包名列表：

    pm list packages

可选参数：

* -f  显示每个包的文件位置
* -d  使用过滤器，只显示禁用的应用的包名
* -e  使用过滤器，只显示可用的应用的包名
* -s  使用过滤器，只显示系统应用的包名
* -3  使用过滤器，只显示第三方应用的包名
* -i  查看应用的安装者


在没有 root 权限的情况下，使用 `disable-user` 禁用应用：

    pm disable-user com.android.browser
    pm disable-user com.xiaomi.vipaccount
    pm disable-user com.xiaomi.gamecenter
    pm disable-user com.mi.health
    pm disable-user com.miui.newhome
    pm disable-user com.miui.systemAdSolution
    pm disable-user com.miui.virtualsim
    pm disable-user com.android.email
    pm disable-user com.miui.bugreport
    pm disable-user com.miui.userguide
    pm disable-user com.miui.yellowpage
    pm disable-user com.xiaomi.drivemode
    pm disable-user com.android.thememanager
    pm disable-user com.duokan.reader
    pm disable-user com.miui.miservice
    pm disable-user com.miui.virtualsim

有 root 权限，使用 `hide` 隐藏/冻结应用：

    pm hide com.meizu.feedback
    pm hide com.meizu.gamecenter.service
    pm hide com.meizu.media.life
    pm hide meizu.flyme.gamecenter
    pm hide com.meizu.flyme.walleto

卸载：

    pm uninstall -k --user 0 com.miui.voiceassist
    pm uninstall -k --user 0 com.miui.newhome
    pm uninstall -k --user 0 com.xiaomi.vipaccount
    pm uninstall -k --user 0 com.miui.systemAdSolution
    pm uninstall -k --user 0 com.xiaomi.gamecenter.sdk.service
    pm uninstall --user 0 com.miui.analytics
    pm uninstall --user 0 com.miui.virtualsim

重启启用：

    adb shell pm enable 应用包名



