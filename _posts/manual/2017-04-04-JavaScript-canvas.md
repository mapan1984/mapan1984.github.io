---
title: 使用canvas绘制图形
tags: [JavaScript, canvas]
---

### 在html中使用canvas

``` html
<canvas id="graph" width="150" height="150">
    <img src="images/xxx.png" width="150" height="150">
</canvas>
```

canvas只用width和height属性，默认值为300px和150px

canvas中的元素为替换内容，用于在不支持canvas的浏览器中显示

### 使用JavaScript绘制canvas内容

#### 获取The rendering context

canvas创建了固定大小的画布，公开render context用于绘制和处理要展示的内容

``` javascript
var canvas = document.getElementById('graph');
var ctx = canvas.getContext('2d')
```

#### 坐标

canvas以像素为单位，左上角为坐标原点，向左为x轴正方向，向下为y轴正方向

#### 矩形

``` javascript
// 绘制一个填充的矩形
fillRect(x, y, width, height)

// 绘制一个矩形的边框
strokeRect(x, y, width, height)

// 清除指定矩形区域，让清除部分完全透明。
clearRect(x, y, width, height)
```

#### 路径

步骤：

1. 首先，你需要创建路径起始点。
2. 然后你使用画图命令去画出路径。
3. 之后你把路径封闭。
4. 一旦路径生成，你就能通过描边或填充路径区域来渲染图形。

``` javascript
// 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
beginPath()

// 闭合路径之后图形绘制命令又重新指向到上下文中。
// 如果路径已经闭合，即当前点为开始点，则该函数什么都不做
closePath()

// 通过线条来绘制图形轮廓。
stroke()

// 通过填充路径的内容区域生成实心的图形。
// 当调用fill时，所有未闭合的形状都会自动闭合
fill()

// 将笔触移动到指定的坐标x以及y上。
moveTo(x, y)

// 绘制一条从当前位置到指定x以及y位置的直线。
lineTo(x, y)
```

设置图形颜色：

``` javascript
// 设置填充颜色
fillStyle = color

// 设置轮廓颜色
strokeStyle = color
```

#### 圆弧

``` javascript
// 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
arc(x, y, radius, startAngle, endAngle, anticlockwise)

// 根据给定的控制点(x1, y1)，(x2, y2)和半径画一段圆弧，再以直线连接两个控制点。
arcTo(x1, y1, x2, y2, radius)
```

#### 清空canvas

``` javascript
// 保存当前渲染上下文所进行的变换
context.save();

// 重置渲染上下文并清空画布
context.setTransform(1, 0, 0, 1, 0, 0);
context.clearRect(0, 0, canvas.width, canvas.height);

// 恢复先前渲染上下文所进行的变换
context.restore();
```

或者

``` javascript
canvas.width = canvas.width;
// or
canvas.height = canvas.height;
```

