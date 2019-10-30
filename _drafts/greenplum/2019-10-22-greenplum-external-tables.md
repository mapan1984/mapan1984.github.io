## gphdfs

    echo "1,tom" | hadoop fs -put - /data/gp.dat

``` sql
create external table hdfs_test2 (id int, name varchar(128))
location ('gphdfs://10.9.170.100:8020/data/gp.dat')
format 'TEXT' (delimiter ',');
```

如果没有权限，需要执行：

    GRANT SELECT ON PROTOCOL gphdfs TO <username>;
    GRANT INSERT ON PROTOCOL gphdfs TO <username>;

*gpdb6.x废弃了gphdfs协议*

## pxf

### java 进程详情

``` sh
/usr/lib/jvm/java/bin/java \
    -Djava.util.logging.config.file=/usr/local/gpdb/pxf/pxf-service/conf/logging.properties \
    -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager \
    -Xmx2g \
    -Xms1g \
    -Dconnector.https.port=8443 \
    -Dpxf.home=/usr/local/gpdb/pxf \
    -Dpxf.conf=/home/postgres/pxf/usercfg \
    -Dconnector.http.port=5888 \
    -Dbase.shutdown.port=5889 \
    -Dpxf.log.dir=/home/postgres/pxf/usercfg/logs \
    -Dpxf.service.user.impersonation.enabled=false \
    -Dpxf.service.kerberos.keytab=/home/postgres/pxf/usercfg/keytabs/pxf.service.keytab \
    -Dpxf.service.kerberos.principal=gpadmin/_HOST@EXAMPLE.COM \
    -Djava.endorsed.dirs=/usr/local/gpdb/pxf/pxf-service/endorsed \
    -classpath /usr/local/gpdb/pxf/pxf-service/bin/bootstrap.jar:/usr/local/gpdb/pxf/pxf-service/bin/tomcat-juli.jar \
    -Dcatalina.base=/usr/local/gpdb/pxf/pxf-service \
    -Dcatalina.home=/usr/local/gpdb/pxf/pxf-service \
    -Djava.io.tmpdir=/usr/local/gpdb/pxf/pxf-service/temp org.apache.catalina.startup.Bootstrap start
```

### 日志目录

/home/postgres/pxf/usercfg/logs

### catalina 配置

目录：`/usr/local/gpdb/pxf/pxf-service`

修改配置：`/usr/local/gpdb/pxf/pxf-service/conf/server.xml`

``` xml
<?xml version="1.0"?>

<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

<Server port="${base.shutdown.port}"
        shutdown="SHUTDOWN">
    <Listener className="org.apache.catalina.core.JasperListener"/>
    <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener"/>
    <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener"/>
    <GlobalNamingResources>
        <Resource auth="Container"
                  description="User database that can be updated and saved"
                  factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
                  name="UserDatabase"
                  pathname="conf/tomcat-users.xml"
                  type="org.apache.catalina.UserDatabase"/>
    </GlobalNamingResources>
    <Service name="Catalina">
        <Executor maxThreads="300"
                  minSpareThreads="50"
                  name="tomcatThreadPool"
                  namePrefix="tomcat-http--"/>
        <Engine defaultHost="localhost"
                name="Catalina">
            <Realm className="org.apache.catalina.realm.LockOutRealm">
                <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
                       resourceName="UserDatabase"/>
            </Realm>
            <Host appBase="webapps"
                  autoDeploy="true"
                  deployOnStartup="true"
                  deployXML="true"
                  name="localhost"
                  unpackWARs="true">
                <Valve className="org.apache.catalina.valves.AccessLogValve"
                       directory="/tmp/logs"
                       pattern="%h %l %u %t &quot;%r&quot; %s %b"
                       prefix="localhost_access_log."
                       suffix=".txt"/>
            </Host>
        </Engine>
        <Connector acceptCount="100"
                   connectionTimeout="20000"
                   executor="tomcatThreadPool"
                   maxKeepAliveRequests="15"
                   maxHeaderCount="30000"
                   maxHttpHeaderSize="1048576"
                   port="${connector.http.port}"
                   protocol="org.apache.coyote.http11.Http11Protocol"
                   redirectPort="${connector.https.port}"/>
    </Service>
    <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener"/>
</Server>
```

### pxf 配置

`$PXF_CONF/conf/pxf-env.sh`：

``` sh
#!/bin/bash

##############################################################################
# This file contains PXF properties that can be specified by users           #
# to customize their deployments. This file is sourced by PXF Server control #
# scripts upon initialization, start and stop of the PXF Server.             #
#                                                                            #
# To update a property, uncomment the line and provide a new value.          #
##############################################################################

PXF_CONF="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Path to JAVA
# export JAVA_HOME=/usr/java/default

# Path to Log directory
export PXF_LOGDIR="${PXF_CONF}/logs"

# Memory
export PXF_JVM_OPTS="-Xmx8g -Xms4g"

# Kerberos path to keytab file owned by pxf service with permissions 0400
# export PXF_KEYTAB="${PXF_CONF}/keytabs/pxf.service.keytab"

# Kerberos principal pxf service should use. _HOST is replaced automatically with hostnames FQDN
# export PXF_PRINCIPAL="gpadmin/_HOST@EXAMPLE.COM"

# End-user identity impersonation, set to true to enable
# export PXF_USER_IMPERSONATION=true
export PXF_USER_IMPERSONATION=false
```

