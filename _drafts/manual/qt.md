### qt的编译生成

#### 编辑文件

#### 生成工程

运行命令

    $ qmake -project

生成项目的配置文件(.pro)，之后手动在`pro`(配置)文件中添加`QT += widgets`

#### 准备编译

生成在当前环境下的编译方法，即makefile和debug、realse目录

    $ qmake

#### 生成执行文件

根据makefile进行编译

    $ mingw32-make

### class

QObject  - QWidget
         - QLayout

### 通过ui文件绘制界面

`xxx.ui`文件生成的`ui_xxx.h`文件中定义`Ui_xxx`类，类中定义`setupUi`方法，函数以主窗口的指针为参数，对指针的ui进行初始，即以主窗口指针为构件的参数(Qwidget *parent)初始主窗口中的构件，则构件包含在主窗口中。同时定义命名空间`Ui`，`Ui`中定义类`xxx`继承`Ui_xxx`。

使用时，自定义类可以通过继承`Ui::xxx`或将`Ui::xxx`的实例作为数据成员，通过调用`setupUi`方法来完成界面的初始。

#### 自定义窗口类，在构造函数中完成窗口类中的ui

在my.h中完成自定义类的声明，my.h中引入ui_xxx.h，在my.cpp中完成自定义类中函数的定义。

1. 可以定义自己的窗口类，继承`Ui::xxx`类，在构造函数中调用`this->steupUi(this)`函数，即初始化之后，就完成自己ui的绘制。
2. 可以将`Ui_xxx`类的指针作为自定义窗口类的内部属性，通过在构造函数中调用`&Ui::xxx->steupUi(this)`来完成自己ui的绘制。

### qt布局

2. qt的布局对象QLayout不是QObject的派生类，QLayout的对象有方法addWidget，addLayout，可以用于布局，Qwidget可以通过setLayout添加布局管理器。
