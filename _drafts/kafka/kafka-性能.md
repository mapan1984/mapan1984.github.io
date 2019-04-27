## JVM

    bin/kafka-server-start.sh

### 使用 G1 垃圾回收器

    -XX:+UseG1GC

### 堆内存

    KAFKA_HEAP_OPTS='-Xmx16G -Xms16G'   # 大小为主机内存的 50%

## Broker 参数配置

### 网络和ios操作线程配置

    # broker处理消息的最大线程数(读写缓冲区数据，基本没有io等待，配置线程数量为cpu核数加1)
    num.network.threads=9

    # broker处理磁盘IO的线程数(高峰期可能有些io等待，因此配置需要大些。配置线程数量为cpu核数2倍，最大不超过3倍)
    num.io.threads=16


### socket server可接受数据大小(防止OOM异常)(根据业务数据包大小适当调大)

java int的取值范围为（-2147483648~2147483647）

    socket.request.max.bytes=2147483600

### log 数据文件刷盘策略


    # 每当producer写入10000条消息时，刷数据到磁盘
    log.flush.interval.messages=10000

    # 每间隔1秒钟时间，刷数据到磁盘
    log.flush.interval.ms=1000

为了大幅度提高producer写入吞吐量，需要定期批量写文件。一般无需改动，如果topic的数据量较小可以考虑减少log.flush.interval.ms和log.flush.interval.messages来强制刷写数据，减少可能由于缓存数据未写盘带来的不一致。推荐配置分别message 10000，间隔1s。

### 日志保留策略配置

    # 日志保留时长
    log.retention.hours=72

    # 段文件配置
    log.segment.bytes=1073741824

日志建议保留三天，也可以更短；段文件配置1GB，有利于快速回收磁盘空间，重启kafka加载也会加快（kafka启动时是单线程扫描目录(log.dir)下所有数据文件）。如果文件过小，则文件数量比较多。

### replica复制配置

    num.replica.fetchers=3
    replica.fetch.min.bytes=1
    replica.fetch.max.bytes=5242880
    replica.fetch.wait.max.ms

每个follow从leader拉取消息进行同步数据，follow同步性能由这几个参数决定，分别为:

**拉取线程数(num.replica.fetchers)**: fetcher配置多可以提高follower的I/O并发度，单位时间内leader持有更多请求，相应负载会增大，需要根据机器硬件资源做权衡，建议适当调大；

**最小字节数(replica.fetch.min.bytes)**: 一般无需更改，默认值即可；

**最大字节数(replica.fetch.max.bytes)**：默认为1MB，这个值太小，推荐5M，根据业务情况调整

**最大等待时间(replica.fetch.wait.max.ms)**: follow拉取频率，频率过高，leader会积压大量无效请求情况，无法进行数据同步，导致cpu飙升。配置时谨慎使用，建议默认值，无需配置。

### 分区数量配置

    num.partitions=5

默认partition数量1，如果topic在创建时没有指定partition数量，默认使用此值。Partition的数量选取也会直接影响到Kafka集群的吞吐性能，配置过小会影响消费性能，建议改为5。

### replica lag

    replica.lag.time.max.ms=10000
    replica.lag.max.messages=4000
