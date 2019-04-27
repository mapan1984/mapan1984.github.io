1. logrotate 是 linux 系统日志的管理工具，可以轮换，压缩系统日志文件。
2. 默认的 logrotate 被加入 cron 的 `/etc/cron.daily` 中作为每日任务执行。
3. `/etc/logrotate.conf` 为其默认配置文件指定每个日志文件的默认规则。
4. `/etc/logrotate.d/*` 被 `/etc/logrotate.conf` 文件配置默认包含，其中的文件也会当作配置文件被 logrotate 读取。
5. `/var/lib/logrotate/statue` 中默认记录 logrotate 上次轮换日志文件的时间

## 按时执行 logrotate

新建`/etc/logrotate.hourly.d`文件夹，创建文件`/etc/logrotate.hourly.d/rotate-task`

    $ mkdir /etc/logrotate.hourly.d
    $ vim /etc/logrotate.hourly.d/rotate-task

写入以下内容

```
/data/pm2log/ukafka-monitor-*.log {
  size 500M
  rotate 3
  copytruncate
  compress
  missingok
  notifempty
  create 640 root root
  postrotate
      pm2 reloadLogs
  endscript
  nomail
}

```

创建文件`/etc/logrotate.hourly.conf`

```
# packages drop hourly log rotation information into this directory
include /etc/logrotate.hourly.d
```

在`/etc/cron.hourly`创建每小时执行任务`hourly_logrotate`

``` sh
#!/bin/bash
/usr/bin/test -x /usr/sbin/logrotate || exit 0
/usr/sbin/logrotate /etc/logrotate.hourly.conf
```

    $ chmod u+x /etc/cron.hourly/hourly_logrotate

`/etc/cron.hourly`中的脚本在 crontab 的默认配置下会每小时执行一次，如果没有执行，检查`/etc/crontab`文件中的`run-parts`部分是否包含如下代码：

    01 * * * * root run-parts /etc/cron.hourly

## 其他

1. 注释符号`#`