### 同步配置

    gpscp -v -f /usr/local/gpdb/conf/allnodes /usr/local/gpdb/pxf/pxf-service/conf/server.xml =:/usr/local/gpdb/pxf/pxf-service/conf

    gpscp -v -f /usr/local/gpdb/conf/allnodes /home/postgres/pxf/usercfg/conf/pxf-env.sh =:/home/postgres/pxf/usercfg/conf

    gpscp -v -f /usr/local/gpdb/conf/allnodes /home/postgres/.bashrc =:/home/postgres

### 配置 Hadoop 相关信息

同步脚本：

``` bash
#!/bin/bash
# ./copy.sh root@10.8.35.154 /home/hadoop/.versions/hadoop-2.6.0/etc/hadoop

remote=${1:-hdfsuser@namenode}
conf_dir=${2:-/etc/hadoop/conf}

cd $PXF_CONF/servers/default

scp ${remote}:${conf_dir}/core-site.xml .
scp ${remote}:${conf_dir}/hdfs-site.xml .
scp ${remote}:${conf_dir}/mapred-site.xml .
scp ${remote}:${conf_dir}/yarn-site.xml .
scp ${remote}:${conf_dir}/hbase-site.xml .

scp ${remote}:/home/hadoop/.versions/hive-2.3.3/conf/hive-site.xml .
```

### 同步 hosts 文件

    $ scp hdfsuser@namenode:/etc/hosts .

    $ source /home/postgres/.bashrc
    $ gpscp -v -f /usr/local/gpdb/conf/allnodes /etc/hosts =:/etc

source /home/postgres/.bashrc
gpscp -v -f /usr/local/gpdb/conf/allnodes /etc/hosts =:/etc

### 创建 extension

    CREATE EXTENSION pxf;
    GRANT SELECT ON PROTOCOL pxf TO pan;
    GRANT INSERT ON PROTOCOL pxf TO pan;

### 访问 HDFS

在 HDFS 上创建示例数据文件：

    $ hdfs dfs -mkdir -p /data/pxf_examples

    $ echo 'Prague,Jan,101,4875.33
    Rome,Mar,87,1557.39
    Bangalore,May,317,8936.99
    Beijing,Jul,411,11600.67' > /tmp/pxf_hdfs_simple.txt

    $ hdfs dfs -put /tmp/pxf_hdfs_simple.txt /data/pxf_examples/

    $ hdfs dfs -cat /data/pxf_examples/pxf_hdfs_simple.txt

在 Greenplum 上创建外部表：

``` sql
CREATE EXTERNAL TABLE pxf_hdfs_textsimple5(location text, month text, num_orders int, total_sales float8)
LOCATION ('pxf://data/pxf_examples/pxf_hdfs_simple.txt?PROFILE=hdfs:text')
FORMAT 'TEXT' (delimiter=E',');
```

在 GreenPlum 上创建可写外部表：

``` sql
CREATE WRITABLE EXTERNAL TABLE pxf_hdfs_writabletbl_2 (location text, month text, num_orders int, total_sales float8)
LOCATION ('pxf://data/pxf_example/pxfwritable_hdfs_textsimple2?PROFILE=hdfs:text&COMPRESSION_CODEC=org.apache.hadoop.io.compress.GzipCodec')
FORMAT 'TEXT' (delimiter=':');

INSERT INTO pxf_hdfs_writabletbl_1 VALUES ( 'Cleveland', 'Oct', 3812, 96645.37 );
INSERT INTO pxf_hdfs_writabletbl_1 VALUES ( 'Frankfurt', 'Mar', 777, 3956.98 );
```

### 访问 Hive

示例数据：

``` sh
echo 'Prague,Jan,101,4875.33
Rome,Mar,87,1557.39
Bangalore,May,317,8936.99
Beijing,Jul,411,11600.67
San Francisco,Sept,156,6846.34
Paris,Nov,159,7134.56
San Francisco,Jan,113,5397.89
Prague,Dec,333,9894.77
Bangalore,Jul,271,8320.55
Beijing,Dec,100,4248.41
' > /tmp/pxf_hive_datafile.txt
```

    $ hive

``` sql
CREATE TABLE sales_info (location string, month string,
number_of_orders int, total_sales double)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS textfile;

LOAD DATA LOCAL INPATH '/tmp/pxf_hive_datafile.txt'
INTO TABLE sales_info;

SELECT * FROM sales_info;

DESCRIBE EXTENDED sales_info;
```

    $ psql

``` sql
CREATE EXTERNAL TABLE salesinfo_hiveprofile(location text, month text, num_orders int, total_sales float8)
LOCATION ('pxf://default.sales_info?PROFILE=Hive')
FORMAT 'custom' (formatter='pxfwritable_import');

SELECT * FROM salesinfo_hiveprofile;
```
