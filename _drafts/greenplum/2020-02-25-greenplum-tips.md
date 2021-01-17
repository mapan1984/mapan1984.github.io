## 架构

1. Master 节点：入口，接受客户端连接及提交 SQL 语句，将工作负载分发给其他数据库实例(Segment实例)，由它们存储和处理数据
    * SQL 的解析并形成分布式的执行计划
    * 将生成好的执行计划分布到每个 Segment 上执行
    * 收集 Segment 的执行结果
2. Segment 节点：独立的 PostgreSQL 数据库，每个 Segment 存储一部分数据，大部分查询处理都由 Segment 完成
3. Interconnect：负责不同 PostgreSQL 实例之间通信

## 编码

psql 编码：

    show client_encoding;
    set client_encoding='UTF8'

创建 database:

``` sql
CREATE DATABASE "helpspot_db"
    WITH OWNER "gpadmin"
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;
```

[](https://www.postgresql.org/docs/9.3/multibyte.html)

## template0/template1

create database 时，如果不指定 `template` 属性，默认以 template1 为模板

``` sql
create database db;

-- 相当于

create database db template template1;
```

数据库初始化之后, 就有了 template0, template1 库，开始时这两个库的内容是一样的。任何时候都不要对template0模板数据库进行任何修改，因为这是原始的干净模板，如果其它模板数据库被搞坏了，基于这个数据库做一个副本就可以了。如果希望定制自己的模板数据库，那么请基于template1进行修改，或者自己另外创建一个模板数据库再修改。

## ERROR: Canceling query because of high VMEM usage

Canceling query because of high VMEM usage. Used: 2MB, available 8165MB, red zone: 7372MB (runaway_cleaner.c:135)

取消超过 `gp_vmem_protect_limit` 设置 90% 的查询，防止 out-of-memory 错误。

`gp_vmem_protect_limit` 指定了单个 Segment 的所有活动 postgres 进程在任何给定时刻能够消耗的内存量。

90% 是由参数 `runaway_detector_activation_percent` 所规定的值。

`red zone` `used` `available`

`red zone` = `gp_vmem_protect_limit` * `runaway_detector_activation_percent`

[推荐设置](https://gp-docs-cn.github.io/docs/best_practices/sysconfig.html)

``` python
# 主机的交换空间(GB)
swap = 0
# 主机内存(GB)
ram = 12

gp_vmem = ((swap + ram) - (7.5 + 0.05 * ram)) / 1.7

print(f'greemplum 可用的主机内存 gp_vmem: {gp_vmem}')

# 能在一台主机上运行的主Segment的最大数量（要考虑镜像 segment 因为其他主机失效而被激活的情况）
max_acting_primary_segments = 2

print(f'greemplum 主机上可能运行的主Segment的最大数量: {max_acting_primary_segments}')

gp_vmem_protect_limit = gp_vmem / max_acting_primary_segments

print(f'greemplum gp_vmem_protect_limit: {gp_vmem_protect_limit}')

vm_overcommit_ratio = (ram - 0.026 * gp_vmem) / ram

print(f'vm.overcommit_ratio: {vm_overcommit_ratio}')
```

## pg_hba.conf

```
local      DATABASE  USER  METHOD  [OPTIONS]
host       DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
hostssl    DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
hostnossl  DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
```

* local: 这条记录匹配企图使用 Unix 域套接字的连接。如果没有这种类型的记录，就不允许 Unix 域套接字连接。
* host: 这条记录匹配企图使用 TCP/IP 建立的连接。host记录匹配SSL和非SSL的连接尝试。
* hostssl: 这条记录匹配企图使用 TCP/IP 建立的连接，但必须是使用SSL加密的连接。
* hostnossl: 这条记录的行为与hostssl相反；它只匹配那些在 TCP/IP上不使用SSL的连接企图。
* DATABASE:
    * all
    * sameuser: 如果被请求的数据库和请求的用户同名，则匹配
    * samerole: 请求的用户必须是一个与数据库同名的角色中的成员
    * replication: 如果一个物理复制连接被请求则该记录匹配（注意复制连接不指定任何特定的数据库）
    * 在其它情况里，这就是一个特定的PostgreSQL数据库名字。可以通过用逗号分隔的方法指定多个数据库，也可以通过在文件名前面放@来指定一个包含数据库名的文件。
* USER:
    * all
    * 要么是一个特定数据库用户的名字或者是一个有前导+的组名称（回想一下，在PostgreSQL里，用户和组没有真正的区别，+实际表示“匹配这个角色的任何直接或间接成员角色”，而没有+记号的名字只匹配指定的角色）
* ADDRESS:
    * trust: 无条件地允许连接。这种方法允许任何可以与PostgreSQL数据库服务器连接的用户以他们期望的任意PostgreSQL数据库用户身份登入，而不需要口令或者其他任何认证。
    * ident: 通过联系客户端的 ident 服务器获取客户端的操作系统名，并且检查它是否匹配被请求的数据库用户名。Ident 认证只能在 TCIP/IP 连接上使用。当为本地连接指定这种认证方式时，将用 peer 认证来替代
    * peer: 从操作系统获得客户端的操作系统用户，并且检查它是否匹配被请求的数据库用户名。这只对本地连接可用
