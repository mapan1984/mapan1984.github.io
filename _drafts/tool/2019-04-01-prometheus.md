---
title: prometheus 使用
tags: [prometheus]
---

### 下载运行

    $ wget https://github.com/prometheus/prometheus/releases/download/v2.8.1/prometheus-2.8.1.linux-amd64.tar.gz
    $ tar zxvf prometheus-2.8.1.linux-amd64.tar.gz
    $ cd prometheus-2.8.1.linux-amd64/
    $ ./prometheus --config.file=prometheus.yml

    $ curl http://localhost:9090


配置文件默认采集 prometheus 服务自身信息：

``` yaml
# my global config
global:
  scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
    - targets: ['localhost:9090']
```

### exporter

#### node

使用 node_exporter 为 prometheus 提供信息

    $ wget https://github.com/prometheus/node_exporter/releases/download/v0.17.0/node_exporter-0.17.0.linux-amd64.tar.gz
    $ tar zxvf node_exporter-0.17.0.linux-amd64.tar.gz
    $ cd node_exporter-0.17.0.linux-amd64
    $ ./node_exporter

    $ curl http://localhost:9100/metrics


修改 `prometheus.yml`，增加 job：

``` yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
    - targets: ['localhost:9100']
```

#### jmx

    $ wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.11.0/jmx_prometheus_javaagent-0.11.0.jar<Paste>jk:w


jmx_export 的配置文件：

``` yaml
# config.yaml
---
startDelaySeconds: 0
# hostPort: 0.0.0.0:9999
username:
password:
# jmxUrl: service:jmx:rmi:///jndi/rmi://127.0.0.1:1234/jmxrmi
jmxUrl: service:jmx:rmi:///jndi/rmi://0.0.0.0:9999/jmxrmi
ssl: false
lowercaseOutputName: false
# lowercaseOutputName: true
lowercaseOutputLabelNames: false
whitelistObjectNames: ["org.apache.cassandra.metrics:*", "kafka.*:*"]
blacklistObjectNames: ["org.apache.cassandra.metrics:type=ColumnFamily,*"]
rules:
  - pattern: 'org.apache.cassandra.metrics<type=(\w+), name=(\w+)><>Value: (\d+)'
    name: cassandra_$1_$2
    value: $3
    valueFactor: 0.001
    labels: {}
    help: "Cassandra metric $1 $2"
    type: GAUGE
    attrNameSnakeCase: false
  # Special cases and very specific rules
  - pattern : kafka.server<type=(.+), name=(.+), clientId=(.+), topic=(.+), partition=(.*)><>Value
    name: kafka_server_$1_$2
    type: GAUGE
    labels:
      clientId: "$3"
      topic: "$4"
      partition: "$5"
  - pattern : kafka.server<type=(.+), name=(.+), clientId=(.+), brokerHost=(.+), brokerPort=(.+)><>Value
    name: kafka_server_$1_$2
    type: GAUGE
    labels:
      clientId: "$3"
      broker: "$4:$5"

  # Generic per-second counters with 0-2 key/value pairs
  - pattern: kafka.(\w+)<type=(.+), name=(.+)PerSec\w*, (.+)=(.+), (.+)=(.+)><>Count
    name: kafka_$1_$2_$3_total
    type: COUNTER
    labels:
      "$4": "$5"
      "$6": "$7"
  - pattern: kafka.(\w+)<type=(.+), name=(.+)PerSec\w*, (.+)=(.+)><>Count
    name: kafka_$1_$2_$3_total
    type: COUNTER
    labels:
      "$4": "$5"
  - pattern: kafka.(\w+)<type=(.+), name=(.+)PerSec\w*><>Count
    name: kafka_$1_$2_$3_total
    type: COUNTER

  # Generic gauges with 0-2 key/value pairs
  - pattern: kafka.(\w+)<type=(.+), name=(.+), (.+)=(.+), (.+)=(.+)><>Value
    name: kafka_$1_$2_$3
    type: GAUGE
    labels:
      "$4": "$5"
      "$6": "$7"
  - pattern: kafka.(\w+)<type=(.+), name=(.+), (.+)=(.+)><>Value
    name: kafka_$1_$2_$3
    type: GAUGE
    labels:
      "$4": "$5"
  - pattern: kafka.(\w+)<type=(.+), name=(.+)><>Value
    name: kafka_$1_$2_$3
    type: GAUGE

  # Emulate Prometheus 'Summary' metrics for the exported 'Histogram's.
  #
  # Note that these are missing the '_sum' metric!
  - pattern: kafka.(\w+)<type=(.+), name=(.+), (.+)=(.+), (.+)=(.+)><>Count
    name: kafka_$1_$2_$3_count
    type: COUNTER
    labels:
      "$4": "$5"
      "$6": "$7"
  - pattern: kafka.(\w+)<type=(.+), name=(.+), (.+)=(.*), (.+)=(.+)><>(\d+)thPercentile
    name: kafka_$1_$2_$3
    type: GAUGE
    labels:
      "$4": "$5"
      "$6": "$7"
      quantile: "0.$8"
  - pattern: kafka.(\w+)<type=(.+), name=(.+), (.+)=(.+)><>Count
    name: kafka_$1_$2_$3_count
    type: COUNTER
    labels:
      "$4": "$5"
  - pattern: kafka.(\w+)<type=(.+), name=(.+), (.+)=(.*)><>(\d+)thPercentile
    name: kafka_$1_$2_$3
    type: GAUGE
    labels:
      "$4": "$5"
      quantile: "0.$6"
  - pattern: kafka.(\w+)<type=(.+), name=(.+)><>Count
    name: kafka_$1_$2_$3_count
    type: COUNTER
  - pattern: kafka.(\w+)<type=(.+), name=(.+)><>(\d+)thPercentile
    name: kafka_$1_$2_$3
    type: GAUGE
    labels:
      quantile: "0.$4"
```

