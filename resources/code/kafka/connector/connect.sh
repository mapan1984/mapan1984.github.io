### connector

curl http://localhost:8083 | python -m json.tool

curl -g -6 http://[::1]:8083 | python -m json.tool

curl http://localhost:8083/connector-plugins | python -m json.tool

echo '{"name": "load-kafka-config", "config": { "connector.class": "org.apache.kafka.connect.file.FileStreamSourceConnector", "file": "/var/log/agent/kafkaAgent.log", "topic": "agent-log"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

${KAFKA_HOME}/bin/kafka-console-consumer.sh --property print.timestamp=true --property print.key=true --bootstrap-server $(hostname):9092 --topic agent-log --from-beginning

echo '{"name": "dump-kafka-config", "config": {"connector.class": "org.apache.kafka.connect.file.FileStreamSinkConnector", "file": "/usr/local/kafka/copy-agent-log", "topics": "agent-log"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

curl http://localhost:8083/connectors | python -m json.tool

curl http://localhost:8083/connectors/load-kafka-config | python -m json.tool

curl -X DELETE http://localhost:8083/connectors/dump-kafka-config | python -m json.tool

### es

#### 获取所有配置项

``` json
{
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "tasks.max": "1",
    "topics": "test-topic"
}
```

curl -X PUT -H "Content-Type: application/json" --data @config.json http://localhost:8083/connector-plugins/ElasticsearchSinkConnector/config/validate/

#### 提交connector

echo '{"name": "elastic-log-connector", "config": {"connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector", "connection.url": "http://10.9.107.141:9200", "type.name": "log", "topics": "log", "key.ignore": true, "schema.ignore": true, "tasks.max": 3}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "elastic-random-log-connector", "config": {"connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector", "connection.url": "http://10.9.107.141:9200", "type.name": "randomlog", "topics": "random-log", "key.ignore": true, "schema.ignore": true, "tasks.max": 3}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "elastic-large-log-connector", "config": {"connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector", "connection.url": "http://10.9.107.141:9200", "type.name": "largelog", "topics": "large-log", "key.ignore": true, "schema.ignore": true, "tasks.max": 3}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool


curl http://localhost:8083/connectors/elastic-log-connector/config | python -m json.tool

curl http://localhost:8083/connectors/elastic-log-connector/status | python -m json.tool

curl http://localhost:8083/connectors/elastic-log-connector/tasks | python -m json.tool

### hdfs

curl http://localhost:8083/connectors/hdfs-users-connector/config | python -m json.tool

curl http://localhost:8083/connectors/hdfs-users-connector/status | python -m json.tool

curl http://localhost:8083/connectors/hdfs-users-connector/tasks | python -m json.tool

echo '{"name": "hdfs-string-connector", "config": {"connector.class": "io.confluent.connect.hdfs.HdfsSinkConnector", "hdfs.url": "hdfs://10.9.68.210:8020", "topics": "string", "tasks.max": 3, "flush.size": 3, "format.class": "io.confluent.connect.hdfs.json.JsonFormat"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "hdfs-random-string-connector", "config": {"connector.class": "io.confluent.connect.hdfs.HdfsSinkConnector", "hdfs.url": "hdfs://10.9.68.210:8020", "topics": "random-string", "tasks.max": 3, "flush.size": 3, "format.class": "io.confluent.connect.hdfs.json.JsonFormat"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "hdfs-log-connector", "config": {"connector.class": "io.confluent.connect.hdfs.HdfsSinkConnector", "hdfs.url": "hdfs://10.9.68.210:8020", "topics": "log", "tasks.max": 3, "flush.size": 3, "format.class": "io.confluent.connect.hdfs.json.JsonFormat", "topics.dir":"/ltopics", "logs.dir": "/llogs"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "hdfs-users-connector", "config": {"connector.class": "io.confluent.connect.hdfs.HdfsSinkConnector", "hdfs.url": "hdfs://10.9.109.103:8020", "topics": "users", "tasks.max": 3, "flush.size": 1024, "format.class": "io.confluent.connect.hdfs.json.JsonFormat", "topics.dir":"/ukafka/users/topic", "logs.dir": "/ukafka/users/log"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "hdfs-logs-connector", "config": {"connector.class": "io.confluent.connect.hdfs.HdfsSinkConnector", "hdfs.url": "hdfs://10.9.109.103:8020", "topics": "logs", "tasks.max": 3, "flush.size": 1024, "format.class": "io.confluent.connect.hdfs.json.JsonFormat", "topics.dir":"/ukafka/logs/topic", "logs.dir": "/ukafka/logs/log"}}' \
  | curl -X POST -d @- http://10.9.138.90:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "hdfs-large-log-connector", "config": {"connector.class": "io.confluent.connect.hdfs.HdfsSinkConnector", "hdfs.url": "hdfs://10.9.68.210:8020", "topics": "large-log", "tasks.max": 3, "flush.size": 10, "format.class": "io.confluent.connect.hdfs.json.JsonFormat"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

echo '{"name": "hdfs-users-connector", "config": {"connector.class": "io.confluent.connect.hdfs.HdfsSinkConnector", "hdfs.url": "hdfs://10.9.109.103:8020", "topics": "users", "tasks.max": 3, "flush.size": 1024, "topics.dir": "/ukafka/users/topic", "logs.dir": "/ukafka/users/log"}}' \
  | curl -X POST -d @- http://localhost:8083/connectors --header "Content-Type:application/json" \
  | python -m json.tool

## 控制 connector

curl -X PUT  http://localhost:8083/connectors/elastic-log-connector/pause

curl -X PUT  http://localhost:8083/connectors/elastic-log-connector/resume

curl -X POST -d '{}' http://localhost:8083/connectors/elastic-log-connector/restart --header "Content-Type:application/json"

# 更新配置

``` json
{
    "connection.url": "http://10.9.79.39:9200",
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "key.ignore": "true",
    "name": "elastic-log-connector",
    "schema.ignore": "true",
    "tasks.max": "10",
    "topics": "log",
    "type.name": "log"
}
```

curl -X PUT  --data @elastic-log-connector.json http://localhost:8083/connectors/elastic-log-connector/config --header "Content-Type:application/json"

## es 交互

curl http://10.9.79.39:9200/

curl http://10.9.79.39:9200/_cat/indices?v

curl -s -X GET http://10.9.79.39:9200/agent-log/_search?pretty=true

## curl

wget https://github.com/confluentinc/kafka-connect-datagen/raw/master/config/connector_pageviews_cos.config
curl -X POST -H "Content-Type: application/json" --data @connector_pageviews_cos.config http://localhost:8083/connectors


vim config.json

``` json
{
    "connector.class": "org.apache.kafka.connect.file.FileStreamSinkConnector",
    "tasks.max": "1",
    "topics": "test-topic"
}
```

curl -X PUT -H "Content-Type: application/json" --data @config.json http://localhost:8083/connector-plugins/FileStreamSinkConnector/config/validate/


unzip confluentinc-kafka-connect-elasticsearch-4.1.1.zip
mv confluentinc-kafka-connect-elasticsearch-4.1.1 plugins/

