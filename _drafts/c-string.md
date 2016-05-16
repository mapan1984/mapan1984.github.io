``` c
size_t strlen(char const *string);
```
`size_t`在stddef.h中定义,为`unsigned int`

#### 复制，连接，比较
``` c
char *strcpy(char *dst, char const *src);
char *strcat(char *dst, char const *src);
int strcmp(char const *s1, char const *s2); // s1<s2:-; s1>s2:+; s1=s2:0
```
`strcpy`将`src`字符串复制到`dst`参数

``` c
char *strncpy(char *dst, char const *src, size_t len);
char *strncat(char *dst, char const *src, size_t len);
int strncmp(char const *s1, char const *s2, size_t len); // s1<s2:-; s1>s2:+; s1=s2:0
```
#### 字符串查找

***查找一个字符***

``` c
char *strchr(char const *str, int ch);
char *strrchr(char const *str, int ch);
```
return: `ch`在`str`中第一次出现位置的指针(`strrchr`返回`ch`最后出现的位置的指针)，不存在返回`NULL`指针

***查找任何几个字符***

``` c
char *strpbrk(char const *str, char const *group);
```
return: 指向`str`中第一个匹配`group`中任何一个字符的字符的位置，未找到则返回`NULL`指针

***查找一个子串***

```c
char *strstr(char const *s1, char const *s2);
```
return: 指向`s2`第一次在`s1`中出现的起始位置的指针; 如果没有找到，返回`NULL`指针; 如果`s2`是空字符串，返回`s1`

***查找一个字符串前缀***
``` c
size_t strspn(char const *str, char const *group);
size_t strcspn(char const *str, char const *group);
```
`group`指定多个字符，`strspn`返回`str`开头与`group`中任意字符匹配的字符数量
