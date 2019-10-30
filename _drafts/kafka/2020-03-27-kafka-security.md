### 控制方式

* 信道加密Encryption(SSL)
* 认证Authentication(SSL or SASL)：对 client 与 broker 的连接进行控制
  * SSL
  * SASL
    * SASL/GSSAPI (Kerberos) - 从0.9.0.0版本开始
    * SASL/PLAIN - 从0.10.0.0版本开始
    * SASL/SCRAM-SHA-256 和 SASL/SCRAM-SHA-512 - 从0.10.2.0版本开始
    * SASL/OAUTHBEARER - 从2.0版本开始
* 授权Authorisation(ACL)：控制 host/producer/consumer 对 topic 的读写权限

### 解决的问题

* Currently, any client can access your Kafka cluster (authentication)
* The clients can publish / consumer and topic data (authorisation)
* All the data being sent is fully visible on the network (encryption)

### SASL/PLAIN Authentication

修改 `config/server.properties`

```
# 认证配置
listeners=SASL_PLAINTEXT://ip:port
security.inter.broker.protocol=SASL_PLAINTEXT
sasl.mechanism.inter.broker.protocol=PLAIN
sasl.enabled.mechanisms=PLAIN

# ACL 配置
allow.everyone.if.no.acl.found=false
authorizer.class.name=kafka.security.auth.SimpleAclAuthorizer
super.users=User:admin
```

`super.users` 可以配置多个：

```
super.users=User:admin;User:alice
```

添加 `config/kafka_server_jaas.conf` 文件：

```
KafkaServer {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    username="admin"
    password="admin_pass"
    user_admin="admin_pass"
    user_alice="alice_pass";
};
```

配置中的 `user_admin="admin_pass"` 的规则是 `user_<username>="<password>"`，就是说配置了 2 个用户 `admin` 和 `alice`，密码分别是 `admin_pass` 和 `alice_pass`

需要在 jvm 启动参数中指定 jaas 配置文件，修改 `bin/kafka-run-class.sh`:

``` bash
KAFKA_SASL_OPTS='-Djava.security.auth.login.config=/usr/local/kafka/config/kafka_server_jaas.conf'

# Launch mode
if [ "x$DAEMON_MODE" = "xtrue" ]; then
  nohup $JAVA $KAFKA_HEAP_OPTS $KAFKA_JVM_PERFORMANCE_OPTS $KAFKA_GC_LOG_OPTS $KAFKA_SASL_OPTS $KAFKA_JMX_OPTS $KAFKA_LOG4J_OPTS -cp $CLASSPATH $KAFKA_OPTS "$@" > "$CONSOLE_OUTPUT_FILE" 2>&1 < /dev/null &
else
  exec $JAVA $KAFKA_HEAP_OPTS $KAFKA_JVM_PERFORMANCE_OPTS $KAFKA_GC_LOG_OPTS $KAFKA_SASL_OPTS $KAFKA_JMX_OPTS $KAFKA_LOG4J_OPTS -cp $CLASSPATH $KAFKA_OPTS "$@"
fi
```

客户端连接时需要配置 `kafka_client_jaas.conf` 文件

```
KafkaClient {
  org.apache.kafka.common.security.plain.PlainLoginModule required
  username="alice"
  password="alice_pass";
};
```

然后在程序中添加配置：

``` java
// 添加环境变量，需要指定配置文件的路径
System.setProperty("java.security.auth.login.config", "/etc/kafka/conf/kafka_client_jaas.conf");

props.put("security.protocol", "SASL_PLAINTEXT");
props.put("sasl.mechanism", "PLAIN");
```

使用命令行时，在 jvm 中增加启动参数 `java.security.auth.login.config`，例如：修改 `bin/kafka-console-consumer.sh`

``` bash
exec $(dirname $0)/kafka-run-class.sh -Djava.security.auth.login.config=/etc/kafka/conf/kafka_client_jaas.conf kafka.tools.ConsoleConsumer "$@"
```

增加配置文件 `consumer.properies`

```
group.id=__test
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
```

运行 `kafka-console-consumer.sh`

    $ kafka-console-consumer.sh --bootstrap-server $(hostname):9092 --topic foo --from-beginning --consumer.config /etc/kafka/conf/consumer.properies

    $ kafka-console-consumer.sh --formatter "kafka.coordinator.group.GroupMetadataManager\$OffsetsMessageFormatter" --bootstrap-server $(hostname):9092 --topic foo --from-beginning --consumer.config /etc/kafka/conf/consumer.properies

### SASL/SCRAM Authentication

### 权限控制(Authorisation)

kafka 的权限控制可以通过 `kafka-acls.sh` 脚本添加，内存存储在 zookeeper 的 `/kafka-acl` 路径上

进行上述配置后，还需要给 topic 增加权限：

    $ kafka-acls.sh --authorizer kafka.security.auth.SimpleAclAuthorizer --authorizer-properties zookeeper.connect=localhost:2181 --add --allow-principal User:alice --operation Write --topic foo

    $ kafka-acls.sh --authorizer kafka.security.auth.SimpleAclAuthorizer --authorizer-properties zookeeper.connect=localhost:2181 --add --allow-principal User:godman --operation Read --topic __consumer_offsets --group __test

列出权限：

    $ kafka-acls.sh --authorizer kafka.security.auth.SimpleAclAuthorizer  --authorizer-properties zookeeper.connect=localhost:2181 --list

移除权限：

    $ kafka-acls.sh --authorizer kafka.security.auth.SimpleAclAuthorizer  --authorizer-properties zookeeper.connect=localhost:2181 --remove --topic foo
