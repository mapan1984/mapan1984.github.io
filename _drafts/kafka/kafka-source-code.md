### Core

- admin: 管理命令
    - TopicCommand
- api:
- cluster: 集群相关代码，包含 Partition, Replica 等
    - Broker: Broker 定义
    - BrokerEndPoint
    - Cluster: Cluster 定义，The set of active brokers in the cluster
    - EndPoint
    - Partition: Data structure that represents a topic partition. The leader maintains the AR, ISR, CUR, RAR
    - Replica
- common: 一些常用的公共类(Exception, ...)
- consumer: 消费者代码（已经 deprecated，并且挪到 clients 模块）
- controller: KafkaController
- coordinator:
    - group
        - GroupCoordinator
    - transaction
- log: log 管理模块（kafka 存储消息的方式）
- message
    - CompressionCodec: 压缩方式的定义
- metrics: kafka 监控统计
- network: 网络层处理，nio 的一层封装
    - SocketServer: An NIO socket server. The threading model is 1 Acceptor thread that handles new connections Acceptor has N Processor threads that each have their own selector and read requests from sockets M Handler threads that handle requests and produce responses back to the processor threads for writing.

                     Acceptor
                        |
                        V
               (IO 复用，管理新连接)
               /        |          \
              /         |           \
                    Processor
                        |
                        V
           (IO 复用，管理接受连接的读写)
                        |
                        V
                 各种请求的 Handler
        1. Acceptor: 创建一堆 processor 线程；接受新连接，将新的 socket 指派个某个 processor 线程
        2. Processor: 处理若干个 socket，接受请求转发给各种 handler 处理，response 再经由 processor 线程发送回去

    - RequestChannel
- security: 权限管理
    - auth
- serializer: 定义 Encoder 和 Docoder 接口和一些基础的如 String, Long 的实现
    - Decoder
- server: kafka server 的主要实现逻辑
    - checkpoints
    - epoch
    - kafkaServer
    - KafkaSErverStartable: 创建 `KafkaServer`
    - KafkaConfig: kafka 配置设置实现
        - `object Defaults`
        - `object KafkaConifg`
- tools: 各种可以独立运行的工具
    - ConsoleConsumer
    - ConsoleProducer
- utils: 各种工具类
    - json
    - timer
- zk
    - AdminZkClient
    - KafkaZkClient
    - ZkData
- zookeeper
    - ZooKeeperClient
- Kafka: kafka 启动入口
    - `object Kafka extends Logging`：获取配置项，启动代理 `KafkaServerStartable`


### clients

- common
    - network
        - Selector.java

