### 文件系统

cd "Change (working) Dir"
pwd "Print Working Dir"

    $ ls -l a.txt
    -rw-r--r-- 1 mapan mapan 327 Jun  6 22:53 a.txt

1. file type

        -: file
        l: sym link
        d: directory
        ...: ...

2. user-permission

        rw-: owner file mode
        r--: group file mode
        r--: world file mode

3. link number

        1 link number

4. owner

        mapan

5. group

        mapan

6. size in byte

        327

7. last modify time

        Jun 6 22:53 

8. file name

        a.txt

### file permission

1. dir
    * r --- ls dir
    * w --- create/delete/rename files in it
    * x --- cd dir
    * -

2. file
    * r --- cat file
    * w --- file
    * x --- ./a.sh
    * - 

### change file mode

    $ chmod 666 a.txt    # chmod 110110110 a.txt
    $ ls -l a.txt
    -rw-rw-rw- 1 mapan mapan 327 Jun  6 22:55 a.txt

    $ chmod u+x a.txt
    $ chmod u-x a.txt
    $ chmod o-x a.txt

### 进程

#### 获取进程号

    $ ps aux
    $ ps aux|less
    $ ps aux|grep vim

#### 后台执行

    $ firefox &

#### kill

    $ kill -9 5034  # kill -9 "pid"


### remote

#### 上传，下载目录

    $ rsync -r mydir user_name@host_name
    $ rsync -r user_name@host_name:dir .

#### 同步文件

在本地目录增加文件

    $ rsync -r mydir/ user_name@host_name:mydir/

在本地删除文件

    $ rsync -av --delete mydir/ user_name@host_name:mydir/

增加提醒

    $ rsync -av --delete mydir/ user_name@host_name:mydir/ --dry--run

### 组合键

ctrl+u 删除当前光标前一行
ctrl+k 删除当后光标前一行
ctrl+s 终止输出
ctrl+q 恢复输出
ctrl+d 注销/终止
ctrl+h 删除一个字符
ctrl+l 清屏

## windows

ipconfig
ipconfig /all
ipconfig /release
ipconfig /renew
