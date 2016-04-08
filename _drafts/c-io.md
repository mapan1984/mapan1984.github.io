    printf("something or other");
    fflush(stdout);

### 打开流

##### 原型

    FILE *fopen(char const *name, char const *mode);
    mode:
         r w a rb rw ra a+
    return:
        FILE */ NULL

##### 使用
    
    FILE *input;
    input = fopen("file", "r");
    if(input == NULL){
        perror("can not open file");
        exit(EXIT_FAILURE);
    }

##### 原型

    FILE *freopen(char const *filename, char const *mode, FILE *stream);
    以指定文件名和模式重新打开 stream
    return:
        FILE *stream/ NULL

### 关闭流

##### 原型
    
    int fclose(FILE *f);
    return:
        0/ EOF

##### 使用

    if(fclose(input) != 0){
        perror("fclose %s", input);
        exit(EXIT_FAILURE);
    }

### 字符i/o

##### 原型

    int fgetc(FILE *stream);
    int getc(FILE *stream);
    int getchar(void);

函数执行成功会返回读取的字符，失败返回EOF，不用char作为返回值类型的原因是为了返回EOF(end of file)，EOF作为常量，它的值在任何可能出现的字符范围之外。

---
    int fputc(int character, FILE *stream);
    int putc(int character, FILE *stream);
    int putchar(int character);

在写入流之前，character 会被剪裁为无符号字符型值，如果函数失败，返回EOF

 *getc, putc, getchar, putchar是通过#define定义的宏*

---

    int ungetc(int character, FILE *stream);

ungetc 把一个先前读入的字符返回的流中，这样它可以在以后被重新读入  比如:

    /*
    ** 从一串标准输入中读取的数字转化为整数
    */
    #include <stdio.h>
    #include <ctype.h>

    int read_int(){
        int value;
        int ch;
        value = 0;

        while((ch = getchar()) != EOF && isdigit(ch)){
            value *= 10;
            value += ch - '0';
        }

        // 把非数字字符退回的流中，这样它不会丢失
        ungetc(ch, stdin);
        return value;
    }

---

### 未格式化的行i/o

#### 原型

    char *fgets(char *buffer, int buffer_size, FILE *stream);
    char *gets(char *buffer);

当fgets读取到一个换行符并存储的buffer之后就不再读取，如果buffer中的字符数达到buffer_size-1时它也停止读取，任何情况下，NUL字节会被添加到buffer所存储数据的末尾.

 *fgets无法把字符读入到长度小于两个字符的buffer，因为其中一个字符需要为NUL字节保留 * 

返回：如果在任何字符读取前就到达了文件末尾，fgets会返回NULL, 否则返回buffer

gets读取一行输入时，并不在buffer中存储结尾的换行符

---

    int fputs(char const *buffer, FILE *stream);
    int puts(char const *buffer);

传递个fputs的buffer预期以NUL结尾，buffer中可以有换行符(\r\n)，执行错误返回EOF，否则返回非负值

puts写入一个字符串时，它在字符串写入之后向输出在添加一个换行符

### 格式化的行i/o

#### 原型

    int fscanf(FILE *stream, char const *format, ... );
    int scanf(char const *format, ... );
    int sscanf(char const *string, char const *format, ... );

每个原型中的省略号表示一个可变长度的指针列表，从输入转换而来的值逐个存储到这些指针指向的内存地址

    int fprintf(FILE *stream, char const *format, ... );
    int printf(char const *format, ... );
    int sprintf(char *buffer, char const *format, ... );

### 二进制i/o

#### 原型

    size_t fread(void *buffer, size_t size, size_t count, FILE *stream);
    size_t fwrite(void *buffer, size_t size, size_t count, FILE *stream);

### 刷新和定位函数

    int fflush(FILE *stream);
