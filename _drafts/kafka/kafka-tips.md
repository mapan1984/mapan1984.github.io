### 基本概念

1. producer：向kafka broker发消息的客户端
2. consumer：从kafka broker取消息的客户端
1. topic：可在逻辑上视为消息队列，生产者和消费者需指定topic进行消息的push与pull
2. partition：一个topic在物理上被分为多个partition，每个partition都对应物理上的一个文件，通过将partition分配到不同的broker实现消息读取的负载均衡，producer发送消息时除了指定topic，还可指定key，由key来决定发送到那个partition。partition中的每条消息都会分配一个有序id(offset)，Kafkaz只保证按一个partition中的顺序将消息发给consumer，不保证一个topic的整体的顺序。
3. raplic：一个partition可以有多个备份，存放在不同broker上，raplic中只有一个leader负责和生产者以及消费者的读写，其余为follower，当leader宕机后重新进行选举。
4. consumer group：同一个group内只有一个consumer会消费某条消息，不同group内的consumer可以消费同一条消息。Kafka借此实现广播与单播，要实现广播，只要每个consumer都有一个独立的consumer group,要实现单播，则所有的consumer都在一个consumer group中。
5. broker：一台Kafka服务就是一个broker，一个集群由多个broker组成。

### consumer 消费规则

Kafka保证同一Consumer Group中只有一个Consumer会消费某条消息，实际上，Kafka保证的是稳定状态下每一个Consumer实例只会消费某一个或多个特定Partition的数据，而某个Partition的数据只会被某一个特定的Consumer实例所消费。

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

### 重分区


`topics.json`

``` json
{
    "topics": [
        {
            "topic": "ecarx-datacontent-sync-xianxia"
        },
        {
            "topic": "logclickrate-test"
        },
        {
            "topic": "logtrient"
        },
        {
            "topic": "ecarx-datacontent-sync-idc"
        },
        {
            "topic": "ecarx-datacontent-v1"
        },
        {
            "topic": "logclickrate"
        },
        {
            "topic": "ecarx_log_analysis"
        },
        {
            "topic": "ecarx-datacontent-sync-v0"
        },
        {
            "topic": "ecarx-datacontent-sync-v1"
        },
        {
            "topic": "ecarx-datacontent-sync"
        },
        {
           "topic": "ecarx-loganalysis-es"
        }
    ],
    "version": 1
}
```

kafka-reassign-partitions.sh --zookeeper $(hostname):2181 --generate --topics-to-move-json-file topics.json --broker-list 1,2,3

`reassign.json`

``` json
{
    "version": 1,
    "partitions": [{
        "topic": "login",
        "partition": 0,
        "replicas": [1, 3]
    }, {
        "topic": "shopdata",
        "partition": 0,
        "replicas": [3, 2]
    }, {
        "topic": "progress",
        "partition": 0,
        "replicas": [2, 3, 1]
    }, {
        "topic": "test",
        "partition": 0,
        "replicas": [1, 2]
    }]
}
```

kafka-reassign-partitions.sh --zookeeper $(hostname):2181 --execute --reassignment-json-file reassign.json

kafka-reassign-partitions.sh --zookeeper $(hostname):2181 --verify --reassignment-json-file reassign.json

### replica

partition 的 replica 列表被称为 AR(Assigned Replicas)，AR 中的第一个 Replica 即为 Preferred Replica，kafka 需要保证 Preferred Replica 被均匀分布在集群的所有的 Broker 上

### controller

broker 通过抢夺注册 zk 的 `/controller` 路径成为 controller
