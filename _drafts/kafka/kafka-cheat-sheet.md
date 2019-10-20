## Kafka Topics

### List existing topics

    bin/kafka-topics.sh --zookeeper localhost:2181 --list

### Purge a topic

    bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic mytopic --config retention.ms=1000

... wait a minute ...

    bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic mytopic --delete-config retention.ms

### Delete a topic

    bin/kafka-topics.sh --zookeeper localhost:2181 --delete --topic mytopic

### Get the earliest offset still in a topic

    bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list localhost:9092 --topic mytopic --time -2

### Get the latest offset still in a topic

    bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list localhost:9092 --topic mytopic --time -1

### Consume messages with the console consumer

    bin/kafka-console-consumer.sh --new-consumer --bootstrap-server localhost:9092 --topic mytopic --from-beginning

## Get the consumer offsets for a topic

    bin/kafka-consumer-offset-checker.sh --zookeeper=localhost:2181 --topic=mytopic --group=my_consumer_group

### Read from __consumer_offsets

Add the following property to `config/consumer.properties`:

```
exclude.internal.topics=false
```

    bin/kafka-console-consumer.sh --consumer.config config/consumer.properties --from-beginning --topic __consumer_offsets --zookeeper localhost:2181 --formatter "kafka.coordinator.GroupMetadataManager\$OffsetsMessageFormatter"

## Kafka Consumer Groups

### List the consumer groups known to Kafka

    # (old api)
    bin/kafka-consumer-groups.sh --zookeeper localhost:2181 --list

    # (new api)
    bin/kafka-consumer-groups.sh --new-consumer --bootstrap-server localhost:9092 --list

### View the details of a consumer group 

    bin/kafka-consumer-groups.sh --zookeeper localhost:2181 --describe --group <group name>

## kafkacat

### Getting the last five message of a topic

    kafkacat -C -b localhost:9092 -t mytopic -p 0 -o -5 -e

## Zookeeper

### Starting the Zookeeper Shell

    bin/zookeeper-shell.sh localhost:2181
