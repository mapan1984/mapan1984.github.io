---
layout: post 
title: c 内存分配
categories: [linux]
tags: [c]
---
    
    void *malloc(size_t size);
    void free(void *pointer);

malloc的参数size为需要分配的字节数(不会初始化)，失败会返回NULL。标准表示一个`void *`类型的指针可以转换为其他任何类型的指针，但最好做强制转换(为了使用某些老式编译器)

malloc分配内存时会将比实际申请内存大几个字节，用来记录这块内存有多大，一般直接存在指针的左边，`free`会读取这块信息，所以free的参数要么是NULL(不会产生任何效果)，要么是malloc(calloc, realloc)返回的值。

    void *calloc(size_t num_elements, size_t element_size);
    void *realloc(void *ptr, size_t new_size);

calloc用于申请内存，在返回指向内存的地址之前会把内存初始化为零

realloc函数用于修改一个原先已分配的内存块的大小，如果用于扩大一个内存块，这个块原先内容依然保留，新增内容添加到原先内存块的后面，新内存不会初始化；如果用于缩小一个内存块，该内存块的尾部内容会被移除，剩余内容依然保留。

如果原先内存无法改变大小，realloc将分配一块新的内存，并复制原先内存的内容，所以每次都应使用realloc返回的新指针。
