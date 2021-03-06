### 基本概念

1. producer：向kafka broker发消息的客户端
2. consumer：从kafka broker取消息的客户端
1. topic：可在逻辑上视为消息队列，生产者和消费者需指定topic进行消息的push与pull
2. partition：一个topic在物理上被分为多个partition，每个partition都对应物理上的一个文件，通过将partition分配到不同的broker实现消息读取的负载均衡，producer发送消息时除了指定topic，还可指定key，由key来决定发送到那个partition。partition中的每条消息都会分配一个有序id(offset)，Kafka只保证按一个partition中的顺序将消息发给consumer，不保证一个topic的整体的顺序。
3. raplic：一个partition可以有多个备份，存放在不同broker上，raplic中只有一个leader负责和生产者以及消费者的读写，其余为follower，当leader宕机后重新进行选举。
4. consumer group：同一个group内只有一个consumer会消费某条消息，不同group内的consumer可以消费同一条消息。Kafka借此实现广播与单播，要实现广播，只要每个consumer都有一个独立的consumer group,要实现单播，则所有的consumer都在一个consumer group中。
5. broker：一台Kafka服务就是一个broker，一个集群由多个broker组成。

### consumer 消费规则

Kafka 保证同一 Consumer Group 中只有一个 Consumer 会消费某条消息，实际上，Kafka 保证的是稳定状态下每一个 Consumer 实例只会消费某一个或多个特定 Partition 的数据，而某个 Partition 的数据只会被某一个特定的 Consumer实例所消费。

### 列出 topic 详情

``` sh
${KAFKA_HOME}/bin/kafka-topics.sh --list --zookeeper $(hostname):2181 > topics.data
while read topic
do
    ${KAFKA_HOME}/bin/kafka-topics.sh --describe --zookeeper $(hostname):2181 --topic $topic
done < topics.data
```

### 列出 consumer 详情

``` sh
/usr/local/kafka/bin/kafka-consumer-groups.sh --zookeeper $(hostname):2181 --list > zk.data
while read group
do
    echo ==================== zk group name: $group ===============================
    /usr/local/kafka/bin/kafka-consumer-groups.sh --zookeeper $(hostname):2181 --describe --group $group
    echo
    echo
done < zk.data


/usr/local/kafka/bin/kafka-consumer-groups.sh --bootstrap-server $(hostname):9092 --list > kf.data
while read group
do
    echo ==================== kf group name: $group ===============================
    /usr/local/kafka/bin/kafka-consumer-groups.sh --bootstrap-server $(hostname):9092  --describe --group $group
    echo
    echo
done < kf.data
```

### 重分区/修改副本数

创建 `topics.json` 文件，文件内容为需要重分区的 topic：

``` json
{
    "topics": [
        {
            "topic": "statistics"
        }
    ],
    "version": 1
}
```

执行 `kafka-reassign-partitions.sh`，指定 `--generate` 参数和刚才创建的 `topics.json` 文件，生成描述 partition 分布的内存：

    $ kafka-reassign-partitions.sh --zookeeper $(hostname):2181 --generate --topics-to-move-json-file topics.json --broker-list 1,2,3
    Current partition replica assignment
    {"version":1,"partitions":[{"topic":"statistics","partition":0,"replicas":[3],"log_dirs":["any"]}]}

    Proposed partition reassignment configuration
    {"version":1,"partitions":[{"topic":"statistics","partition":0,"replicas":[1],"log_dirs":["any"]}]}

*低版本没有 `log_dirs` 字段，可以忽略*

命令会给出现在的 partition 分布和目的 partition 分布，将生成的内容分别保存到 `current.json`(用于恢复) `reassign.json`(之后的计划)

调整 `replicas.json` 的内容，`replicas` 字段的含义是该 partition 分布的 broker id：
1. 通过增加/减少 `replicas` 中的 broker id 可以增加/减少副本（`log_dirs` 包含的项要与 `replicas` 包含的项数目一致）
2. 调整 `replicas` 字段的第一个 broker id 可以指定这个 partition 的优先 leader

