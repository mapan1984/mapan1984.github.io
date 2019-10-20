# consul 节点的模式

## Client

客户端模式：所有注册到当前节点的服务都会被转发到 Server，本身不持久化信息

## Server

功能和 Client 一样，但是它会持久化保存信息到本地

### Server Leader

Server Leader 负责同步注册的信息给其他的 Server，同时也要负责各个节点的健康检测

# 用 docker 启动

## Server 1

```
docker run -d \
    -e 'CONSUL_LOCAL_CONFIG={"skip_leave_on_interrupt": true}' \
    --name=node1 \
    consul agent \
    -server \  # 表示这个节点是个 Server
    -bind=172.17.0.2  \  # 绑定地址，用于节点之间通信的地址
    -bootstrap-expect=3 \  # 期望提供的 Server 节点数目(达到数目后被激活，转换为 Leader)
    -node=node1  # 节点名称
```

```
docker run -d \
    -e 'CONSUL_LOCAL_CONFIG={"skip_leave_on_interrupt": true}' \
    --name=node1 \
    --net=host \
    -p 8300:8300 \
    -p 8301:8301 \
    -p 8301:8301/udp  \
    -p 8302:8302/udp \
    -p 8302:8302 \
    -p 8400:8400 \
    -p 8500:8500 \
    -p 53:53/udp \
    -h consul \
    consul agent \
    -server \
    -bind=172.17.0.2  \
    -bootstrap \
    -node=node1
```

## Server 2

```
docker run -d \
    -e 'CONSUL_LOCAL_CONFIG={"skip_leave_on_interrupt": true}' \
    --name=node2 \
    consul agent \
    -server \
    -bind=172.17.0.3  \
    -join=172.17.0.2 \  # 表示启动的时候要加入到节点1的集群
    -node-id=$(uuidgen | awk '{print tolower($0)}')  \  # 指定唯一的节点id
    -node=node2
```

```
docker run -d \
    -e 'CONSUL_LOCAL_CONFIG={"skip_leave_on_interrupt": true}' \
    --name=node2 \
    consul agent \
    -server \
    -bind=172.17.0.3  \
    -join=192.168.99.100 \
    -node-id=$(uuidgen | awk '{print tolower($0)}') \
    -node=node2
```

## Server 3

```
docker run -d \
    -e 'CONSUL_LOCAL_CONFIG={"skip_leave_on_interrupt": true}' \
    --name=node3 \
    consul agent \
    -server \
    -bind=172.17.0.4  \
    -join=172.17.0.2 \
    -node-id=$(uuidgen | awk '{print tolower($0)}')  \
    -node=node3 \
    -client=172.17.0.4  # 表示注册或者查询等一系列客户端对它操作的 IP
```

## Client

```
# 没有 `-server`，表示这个节点是 client
docker run -d \
    -e 'CONSUL_LOCAL_CONFIG={"leave_on_terminate": true}' \
    --name=node4 \
    consul agent \
    -bind=172.17.0.5 \
    -retry-join=172.17.0.2 \
    -node-id=$(uuidgen | awk '{print tolower($0)}')  \
    -node=node4
```

查看集群的状态：

    $ docker exec -t node1 consul members

# 故障恢复

1. leader：leader挂了，consul会重新选取出新的leader，只要超过一半的SERVER还活着，集群是可以正常工作的

获取 leader：

    $ curl http://172.17.0.4:8500/v1/status/leader

# 注册

    PUT http://consul:8500/v1/agent/service/register

body:

``` javascript
{
  "Name": "userService", // 服务名，需要区分不同的业务服务，可以部署多份并使用相同的 name 注册
  "ID": "userServiceId", // 服务id，每个节点上需要唯一，如果有重复会被覆盖
  "Tags": [              // 服务的tag，自定义，可以根据这个tag来区分同一个服务名的服务
    "primary",
    "v1"
  ],
  "Address": "127.0.0.1",// 服务注册到consul的IP，服务发现，发现的就是这个IP
  "Port": 8000,          // 服务注册consul的PORT，发现的就是这个PORT
  "EnableTagOverride": false,
  "Check": {             //健康检查部分
    "DeregisterCriticalServiceAfter": "90m",
    "HTTP": "http://www.baidu.com", //指定健康检查的URL，调用后只要返回20X，consul都认为是健康的
    "Interval": "10s"   //健康检查间隔时间，每隔10s，调用一次上面的URL
  }
}
```

``` sh
curl http://172.17.0.4:8500/v1/agent/service/register -X PUT -i -H "Content-Type:application/json" -d '{
 "ID": "userServiceId",
 "Name": "userService",
 "Tags": [
   "primary",
   "v1"
 ],
 "Address": "127.0.0.1",
 "Port": 8000,
 "EnableTagOverride": false,
 "Check": {
   "DeregisterCriticalServiceAfter": "90m",
   "HTTP": "http://www.baidu.com",
   "Interval": "10s"
 }
}'
```

# 发现

``` sh
curl http://172.17.0.4:8500/v1/catalog/service/userService
```

body:

``` javascript
[
    {
        "Address": "172.17.0.4",
        "CreateIndex": 880,
        "ID": "e6e9a8cb-c47e-4be9-b13e-a24a1582e825",
        "ModifyIndex": 880,
        "Node": "node3",
        "NodeMeta": {},
        "ServiceAddress": "127.0.0.1",
        "ServiceEnableTagOverride": false,
        "ServiceID": "userServiceId",
        "ServiceName": "userService",
        "ServicePort": 8000,
        "ServiceTags": [
            "primary",
            "v1"
        ],
        "TaggedAddresses": {
            "lan": "172.17.0.4",
            "wan": "172.17.0.4"
        }
    }
]
```

# 存储 key

    $ docker exec -t node1 consul kv put user/config/connections 5

    $ docker exec -t node1 consul kv get -detailed user/config/connections
