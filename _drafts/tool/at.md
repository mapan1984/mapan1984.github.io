## 延时任务

### at 服务

    $ systemctl start atd
    $ systemctl enable atd

或者：

    $ service atd start
    $ chkconfig --level 35 atd on

### 创建任务

延时执行：

    $ echo "ping -c 4 www.google.com" | at -m now +1 minute

今天 11 pm 执行：

    $ echo "updatedb" | at -m 23

今天 23:55 执行：

    $ echo "shutdown -h now" | at -m 23:55

* `-m`：通过邮件发送结果


列出待执行任务：

    $ atq

删除任务：

    $ atrm

