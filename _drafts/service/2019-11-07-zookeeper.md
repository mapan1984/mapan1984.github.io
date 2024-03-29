---
title: zookeeper
tags: [zookeeper]
---

# zookeeper

Zookeeper提供了一个类似于Linux文件系统的树形结构（可认为是轻量级的内存文件系统，但只适合存少量信息，完全不适合存储大量文件或者大文件），同时提供了对于每个节点的监控与通知机制。

## 节点类型

* leader
* follower: 可以处理读请求，写请求转发给 leader，参与投票
* observer: 可以处理读请求，写请求转发给 leader，不参与投票

### 读写

1. 任何类型的节点都可以直接返回读请求的数据
2. 对于写请求：
    1. 当写请求发送到 leader 节点时，leader 将数据写入到本节点，并将数据发送到所有 follower 节点，当有超过一半以上节点(leader 和 follower, 不包括 observer)返回写成功之后，向 client 返回写成功响应
    2. 当写请求发送到 follower 节点时，followed 节点将请求转发给 leader 节点
    3. observer

## znode 节点类型

* 是否持久保存：
    * Persist: 一旦被创建，就不会丢失
    * Ephemeral: 在创建它的客户端和服务器之间的Session结束时自动被删除
* 是否顺序：
    * Sequence: 创建出的节点名在指定的名称后带有10位10进制序号，多个客户端创建同一名称的节点时，都可以创建成功，只是序号不同
    * Non-sequence: 多个客户端同时创建同一名称的Non-sequence节点时，只有一个可创建成功

上述 2 种方式可以组合出 4 种类型：

* PERSISTENT
* PERSISTENT_SEQUENTIAL
* EPHEMERAL
* EPHEMERAL_SEQUENTIAL

## watch机制

所有对Zookeeper的读操作，都可附带一个Watch，一旦相应的数据有变化，该Watch即被触发。

* Watch被触发时由服务器主动将更新推送给客户端，不需要客户端轮询
* 数据变化时，Watch只会被触发一次，如果客户端想要得到后续更新的通知，必须要在Watch被触发后重新注册

## 分布式锁与选举原理

### 非公平选举

#### 选择Leader/获得锁

多个客户端（节点）同时向Zookeeper集群注册Ephemeral且Non-sequence类型的节点，路径都为`/zkroot/leader`，则只有一个会创建成功，创建成功的客户端（节点）即成功竞选为Leader（获得锁），其他节点为Follower。

成为Follower的节点需要向`/zkroot/leader`注册一个Watch，用于Leader放弃领导或者意外宕机时接收通知。

#### 放弃领导/释放锁

如果Leader要放弃领导权，可用直接删除`/zkroot/leader`节点。如果Leader意外宕机，则其与Zookeeper之间的Session也结束，由于`/zkroot/leader`是Ephemeral类型的节点，所以也会被自动删除。

#### 重新选举

Follower在之前已经向`/zkroot/leader`注册过Watch，因此此时会收到通知。

Follower收到通知之后，进行新一轮选举，选举过程与之前相同。

### 公平选举

#### 选择Leader/获得锁

多个客户端（节点）同时向Zookeeper集群注册Ephemeral且Sequence类型的节点，路径都为`/zkroot/leader`，则所有客户端都会创建成功，每个客户端判断自己的节点序号，节点序号最小的客户端（节点）即成功竞选为Leader（获得锁），其他节点为Follower。

成为Follower的节点需要向节点序号刚好小于自己的节点注册Watch，用于Leader放弃领导或者意外宕机时接收通知。

#### 放弃领导/释放锁

如果Leader要放弃领导权，可用直接删除`/zkroot/leader`节点。如果Leader意外宕机，则其与Zookeeper之间的Session也结束，由于`/zkroot/leader`是Ephemeral类型的节点，所以也会被自动删除。

#### 重新选举

当Leader放弃领导后，节点序号刚好大于它的Follower会收到通知，此Follower判断自己的序号是否为最小的节点，如果是测成为新的Leader。

如果Leader之后的节点在Leader之前就以宕机，后续节点会收到通知并向Leader创建的节点注册Watch

## 运维

### 配置参数

- `clientPort`: 对外服务的端口
- `dataDir`: snapshots 和 transaction log 文件存储路径
- `dataLogDir`: transaction log 文件存储路径，优先级高于 dataDir
- `tickTime`: zookeeper 的时间单位，毫秒，其他时间设置基于此单位
- `maxClientCnxns`: 最多客户端连接数，默认 60，设置为 0 表示无限制
- `autopurge.snapRetainCount`: 保留的 snapshot 以及对应的 transaction log 文件数量
- `autopurge.purgeInterval`: 清理时间间隔，单位小时，默认为 0 表示不清理
- `minSessionTimeout`: 默认 2 * tickTime
- `maxSessionTimeout`: 默认 20 * tickTime
- `server`：集群模式时配置，格式为 `server.<myid>=<ip>:2888:3888`，2888 表示集群内通讯端口，3888 表示 leader 选举端口

        server.1=node1:2888:3888
        server.2=node2:2888:3888
        server.3=node3:2888:3888

### JVM

编辑 `conf/java.env` 文件：

