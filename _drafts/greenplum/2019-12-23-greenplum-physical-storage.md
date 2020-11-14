---
title: greenplum 物理存储对应
tags: [greenplum]
---

### 数据目录

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

### database 存储位置

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

### table 存储文件

table 对应的数据文件在各节点的 `/data/[primary|mirror]/udwseg<id>/base/<db.oid>` 中，文件名是该 table 的 relfilenode

每个文件默认大小 1G，当 table 对应的内容超过 1G 时，对对文件进行切分，对应的文件列表为：

`
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>.1
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>.2
/data/[primary|mirror]/udwseg<id>/base/<db.oid>/<relfilenode>.3
...
`

不同 segment 上查询相同的表，relfilenode 不一致，可以在对应的节点上指定 segment 端口登录：

    PGOPTIONS='-c gp_session_role=utility' psql -p 40001

切换到对应的 database; 执行查询

``` sql
\c dev
select oid, relname, relfilenode from pg_class where relname='test';
```


### 查看表数据在各个节点上的大小

    gpssh -f /usr/local/gpdb/conf/nodes

    => find /data/primary -name '24272176.*'  | xargs ls -al | awk 'BEGIN {sum=0} {sum+=$5} END {print sum}'
    [udw-ewksk0-c11] 68827032
    [udw-ewksk0-c15] 68832600
    [udw-ewksk0-c12] 68688520
    [udw-ewksk0-c13] 68834144
    [udw-ewksk0-c14] 68685544
    [udw-ewksk0-c10] 68667560
    [udw-ewksk0-c17] 68814416
    [udw-ewksk0-c16] 68701360
    [udw-ewksk0-c28] 68694192
    [udw-ewksk0-c19] 68856752
    [udw-ewksk0-c18] 68684608
    [udw-ewksk0-c29] 68829880
    [udw-ewksk0-c24] 68687392
    [udw-ewksk0-c26] 68667760
    [udw-ewksk0-c21] 68824808
    [udw-ewksk0-c27] 68841752
    [udw-ewksk0-c20] 68681536
    [udw-ewksk0-c23] 68816680
    [udw-ewksk0-c03] 68870304
    [udw-ewksk0-c25] 68827176
    [udw-ewksk0-c02] 68679568
    [udw-ewksk0-c22] 68668504
    [udw-ewksk0-c06] 68673736
    [udw-ewksk0-c07] 68847288
    [udw-ewksk0-c04] 68686856
    [udw-ewksk0-c08] 68789016
    [udw-ewksk0-c31] 68828648
    [udw-ewksk0-c30] 68690832
    [udw-ewksk0-c33] 68829840
    [udw-ewksk0-c09] 68834344
    [udw-ewksk0-c32] 68702008
    [udw-ewksk0-c05] 68849536

