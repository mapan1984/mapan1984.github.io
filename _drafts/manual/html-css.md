---
title: html/css Tips
tags: [html, css]
---

### css中元素位置、大小转换

#### 2D

* translate()
* rotate()
* scale()
* skew()
* matrix()

#### 3D

* rotateX()
* rotateY()

### 让css支持特定浏览器

比如css3中的transform

``` css
transform: translate(100px, 100px);
-webkit-transform: translate(100px, 100px); /*safari chrome*/
-ms-transform: translate(100px, 100px); /*IE*/
-o-transform: translate(100px, 100px); /*opera*/
-moz-transform: translate(100px, 100px); /*Firefox*/
```

### css链接的四种状态

* a:link
* a:visited
* a:hover
* a:active

### html音频播放

``` html
<audio src="source.mp3" controls="controls">你的浏览器不支持html5</audio>
```

用js代替controls

``` html
<button onclick="controlAudio()">Play/Pause</button>
<audio id="audio" src="source.mp3">你的浏览器不支持html5</audio>
<script>
    var audio = document.getElementById("audio");
    function controlAudio(){
        if(audio.paused){
            audio.play();
        }else{
            audio.pause();
        }
    }
</script>
```

### html视频播放

``` html
<video src="source.mp4" controls="controls">你的浏览器不支持html5</video>
```

使用`source`来达到多浏览器支持的效果

``` html
<video controls="controls">
    <source src="source.mp4"> <!-- safari chrome-->
    <source src="source.ogg"> <!-- Firefox -->
    你的浏览器不支持html5
</video>
```

使用js来代替controls

``` html
<button onclick="controlVideo()">Play/Pause</button>
<video id="video">
    <source src="source.mp4"> <!-- safari chrome-->
    <source src="source.ogg"> <!-- Firefox -->
    你的浏览器不支持html5
</video>
<script>
    var video = document.getElementById("video");
    function controlAudio(){
        if(video.paused){
            videoplay();
        }else{
            video.pause();
        }
    }
</script>
```
