## docker 启动

### 启动单节点

拉取 RabbitMQ 的官方镜像

    docker pull rabbitmq:management

> 使用 rabbitmq:management 镜像，这个版本带有 Web 管理界面，方便管理和监控。

启动 RabbitMQ 容器：

    docker run -d --name rabbitmq \
      -p 5552:5552 \
      -p 5672:5672 \
      -p 15672:15672 \
      rabbitmq:management

* --name rabbitmq：容器名为 rabbitmq。
* -p 5552:5552：stream 二进制协议默认端口（5552）。
* -p 5672:5672：映射 AMQP 协议的默认端口（5672）。
* -p 15672:15672：映射管理界面的默认端口（15672）。
* rabbitmq:management：使用带管理界面的官方镜像。

访问 http://localhost:15672 进入管理界面，默认的用户名和密码如下：

- 用户名：guest
- 密码：guest

### 启动集群

创建自定义网络，使容器之间可以互相通信

    docker network create rabbitmq-cluster-net

启动第一台节点

    docker run -d \
        --hostname rabbitmq-node1 \
        --name rabbitmq-node1 \
        --net rabbitmq-cluster-net \
        -p 5552:5552 \
        -p 5672:5672 \
        -p 15672:15672 \
        -e RABBITMQ_ERLANG_COOKIE='rabbitmq_cookie' \
        rabbitmq:management

启动第二台节点

    docker run -d \
        --hostname rabbitmq-node2 \
        --name rabbitmq-node2 \
        --net rabbitmq-cluster-net \
        -p 5553:5552 \
        -p 5673:5672 \
        -p 15673:15672 \
        -e RABBITMQ_ERLANG_COOKIE='rabbitmq_cookie' \
        rabbitmq:management

进入第二台节点

    docker exec -it rabbitmq-node2 bash

在第二台节点上执行以下命令加入第一台节点

    rabbitmqctl stop_app

    rabbitmqctl join_cluster rabbit@rabbitmq-node1

    rabbitmqctl start_app

    rabbitmqctl cluster_status

如果想加入更多节点，参考节点 2 操作

## 管理

### vhost

查看 vhost 列表

    rabbitmqctl list_vhosts

    rabbitmqctl list_vhosts name tracing

创建新的 vhost

    rabbitmqctl add_vhost vhost1

删除 vhost

    rabbitmqctl delete_vhost vhost1

### user

查看用户列表

    rabbitmqctl list_users

增加用户

    rabbitmqctl add_user <username> <password>

设置用户角色

    rabbitmqctl set_user_tags <username> <tag>

tag:

- administrator：管理员权限
- management：可以访问管理界面，但没有管理员权限
- （留空）：普通用户

删除用户

    rabbitmqctl delete_user root

### 权限

授予权限

    rabbitmqctl set_permissions [-p vhost] {user} {conf} {write} {read}

- vhost: 授予用户访问权限的 vhost 名称（默认 vhost `/`）
- user: 可以访问 vhost 的用户名
- conf: 一个用于匹配用户在哪些资源上拥有可配置权限的正则表达式（交换器和队列的创建/删除）
- write: 一个用于匹配用户在哪些资源上拥有可写权限的正则表达式（发布消息）
- read: 一个用于匹配用户在哪些资源上拥有可读权限的正则表达式（读取消息/清空队列）

授予 root 用户可访问虚拟主机 vhost1，并且在所有资源上都具备可配置、可写、可读的权限：

    rabbitmqctl set_permissions -p vhost1 root ".*" ".*" ".*"

授予 root 用户可访问虚拟主机 vhost2，在以 queue 开头的资源上具备可配置权限，并在所有资源上有可写、可读权限：

    rabbitmqctl set_permissions -p vhost2 root "^queue.*" ".*" ".*"

删除权限

    rabbitmqctl clear_permissions [-p vhost] {username}

    rabbitmqctl clear_permissions -p vhost1 root

权限列表

    rabbitmqctl list_permissions -p vhost2

    rabbitmqctl list_user_permissions root

### 插件

插件列表

    rabbitmq-plugins list

启用插件

    rabbitmq-plugins enable <plugin-name>

关闭插件

    rabbitmq-plugins disable <plugin-name>

### 应用管理

完成停止 RabbitMQ 服务并退出 Erlang 虚拟机

    rabbitmqctl stop [pid_file]

尝试停止 RabbitMQ 服务，完成当前正在处理的消息并关闭连接

    rabbitmqctl shutdown

停止 RabbitMQ 服务但不退出 Erlang 虚拟机

    rabbitmqctl stop_app

启动 RabbitMQ 服务

    rabbitmqctl start_app

等待 RabbitMQ 应用启动

    rabbitmqctl wait [pid_file]

将 RabbitMQ 节点重置还原到最初状态

    rabbitmqctl stop_app
    rabbitmqctl reset

强制将 RabbitMQ 节点重置还原到最初状态

    rabbitmqctl stop_app
    rabbitmqctl force_reset

轮换日志

    rabbitmqctl rotate_logs [suffix]

### exchange

查看 exchange 列表

    rabbitmqctl list_exchanges

声明 exchange

    rabbitmqadmin declare exchange name=<exchange-name> type=<exchange-type>

- exchange-name：交换器名称
- exchange-type：交换器类型
    - direct
    - topic
    - fanout
    - headers

### queue

查看 queue 列表

    rabbitmqctl list_queues

声明 queue

    rabbitmqadmin declare queue name=<queue-name> durable=true

- queue-name：队列名称
- durable：是否持久化

### binding

查看 exchange 与 queue 的绑定关系

    rabbitmqctl list_bindings

将 queue 绑定到 exchange 上

    rabbitmqadmin declare binding source=<exchange-name> destination=<queue-name> destination_type=queue routing_key=<routing-key>

- exchange-name：绑定的交换器名称
- queue-name：绑定的队列名称
- routing-key：路由键

### 发送/接收消息

发送消息

    rabbitmqadmin publish exchange=<exchange-name> routing_key=<routing-key> payload="Hello, RabbitMQ!"

接收消息

    rabbitmqadmin get queue=<queue-name>

### 其他

查看 connection 列表

    rabbitmqctl list_connections

查看 channel 列表

    rabbitmqctl list_channels

查看 consumer 列表

    rabbitmqctl list_consumers

设置 policy

    rabbitmqctl set_policy [-p vhost] [--priority priority] [--apply-to apply-to] <name> <pattern> <definition>
