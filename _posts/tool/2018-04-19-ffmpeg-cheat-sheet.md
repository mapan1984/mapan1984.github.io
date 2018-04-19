---
title: ffmpeg cheat sheet
tags: [ffmpeg]
---

## 截取与合并

* -ss 指定从什么时间开始
* -t 指定需要截取多长时间
* -i 指定输入文件

截取从头开始的30s

    $ ffmpeg -ss 00:00:00 -t 00:00:30 -i input.mp4 -vcodec copy -acodec copy split1.mp4

截取从30s开始的30s

    $ ffmpeg -ss 00:00:30 -t 00:00:30 -i input.mp4 -vcodec copy -acodec copy split2.mp4

进行视频的合并

    $ ffmpeg -f concat -i list.txt -c copy concat.mp4

在list.txt文件中，对要合并的视频片段进行了描述。

内容如下

```
file ./split1.mp4
file ./split2.mp4
```

## 字幕

转换字幕格式

    $ ffmpeg -i subtitle.srt subtitle.ass

嵌入ass字幕

    $ ffmpeg -i input.mp4 -vf ass=subtitle.ass output.mp4

嵌入srt字幕

    $ ffmpeg -i input.mp4 -vf subtitles=subtitles.srt output.mp4

