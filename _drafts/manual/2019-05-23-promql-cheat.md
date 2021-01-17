## 数据类型与操作

### Counter

    rate(http_requests_total[5m])

    topk(10, http_requests_total)

### Gauge

    delta(cpu_temp_celsius{host="zeus"}[2h])

    predict_linear(node_filesystem_free{job="node"}[1h], 4 * 3600)

### Histogram

### Summary

## promql

直接以 metrics 名查询

    http_requests_total
    http_requests_total{}

利用标签进行过滤(完全匹配/正则表达式)：

    http_requests_total{instance="localhost:9090"}
    http_requests_total{instance!="localhost:9090"}

    http_requests_total{environment=~"staging|testing|development",method!="GET"}
    http_requests_total{environment!~"staging|testing|development",method!="GET"}

不含某个标签（以不含 `topic` 标签为例）：

    kafka_server_BrokerTopicMetrics_OneMinuteRate{name="BytesOutPerSec",zone="zone-9001",instanceId="ukafka-ghz0cc",topic=""}

时间范围：

    http_request_total{}[5m]

* s - 秒
* m - 分钟
* h - 小时
* d - 天
* w - 周
* y - 年

时间位移：

    http_request_total{} # 瞬时向量表达式，选择当前最新的数据
    http_request_total{}[5m] # 区间向量表达式，选择以当前时间为基准，5分钟内的数据

    http_request_total{} offset 5m
    http_request_total{}[1d] offset 1d

聚合操作：

    # 查询系统所有http请求的总量
    sum(http_request_total)

    # 按照mode计算主机CPU的平均使用时间
    avg(node_cpu) by (mode)

    # 按照主机查询各个主机的CPU使用率
    sum(sum(irate(node_cpu{mode!='idle'}[5m]))  / sum(irate(node_cpu[5m]))) by (instance)

