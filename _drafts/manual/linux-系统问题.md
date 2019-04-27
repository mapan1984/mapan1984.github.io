### Inode 节点占满

查看磁盘占用：

    $ df -i
    Filesystem            Inodes   IUsed   IFree IUse% Mounted on
    /dev/vda1            1310720 1310720       0  100% /
    tmpfs                 983191       1  983190    1% /dev/shm
    /dev/vdb             13107200   91566 13015634    1% /data

    $ df -h
    Filesystem            Size  Used Avail Use% Mounted on
    /dev/vda1              20G  9.0G  9.8G  48% /
    tmpfs                 3.8G     0  3.8G   0% /dev/shm
    /dev/vdb              197G  131G   57G  71% /data

找出文件数量最多的目录：

    $ for i in /*; do echo $i; find $i | wc -l; done

删除文件：

    $ find dir -type f -name '*'  | xargs rm

    $ find /var/spool/clientmqueue -type f -mtime +30 -exec rm -f {} \;

### 进程跑满

错误：

    bash: fork: retry: No child processes

查看进程数限制：

    $ cat /proc/sys/kernel/pid_max
    49152

调整限制：

    $ echo 100000 > /proc/sys/kernel/pid_max

或者查看是否有无用的进程：

    $ pstree -up

### 删除文件未释放磁盘占用

    $ lsof | grep delete

    $ find /proc/*/fd -ls | grep  '(deleted)'
    $ : > "/proc/$pid/fd/$fd"


``` sh
delete_files=$(find /proc/*/fd -ls 2>/dev/null | grep  '(deleted)' | awk '{print $11}')
for delete_file in ${delete_files}; do
    echo ${delete_file}
    : > ${delete_file}
done
```

### 清除 cache

仅清除页面缓存（PageCache）

    $ sync; echo 1 > /proc/sys/vm/drop_caches

清除目录项和inode

    $ sync; echo 2 > /proc/sys/vm/drop_caches

清除页面缓存，目录项和inode

    $ sync; echo 3 > /proc/sys/vm/drop_caches

### 

    $ cat /var/log/messages
    ...
    kernel: SLUB: Unable to allocate memory on node -1 (gfp=0x8020)
    ...