复制 kafka 的 kafka-run-class.sh 文件，增加 `javaagent` 配置，另存为 kafka-run-class-with-agent.sh：

``` sh
# ...

JMX_EXPORTER=-javaagent:/usr/local/jmx_prometheus_javaagent-0.11.0.jar=8089:/etc/jmx_exporter/config.yaml

# ...

# Launch mode
if [ "x$DAEMON_MODE" = "xtrue" ]; then
  nohup $JAVA $KAFKA_HEAP_OPTS $KAFKA_JVM_PERFORMANCE_OPTS $KAFKA_GC_LOG_OPTS $KAFKA_JMX_OPTS $KAFKA_LOG4J_OPTS $JMX_EXPORTER -cp $CLASSPATH $KAFKA_OPTS "$@" > "$CONSOLE_OUTPUT_FILE" 2>&1 < /dev/null &
else
  exec  $JAVA $KAFKA_HEAP_OPTS $KAFKA_JVM_PERFORMANCE_OPTS $KAFKA_GC_LOG_OPTS $KAFKA_JMX_OPTS $KAFKA_LOG4J_OPTS $JMX_EXPORTER -cp $CLASSPATH $KAFKA_OPTS "$@"
fi
```

修改 kafka 的 kafka-server-start.sh 文件中的 kafka-run-class 为 kafka-run-class-with-agent

    $ curl http://localhost:8089/metrics

``` yaml
scrape_configs:
  - job_name: 'kafka1'
    static_configs:
    - targets: ['10.9.164.4:8089']
  - job_name: 'kafka2'
    static_configs:
    - targets: ['10.9.140.204:8089']
  - job_name: 'kafka3'
    static_configs:
    - targets: ['10.9.145.115:8089']
```


### data model

时间序列数据被 metric name 和 labels (key-value pairs) 唯一标识

metric name：
label:

Natation:

    <metric name>{<label name>=<label value>, ...}

example:

    api_http_requests_total{method="POST", handler="/messages"}

    <--------------- metric ---------------------><-timestamp -><-value->
    http_request_total{status="200", method="GET"}@1434417560938 => 94355
    http_request_total{status="200", method="GET"}@1434417561287 => 94334

    http_request_total{status="404", method="GET"}@1434417560938 => 38473
    http_request_total{status="404", method="GET"}@1434417561287 => 38544

    http_request_total{status="200", method="POST"}@1434417560938 => 4748
    http_request_total{status="200", method="POST"}@1434417561287 => 4785

### 数据存储


用户可以通过命令行启动参数的方式修改本地存储的配置。

    $ ./prometheus --config.file=./prometheus.yml --storage.tsdb.path=/data/prometheus

| 启动参数                          | 默认值 | 含义                                                                                              |
|-----------------------------------|--------|---------------------------------------------------------------------------------------------------|
| --storage.tsdb.path               | data/  | Base path for metrics storage                                                                     |
| --storage.tsdb.retention          | 15d    | How long to retain samples in the storage                                                         |
| --storage.tsdb.min-block-duration | 2h     | The timestamp range of head blocks after which they get persisted                                 |
| --storage.tsdb.max-block-duration | 36h    | The maximum timestamp range of compacted blocks,It's the minimum duration of any persisted block. |
| --storage.tsdb.no-lockfile        | false  | Do not create lockfile in data directory                                                          |

- storage.tsdb.path: This determines where Prometheus writes its database. Defaults to data/.
- storage.tsdb.retention.time: This determines when to remove old data. Defaults to 15d. Overrides storage.tsdb.retention if this flag is set to anything other than default.
- storage.tsdb.retention.size: [EXPERIMENTAL] This determines the maximum number of bytes that storage blocks can use (note that this does not include the WAL size, which can be substantial). The oldest data will be removed first. Defaults to 0 or disabled. This flag is experimental and can be changed in future releases. Units supported: KB, MB, GB, PB. Ex: "512MB"
- storage.tsdb.retention: This flag has been deprecated in favour of storage.tsdb.retention.time.

