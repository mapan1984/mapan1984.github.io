---
title: C 常用标准函数库
tags: [C]
---

### 1.整型函数

#### a.算数 <stdlib.h>

``` c
int abs(int value);
long int labs(long int value);
div_t div(int numerator, int denominator);
ldiv_t div(long int numer, long int denom);
```

`abs`与`labs`返回参数的绝对值，如果结果不能用一个整数表示，这个行为是为定义的。

`div`用`denom`除以`numer`，产生商和余数，用`div_t`结构返回，结构包含以下两个字段，


``` c
int quot; //商
int rem; //余数
```

如果不能整除，商将是所有小于代数商的整数中的最靠近它的那个整数(解决`/`操作结果未精确定义的问题)

*当`/`的任一个操作数为负而不能整除时，商大于或小于代数商取决于编译器*

#### b.随机数 <stdlib.h>

``` c
int rand(void);
void srand(unsigned int seed);
```

`rand`返回一个0到RAND_MAX(至少为32767)之间的伪随机数，当它重复调用时，函数返回这个范围内的其他数

`srand`用参数对伪随机数发生器进行初始化，常用的技巧是使用每天的时间作为`seed`

``` c
srand((unsigned int)time(0))
```

#### c.字符串转换 <stdlib.h>

``` c
int atoi(char const *string);
long int atol(char const *string);
long int strtol(char const *string, char **unused, int base);
unsigned long int strtoul(char const *string, char **unused, int base);
```

### 3.日期和时间函数

#### a.处理器时间 <time.h>

``` c
clock_t clock(void);
```

#### b.当天时间 <time.h>

``` c
time_t time(time_t *returnde_value);
```

#### 求时间差

``` c
time_t start = time(NULL);

/*
 * some things
 */

double space = difftime(time(NULL), start);
printf("time = %f ms", space*0.001);
```

### qsort

比较函数接受的是待排列数组中元素的地址，`qsort`接受待排列数组首地址、元素个数、元素大小和排序函数。

排序一个有N个元素的字符串数组：

``` c
char *str[N];

/* scmp: string compare of *p1 and *p2 */
int scmp(const void *p1, const void *p2)
{
    char *v1, *v2;
    v1 = *(char **) p1;
    v2 = *(char **) p2;
    return strcmp(v1, v2);
}

qsort(str, N, sizeof(str[0]), scmp);
```

排序一个有N个元素的整型数组：

``` c
int arr[N];

/* icmp: integer compare of *p1 and *p2 */
int icmp(const void *p1, const void *p2)
{
    int v1, v2;
    v1 = *(int *) p1;
    v2 = *(int *) p2;
    if (v1 < v2) {
        return -1;
    } else if (v1 == v2) {
        return 0;
    } else {
        return 1;
    }
}

qsort(arr, N, sizeof(arr[0]), icmp);
```

