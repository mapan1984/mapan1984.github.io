---
title: greenplum 物理存储对应
tags: [greenplum]
---

## 数据目录

greenplum 初始化时指定 segment 数据存储位置，查看 `gpinitsystem_config` 文件，假设内容如下：

```
...
SEG_PREFIX=udwseg
...

declare -a DATA_DIRECTORY=(/data/primary /data/primary)
...

declare -a MIRROR_DATA_DIRECTORY=(/data/mirror /data/mirror)
...

```

该配置文件指定了 2 个 primay 和 2 个 mirror，primary 的存储位置在 `/data/primary`，mirror 的存储位置在 `/data/mirror`

具体到每个 segment，存储位置在 `/data/primary/udwseg<id>/base`

## database 存储位置

在 `base` 目录中，会按照不同 database 分成不同的子目录，子目录名是 database 的 oid。运行以下 sql 可以查看不同 database 的 oid:

``` sql
select oid, datname from pg_database;
```

假如有以下结果：

    postgres=# select oid, datname from pg_database;
       oid   |      datname
    ---------+-------------------
       12025 | postgres
       16386 | dev
           1 | template1
       12024 | template0

则 `dev` database 的数据存储在各个节点的 `/data/[primary|mirror]/udwseg<id>/base/16386` 中

## table 存储文件

table 对应的数据文件在各节点的 `/data/[primary|mirror]/udwseg<id>/base/<db.oid>` 中，文件名是该 table 的 relfilenode

每个文件默认大小 1G，当 table 对应的内容超过 1G 时，对对文件进行切分，对应的文件列表为：

`
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>.1
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>.2
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>.3
...
`

不同 segment 上查询相同的表，relfilenode (可能)不一致，可以在对应的节点上指定 segment 端口登录：

    PGOPTIONS='-c gp_session_role=utility' psql -p 40001

切换到对应的 database, 查询 `dev` database 下的 `products` 表的 relfilenode

``` sql
\c dev
select oid, relname, relfilenode from pg_class where relname='products';
```

`
  oid  | relname  | relfilenode
-------+----------+-------------
 16387 | products |       16384
`

## 查看数据占用（检查数据倾斜）

### 数据库数据占用

根据数据库 `oid` 查看数据库占用大小：

``` bash
du -b /data/primary/udwseg*/base/<oid>
```

查看不同节点下数据库数据占用大小

``` bash
gpssh -f /usr/local/gpdb/conf/nodes -e "du -b /data/primary/udwseg*/base/16386" | grep -v "du -b"
```

进行统计：

``` bash
gpssh -f /usr/local/gpdb/conf/nodes -e \
    "du -b /data/primary/udwseg*/base/<oid>" | \
    grep -v "du -b" | sort | awk -F" " '{ arr[$1] = arr[$1] + $2 ; tot = tot + $2 }; END \
    { for ( i in arr ) print "Segment node" i, arr[i], "bytes (" arr[i]/(1024**3)" GB)"; \
    print "Total", tot, "bytes (" tot/(1024**3)" GB)" }' -
```

### 表数据占用

运行以下命令，替换 `db.oid` 和 `relfilenode`，可以统计 `db.oid` 数据库下 `relfilenode` 表文件占用磁盘存储：

``` bash
find /data/primary/udwseg*/base/<db.oid> -name '<relfilenode>*'  | xargs ls -al | awk 'BEGIN {sum=0} {sum+=$5} END {print sum}'
```

在所有节点上执行：

    gpssh -f /usr/local/gpdb/conf/nodes

    => find /data/primary/udwseg*/base/16387 -name '24272176*'  | xargs ls -al | awk 'BEGIN {sum=0} {sum+=$5} END {print sum}'

