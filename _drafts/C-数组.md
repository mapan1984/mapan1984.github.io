---
title: C 动态创建数组
tags: [C]
---

### 一维数组

一维数组数组名为指向第一个元素的指针

``` c
int num;
int *array;
scanf("%d", &num);
array = (int *)malloc(num*sizeof(int));
```

### 列数固定的二维数组

二维数组可以视为一个以为数组，数组中每一项为另一个一维数组的数组首地址

``` c
int i,j; 
int ;//这个就是需要指定的行数
int (*p)[10]; 

scanf("%d",&n);//取得行数

//动态生成二维数组,指定列数为10，如果想改,自己该里面 
的参数,如果想定义n行2列就为: p=(int (*)[2])malloc(n*2*sizeof(int)); 
p=(int (*)[10])malloc(n*10*sizeof(int)); //动态申请n行10列的二维数组

for(i=0;i<n;i++) 
    for(j=0;j<10;j++) 
        p[i][j]=i*j; 

for(i=0;i<n;i++) 
{ 
    for(j=0;j<10;j++) 
        printf("%d,",p[i][j]); 

    printf("\n"); 
} 
free(p); 
```

### 列与行都不固定的二维数组

``` c
int i = 0;
int j = 0;

int row = 0; 
int col = 0; 
int **array = NULL; 

printf("input the row of the array:\n"); 
scanf("%d", &row); 
printf("input the col of the array:\n"); 
scanf("%d", &col); 

/* 
 * 现在array是一个有row项(int *)型指针的一维数组
 * 数组中每一项将来要指向(int)型的一维数组
 */
array = (int **)malloc(sizeof(int *) * row); 
if (NULL == p) 
{ 
    return; 
} 

for (i = 0; i < row; i++) 
{ 
    /*
     * 将array的每一项视为一个(int)型的一维数组
     */
    *(array + i) = (int *)malloc(sizeof(int) * col); 
    if (NULL == *(p + i)) 
    { 
        return; 
    } 
} 

/*input data*/ 
for (i = 0; i < row; i++) 
{ 
    for(j = 0; j < col; j++) 
    { 
        array[i][j] = i + 1; 
    } 
} 
/*output data*/ 
for (i = 0; i < row; i++) 
{ 
    for(j = 0; j < col; j++) 
    { 
        printf("%d", array[i][j]); 
    } 
} 
/*free every row point*/ 
for (i = 0; i < row; i++) 
{ 
    free(*(p + i)); 
    p[i] = NULL; 
} 

free(p); 
p = NULL; 
```

### 用一维数组模拟二维数组

``` c
typedef struct {
    int row;
    int col;
    int *base;
} table;
 
void init_table(table *t, int row, int col)
{
    t->row = row;
    t->col = col;
    t->base = (int *)malloc(sizeof(int)*row*col);
    if (t->base == NULL){
        printf("init table falue failed");
    }
}

#define ELEMENT(table, r, c) (*(table.base + (r)*table.col + (c)))
```
