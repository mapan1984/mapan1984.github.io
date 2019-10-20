## 架构

1. Master 节点：入口，接受客户端连接及提交 SQL 语句，将工作负载分发给其他数据库实例(Segment实例)，由它们存储和处理数据
    * SQL 的解析并形成分布式的执行计划
    * 将生成好的执行计划分布到每个 Segment 上执行
    * 收集 Segment 的执行结果
2. Segment 节点：独立的 PostgreSQL 数据库，每个 Segment 存储一部分数据，大部分查询处理都由 Segment 完成
3. Interconnect：负责不同 PostgreSQL 实例之间通信

## 数据字典

0. gp_configration
1. gp_segment_configration
2. pg_filespace_entry
    - 这两个表是在pg_global表空间下面的，是全局表。用来查看集群segment信息，比如segment个数。

3. pg_class 保存了所有表、视图、序列、索引元数据信息，每个DDL/DML操作都必须跟这个表发生关系。
4. pg_attribute 记录字段的内容
3. gp_distribution_policy 记录表的分布键
4. pg_statistic 和 pg_stats: 数据库中表的统计信息保存在pg_statistic中 pg_stats可以方便帮我们查看pg_statistic的内容
5. pg_partition 记录分区表的信息
6. pg_partition_rule 分区表的分区规则
7. pg_partitions

### 字典表的应用

1. 查看表的信息

1）从catalog中查询

2）从information_schema查询

``` sql
select * from information_schema.tables where table_name ='';
```

2. 获取字段信息

1）从catalog中查询

``` sql
SELECT a.attnameg_catalog.format_type(a.atttypid, (pg_catalog.pg_attribute a, a.atttypmod) AS data_type
FROM pg_catalog.pg_attribute a,
 (SELECT c. oid
  FROM pg_catalog.pg_class c
   LEFT JOIN pg_catalog.pg_namespace n
    ON n.oid = c.relnamespace
     WHERE c.relname = 'pg_class'
      AND n.nspname = 'pg_catalog'
       ) b
       WHERE a.attrelid = b.oid
       AND a.attnum > 0
       AND NOT a.attisdropped ORDER BY a.attnum;
```

使用regclass就会简化很多：

``` sql
SELECT a.attnameg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type
FROM pg_catalog.pg_attribute a
WHERE a.attrelid ='pg_catalog.pg_class'::regclass
AND a.attnum > 0
AND NOT a.attisdropped ORDER BY a.attnum;
```

2）从information_schema查询

``` sql
select * from information_schema.columns where table_name = '';
```

2、获取表的分布键

``` sql
select a.attrnums[i.i],b.attname,a.localoid::regclass
from gp_distribution_policy a,
(select generate_series(1,10))i (i),
  pg_attribute b
where a.attrnums[i.i) is not null
and a.localoid=b.attrelid
and a.attrnums[i.i]=b.attnum
and a.localoid='public.cxfa2 '::regclass
order by i.i;
```

3、获取一个视图定义

    testDB=# create table cxfa( a int) distributed by (a);
    CREATE TABLE
    testDB=# create view v_cxfa as select * from cxfa;
    CREATE VIEW
    testDB=# select pg_get_viewdef('v_cxfa', true);
    SELECT cxfa.a FROM cxfa;
    (1 row)

4、查询备注信息

1）获取表的备注

``` sql
select COALESCE(description, * *) as comment
from pg_description
where objoid=‘cxfa*::regclass and objsubid=0;
```

2）获取字段的备注

``` sql
select b.attname as columnname, COALESCE(a.description,'') as comment
from pg_catalog.pg_description ag_catalog.pg_attribute b
where  objoid='cxfa'::regclass
and a.objoid=b.attrelid
and a.objsubid=b.attnum;
```

5、获取数据据库建表语句

1）调用plpythonu

``` sql
CREATE PROCEDURAL LANGUAGE plpythonu;
```

2）创建存储过程


