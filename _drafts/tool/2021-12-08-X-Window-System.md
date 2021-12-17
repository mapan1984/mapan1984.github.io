# X Window System

## 架构

1. X Server: 负责操纵显卡或视频终端把位图图像绘制出来，并处理键盘鼠标的事件，发送给 X Client
2. X Client: 也就是各种软件，负责实现程序逻辑，接收 X Server 传递的键盘鼠标事件，计算出绘图数据，并将绘图请求发给 X Server
3. Window Manager: 多个X Client向X Server发送绘制请求时，各X Client程序并不知道彼此的存在，绘制图形出现重叠、颜色干扰等问题是大概率事件，这就需要一个管理者统一协调，即Window Manager，它掌管各X Client的Window（窗口）视觉外观，如形状、排列、移动、重叠渲染等

> 注意:
>
> 1. 和用户交互的是 X Server，X Server 是运行在本地计算机上的
> 2. Window Manager 并非 X Server 的一部分，而是一个特殊的 X Client 程序
