### standalone

    $ ./bin/start-cluster.sh

    $ curl http://127.0.0.1:8081

    $ ./bin/flink run examples/streaming/WordCount.jar

    $ ./bin/stop-cluster.sh

### JobManager

`conf/flink-conf.yaml` 常用配置

``` yaml
# The heap size for the JobManager JVM
jobmanager.heap.mb: 1024

# The heap size for the TaskManager JVM
taskmanager.heap.mb: 1024

# The number of task slots that each TaskManager offers. Each slot runs one parallel pipeline.
taskmanager.numberOfTaskSlots: 4

# The managed memory size for each task manager.
taskmanager.managed.memory.size: 256
```

### TaskManager

### log

#### 分类

JobManager 和 TaskManager 的日志可以在 `log` 子目录中找到：

* flink-${user}-standalonesession-${id}-${hostname}.log：代码中的日志输出
* flink-${user}-standalonesession-${id}-${hostname}.out：进程执行时的 stdout 输出
* flink-${user}-standalonesession-${id}-${hostname}-gc.log：JVM 的 GC 日志

* flink-${user}-taskexecutor-${id}-${hostname}.log：代码中的日志输出
* flink-${user}-taskexecutor-${id}-${hostname}.out：进程执行时的 stdout 输出
* flink-${user}-taskexecutor-${id}-${hostname}-gc.log：JVM 的 GC 日志

#### 配置

* log4j-cli.properties：用 flink 命令行时用的 log 配置，比如执行 `flink run` 命令
* log4j-yarn-session.properties：用 `yarn-session.sh` 启动时命令行执行时用的 log 配置
* log4j.properties：无论是 standalone 还是 yarn 模式，JobManager 和 TaskManager 上的 log 配置都是 log4j.properties


### pid

    $ cat /tmp/flink-${user}.ssy-standalonesession.pid

    $ cat /tmp/flink-${user}.ssy-taskexecutor.pid

### 多机 standalone 集群

* 每台机器上配置好 Java 以及 JAVA_HOME 环境变量
* 挑选一台机器，和其他机器 ssh 打通
* 每台机器上部署的 Flink binary 的目录要保证是同一个目录
* 如果需要用 hdfs，需要配置 HADOOP_CONF_DIR 环境变量

`conf/masters`

    hostname-1:8081


`conf/slaves`

    hostname-1
    hostname-2
    hostname-3

`conf/flink-conf.yaml`

``` yaml
jobmanager.rpc.address: hostname-1
```

### 多机 standalone 机器 HA

`conf/masters`

    hostname-1:8081
    hostname-2:8081


`conf/slaves`

    hostname-1
    hostname-2
    hostname-3


`conf/flink-conf.yaml`

``` yaml
# 配置 high-availability mode
high-availability: zookeeper

# 配置 zookeeper quorum
high-availability.zookeeper.quorum: hostname:2181

# （可选）设置 zookeeper 的 root 目录
high-availability.zookeeper.path.root: /test_dir/test_standalone_root

# （可选）相当于是这个 standalone 集群中创建 zk node 的 namespace
high-availability.cluster-id: /test_dir/test_standalone


# JobManager 的 meta 信息放在 hdfs，在 zk 上主要会保存一个指向 hdfs 路径的指针
high-availability.storageDir: hdfs:///test_dir/recovery/
```

### Yarn 模式

* 资源按需使用，提高集群的资源利用率
* 任务有优先级，根据优先级运行作业
* 基于 Yarn 调度系统，能够自动化地处理各个角色的 failover
    * JobManager 进程和 TaskManager 进程都由 Yarn NodeManager 监控
    * 如果 JobManager 进程异常退出，则 Yarn ResourceManager 会重新调度 JobManager 到其他机器
    * 如果 TaskManager 进程异常退出，JobManager 会收到消息并重新向 Yarn ResourceManager 申请资源，重新启动 TaskManager

#### long running

client必须要设置`YARN_CONF_DIR`或者`HADOOP_CONF_DIR`环境变量，通过这个环境变量来读取YARN和HDFS的配置信息，否则启动会失败。

    $ ./bin/yarn-session.sh -h

    $ ./bin/yarn-session.sh -n 4 -jm 1024m -tm 4096m


`/tmp/.yarn-properties-${user}` 文件保存了上一次创建 yarn session 的集群信息

#### HA

首先要确保启动 Yarn 集群用的 `yarn-site.xml` 文件中的这个配置，指定 Yarm 集群级别 AM 重启的上限：

``` xml
<property>
    <name>yarn.resourcemanager.am.max-attempts</name>
    <value>100</value>
</property>
```

然后在 `conf/flink-conf.yaml` 文件中配置这个 flink job 的 JobManager 能够重启的次数

``` yaml
yarn.application-attempts: 10
```

最后配置 zk 相关配置：

``` yaml
# 配置 high-availability mode
high-availability: zookeeper

# 配置 zookeeper quorum
high-availability.zookeeper.quorum: hostname:2181

# （可选）设置 zookeeper 的 root 目录
high-availability.zookeeper.path.root: /test_dir/test_standalone_root

# （可选）相当于是这个 standalone 集群中创建 zk node 的 namespace
# 使用 Yarn 的 application id，从而保证唯一性，否则，在提交作业的使用需要用户取保证 cluster-id 的全局唯一性
# high-availability.cluster-id: /test_dir/test_standalone


# JobManager 的 meta 信息放在 hdfs，在 zk 上主要会保存一个指向 hdfs 路径的指针
high-availability.storageDir: hdfs:///test_dir/recovery/
```
