# ukafka 外网 nignx 代理访问集群

## 准备信息

1. kafka 集群各节点的内网 ip 和 hostname 的对应信息

        10.13.8.59 ukafka-ozowgw5f-kafka1
        10.13.76.7 ukafka-ozowgw5f-kafka2
        10.13.79.81 ukafka-ozowgw5f-kafka3

2. nginx 代理所在机器

        内网ip：10.13.9.72
        外网ip：106.75.143.227

## 配置 kafka broker 监听地址/端口

修改每个 kafka broker 的配置文件 `server.properties`：

    advertised.listeners=PLAINTEXT://ukafka-ozowgw5f-kafka1:9092

让每个 broker 监听的地址为当前节点的 hostname

并修改端口，让每个 broker 使用不同端口（之后会用同一个主机的 nginx 代理所有 kafka broker，所以需要使用端口进行区分，如果可以做到 nginx 代理机器和 kafka broker 数量一致，则不需要修改默认端口）

## 配置 nignx 代理

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

> [下载 nginx.conf]({{ site.url }}/resources/code/kafka/nginx.conf)

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

> [下载 kafka.conf]({{ site.url }}/resources/code/kafka/kafka.conf)

测试 nginx 配置：

    $ nginx -t

如果没有错误，应用 nginx 配置：

    $ nginx -s reload

## 配置客户端机器

修改客户端 hosts 文件（106.75.143.227 为 nginx 所在机器外网ip）：

```
106.75.143.227 ukafka-ozowgw5f-kafka1
106.75.143.227 ukafka-ozowgw5f-kafka2
106.75.143.227 ukafka-ozowgw5f-kafka3
```
