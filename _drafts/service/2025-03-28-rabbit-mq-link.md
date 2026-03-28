## Federation

启用 Federation 插件

    rabbitmq-plugins enable rabbitmq_federation

启用 Federation 管理插件

    rabbitmq-plugins enable rabbitmq_federation_management

添加上游联邦连接：

    rabbitmqctl set_parameter federation-upstream <upstream-name> \
      '{"uri":"amqp://user:password@remote-rabbitmq-host:5672"}'

删除上游联邦连接：

    rabbitmqctl clear_parameter federation-upstream <upstream-name>

### 联邦交换器

从一个交换器复制到另一个集群的交换器，将发送给上游交换器的消息路由到本地的某个队列中，实现跨集群的消息传递。

创建联邦交换器：

    rabbitmqctl set_policy \
      "federation-policy" \
      "^federated-exchange$" \
      '{"federation-upstream-set":"all"}' \
      --apply-to exchanges

- `federation-policy`：策略名称
- `^federated-exchange$`：使用正则表达式匹配要联邦化的交换器
- `{"federation-upstream-set":"all"}`：表示使用所有定义的联邦连接

删除联邦交换器策略：

    rabbitmqctl clear_policy federation-policy

### 联邦队列

允许一个本地消费者接收到来自上游队列的消息。

## Shovel

从一个队列中拉取数据并转发到另一个交换器中

启用 shovel 插件

    rabbitmq-plugins enable rabbitmq_shovel

    rabbitmq-plugins enable rabbitmq_shovel_management

### 静态

通过配置文件定义 shovel

### 动态

通过 parameter  定义 shovel

### 应用：消息堆积的治理

## 存储机制

    root@7e24055fee66:~/mnesia/rabbit@7e24055fee66/msg_stores/vhosts/628WB79CIFDYO9LJI6DKMI09L# ls -ahl
    total 36K
    drwxr-xr-x 5 rabbitmq rabbitmq 4.0K Jan 20 02:56 .
    drwxr-xr-x 5 rabbitmq rabbitmq 4.0K Jan 15 08:33 ..
    -rw-r--r-- 1 rabbitmq rabbitmq   83 Jan 15 08:02 .config
    -rw-r--r-- 1 rabbitmq rabbitmq    1 Jan 16 07:24 .vhost
    drwxr-xr-x 2 rabbitmq rabbitmq 4.0K Jan 16 07:24 msg_store_persistent
    drwxr-xr-x 2 rabbitmq rabbitmq 4.0K Jan 16 07:24 msg_store_transient
    drwxr-xr-x 3 rabbitmq rabbitmq 4.0K Jan 20 02:56 queues
    -rw-r--r-- 1 rabbitmq rabbitmq 5.4K Jan 16 07:24 recovery.dets

## 内存

vm_memory_high_watermark

    rabbitmqctl set_vm_memory_high_watermark 0.4

    rabbitmqctl set_vm_memory_high_watermark absolute <memory_limit>

vm_memory_high_watermark_paging_ratio

## 磁盘

disk_free_limit 小于该容量时阻塞所有 connection 的消息

    rabbitmqctl set_disk_free_limit <disk_limit>

    rabbitmqctl set_disk_free_limit mem_relation <fraction>

## 流控

    rabbit_reader  -> rabbit_channel -> rabbit_amqqueue_process -> rabbita_msg_store
     (Connection)

- rabbit_reader：Connection 的处理进程，负责接收、解析 AMQP 协议数据包等。
- rabbit_channel：Channel 的处理进程，负责处理 AMQP 协议的各种方法、进行路由解析等。
- rabbit_amqqueue_process：队列的处理进程，负责实现队列的所有逻辑。
- rabbit_msg_store：负责实现消息的持久化。

## 消息跟踪

### Firehose

Firehose 的原理是将生产者投递给 RabbitMQ 的消息，或者 RabbitMQ 投递给消费者的消息，按照指定的格式发送到默认的 `amq.rabbitmq.trace` 交换器上。

开启 Firehose：

    rabbitmqctl trace_on [-p vhost]

关闭 Firehose：

    rabbitmqctl trace_off [-p vhost]

### rabbitmq_tracing

启用 rabbitmq_tracing 插件：

    rabbitmq-plugins enable rabbitmq_tracing

停用 rabbitmq_tracing 插件：

    rabbitmq-plugins disable rabbitmq_tracing
