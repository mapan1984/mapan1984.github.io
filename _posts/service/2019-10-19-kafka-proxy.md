---
title: 代理 kafka 服务
tags: [kafka, proxy]
---

# kafka 外网 nginx 代理访问集群

进行生产或者消费活动时，kafka 客户端会主动获取集群的元信息，元信息包含 broker id 与 broker 地址之间的对应关系，以及 topic 的 partition, replica, leader 信息。当具体读/写某个 topic 的某个 partition 时，客户端必须根据元信息找到代表该 partition leader 的 broker id，再根据 broker id 找到 broker 的地址。

配置 kafka 转发常见的错误就是忽略了客户端会主动获取集群地址的特性，仅仅用外网 IP 代理内网下的 Kafka broker IP，这样客户端在连接时没有问题，但是第一次连接成功后，客户端主动获取的集群 broker 地址可能还是 kafka listeners 配置的内网地址，因此之后的任何请求都会发向内网地址而不是代理地址。

解决这个问题的关键是让客户端连接成功后，主动获取的集群 broker 地址还是指向代理 IP，有 2 种配置方法：
1. 修改 kafka listeners 的地址为 kafka broker 节点的 hostname，然后在客户端所在的主机配置 `/etc/hosts` 文件，添加 kafka listeners 配置的 hostname，并将对应的 IP 配置为代理 IP
2. 修改 kafka `advertised.listeners` 的地址为代理 IP，等于直接向客户端宣告通过代理地址访问自己

kafka broker 注册的地址可以在 zookeeper 的 `/brokers/ids/<broker_id>` 路径下查看。

## 方法1：hosts

### 准备信息

1. kafka 集群各节点的内网 ip 和 hostname 的对应信息

        10.13.8.59  kafka1
        10.13.76.7  kafka2
        10.13.79.81 kafka3

2. nginx 代理所在机器

        内网ip：10.13.9.72
        外网ip：106.75.143.227

### 配置 kafka broker 监听地址/端口

修改每个 kafka broker 的配置文件 `server.properties`：

    listeners=PLAINTEXT://kafka1:9092
    #advertised.listeners=PLAINTEXT://kafka1:9092

让每个 broker 注册到 zookeeper 的监听地址为当前节点的 hostname，并修改端口，让每个 broker 使用不同端口（之后会用同一个主机的 nginx 代理所有 kafka broker，所以需要使用端口进行区分，如果可以做到 nginx 代理机器和 kafka broker 数量一致，则不需要修改默认端口）

### 配置 nginx 代理

编辑 `/etc/nginx/nginx.conf`，增加 stream 配置

    $ vim /etc/nginx/nginx.conf

``` conf
stream {
    log_format proxy '$remote_addr [$time_local] '
                 '$protocol $status $bytes_sent $bytes_received '
                 '$session_time "$upstream_addr" '
                 '"$upstream_bytes_sent" "$upstream_bytes_received" "$upstream_connect_time"';

    access_log /var/log/nginx/tcp-access.log proxy;
    open_log_file_cache off;

    # 统一放置，方便管理
    include /etc/nginx/tcpConf.d/*.conf;
}
```

> [下载 nginx.conf]({{ site.url }}/resources/code/kafka/proxy/nginx.conf)

创建 `/etc/nginx/tcpConf.d/` 目录

    $ mkdir -p /etc/nginx/tcpConf.d/

编辑 `/etc/nginx/tcpConf.d/kafka.conf` 配置文件

    $ vim /etc/nginx/tcpConf.d/kafka.conf

``` conf
upstream tcp9092 {
    server 10.13.8.59:9092;
}
upstream tcp9093 {
    server 10.13.76.7:9093;
}
upstream tcp9094 {
    server 10.13.79.81:9094;
}

server {
    listen 9092;
    proxy_connect_timeout 8s;
    proxy_timeout 24h;
    proxy_pass tcp9092;
}
server {
    listen 9093;
    proxy_connect_timeout 8s;
    proxy_timeout 24h;
    proxy_pass tcp9093;
}
server {
    listen 9094;
    proxy_connect_timeout 8s;
    proxy_timeout 24h;
    proxy_pass tcp9094;
}
```

> [下载 kafka.conf]({{ site.url }}/resources/code/kafka/proxy/kafka.conf)

测试 nginx 配置：

    $ nginx -t

如果没有错误，应用 nginx 配置：

    $ nginx -s reload

这里 nginx 代理会将本地 9092，9093，9094 端口的请求转发到对应的 kafka broker 上

### 配置客户端机器

修改客户端 hosts 文件（106.75.143.227 为 nginx 所在机器外网ip）：

```
106.75.143.227 kafka1
106.75.143.227 kafka2
106.75.143.227 kafka3
```

## 方法2：advertised.listeners

[](https://medium.com/@iamsuraj/what-is-advertised-listeners-in-kafka-72e6fae7d68e)
