# Kafka 通信协议

## 核心的客户端请求API

1. 元数据（Metadata） – 描述可用的 brokers，包括他们的主机和端口信息，并给出了每个 broker 上分别存有哪些分区 Partition；
2. 发送（Send） – 发送消息到 broker；
3. 获取（Fetch） – 从 broker 获取消息，其中，一个获取数据，一个获取集群的元数据，还有一个获取 topic 的偏移量信息；
4. 偏移量（Offsets） – 获取给定 topic 的分区的可用偏移量信息；
5. 偏移量提交（Offset Commit） – 提交消费者组（Consumer Group）的一组偏移量；
6. 偏移量获取（Offset Fetch） – 获取一个消费者组的一组偏移量；


每一种 API 都将在下面详细说明。此外，从 0.9 版本开始，Kafka 支持为消费者和 Kafka Connect 提供通用的分组管理。为此客户端 API 又提供五个请求：

1. 分组协调者（GroupCoordinator） – 用来定位一个分组当前的协调者。
2. 加入分组（JoinGroup） – 成为某一个分组的一个成员，当分组不存在（没有一个成员时）创建分组。
3. 同步分组（SyncGroup） – 同步分组中所有成员的状态（例如分发分区分配信息 (Partition Assignments) 到各个组员）。
4. 心跳（Heartbeat） – 保持组内成员的活跃状态。
5. 离开分组（LeaveGroup） – 直接离开一个组。

最后，有几个管理 API，可用于监控 / 管理的 Kafka 集群（KIP-4 完成时，这个列表将变长）：

1. 描述消费者组（DescribeGroups） – 用于检查一组群体的当前状态（如：查看消费者分区分配）。
2. 列出组（ListGroups） – 列出某一个 broker 当前管理的所有组

## 通信方式

Kafka 使用基于TCP的二进制协议，该协议定义了所有API的请求及响应消息，所有的消息都是通过长度来分割，并且由后面描述的基本类型组成。

## 版本与兼容性

每个请求都包含 API Key，里面包含了被调用的API标识，以及表示这些请求和响应格式的版本号。

## 协议

###  基本数据类型（Protocol Primitive Types）

该协议是建立在下列基本类型之上。

1. 定长基本类型（Fixed Width Primitives）
int8, int16, int32, int64 – 不同精度 (以 bit 数区分) 的带符号整数，以大端（Big Endiam）方式存储.

2. 变长基本类型（Variable Length Primitives）
bytes, string – 这些类型由一个表示长度的带符号整数 N 以及后续 N 字节的内容组成。长度如果为 - 1 表示空（null）. string 使用 int16 表示长度，bytes 使用 int32.

3. 数组（Arrays）
这个类型用来处理重复的结构体数据。他们总是由一个代表元素个数 int32 整数 N，以及后续的 N 个重复结构体组成，这些结构体自身是有其他的基本数据类型组成。我们后面会用 BNF 语法展示一个 foo 的结构体数组 [foo]

### 协议格式


#### 总

``` bnf
RequestOrResponse => MessageSize (RequestMessage | ResponseMessage)
  MessageSize => int32
```

MessageSize 域给出了后续请求或响应消息的字节 (bytes) 长度。客户端可以先读取 4 字节的长度 N，然后读取并解析后续的 N 字节请求内容

#### 请求

``` bnf
RequestMessage => ApiKey ApiVersion CorrelationId ClientId RequestMessage
  ApiKey => int16
  ApiVersion => int16
  CorrelationId => int32
  ClientId => string
  RequestMessage => MetadataRequest | ProduceRequest | FetchRequest | OffsetRequest | OffsetCommitRequest | OffsetFetchRequest
```

| 域（FIELD）   | 描述                                                                                                                                                                                                                                                                                              |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApiKey        | 这是一个表示所调用的 API 的数字 id（即它表示是一个元数据请求？生产请求？获取请求等）.                                                                                                                                                                                                             |
| ApiVersion    | 这是该 API 的一个数字版本号。我们为每个 API 定义一个版本号，该版本号允许服务器根据版本号正确地解释请求内容。响应消息也始终对应于所述请求的版本的格式。                                                                                                                                           |
| CorrelationId | 这是一个用户提供的整数。它将会被服务器原封不动地回传给客户端。用于匹配客户机和服务器之间的请求和响应。                                                                                                                                                                                            |
| ClientId      | 这是为客户端应用程序的自定义的标识。用户可以使用他们喜欢的任何标识符，他们会被用在记录错误时，监测统计信息等场景。例如，你可能不仅想要监视每秒的总体请求，还要根据客户端应用程序进行监视，那它就可以被用上（其中每一个都将驻留在多个服务器上）。这个 ID 作为特定的客户端对所有的请求的逻辑分组。 |

#### 响应

``` bnf
Response => CorrelationId ResponseMessage
  CorrelationId => int32
  ResponseMessage => MetadataResponse | ProduceResponse | FetchResponse | OffsetResponse | OffsetCommitResponse | OffsetFetchResponse
```

CorrelationId 服务器传回给客户端它所提供用作关联请求和响应消息的整数。

#### 消息集（Message sets）

生产和获取消息指令请求共享同一个消息集结构。在 Kafka 中，消息是由一个键值对以及少量相关的元数据组成。消息只是一个有偏移量和大小信息的消息序列。这种格式正好即用于在 broker 上的磁盘上存储，也用在线上数据交换。

消息集也是 Kafka 中的压缩单元，我们也允许消息递归包含压缩消息从而允许批量压缩。