### grafana

下载安装：

    $ wget https://dl.grafana.com/oss/release/grafana-6.0.2-1.x86_64.rpm
    $ sudo yum localinstall grafana-6.0.2-1.x86_64.rpm

运行：

    $ service grafana-server start

开机自启：

    $ /sbin/chkconfig --add grafana-server

### 服务发现

#### 基于文件

通过 `targets.json` 文件定义所有的监控目标：

``` json
[
  {
    "targets": [ "localhost:8080"],
    "labels": {
      "env": "localhost",
      "job": "cadvisor"
    }
  },
  {
    "targets": [ "localhost:9104" ],
    "labels": {
      "env": "prod",
      "job": "mysqld"
    }
  },
  {
    "targets": [ "localhost:9100"],
    "labels": {
      "env": "prod",
      "job": "node"
    }
  }
]
```

创建 prometheus 配置文件：

``` yaml
global:
  scrape_interval: 15s
  scrape_timeout: 10s
  evaluation_interval: 15s
scrape_configs:
  - job_name: 'file_ds'
    file_sd_configs:
      - refresh_interval: 1m
        files:
          - targets.json
```

prometheus 周期性读取文件中的内容，当文件中定义的内容发生变化时，不需要对 prometheus 进行重启

#### Consul

下载(https://www.consul.io/downloads.html)

    $ wget https://releases.hashicorp.com/consul/1.4.4/consul_1.4.4_linux_amd64.zip
    $ unzip consul_1.4.4_linux_amd64.zip

启动（开发者模式，单节点）

    $ ./consul agent -dev

查看集群节点：

    $ ./consul members

    $ curl localhost:8500/v1/catalog/nodes

添加服务：

    $ echo '{"service": {"name": "node_exporter", "tags": ["exporter"], "port": 9100}}' \
        | sudo tee /etc/consul.d/node_exporter.json

    $ consul agent -dev -config-dir=/etc/consul.d

    $ curl http://localhost:8500/v1/catalog/service/node_exporter

通过 put 请求添加服务：

    $ curl http://localhost:8900/v1/agent/service/register -X PUT -i -H "Content-Type:application/json" -d '{
       "ID": "kafkaNode3",
       "Name": "kafkaNode",
       "Tags": [
         "node"
       ],
       "Address": "10.9.145.115",
       "Port": 8089,
       "EnableTagOverride": false,
       "Check": {
         "DeregisterCriticalServiceAfter": "90m",
         "HTTP": "http://10.9.164.4:65431?Action=CheckHealth",
         "Interval": "10s"
       }
      }'

    $ curl http://localhost:8500/v1/catalog/services

    $ curl http://localhost:8500/v1/catalog/service/kafkaNode


在consul_sd_configs定义当中通过server定义了Consul服务的访问地址，services则定义了当前需要发现哪些类型服务实例的信息，这里限定了只获取node_exporter的服务实例信息。

``` yaml
- job_name: node_exporter
    metrics_path: /metrics
    scheme: http
    consul_sd_configs:
      - server: localhost:8500
        services:
          - node_exporter
```

### AlertManager

告警规则

``` yaml
groups:
  - name: example
    rules:
      - alert: HighErrorRate
        expr: job:request_latency_seconds:mean5m{job="myjob"} > 0.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: High request latency
          description: description info
```

指定告警规则文件的访问路径：

``` yaml
rule_files:
  [ - <filepath_glob> ... ]
```


``` yaml
rule_files:
  - /etc/prometheus/rules/*.rules
```

``` yaml
groups:
- name: hostStatsAlert
  rules:
  - alert: hostCpuUsageAlert
    expr: sum(avg without (cpu)(irate(node_cpu_seconds_total{mode!='idle'}[5m]))) by (instance) > 0.85
    for: 1m
    labels:
      severity: page
    annotations:
      summary: "Instance {{ $labels.instance }} CPU usgae high"
      description: "{{ $labels.instance }} CPU usage above 85% (current value: {{ $value }})"
  - alert: hostMemUsageAlert
    expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)/node_memory_MemTotal_bytes > 0.85
    for: 1m
    labels:
      severity: page
    annotations:
      summary: "Instance {{ $labels.instance }} MEM usgae high"
      description: "{{ $labels.instance }} MEM usage above 85% (current value: {{ $value }})"
```

通过 http://127.0.0.1:9090/rules 查看规则文件

    $ wget https://github.com/prometheus/alertmanager/releases/download/v0.16.1/alertmanager-0.16.1.linux-amd64.tar.gz