``` json
{
    "partitions": [
        {
            "log_dirs": [
                "any", "any", "any"
            ],
            "partition": 0,
            "replicas": [
                1, 2, 3
            ],
            "topic": "statistics"
        }
    ],
    "version": 1
}
```

执行 `kafka-reassign-partitions.sh`，指定 `--execute` 参数和 `reassign.json` 文件，执行 partition 重分布：

    $ kafka-reassign-partitions.sh --zookeeper $(hostname):2181 --execute --reassignment-json-file reassign.json

执行 `kafka-reassign-partitions.sh`，指定 `--verify` 参数和 `reassign.json` 文件，确认 partition 重分布进度：

    $ kafka-reassign-partitions.sh --zookeeper $(hostname):2181 --verify --reassignment-json-file reassign.json

### replica

partition 的 replica 列表被称为 AR(Assigned Replicas)，AR 中的第一个 Replica 即为 Preferred Replica，kafka 需要保证 Preferred Replica 被均匀分布在集群的所有的 Broker 上

### controller

broker 通过抢夺注册 zk 的 `/controller` 路径成为 controller

### 指定位置消费

    $ bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list $(hostname):9092 --topic logs

    $ bin/kafka-console-consumer.sh --bootstrap-server $(hostname):9092 --topic logs --offset 3418783 --partition 0


### __consumer_offsets

    $KAFKA_HOME/bin/kafka-console-consumer.sh --formatter "kafka.coordinator.group.GroupMetadataManager\$OffsetsMessageFormatter" --bootstrap-server $(hostname):9092 --topic __consumer_offsets

    $KAFKA_HOME/bin/kafka-console-consumer.sh --formatter "kafka.coordinator.GroupMetadataManager\$OffsetsMessageFormatter" --zookeeper $(hostname):2181 --topic __consumer_offsets

格式：

    [Group, Topic, Partition]::[OffsetMetadata[Offset, Metadata], CommitTime, ExpirationTime]

分区规则：

    Math.abs(groupID.hashCode()) % numPartitions

### listeners

* `listeners`

    key:value 的列表，key 是 listeners 的名称，value 是 listeners ip 地址与 port

        listeners=EXTERNAL_LISTENER_CLIENTS://阿里云ECS外网IP:9092,INTERNAL_LISTENER_CLIENTS://阿里云ECS内网IP:9093,INTERNAL_LISTENER_BROKER://阿里云ECS内网IP:9094

* `advertised.listeners`

    kafka 需要把 `listeners` 配置的地址信息发布到 zookeeper 中供客户端获取，如果配置了 `advertised.listeners`，则会优先把 `advertised.listeners` 的配置的地址信息发布到 zookeeper，提供多个 listeners 的情况下，可以利用 `advertised.listeners` 配置只发布客户端使用的地址

        advertised.listeners=EXTERNAL_LISTENER_CLIENTS://阿里云ECS外网IP:9092

* `listener.security.protocol.map`

    key:value 的列表，key 是 listeners 的名称，value 是安全协议

        listener.security.protocol.map=EXTERNAL_LISTENER_CLIENTS:SSL,INTERNAL_LISTENER_CLIENTS:PLAINTEXT,INTERNAL_LISTENER_BROKER:PLAINTEXT

* `inter.broker.listener.name`

    指定一个 listener 名称，用于 broker 之间通信

        inter.broker.listener.name=INTERNAL_LISTENER_BROKER

> advertised.listeners配置项中配置的Listener名称或者说安全协议必须在listeners中存在。因为真正创建连接的是listeners中的信息。
> inter.broker.listener.name配置项中配置的Listener名称或者说安全协议必须在advertised.listeners中存在。因为Broker之间也是要通过advertised.listeners配置项获取Internal Listener信息的。


来源：http://www.devtalking.com/articles/kafka-practice-16/
