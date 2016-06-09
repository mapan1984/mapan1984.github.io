### 上传，下载目录

rsync -r mydir user_name@host_name
rsync -r user_name@host_name:dir .

### 同步文件

在本地目录增加文件

rsync -r mydir/ user_name@host_name:mydir/

在本地删除文件

rsync -av --delete mydir/ user_name@host_name:mydir/

提醒

rsync -av --delete mydir/ user_name@host_name:mydir/ --dry--run

