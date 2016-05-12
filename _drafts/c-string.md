``` c
size_t strlen(char const *string);

char *strcpy(char *dst, char const *src);
char *strcat(char *dst, char const *src);
int strcmp(char const *s1, char const *s2); // s1<s2:-; s1>s2:+; s1=s2:0

char *strncpy(char *dst, char const *src, size_t len);
char *strncat(char *dst, char const *src, size_t len);
int strncmp(char const *s1, char const *s2, size_t len); // s1<s2:-; s1>s2:+; s1=s2:0
```

`size_t`在stddef.h中定义,为`unsigned int`
