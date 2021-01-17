---
title: greenplum 查看数据占用
tags: [greenplum]
---


### database

``` sql
SELECT sodddatname, sodddatasize FROM gp_toolkit.gp_size_database;
```

Above query shows all databases and their size in bytes. If you wanted to see the size in GB, TB, and/or MB.

``` sql
SELECT sodddatname, (sodddatsize/1048576) AS sizeinMB
FROM gp_toolkit.gp_size_of_database;

SELECT sodddatname, (sodddatsize/1073741824) AS sizeinGB
FROM gp_toolkit.gp_size_of_database;

SELECT sodddatname, (sodddatsize/1073741824)/1024 AS sizeinTB
FROM gp_toolkit.gp_size_of_database;
```

### schema

For schema sizes, connect to your database and run:

``` sql
SELECT sosdnsp, (sosdschematablesize/1048576) AS schemasizeinMB
FROM gp_toolkit.gp_size_of_schema_disk;

SELECT sosdnsp, (sosdschematablesize/1073741824) AS schemasizeinGB
FROM gp_toolkit.gp_size_of_schema_disk;

SELECT sosdnsp, (sosdschematablesize/1073741824)/1024 AS schemasizeinTB
FROM gp_toolkit.gp_size_of_schema_disk;
```

Take a given schema and find table sizes:

``` sql
SELECT sotdschemaname as SCHEMA, sotdtablename,(sotdsize/1073741824) as tableGB
FROM gp_toolkit.gp_size_of_table_disk
WHERE sotdschemaname = 'yourschema' AND (sotdsize/1073741824) > 0
ORDER BY sotdtablename;

SELECT sotdschemaname as SCHEMA, sotdtablename,round((sotdsize/1048576),2) as tableMB
FROM gp_toolkit.gp_size_of_table_disk
WHERE sotdschemaname = 'yourschema' AND (sotdsize/1048576) > 0
ORDER BY sotdtablename;
```

### table

For an individual table you can get the size of the table as:

``` sql
SELECT pg_size_pretty(pg_relation_size('schema.table_name'));
```

You can get table and index size(total) with:

``` sql
SELECT pg_size_pretty(pg_total_relation_size('schema.table_name'));
```

### index

For just index size use:

``` sql
SELECT (pg_size_pretty( pg_total_relation_size('schema.table_name') - pg_relation_size('schema.table_name'))) AS IndexSize;
```

Digging more on the schema size queries.

``` sql
select schemaname,round(sum(pg_total_relation_size(schemaname||'.'||tablename))) "Size" from pg_tables group by 1;
```

This query misses out on the indexes as well as some required size components of any append-only tables. It also needs usage grants on all the schemas.

``` sql
select * from gp_toolkit.gp_size_of_schema_disk;
```

This query will return without error if the user running the SQL has usage on all the schemas. It will, however, not return correct data if the user does not have select access on all the tables (it will simply exclude the tables to which the user does not have select access).

If you have a service account and you want to monitor schema size for all individual schema which you do not have priv.

The best way to use a service account to get schema size correctly without having to grant any other unnecessary privileges is to use a stored function with security definer construct like below.

As gpadmin:

``` sql
create or replace function schema_size()
returns setof gp_toolkit.gp_size_of_schema_disk
as
$
select * from gp_toolkit.gp_size_of_schema_disk;
$
language sql volatile security definer;

revoke execute on function schema_size() from public;
grant execute on function schema_size() to some_user;
```

Then log in as some_user and run:

``` sql
select * from schema_size();
```

http://www.dbaref.com/greenplum-database-dba-references/databaseschemaandtablesizesingreenplum
