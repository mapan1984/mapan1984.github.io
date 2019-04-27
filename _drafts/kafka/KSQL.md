# KSQL

分布式、可扩展、可靠且实时

过滤、转换、聚合 (aggregation)、连接 (join)、时间窗口化 (windowing)、会话化 (Sessiionization, 即捕获单一会话期间的所有流事件）

KSQL 不进行查找，它所做的是连续转换（即流处理）

## 实时监控与实时分析

``` sql
create table error_counts as

select error_code, count(*) from monitoring_stream

window tumbling (size 1 minute)

where type = 'ERROR'
```

## 安全性和异常检测

``` sql
create table possible_fraud as

select card_number, count(*) from authorization_attempts

window tumbling (size 5 seconds)

group by card_number

having count(*) > 3
```

## 在线数据集成

``` sql
create stream vip_users as

select userid, page, action

from clickstream c

left join user u on c.userid = u.user_id

where u.level = 'Platinum'
```

# 核心

KSQL 在内部使用 Kafka 的 API Streams，它们共享相同的核心抽象，用于 Kafka 上的流处理。

KSQL 中有两个可以由 Kafka Steams 操作的核心抽象，允许操作 Kafka Topic

1. 流(Stream)：流是结构化数据的无界序列（"facts"），不可更新，新的fact可以插入到流中，但是已有的fact无法进行更新或删除。可以通过 topic 来创建，也可以通过以有的流或表衍生出来

    ``` sql
    create stream pageviews (
        viewtime bigint,
        userid varchar,
        pageid varchar
    ) with (kafka_topic='pageviews', value_format='JSON')
    ```

2. 表(Table)：表是 stream 或另一个 table 的视图，表示不断变化的 fact 的集合。当用新事件到达时，它就会持续更新。

    ``` sql
    create table users (
        registertime bigint,
        gender varchar,
        regionid varchar,
        userid varchar
    ) with (kafka_topic='users', value_format='DELIMITED')
    ```

# 比较

``` sql
CREATE STREAM fraudulent_payments AS

SELECT * FROM payments-kafka-stream
WHERE fraud_probability > 0.8
```

``` scala
// Using Kafka’s Streams API
object FraudFilteringApplication extends App {

  val builder: StreamsBuilder = new StreamsBuilder()

  val fraudulentPayments: KStream[String, Payment] = builder
    .stream[String, Payment]("payments-kafka-topic")
    .filter((_ ,payment) => payment.fraudProbability > 0.8)

  fraudulentPayments.to("fraudulent-payments-topic")

  val config = new java.util.Properties

  config.put(StreamsConfig.APPLICATION_ID_CONFIG, "fraud-filtering-app")

  config.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka-broker1:9092")

  val streams: KafkaStreams = new KafkaStreams(builder.build(), config)

  streams.start()
}
```

# 语法

## 字段类型


``` sql
BOOLEAN
INTEGER
BIGINT
DOUBLE
VARCHAR(STRING)
ARRAY(JSON and AVRO only)
MAP (JSON and AVRO only)
```

注意: 创建 stream 或者 table 时 KSQL 都会默认添加以下两个字段

1. ROWKEY: 对应 kafka 的 message key
2. ROWTIME: 对应 kafka 的 message timestamp, 时间窗口根据这个值计算时间

## 创建

``` sql
CREATE STREAM stream_name (  column_name data_type  [, ...] )
  WITH ( property_name = expression [, ...] );

  CREATE TABLE table_name (  column_name data_type  [, ...] )
  WITH ( property_name = expression [, ...] );
```


| 关键字参数        | 描述                                                                          |
|-------------------|-------------------------------------------------------------------------------|
| KAFKA_TOPIC       | 指定对应 topic 名字                                                           |
| VALUE_FORMAT      | 存在以下三种格式: JSON(主要)、DELIMITED(逗号分隔)、AVRO                       |
| KEY(VARCHAR 类型) | 对应 kafka 的 message key, 创建 table 时必填, 创建 stream 是可选的 (最好不填) |
| TIMESTAMP         | 覆盖默认生成的 ROWTIME                                                        |

``` sql
CREATE STREAM stream_name
  [WITH ( property_name = expression [, ...] )]
  AS SELECT  select_expr [, ...]
  FROM from_item
  [ LEFT JOIN join_table ON join_criteria ]
  [ WHERE condition ]
  [PARTITION BY column_name];


CREATE TABLE table_name
  [WITH ( property_name = expression [, ...] )]
  AS SELECT  select_expr [, ...]
  FROM from_item
  [ WINDOW window_expression ]
  [ WHERE condition ]
  [ GROUP BY grouping_expression ]
  [ HAVING having_expression ];
```


| 关键字参数   | 描述                                                                                                             |
|--------------|------------------------------------------------------------------------------------------------------------------|
| KAFKA_TOPIC  | 指定创建的 topic 名字, 如果不指定则默认取 stream 名字的大写                                                      |
| VALUE_FORMAT | 存在以下三种格式: JSON(主要)、DELIMITED(逗号分隔)、AVRO                                                          |
| PARTITIONS   | 创建的 topic 的 partition 数量, 不指定则默认取 ksql.sink.partitions=4, 可通过配置文件或者命令行 SET 命令自行配置 |
| REPLICAS     | 创建的 topic 的 replica 的数量, 不指定则默认取 input stream/table 的 replica 值                                  |
| TIMESTAMP    | 覆盖默认生成的 ROWTIME                                                                                           |
| PARTITION BY | 指定 click_users 的 ROWKEY, 这个语句不是在 select 语法里面的，所以指定的列名是 select 之后的列名                 |


## 查询

``` sql
SELECT select_expr [, ...]
  FROM from_item
  [ LEFT JOIN join_table ON join_criteria ]
  [ WINDOW window_expression ]
  [ WHERE condition ]
  [ GROUP BY grouping_expression ]
  [ HAVING having_expression ];
```

WINDOW(时间窗口支持以下三种):
1. HOPPING: 比如 (SIZE 20 SECONDS,ADVANCE BY 5 SECONDS) 表示每 5 秒钟统计之前 20 秒的内容
2. TUMBLING: 特殊的 HOPPING(SIZE 20 SECONDS) SIZE 与 ADVANCE 的值一样
3. SESSION: 比如 (20 SECONDS) 表示某个 key 20 秒不活动则完成一个 session, 之后的记录都计算在下一个 session 中

## 一些常用操作

| 操作                                                    | 代码                          |
|---------------------------------------------------------|-------------------------------|
| 删除 stream                                             | DROP STREAM click;            |
| 删除 table                                              | DROP TABLE users;             |
| 显示 stream/table 的列名和类型                          | DESCRIBE click;               |
| 显示 stream/table 的列名和类型以及 kafka topic 详细信息 | DESCRIBE EXTENDED click;      |
| 显示某个查询的执行计划 query_id 通过 show queries 获取  | EXPLAIN query_id;             |
| 显示 kafka topic 内容 (从头取数据)                      | PRINT 'click' FROM BEGINNING; |
| 显示 kafka topic 内容 (取最新数据)                      | PRINT 'click';                |
| 打印 topics                                             | SHOW/LIST TOPICS;             |
| 打印 streams                                            | SHOW/LIST STREAMS;            |
| 打印 tables                                             | SHOW/LIST TABLES;             |
| 打印 queries                                            | SHOW QUERIES;                 |
| 打印 KSQL 配置                                          | SHOW PROPERTIES;              |

## 内置 SQL 方法

| 方法名            | 举例                                                  | 描述                                                                |
|-------------------|-------------------------------------------------------|---------------------------------------------------------------------|
| ABS               | ABS(col1)                                             | 绝对值                                                              |
| ARRAYCONTAINS     | ARRAYCONTAINS('[1, 2, 3]', col1)                      | 给定的列的值是否在给定的 json 或者数组中，返回 true/false           |
| CEIL              | CEIL(col1)                                            | 取上限                                                              |
| FLOOR             | FLOOR(col1)                                           | 取下限                                                              |
| CONCAT            | CONCAT(col1, '_hello')                                | 字符串拼接                                                          |
| EXTRACTJSONFIELD  | EXTRACTJSONFIELD(message, '$.log.cloud')              | 提取 json 字符串内部的 value                                        |
| LCASE             | LCASE(col1)                                           | 字符串小写                                                          |
| UCASE             | UCASE(col1)                                           | 字符串大写                                                          |
| LEN               | LEN(coll)                                             | 字符串长度                                                          |
| RANDOM            | RANDOM()                                              | 0.0~1.0 之间的随即 DOUBLE                                           |
| ROUND             | ROUND(col1)                                           | 四舍五入                                                            |
| TIMESTAMPTOSTRING | STRINGTOTIMESTAMP(col1, 'yyyy-MM-dd HH:mm:ss.SSS')    | 根据给定的 format 格式将 string 形式的 timestamp 转换成 BIGINT 表示 |
| TIMESTAMPTOSTRING | TIMESTAMPTOSTRING(ROWTIME, 'yyyy-MM-dd HH:mm:ss.SSS') | 根据给定的 format 格式将 BIGINT 形式的 timestamp 转换成 string 表示 |
| SUBSTRING         | SUBSTRING(col1, 2, 5)                                 | 字符串截取                                                          |
| TRIM              | TRIM(col1)                                            | 去除字符串两边空格                                                  |

## 内置聚合方法

| 方法名       | 例子                  | 描述                                |
|--------------|-----------------------|-------------------------------------|
| COUNT        | COUNT(col1)           | 计算总数                            |
| MAX          | MAX(col1)             | 最大值                              |
| MIN          | MIN(col1)             | 最小值                              |
| SUM          | SUM(col1)             | 总数                                |
| TOPK         | TOPK(col1, k)         | 返回给定字段的 top k 个 value       |
| TOPKDISTINCT | TOPKDISTINCT(col1, k) | 返回给定字段的 top k 个不重复 value |

### 分布部署

维持进程的`APPLICATION_ID_CONFIG`一致，将其作为隐式启动的 Consumer 的 Group ID，会保证这两个进程的 Consumer 属于同一个 Group，从而可以通过 Consuemr Rebalance 机制拿到互补的数据集。

### KTabble vs KStream

KStream 是一个数据流，可以认为所有记录都是通过 Insert only 的方式插入进这个数据流里

KTable 代表一个完整的数据集，可以理解为数据库中的表，由于每条记录都是 Keb-Value 对，可以认为 KTable 中的数据都是通过 Update only 的方式进入的。

| Topic  | KSTream | KTable |
|--------|---------|--------|
| Jack,1 | Jack,1  | Mike,4 |
| Lily,2 | Lily,2  | Jack,3 |
| Mike,4 | Mike,4  | Lily,5 |
| Jack,3 | Jack,3  |        |
| Lily,5 | Lily,5  |        |

### State Store

无状态操作：过滤操作（Kafka Stream DSL 中用 `filter` 方法实现）
有状态操作：Window 操作、聚合操作


Kafka 提供了基于 Topic 的状态存储。

Topic 中存储的数据记录本身是 Key-Value 形式的，同时 Kafka 的 log compaction 机制可对历史数据做 compact 操作，保留每个 Key 对应的最后一个 Value，从而在保证 Key 不丢失的前提下，减少总数据量，从而提高查询效率。

构造 KTable 时，需要指定其 state store name。默认情况下，该名字也即用于存储该 KTable 的状态的 Topic 的名字，遍历 KTable 的过程，实际就是遍历它对应的 state store，或者说遍历 Topic 的所有 key，并取每个 Key 最新值的过程。为了使得该过程更加高效，默认情况下会对该 Topic 进行 compact 操作。

另外，除了 KTable，所有状态计算，都需要指定 state store name，从而记录中间状态。

### 总结

Kafka Stream 的并行模型完全基于 Kafka 的分区机制和 Rebalance 机制，实现了在线动态调整并行度
同一 Task 包含了一个子 Topology 的所有 Processor，使得所有处理逻辑都在同一线程内完成，避免了不必的网络通信开销，从而提高了效率。
through方法提供了类似 Spark 的 Shuffle 机制，为使用不同分区策略的数据提供了 Join 的可能
log compact 提高了基于 Kafka 的 state store 的加载效率
state store 为状态计算提供了可能
基于 offset 的计算进度管理以及基于 state store 的中间状态管理为发生 Consumer rebalance 或 Failover 时从断点处继续处理提供了可能，并为系统容错性提供了保障
KTable 的引入，使得聚合计算拥用了处理乱序问题的能力

# ksql

ksql is the streaming sql engine for apache kafka

## Stream

* a stream is an unbounded, continuous flow of records
* data is real-time
* recordes are key-value pairs

## Stream Processing

* Per-record stream processing with millisecond latency
* Data filtering
* Data transformations and conversions
* Data enrichment with joins
* Data manipulation with scalar functions
* Data analysis with stateful processing, aggregations, and windowing operations

## Stream Processing with Kafka

No specialized infrastructure beyond Kafka

+--------------------------------+
|       Stream Processing        |
|  (Filter / Aggregate / Join)   |
+--------------------------------+
                ↑
                |
                ↓
        +---------------+
        | Kafka Cluster |
        +---------------+

## Stream Processing with KSQL

Process your streams of unbounded Kafka data in real time with KSQL

* Develop on Mac, Linux, Windows
* Elastic, highly scalable, fault-tolerant
    * KSQL 工作就像一个 Consumer Group
* Deploy to contaniers, VMs, bare metal, cloud, on prem
* Equally viable for small, medium, and large use cases
* Integrated with Kafka security
* Supports exactly-once semantics

# Demo - a streaming music service

* Kafka Cluster
* KSQL server
* Confluence schema registry

 

    $ ksql http://localhost:8080

    ksql> set 'auto.offset.reset' = 'earliest';
    ksql> print 'play-event'

    ksql> create stream ksql_playevents with (kafka_topic='play-events', value_format='avro');
    ksql> describe ksql_playevents;
    ksql> select * from ksql_playevents where duration > 30000;
    ksql> create stream ksql_playevents_min_duration as select * from ksql_playevents where duration > 30000;

    ksql> select * from ksql_songfeed limit 5;
    ksql> describe ksql_songfeed;
    ksql> create stream ksql_songfeedwithkey with (kafka_topic='ksql_songfeedwithkey', value_format='varo') as select cast(id as string) as id, album, artist, name, genre from ksql_songfeed partition by id;
    ksql> show streams;
    ksql> show tables;

# reading kafka data from ksql

* check the list of topics available in the kafka cluster

        ksql> show topics;

* explore data in the kafka topic

        ksql> print 'kafka_topic' from beginning;

* register an existing kafka topic into a ksql stream

        ksql> create stream pageviews (viewtime bigint, user_id varchar, page_id varchar) with (kafka_topic='pageviews-topic', value_format='json')

