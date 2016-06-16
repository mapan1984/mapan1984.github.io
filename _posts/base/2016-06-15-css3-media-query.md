---
title: css3 media query
categories: [Base]
tags: [css]
---

### 常见属性

* device-width, device-height: 屏幕宽高
* width, height: 渲染窗口宽高
* orientation: 设备方向
* resolution: 设备分辨率

### 基本语法

1. 外联css语法

    ``` css
    /*link.css*/
    body {
      background: red;
    }
    ```
    ``` html
    /*demo.html*/
    <html>
    <head>
      <link type="text/css" rel="stylesheet" href="link.css" media="only screen and (max-width: 480px)"/>
    </head>
    <body>
    
    </body>
    </html>
    ```

2. 内嵌样式的语法

    ``` html
    <html>
    <head>
      <link type="text/css" rel="stylesheet" href="link.css" media="only screen and (max-width: 480px)"/>
      <style>
      @media screen and (min-width: 480px){
        body {
          background: blue;
        }
      }
      </style>
    </head>
    <body>
    
    </body>
    </html>
    
    ```
