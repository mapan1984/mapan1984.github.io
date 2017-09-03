---
title: 使用位图进行排序
tag: [sort]
---

### 概要

当输入数据限制在相对较小的范围内，且数据没有重复时，利用位图进行排序是一种在内存受限的情况下，时间复杂的仅为O(n)的方法。

假设待排序数据`nums`的范围为0~n，则可申请n bits空间，空间中第i位为1，则表示`nums`中有数据i。

排序算法如下：

``` python
# phase 1: initialize set to empty
for i in range(n):
    bit[i] = 0
# phase 2: insert present elements into the set
for n in nums:
    bit[n] = 1
# phase 3: write sorted output
for i in range(n):
    if bit[i] == 1:
        print(i)
```

### C位图操作

C语言中没有bit这种数据类型，如果要申请100bit，可以申请一个int数组，数组的大小为100/32+1。

``` c
#define MAX 100
#define DIGITS 32

int bitmap[MAX/DIGITS+1];
```

```
[31][30][29][28][27][26] ... [2][1][0] bitmap[0]
[31][30][29][28][27][26] ... [2][1][0] bitmap[1]
[31][30][29][28][27][26] ... [2][1][0] bitmap[2]

.
.
.

[31][30][29][28][27][26] ... [2][1][0] bitmap[MAX/DIGITS]
[31][30][29][28][27][26] ... [2][1][0] bitmap[MAX/DIGITS+1]
```

假如取bitmap的第33位，必须确定**数组下标**和**位位置**。

``` c
数组下标 = 33/32;  // 采用位运算即右移5位

位位置 = 33%32;  // 采用为运算即于0x1F进行与操作
```

``` c
#define SHIFT 5
#define MASK 0x1F

void set(int i)
{
    bitmap[i>>SHIFT] = bitmap[i>>SHIFT] | (1<<(i&MASK));
}

void clear(int i)
{
    bitmap[i>>SHIFT] = bitmap[i>>SHIFT] & (~(1<<(i&MASK)));
}

int is_one(int i)
{
    return bitmap[i>>SHIFT] & (1<<(i&MASK));
}
```

``` c
/*位图C++STL实现 2011.10.19*/
#include <iostream>
#include<bitset>
#define MAX 1000000
using namespace std;

bitset<MAX+1> bit;        //声明一个有(MAX+1)个二进制位的bitset集合，初始默认所有二进制位为0

int main(int argc, char *argv[])
{
    int n,i;
    while(scanf("%d",&n)!=EOF)
    {
        bit.set(n,1);          //将第n位置1
    }
    for(i=0;i<=MAX+1;i++)
    {
        if(bit[i]==1)
            printf("%d ",i);
    }
    return 0;
}
```
