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
