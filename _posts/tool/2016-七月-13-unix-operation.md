### 缩写  

cd "Change (working) Dir"
pwd "Print Working Dir"

### 文件系统

    $ ls -l a.txt
    -rw-r--r-- 1 mapan mapan 327 Jun  6 22:53 a.txt

-----------------------------------------------------------------------------------------------------------------------------------
file type         |       user-permission       |  link number       | owner  | group | size in byte | last modify time | file name
------------------+-----------------------------+--------------------+--------+-------+--------------+------------------+----------
-: file           |     rw-: owner file mode    |  1: link number    | mapan  | mapan | 327          | Jun 6 22:53      | a.txt
l: sym link       |     r--: group file mode    |                    |        |       |              |                  |
d: directory      |     r--: world file mode    |                    |        |       |              |                  |
c: char device    |                             |                    |        |       |              |                  |
b: block device   |                             |                    |        |       |              |                  |
------------------+-----------------------------+--------------------+--------+-------+--------------+------------------+-----------

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

    $ chmod 666 a.txt       # chmod 110110110 a.txt
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
crrl+z 

## windows

ipconfig
ipconfig /all
ipconfig /release
ipconfig /renew
