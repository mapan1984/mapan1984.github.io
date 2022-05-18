1、检查 Swap 空间，先检查一下系统里有没有既存的 Swap 文件

    swapon -s

如果返回的信息概要是空的，则表示 Swap 文件不存在。

2、确定swap文件的大小，单位为M。将该值乘以1024得到块大小。例如，64MB的swap文件的块大小是65536。

3、创建 Swap 文件，下面使用 dd 命令来创建 Swap 文件。

    dd if=/dev/zero of=/swapfile bs=1024 count=4194304

【参数说明】

* `if=文件名`：输入文件名，缺省为标准输入。即指定源文件。`if=input file`
* `of=文件名`：输出文件名，缺省为标准输出。即指定目的文件。`of=output file`
* `bs=bytes`：同时设置读入/输出的块大小为bytes个字节
* `count=blocks`：仅拷贝blocks个块，块大小等于bs指定的字节数。

4、创建好Swap文件，还需要格式化后才能使用。运行命令：

    mkswap /swapfile

5、激活 Swap ，运行命令：

    swapon /swapfile

6、如果要机器重启的时候自动挂载 Swap ，那么还需要修改 fstab 配置。

用 vim 打开 `/etc/fstab` 文件，在其最后添加如下一行：

    /swapfile   swap   swap    defaults 0 0

当下一次系统启动时，新的swap文件就打开了。

7、添加新的swap文件并开启后，检查 `cat /proc/swaps` 或者 `free` 命令的输出来查看swap是否已打开。

8、最后，赋予 Swap 文件适当的权限：

    chown root:root /swapfile 
    chmod 0600 /swapfile

9、删除SWAP分区

卸载swap文件

    swapoff  /swapfile

并修改 `/etc/fstab` 文件，从配置总删除

删除文件

    rm -rf /swapfile
