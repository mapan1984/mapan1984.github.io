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


