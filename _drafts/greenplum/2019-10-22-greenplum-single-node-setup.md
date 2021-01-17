---
title: greenplum 单节点集群启动
tags: [greenplum]
---

查看主机名：

    $ hostname
    10-11-171-92

添加 gpadmin 用户：

    groupadd gpadmin
    useradd gpadmin -g gpadmin
    passwd gpadmin

安装 gpdb：

    wget https://github.com/greenplum-db/gpdb/releases/download/6.1.0/greenplum-db-6.1.0-rhel6-x86_64.rpm
    # wget https://github.com/greenplum-db/gpdb/releases/download/6.1.0/greenplum-db-6.1.0-rhel7-x86_64.rpm
    yum install apr apr-util krb5-devel libyaml rsync libevent bzip2 zip
    rpm -Uvh ./greenplum-db-6.1.0-rhel6-x86_64.rpm

设置 gpdb 安装目录权限：

    chown -R gpadmin /usr/local/greenplum*
    chgrp -R gpadmin /usr/local/greenplum*

创建 gpdb 数据目录：

    mkdir /data/master
    mkdir /data/primary
    chown -R gpadmin:gpadmin /data

切换到 gpadmin 用户：

    su - gpadmin

修改 .bashrc：

    echo "source /usr/local/greenplum-db/greenplum_path.sh" >> .bashrc
    echo "export MASTER_DATA_DIRECTORY=/data/master/gpseg-1" >> .bashrc
    source .bashrc


    # echo "10-11-171-92" > hostfile
    echo $(hostname) > hostfile
    gpssh-exkeys -f hostfile

vim gp_init_config

```
ARRAY_NAME="Greenplum"
MACHINE_LIST_FILE=./hostfile
SEG_PREFIX=gpseg
PORT_BASE=50000
declare -a DATA_DIRECTORY=(/data/primary /data/primary )
MASTER_HOSTNAME=10-11-171-92
MASTER_DIRECTORY=/data/master
MASTER_PORT=5432
TRUSTED_SHELL=ssh
CHECK_POINT_SEGMENTS=8
ENCODING=UNICODE
```

``` bash
echo "ARRAY_NAME="'"''Greenplum''"'"
MACHINE_LIST_FILE=./hostfile
SEG_PREFIX=gpseg
PORT_BASE=50000
declare -a DATA_DIRECTORY=(/data/primary /data/primary )
MASTER_HOSTNAME=$(hostname)
MASTER_DIRECTORY=/data/master
MASTER_PORT=5432
TRUSTED_SHELL=ssh
CHECK_POINT_SEGMENTS=8
ENCODING=UNICODE" > gp_init_config
```

初始化集群：

    gpinitsystem -c ~/gp_init_config

psql -c "create database gpadmin" template1
psql -c "alter user gpadmin password 'changeme'"

echo "host all all 0.0.0.0/0 md5" >> /data/master/gpseg-1/pg_hba.conf
gpstop -u

psql

## pxf

echo 'export GOPATH=/usr/local/go
export JAVA_HOME=/usr/lib/jvm/java
export PXF_HOME=/usr/local/greenplum-db/pxf
export GPHOME=/usr/local/greenplum-db
export PATH=/usr/local/go/bin:/usr/local/greenplum-db/pxf/bin:$PATH' >> ~/.bashrc

source ~/.bashrc
yum install go java-1.8.0-openjdk-devel.x86_64 unzip
go get -v github.com/golang/dep/cmd/dep
go get -v github.com/onsi/ginkgo/ginkgo

wget https://github.com/greenplum-db/pxf/archive/5.9.1.tar.gz


tar zxvf 5.9.1.tar.gz
cd pxf-5.9.1/
make
make install

    chown -R gpadmin /usr/local/greenplum*
    chgrp -R gpadmin /usr/local/greenplum*

su - gpadmin

echo 'export GOPATH=/usr/local/go
export JAVA_HOME=/usr/lib/jvm/java
export GPHOME=/usr/local/greenplum-db
export PXF_CONF=/home/gpadmin/pxf/usercfg
export PXF_HOME=$GPHOME/pxf
export PATH=$GPHOME/pxf/bin:$PATH' >> ~/.bashrc

source ~/.bashrc
pxf cluster init
pxf cluster start