``` sh
# 设置 `-XX:+AlwaysPreTouch` 参数，在进程启动的时候，让 jvm 通过 demand-zeroed 方式将内存一次分配到位（ES #16937 / ZK #301）
# 使用 CMS 垃圾回收器（“jdk7 + 内存使用不多” 的缘故，可以暂不考虑 G1GC）
export JVMFLAGS="-Xms3G -Xmx3G -Xmn1G -XX:+AlwaysPreTouch -XX:CMSInitiatingOccupancyFraction=70 -XX:+UseParNewGC -XX:+UseConcMarkSweepGC"
# 如果需要打印 GC 日志，则多增加一些 flag
# export JVMFLAGS="-Xms3G -Xmx3G -Xmn1G -XX:+AlwaysPreTouch -XX:CMSInitiatingOccupancyFraction=70 -XX:+UseParNewGC -XX:+UseConcMarkSweepGC -XX:+PrintGCDetails -XX:-PrintGCTimeStamps -Xloggc:/home/zookeeper/logs/zookeeper_`date '+%Y%m%d%H%M%S'`.gc -XX:-UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=64M"
# 需要注意的是，如果不希望 zkCli 等命令创建 gc 日志文件，需要把 JVMFLAGS 改成 SERVER_JVMFLAGS
```

### AdminServer

3.5.0 版本之后，增加 AdminServer 提供 http 接口用于管理监控集群

``` conf
admin.enableServer
(Java system property: zookeeper.admin.enableServer)

Set to "false" to disable the AdminServer. By default the AdminServer is enabled.

admin.serverPort
(Java system property: zookeeper.admin.serverPort)

The port the embedded Jetty server listens on. Defaults to 8080.

admin.commandURL
(Java system property: zookeeper.admin.commandURL)

The URL for listing and issuing commands relative to the root URL. Defaults to "/commands".
```

### 命令操作

启动：

    ./bin/zkServer.sh start

停止：

    ./bin/zkServer.sh stop

状态：

    ./bin/zkServer.sh status

服务信息（查看 leader/follower）

    echo srvr | nc localhost 2181

监控

    echo mntr | nc 127.0.0.1 2181

输出关于性能和连接的客户端的列表（查看leader/follower）

    echo stat | nc localhost 2181

## 日志

### 事务日志

事务日志记录更新操作，zookeeper 在收到客户端请求后，会在返回成功响应之前将请求更新操作的事务日志写到磁盘上，

事务日志的文件名规则为 `log.<transaction_id>`，`transaction_id` 为写入该日志的第一个事务ID，十六进制表示。

可以使用 `org.apache.zookeeper.server.LogFormatter` 查看事务日志内容，复制并修改 `zkCli.sh` 脚本：

``` sh
#!/bin/sh

# use POSTIX interface, symlink is followed automatically
ZOOBIN="${BASH_SOURCE-$0}"
ZOOBIN=`dirname ${ZOOBIN}`
ZOOBINDIR=`cd ${ZOOBIN}; pwd`

if [ -e "$ZOOBIN/../libexec/zkEnv.sh" ]; then
  . "$ZOOBINDIR"/../libexec/zkEnv.sh
else
  . "$ZOOBINDIR"/zkEnv.sh
fi

# JAVA "-Dzookeeper.log.dir=${ZOO_LOG_DIR}" "-Dzookeeper.root.logger=${ZOO_LOG4J_PROP}" \
#     -cp "$CLASSPATH" $CLIENT_JVMFLAGS $JVMFLAGS \
#     org.apache.zookeeper.ZooKeeperMain "$@"

$JAVA -cp "$CLASSPATH" org.apache.zookeeper.server.LogFormatter "$@"
```

### 快照日志

快照会把 zookeeper 保存的全部数据序列化后存储在磁盘，生成快照文件

事务日志的文件名规则为 `snapshot.<transaction_id>`，`transaction_id` 表示触发快照的瞬间，提交的最后一个事务的ID。

生成 snapshot 之前，会判断 `logCount > (snapCount / 2 + randRoll)` 来决定是否启动 snapshot 线程。

## 会话

zookeeper 客户端与服务端建立连接之后，服务端会生成一个会话（session），客户端与服务端维持一个长连接，在 session.timeout 时间之内，客户端需要向服务端发送心跳。

当客户端与服务端的连接因为网络故障断开之后，客户端会主动在 zookeeper 地址列表（即配置的连接地址）中选择新的地址进行连接。

1. 如果在 session.timeout 时间内重新连接成功，则没有任何影响。
2. 如果没有及时在 session.timeout 时间内重新连接成功，那么服务端会认为这个 session 已经结束，session 失效后 zookeeper 会将这个 session 创建的临时节点与注册的 Watcher 清理掉。 在 session 超时之后，如果客户端重新连接上了服务端，服务端会向客户端返回 session expired 错误，客户端需要断开此次连接，重新连接建立新的 session。

### 会话超时

客户端在建立连接时，可以指定参数 `zookeeper.session.timeout.ms` 作为会话超时时间，但是这个值不能超过 zookeeper 服务端配置的 `minSessionTimeout` 和 `maxSessionTimeout` 指定的范围，默认时间范围是 `2 * tickTime ~ 20 * tickTime`
