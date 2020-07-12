### connector-plugin

### connector

Connectors (monitoring the source or sink system for changes that require reconfiguring tasks)

consumer group

#### task

tasks (copying a subset of a connector's data)

`config.storage.topic`

`status.storage.topic`

### workers

consumer group

`group.id`

Under the covers, connect workers are using consumer groups to coordinate and rebalance.


## 启动

``` bash
nohup ${KAFKA_HOME}/bin/connect-distributed.sh config/connect-distributed.properties &

${KAFKA_HOME}/bin/connect-distributed.sh -daemon config/connect-distributed.properties
```

## http api

[connector http api]({{ site.url }}/resources/code/kafka/connector/connect.sh)
