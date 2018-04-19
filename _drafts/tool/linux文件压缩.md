---
title: Linux 文件压缩 cheat sheet
tags: [Linux]
---

## .tar

解包：tar xvf FileName.tar
打包：tar cvf FileName.tar DirName

*（注：tar是打包，不是压缩！）*

参数：
    -c: 创建(create)压缩文件
    -x: 解压(extract)压缩文件
    -t: 查看(list)压缩包中的文件

    -z: 使用gzip压缩/解压缩
    -j: 使用bzip2压缩/解压缩
    -v: (verbose)显示进度
    -f: 使用archive文件名

## .gz

解压1：gunzip FileName.gz
解压2：gzip -d FileName.gz
压缩：gzip FileName

## .tar.gz 和 .tgz

解压：tar zxvf FileName.tar.gz
压缩：tar zcvf FileName.tar.gz DirName

## .bz2

解压1：bzip2 -d FileName.bz2
解压2：bunzip2 FileName.bz2
压缩： bzip2 -z FileName

## .tar.bz2

解压：tar jxvf FileName.tar.bz2
压缩：tar jcvf FileName.tar.bz2 DirName

## .bz

解压1：bzip2 -d FileName.bz
解压2：bunzip2 FileName.bz
压缩：未知

## .tar.bz

解压：tar jxvf FileName.tar.bz
压缩：未知

## .Z

解压：uncompress FileName.Z
压缩：compress FileName

## .tar.Z

解压：tar Zxvf FileName.tar.Z
压缩：tar Zcvf FileName.tar.Z DirName

## .zip

解压：unzip FileName.zip
压缩：zip FileName.zip DirName

## .rar

解压：rar x FileName.rar
压缩：rar a FileName.rar DirName
