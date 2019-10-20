## JVM

### 使用 G1 垃圾回收器

    -XX:+UseG1GC

### 堆内存

    KAFKA_HEAP_OPTS='-Xmx16G -Xms16G'   # 大小为主机内存的 50%

## Broker 参数配置

### 网络和ios操作线程配置

    num.network.threads=9

broker处理消息的最大线程数(主要处理网络io，读写缓冲区数据，基本没有io等待，配置线程数量为cpu核数加1)

    num.io.threads=16

broker处理磁盘IO的线程数(处理磁盘io操作，高峰期可能有些io等待，因此配置需要大些。配置线程数量为cpu核数2倍，最大不超过3倍)

    socket.request.max.bytes=2147483600

socket server可接受数据大小(防止OOM异常)，根据自己业务数据包的大小适当调大。这里取值是int类型的，而受限于java int类型的取值范围

> java int的取值范围为（-2147483648~2147483647）

### log 数据文件刷盘策略

    # 每当producer写入10000条消息时，刷数据到磁盘
    log.flush.interval.messages=10000

    # 每间隔1秒钟时间，刷数据到磁盘
    log.flush.interval.ms=1000

为了大幅度提高producer写入吞吐量，需要定期批量写文件。一般无需改动，如果topic的数据量较小可以考虑减少 `log.flush.interval.ms` 和 `log.flush.interval.messages` 来强制刷写数据，减少可能由于缓存数据未写盘带来的不一致。推荐配置分别message 10000，间隔1s。

> Kafka官方并不建议通过Broker端的log.flush.interval.messages和log.flush.interval.ms来强制写盘，认为数据的可靠性应该通过Replica来保证，而强制Flush数据到磁盘会对整体性能产生影响。

### 日志保留策略配置

    # 日志保留时长
    log.retention.hours=72

日志建议保留三天，也可以更短

    # 段文件大小
    log.segment.bytes=1073741824

段文件配置1GB，有利于快速回收磁盘空间，重启kafka加载也会加快。

> kafka启动时是单线程扫描目录(log.dir)下所有数据文件，如果段文件过小，则文件数量比较多

### replica复制配置

    # 拉取线程数：fetchers 配置多可以提高follower的I/O并发度，单位时间内leader持有更多请求，相应负载会增大，需要根据机器硬件资源做权衡，建议适当调大；
    num.replica.fetchers=3

    # 拉取消息最小字节：一般无需更改，默认值即可；
    replica.fetch.min.bytes=1

    # 拉取消息最大字节：默认为1MB，根据业务情况调整
    replica.fetch.max.bytes=5242880

    # 拉取消息等待时间：决定 follower 的拉取频率，频率过高，leader会积压大量无效请求情况，无法进行数据同步，导致cpu飙升。配置时谨慎使用，建议默认值，无需配置。
    replica.fetch.wait.max.ms

### 分区数量配置

    num.partitions=1

默认 partition 数量 1，如果topic在创建时没有指定partition数量，默认使用此值。Partition的数量选取也会直接影响到Kafka集群的吞吐性能，配置过小会影响消费性能。

### replica 数配置

    default.replication.factor=1

这个参数指新创建一个topic时，默认的Replica数量，Replica过少会影响数据的可用性，太多则会白白浪费存储资源，一般建议在2~3为宜。

### replica lag

    replica.lag.time.max.ms=10000
    replica.lag.max.messages=4000

## 生产者参数配置

    # 内存缓冲大小
    buffer.memory=33554432

在 Producer 端用来存放尚未发送出去的 Message 的缓冲区大小，默认 32MB。内存缓冲区内的消息以一个个 batch 的形式组织，每个 batch 内包含多条消息，Producer 会把多个 batch 打包成一个 request 发送到 kafka 服务器上。内存缓冲区满了之后可以选择阻塞发送或抛出异常，由 `block.on.buffer.full` 的配置来决定。

    batch.size=16384

Producer会尝试去把发往同一个Partition的多个Requests进行合并，`batch.size` 指明了一次Batch合并后Requests总大小的上限。如果这个值设置的太小，可能会导致所有的Request都不进行Batch。

    linger.ms=0

producer 合并的消息的大小未达到 `batch.size`，但如果存在时间达到 `linger.ms`，也会进行发送。

    #  最大请求大小
    max.request.size

决定了每次发送给Kafka服务器请求的最大大小，同时也会限制你一条消息的最大大小也不能超过这个参数设置的值，这个其实可以根据你自己的消息的大小来灵活的调整

    # 发送失败重试次数
    retries
    # 每次重试间隔时间
    retries.backoff.ms

    # 压缩类型
    compression.type=none

默认发送不进行压缩，推荐配置一种适合的压缩算法，可以大幅度的减缓网络压力和Broker的存储压力。

    acks=1

这个配置可以设定发送消息后是否需要Broker端返回确认，设置时需要权衡数据可靠性和吞吐量。

## 消费者参数配置

    num.consumer.fetchers=1

启动Consumer的个数，适当增加可以提高并发度。

    fetch.min.bytes=1

每次Fetch Request至少要拿到多少字节的数据才可以返回。

    fetch.wait.max.ms=100

在Fetch Request获取的数据至少达到 `fetch.min.bytes` 之前，允许等待的最大时长。