注意, 在通讯协议中，消息集之前没有类似的其他数组元素的 int32。

``` bnf
MessageSet => [Offset MessageSize Message]
  Offset => int64
  MessageSize => int32
```

消息格式

``` bnf
v0
Message => Crc MagicByte Attributes Key Value
  Crc => int32
  MagicByte => int8
  Attributes => int8
  Key => bytes
  Value => bytes

v1 (supported since 0.10.0)
Message => Crc MagicByte Attributes Key Value
  Crc => int32
  MagicByte => int8
  Attributes => int8
  Timestamp => int64
  Key => bytes
  Value => bytes
```

| 域（FIELD） | 描述                                                                                                                                                                                         |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Crc         | Crc 是的剩余消息字节的 CRC32 值。broker 和消费者可用来检查信息的完整性。                                                                                                                     |
| MagicByte   | 这是一个用于允许消息二进制格式的向后兼容演化的版本 id。当前值是 0。                                                                                                                          |
| Attributes  | 这个字节保存有关信息的元数据属性。最低的 3 位包含用于消息的压缩编解码器。第四位表示时间戳类型，0 代表 CreateTime，1 代表 LogAppendTime。生产者必须把这个位设成 0。所有其他位必须被设置为 0。 |
| Timestamp   | 消息的时间戳。时间戳类型在 Attributes 域中体现。单位为从 UTC 标准准时间 1970 年 1 月 1 日 0 点到所在时间的毫秒数。                                                                           |
| Key         | Key 是一个可选项，它主要用来进行指派分区。Key 可以为 null。                                                                                                                                  |
| Value       | Value 是消息的实际内容，类型是字节数组。Kafka 支持本身递归包含，因此本身也可能是一个消息集。消息可以为 null。                                                                                |

#### 压缩（Compression）

Kafka 支持压缩多条消息以提高效率，当然，这比压缩一条原始消息要来得复杂。因为单个消息可能没有足够的冗余信息以达到良好的压缩比，压缩的多条信息必须以特殊方式批量发送（当然，如果真的需要的话，你可以自己压缩批处理的一个消息）。要被发送的消息被包装（未压缩）在一个 MessageSet 结构中，然后将其压缩并存储在一个单一的 “消息” 中，一起保存的还有相应的压缩编解码集。接收系统通过解压缩得到实际的消息集。外层 MessageSet 应该只包含一个压缩的 “消息”（详情见 Kafka-1718）。

Kafka 目前支持一下两种压缩算法：

| 压缩算法（COMPRESSION） | 编码器编号（CODEC） |
|-------------------------|---------------------|
| GZIP                    | 1                   |
| Snappy                  | 2                   |


## 接口 API

### 元数据接口（Metadata API）

这个 API 回答下列问题：

1. 存在哪些 Topic？
2. 每个主题有几个分区（Partition）？
3. 每个分区的 Leader 分别是哪个 broker？
4. 这些 broker 的地址和端口分别是什么？

这是唯一一个能发往集群中任意一个 broker 的请求消息。

因为可能有很多 topic，客户端可以给一个的可选 topic 列表，以便只返回一组 topic 元数据。

返回的元数据信息是分区级别的信息，为了方便和避免冗余，以 topic 为组集中在一起。每个分区的元数据中包含了 leader 以及所有副本以及正在同步的副本的信息。

注意: 如果 broker 配置中设置了”auto.create.topics.enable”, topic 元数据请求将会以默认的复制因子和默认的分区数为参数创建 topic。

topic 元数据请求（Topic Metadata Request）

``` bnf
TopicMetadataRequest => [TopicName]
  TopicName => string
```

| 域（FIELD） | 描述                                                      |
|-------------|-----------------------------------------------------------|
| TopicName   | 要获取元数据的主题数组。 如果为空，就返回所有主题的元数据 |

元数据响应（Metadata Response）

响应包含的每个分区的元数据，这些分区元数据以 topic 为组组装在一起。该元数据以 broker id 来指向具体的 broker。每个 broker 有一个地址和端口。

``` bnf
MetadataResponse => [Broker][TopicMetadata]
  Broker => NodeId Host Port  (any number of brokers may be returned)
    NodeId => int32
    Host => string
    Port => int32
  TopicMetadata => TopicErrorCode TopicName [PartitionMetadata]
    TopicErrorCode => int16
  PartitionMetadata => PartitionErrorCode PartitionId Leader Replicas Isr
    PartitionErrorCode => int16
```

可能的错误码（Possible Error Codes）

1. UnknownTopic (3)
2. LeaderNotAvailable (5)
3. InvalidTopic (17)
4. TopicAuthorizationFailed (29)

# 常量（Constants）

## Api Keys And Current Versions

下面是请求中 ApiKey 的数字值，用来表示上面所述的请求类型。

| 接口名称（API NAME）         | APIKEY 值 |
|------------------------------|-----------|
| ProduceRequest               | 0         |
| FetchRequest                 | 1         |
| OffsetRequest                | 2         |
| MetadataRequest              | 3         |
| Non-user facing control APIs | 4-7       |
| OffsetCommitRequest          | 8         |
| OffsetFetchRequest           | 9         |
| GroupCoordinatorRequest      | 10        |
| JoinGroupRequest             | 11        |
| HeartbeatRequest             | 12        |
| LeaveGroupRequest            | 13        |
| SyncGroupRequest             | 14        |
| DescribeGroupsRequest        | 15        |
| ListGroupsRequest            | 16        |
