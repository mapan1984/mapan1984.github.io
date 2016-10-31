---
title: C 库文件 
tags: [C]
---

### C语言编译过程

以gcc编译器为例：

编辑:

    $ file main.c
    main.c: ASCII C program text

预处理: 

    $ gcc main.c -E -o main.i
    $ file main.i
    main.i: UTF-8 Unicode C program text

编译: 

    $ gcc main.i -S -o main.s
    $ file main.s
    main.s: ASCII assembler program text

汇编: 

    $ gcc main.s -c -o main.o
    $ file main.o
    main.o: ELF 32-bit LSB relocatable, Intel 80386, version 1 (SYSV), not stripped

链接: 

    $ gcc main.o -o main
    $ file main
    main: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked (uses shaed libs), for GUN/Linux 2.6.18, not stripped

无论是C、还是C++，首先要把源文件编译成中间代码文件，在Windows下也就是 .obj 文件，UNIX下是 .o 文件，即 Object File，这个动作叫做编译（compile）。然后再把大量的Object File合成执行文件，这个动作叫作链接（link）。

编译时，编译器需要的是语法的正确，函数与变量的声明的正确。对于后者，通常是你需要告诉编译器头文件的所在位置（头文件中应该只是声明，而定义应该放在C/C++文件中），只要所有的语法正确，编译器就可以编译出中间目标文件。一般来说，每个源文件都应该对应于一个中间目标文件（O文件或是OBJ文件）。

链接时，主要是链接函数和全局变量，所以，我们可以使用这些中间目标文件（O文件或是OBJ文件）来链接我们的应用程序。链接器并不管函数所在的源文件，只管函数的中间目标文件（Object File），在大多数时候，由于源文件太多，编译生成的中间目标文件太多，而在链接时需要明显地指出中间目标文件名，这对于编译很不方便，所以，我们要给中间目标文件打个包，在Windows下这种包叫“库文件”（Library File)，也就是 .lib 文件，在UNIX下，是Archive File，也就是 .a 文件。

总结一下，源文件首先会生成中间目标文件，再由中间目标文件生成执行文件。在编译时，编译器只检测程序语法，和函数、变量是否被声明。如果函数未被声明，编译器会给出一个警告，但可以生成Object File。而在链接程序时，链接器会在所有的Object File中找寻函数的实现，如果找不到，那到就会报链接错误码（Linker Error），在VC下，这种错误一般是：Link 2001错误，意思就是说，链接器未能找到函数的实现。你需要指定函数的Object File.

    源文件(.H, .C)                                  .A/.SO 
          \                                            \
           \________>预编译----->编译------>汇编----->链接
                                                         \
                                                          \_____>可执行文件

### 静态库(.A)

静态库是指在链接过程中，将汇编生成的目标文件.O与库一起链接到可执行文件中，链接方式称为静态链接

- 静态库对函数库的链接是放在编译时期完成的
- 程序在运行时与函数库再无瓜葛，移植方便
- 浪费空间和资源，因为所有相关的目标文件与牵涉到的函数库被链接合成一个可执行文件

编译源码但不执行链接

    gcc -c foo.c

编译并链接

    gcc foo.c bar.c -o out

### 动态库(.SO)

动态库编译时并不会链接到可执行文件中，而是在程序运行时才被载入

**WINDOWS上对应的是 .LIB .DLL**
