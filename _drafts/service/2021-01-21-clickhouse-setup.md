## 环境要求

https://clickhouse.tech/docs/en/operations/requirements/

1. cpu
    * 多核心低主频优于少核心高主频
    * x86_64架构并支持SSE4.2指令（检查 `/proc/cpuinfo` 文件，查看 flags 是否包含 `sse4_2`）
    * 睿频加速 和 超线程
2. ram
    * 推荐至少 4GB
    * 运行所需内存很少，内存主要消耗在查询
        * 查询本身的复杂度(group by, distinct, join)
        * 查询处理的数据量
3. swap
    * 禁止生产环境的交换文件(`swapoff -a`; 注释 `/etc/fstab` 交换空间的行)
4. 推荐的Linux发行版是Ubuntu。 tzdata 软件包应安装在系统中

## 安装

https://clickhouse.tech/docs/en/getting-started/install/

`apt-get install tzdata`

## ops

### 日志

日志目录 `/var/log/clickhouse-server`

system.d 日志：`journalctl -u clickhouse-server`

### config.xml

配置文件 `/etc/clickhouse-server/config.xml`

在 `config.xml` 配置文件同目录的 `conf.d` 和 `config.d` 文件夹下，可以新建 `*.xml` 文件覆盖 `config.xml` 文件中的配置

### users.xml

配置文件 `/etc/clickhouse-server/users.xml`

在 `users.xml` 配置文件同目录的 `users.d` 文件夹下，可以新建 `*.xml` 文件添加用户相关配置

### limits

文件句柄数量限制 `/etc/security/limits.d/clickhouse.conf`

### 操作

`/etc/cron.d/clickhouse-server`

前台运行：`clickhouse-server --config-file=/etc/clickhouse-server/config.xml`

后台运行：`service clickhouse-server start`

客户端：`clickhouse-client --password Ucld7.11 -m`

### 修改数据目录

``` xml
<!-- Path to data directory, with trailing slash. -->
<path>/data/clickhouse/</path>

<!-- Path to temporary data for processing hard queries. -->
<tmp_path>/data/clickhouse/tmp/</tmp_path>

<!-- Directory with user provided files that are accessible by 'file' table function. -->
<user_files_path>/data/clickhouse/user_files/</user_files_path>
```

    mkdir -p /data/clickhouse/
    sudo chown -R clickhouse:clickhouse /data/clickhouse/

### listen

``` xml
<!-- Listen specified host. use :: (wildcard IPv6 address), if you want to accept connections both with IPv4 and IPv6 from everywhere. -->
<listen_host>::</listen_host>

<!-- Hostname that is used by other replicas to request this server.
   If not specified, than it is determined analogous to 'hostname -f' command.
   This setting could be used to switch replication to another network interface.
-->
<interserver_http_host>10-9-158-40</interserver_http_host>
```

## 分离配置

当元素有 `incl` 属性，`incl` 属性的值所代表的元素将会替换这个元素。默认情况下，`/etc/metrika.xml` 文件中的元素将被引入，这个路径由 `include_from` 指定。

`/etc/clickhouse-server/config.xml` 中有 `incl` 属性的元素如下：

``` xml
<remote_servers incl="clickhouse_remote_servers"></remote_servers>
<zookeeper incl="zookeeper-servers" optional="true"></zookeeper>
<compression incl="clickhouse_compression"></compression>
<macros incl="macros" optional="true" />
```

因此我们可以将这 4 项配置分离到 `/etc/metrika.xml` 文件中

``` xml
<?xml version="1.0"?>
<yandex>
  <clickhouse_remote_servers>
  </clickhouse_remote_servers>
  <zookeeper-servers>
  </zookeeper-servers>
  <clickhouse_compression>
  </clickhouse_compression>
  <macros>
  </macros>
</yandex>
```

这 4 项中 `clickhouse_remote_servers`, `zookeeper-servers`, `clickhouse_compression` 每个节点配置都相同，但是 `macros` 需要根据节点在集群中担任的角色调整。

## cluster 架构方式

`cluster` 由 `shard` 组成，`shard` 下可以有 1 个到多个 `replica`，每个 `replica` 是一个单独的服务。

当一个 `shard` 下配置多个 `replica` 时，有多种副本同步的策略：

1. `internal_replication=false` 并且写分布式表(Distributed)：
    * 写操作会将数据写入所有副本。实质上，这意味着要分布式表本身来复制数据。
    * 分布式表从 config.xml 的 remote_servers 获取分片以及副本信息
    * 这种方式不如使用复制表的好，因为不会检查副本的一致性，并且随着时间的推移，副本数据可能会有些不一样。
2. `internal_replication=true` 但是没有配置 `zookeeper`
3. `internal_replication=true` 同时配置 `zookeeper` 并且使用 `*ReplicatedMergeTree` 表引擎：
    * 写操作只选择一个正常的副本写入数据，由复制表(*ReplicaMergeTree)来完成数据的复制工作
    * 使用 `*ReplicatedMergeTree` 需要依赖 `zookeeper` 服务，`*ReplicatedMergeTree` 通过 zookeeper 获取分片及副本信息。

