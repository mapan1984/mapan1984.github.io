# hadoop

## hdfs

## mapreduce

### 依赖

1. install Java, ssh, rsync
2. 

### 配置文件

1. `hadoop-env.sh`：Hadoop守护进程环境变量
2. 定位设置：
    1. `core-site.xml`

        fs.default.name: NameNode的IP地址及端口

    2. `hdfs-site.xml`

        dfs.name.dir: NameNode存储名字空间及汇报日志的位置
        dfs.data.dir: DataNode存储数据块的位置
        dfs.replication: 

    3. `yarn-site.xml`

    4. `mapred-site.xml`
    5. `mapred-queues.xml`

    6. `slaves`

## Kafka

1. topic：可在逻辑上视为消息队列，生产者和消费者需指定topic进行消息的push与pull
2. partition：一个topic在物理上被分为多个partition，每个partition都对应物理上的一个文件，通过将partition分配到不同的broker实现消息读取的负载均衡，producer发送消息时除了指定topic，还可指定key，由key来决定发送到那个partition
3. raplic：一个partition可以有多个备份，存放在不同broker上，raplic中只有一个leader负责和生产者以及消费者的读写，其余为follower，当leader宕机后重新进行选举。
4. consumer group：同一个group内只有一个consumer会消费某条消息，不同group内的consumer可以消费同一条消息

## zookeeper

Zookeeper提供了一个类似于Linux文件系统的树形结构（可认为是轻量级的内存文件系统，但只适合存少量信息，完全不适合存储大量文件或者大文件），同时提供了对于每个节点的监控与通知机制。

### 节点类型

### watch机制
