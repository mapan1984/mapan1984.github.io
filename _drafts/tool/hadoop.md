# hadoop

HDFS:
    NameNode, DataNode
    master,   core,       task

NameNode:
 - 负责管理与维护 HDFS 目录系统，并控制档案的读写动作
DataNode:
 - 负责存储资料

Yarn:
    ResourceManager, NodeManager
    master,          core, task

Hive:
    MetaStore
    MySQL
    master,        core, task

HBase:
    HMaster, HRegionServer
    master,  core,           task

## 节点

NameNode,ResourceManager -- master

NameNode:
 - 负责管理与维护 HDFS 目录系统，并控制档案的读写动作

DataNode(NodeManager)    -- slaves

DataNode:
 - 负责存储资料

## hdfs(Hadoop Distributed File System)

将分析的数据资料与程序存储在 HDFS 中

- 分布式文件系统
- 将档案切割成固定大小的资料区块(Block)，且每一个档案的资料区块预设都会产生两个副本

## mapreduce

### 依赖

1. install Java, ssh, rsync
2. 

### 配置文件

1. `hadoop-env.sh`：Hadoop守护进程环境变量
2. 只读默认配置(可由hadoop-env.sh进行设置)
    1. `core-default.xml`
    1. `hdfs-default.xml`
    1. `yarn-default.xml`
    1. `mapred-default.xml`

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

## YARN

### Batch(批次处理)

Map/Reduce

### Interactive(互动处理)

Tez(ASF Incubator) ，可整合 Pig 互 Hive 应用

### Online(线上查询)

HBase

### Streaming（文字串流）

Storm

## 家族

### Flume

日志收集

Web Server --> [  Source  --> Channel --> Sink ] --> HDFS

### HBase

HBase 是一个高可靠性、高性能、面向列、可伸缩的分布式存储系统，它支持通过 key/value 存储来支持实时分析，也支持通过 map-reduce 支持批处理分析。

NoSQL 数据库

### Pig

使 Map-Reduce 简单

- Pig Shell (Grunt)
- Pig Language (Latin)
- Libraries (Piggy Bank)
- User Defined Functions (UDF)

### Hive

Hive 是 Hadoop 生态系统中的数据仓库产品。它可以简单方便的存储、查询和分析存储在 HDFS 或者 HBase 的数据，它将 sql 语句转换成 MapReduce 任务，进行复杂的海量数据分析。它也提供了一系列工具，可用来多数据进行提取、转化和加载。

类似 SQL 操作语法

### Spark

Spark 是一个基于内存计算的开源的集群计算系统，相对于 MapReduce，Spark 使用了更为快速的计算引擎，可以更有效地支持多种类型的计算，如交互式查询和流处理。Spark 被设计的高度易访问，并提供了丰富的内建库，可以使用 Python、Java、Scala 或 SQL 设计 Spark 任务。