*`internal_replication` 默认为 `false`*

### zookeeper-servers

``` xml
<zookeeper-servers>
    <node index="1">
        <host>10.9.27.127</host>
        <port>2181</port>
    </node>
    <node index="2">
        <host>10.9.57.71</host>
        <port>2181</port>
    </node>
    <node index="3">
        <host>10.9.67.89</host>
        <port>2181</port>
    </node>
</zookeeper-servers>
```

### clickhouse_remote_servers

#### 单副本系列：每个分片包含1个副本

``` xml
<clickhouse_remote_servers>
    <default>
         <shard>
             <replica>
                 <host>10-9-77-91</host>
                 <port>9000</port>
                 <user>default</user>
                 <password>Ucld7.11</password>
             </replica>
         </shard>
         <shard>
             <replica>
                 <host>10-9-158-40</host>
                 <port>9000</port>
                 <user>default</user>
                 <password>Ucld7.11</password>
             </replica>
         </shard>
    </default>
</clickhouse_remote_servers>
```

#### 高可用系列：每个分片包含2个副本

``` xml
<clickhouse_remote_servers>
    <default_rp>
         <shard>
             <internal_replication>true</internal_replication>
             <replica>
                 <host>10-9-77-91</host>
                 <port>9000</port>
                 <user>default</user>
                 <password>Ucld7.11</password>
             </replica>
             <replica>
                 <host>10-9-158-40</host>
                 <port>9000</port>
                 <user>default</user>
                 <password>Ucld7.11</password>
             </replica>
         </shard>
    </default_rp>
</clickhouse_remote_servers>
```

### macros

`macros` 一般与 `Replicated*MergeTree` 的使用相关，`Replicated*MergeTree` 需要指定参数：
* `zoo_path`：ZooKeeper 中该表的路径，指定同一 `zoo_path` 的表相互复制，即同一分片应该使用同一个 `zoo_path`
* `replica_name`：ZooKeeper 中该表的副本名称，同一分片下不同副本 `replica_name` 必须不同

当创建复制表时，会把复制表的元数据注册到 zookeeper 的 `zoo_path/replica_name` 下

使用示例如下：

``` sql
CREATE TABLE table_name (
    EventDate DateTime,
    CounterID UInt32,
    UserID UInt32
)
-- 表引擎
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/table_name', '{replica}')
-- 分区
PARTITION BY toYYYYMM(EventDate)
-- 索引排序
ORDER BY (CounterID, EventDate, intHash32(UserID))
SAMPLE BY intHash32(UserID)
```

`Replicated*MergeTree` 的参数中可以包含占位符，由配置文件中 `macros` 指定的值替换

``` xml
<yandex>
    <macros>
        <layer>01</layer>
        <shard>01</shard>
        <replica>01</replica>
    </macros>
</yandex>
```

`{layer}-{shard}` 标识分片，同一分片内所有的机器都应该保持相同，建议将 `layer` 设置为集群名，将 `shard` 设置为分片名。

`{replica}` 标识副本，可以设置为节点名，确保副本使用不同的标识

## 概念

* 表(Table)
  * 数据分布
    * 本地表（Local Table）：只会存储在当前写入的节点所在分片，不会被分散到多台机器上
    * 分布式表（Distributed Table）：是本地表的集合，将多个本地表抽象为一张统一的表，对外提供写入、查询功能。当写入分布式表时，数据会被自动分发到集合中的各个本地表中；当查询分布式表时，集合中各个本地表都会被分别查询，并把最终结果汇总后返回。
  * 存储引擎
    * 单机表（Non-Replicated Table）：数据只存储在当前分片所在的机器上，不会复制到其他机器，即只有一个副本
    * 复制表（Replicated Table）：复制表的数据，会被自动复制到当前分片所在的多台机器上，形成多个副本

### 单副本集群

``` sql
-- 本地单机表
CREATE TABLE default.user_single on cluster default(
`id` UInt64,
`name` String,
`tag` String,
`brith` DateTime
)
ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(brith)
ORDER BY id
SETTINGS index_granularity = 8192;

-- 分布式表
CREATE TABLE user_single_d ON CLUSTER default as user_single ENGINE = Distributed(default, default, user_single, rand());

insert INTO user_single_d values(1, 'alice', 'dev', '1996-07-08 08:15:23');
insert INTO user_single_d values(2, 'bob', 'ops', '1997-08-08 12:05:23');
insert INTO user_single_d values(3, 'eric', 'dev', '1995-10-22 16:30:23');
```

### 双副本集群

``` sql
-- 本地复制表
create table default.user_rp on cluster default_rp (
`id` UInt64,
`name` String,
`tag` String,
`brith` DateTime
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/user_rp', '{replica}')
PARTITION BY toYYYYMM(brith)
ORDER BY (id, name, tag)
SETTINGS index_granularity = 8192;

-- 分布式表
CREATE TABLE user_rp_d ON CLUSTER default_rp as user_rp ENGINE = Distributed(default, default, user_rp, rand());

insert INTO user_rp_d values(1, 'alice', 'dev', '1996-07-08 08:15:23');
insert INTO user_rp_d values(2, 'bob', 'ops', '1997-08-08 12:05:23');
insert INTO user_rp_d values(3, 'eric', 'dev', '1995-10-22 16:30:23');
```

