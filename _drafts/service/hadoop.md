# hadoop

## HDFS(Hadoop Distributed File System)

将分析的数据资料与程序存储在 HDFS 中

- 分布式文件系统
- 将档案切割成固定大小的资料区块(Block)，且每一个档案的资料区块预设都会产生两个副本


- NameNode: 负责管理与维护 HDFS 目录系统，并控制档案的读写动作
- DataNode: 负责存储资料

- JournalNode: 两个NameNode为了数据同步，会通过一组称作JournalNodes的独立进程进行相互通信。当active状态的NameNode的命名空间有任何修改时，会告知大部分的JournalNodes进程。standby状态的NameNode有能力读取JNs中的变更信息，并且一直监控edit log的变化，把变化应用于自己的命名空间。standby可以确保在集群出错时，命名空间状态已经完全同步了。


- ZKFC(ZooKeeperFailoverController): 作为一个ZK集群的客户端，用来监控NN的状态信息。每个运行NN的节点必须要运行一个zkfc。

## Yarn

- ResourceManager(RM)
  - Scheduler：本质上是一种策略，根据节点的容量、队列情况，为 Application 分配资源
  - Application Manager(ASM)：接受用户提交的请求，在节点中启动 Application Master，并监控 Application Master 的状态，进行必要的重启
- NodeManager(NM)：每个节点上都有一个 NM 作为代理监控节点的资源使用情况，并向 RM 上报节点状态


- Application Master(AM)
  1. 提交 Application 后，会新建一个 AM
  2. AM 向 RM 申请 Container 资源
  3. 将程序发到 Container 启动执行
  4. 与 NM 沟通，在分配的 Container 汇总执行任务，监控任务执行情况
- Container：资源的抽象方式

### 基于 yarn 的程序

* YARNClient
* ApplicationMaster

## 配置文件

1. `hadoop-env.sh`：Hadoop守护进程环境变量
2. 只读默认配置(可由hadoop-env.sh进行设置)
    1. `core-default.xml`
    1. `hdfs-default.xml`
    1. `yarn-default.xml`
    1. `mapred-default.xml`
3. 定位设置：
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
4. `hadoop-config.sh`

        # 日志
        HADOOP_ROOT_LOGGER=DEBUG,DRFA

## s3 支持

### core-site.xml

``` xml
<!--
<property>
  <name>central.endpoint</name>
  <value>internal.s3-cn-bj.ufileos.com</value>
</property>
-->
<property>
  <name>fs.s3a.endpoint</name>
  <value>internal.s3-cn-bj.ufileos.com</value>
</property>
<property>
  <name>fs.s3a.access.key</name>
  <value>TOKEN_d601b138-69b7-426c-8555-35181f1981d2</value>
</property>
<property>
  <name>fs.s3a.secret.key</name>
  <value>30bff6ed-5567-4dff-bdd7-c9d9687ef290</value>
</property>
<property>
  <name>fs.s3a.connection.ssl.enabled</name>
  <value>false</value>
</property>
<property>
  <name>fs.s3a.path.style.access</name>
  <value>true</value>
</property>
```

``` xml
<!--
  // https://github.com/apache/hadoop/blob/release-2.8.4-RC0/hadoop-tools/hadoop-aws/src/main/java/org/apache/hadoop/fs/s3a/Constants.java
  // src/main/java/org/apache/hadoop/fs/s3a/Constants.java
  // number of records to get while paging through a directory listing
  public static final String MAX_PAGING_KEYS = "fs.s3a.paging.maximum";
  public static final int DEFAULT_MAX_PAGING_KEYS = 5000;
-->
<property>
  <name>fs.s3a.paging.maximum</name>
  <value>900</value>
</property>
```

### op

    hadoop fs -ls s3a://kafka/plugin-example-0.1.0.jar