## 使用

### http 接口

https://clickhouse.tech/docs/en/interfaces/http/

### 本地/分布式

数据库和表都支持本地和分布式两种，分布式方式的创建有以下两种方法：

* 在每台 clickhouse-server 所在机器上都执行创建语句。
* 使用 `ON CLUSTER` 子句，配合 ZooKeeper 服务完成创建动作。

当使用 clickhouse-client 进行查询时，若在 A 机上查询 B 机的本地表则会报错“Table xxx doesn't exist..”。若希望集群内的所有机器都能查询某张表，推荐使用分布式表。

## 数据库引擎

``` sql
CREATE DATABASE [IF NOT EXISTS] db_name [ON CLUSTER cluster] [ENGINE = engine(...)]
```
### MySQL

MySQL 引擎用于将远程的 MySQL 服务器中的表映射到 ClickHouse 中，并允许您对表进行 INSERT 和 SELECT 查询，以方便您在 ClickHouse 与 MySQL 之间进行数据交换。

MySQL 数据库引擎会将对其的查询转换为 MySQL 语法并发送到 MySQL 服务器中，因此您可以执行诸如 SHOW TABLES 或 SHOW CREATE TABLE 之类的操作。

但您无法对其执行以下操作：

* RENAME
* CREATE TABLE
* ALTER

``` sql
CREATE DATABASE [IF NOT EXISTS] db_name [ON CLUSTER cluster]ENGINE = MySQL('host:port', ['database' | database], 'user', 'password')
```

https://cloud.tencent.com/document/product/1299/49828#mysql-.E5.BC.95.E6.93.8E

### ClickHouse

## 表引擎

``` sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name [ON CLUSTER cluster]
(
    name1 [type1] [DEFAULT|MATERIALIZED|ALIAS expr1] [compression_codec] [TTL expr1],
    name2 [type2] [DEFAULT|MATERIALIZED|ALIAS expr2] [compression_codec] [TTL expr2],
    ...
) ENGINE = engine
```

https://clickhouse.tech/docs/zh/engines/table-engines/
https://developer.aliyun.com/article/739801

- MergeTree
- Log
- Integration
- Special
- Distributed: 分布式表引擎
    ``` sql
    Distributed(logs, default, hits[, sharding_key[, policy_name]])
    - logs: the cluster name in the server’s config file
    - default: the name of a remote database
    - hits: the name of a remote table
    - (optionally) sharding key
    - (optionally) policy name, it will be used to store temporary files for async send
    ```

## 文件系统

    - /var/lib/clickhouse
      - /data  # 数据
        - /system  # 这一层目录是 database 名，每个 database 一个目录
        - /default
            ├── user_l -> /data/clickhouse/store/a11/a113d4d6-3efe-4948-b49f-45bc29134972
            ├── user_local -> /data/clickhouse/store/baf/bafeae6c-9e81-4177-a9ba-6254e645ccc8
            ├── user_rp -> /data/clickhouse/store/f14/f14d2d15-32b3-4486-a972-551bd8e4b115
            ├── user_rp_d -> /data/clickhouse/store/aa5/aa526633-18e4-4098-ac05-cc3c5c17f14c
            ├── user_single -> /data/clickhouse/store/3d4/3d404ebe-9b56-4b3b-a184-f748547c488f
            └── user_single_d -> /data/clickhouse/store/b91/b911bc61-3e61-48a5-8e05-1514917d8340

                ├── 19951022_3_3_0
                │   ├── checksums.txt
                │   ├── columns.txt
                │   ├── count.txt
                │   ├── data.bin
                │   ├── data.mrk3
                │   ├── default_compression_codec.txt
                │   ├── minmax_brith.idx
                │   ├── partition.dat
                │   └── primary.idx
                ├── 19960708_1_1_0
                │   ├── checksums.txt
                │   ├── columns.txt
                │   ├── count.txt
                │   ├── data.bin
                │   ├── data.mrk3
                │   ├── default_compression_codec.txt
                │   ├── minmax_brith.idx
                │   ├── partition.dat
                │   └── primary.idx
                ├── 19970808_2_2_0
                │   ├── checksums.txt
                │   ├── columns.txt
                │   ├── count.txt
                │   ├── data.bin
                │   ├── data.mrk3
                │   ├── default_compression_codec.txt
                │   ├── minmax_brith.idx
                │   ├── partition.dat
                │   └── primary.idx
                ├── detached
                └── format_version.txt
        - /test
            - /bank_replica  # 这一层目录是 table 名
                -
## 监控

## 系统表

集群信息：`system.clusters`

    SELECT * FROM system.clusters;

## clickhouse-copier

    $ clickhouse-copier --daemon --config zookeeper.xml --task-path /task/path --base-dir /path/to/dir

