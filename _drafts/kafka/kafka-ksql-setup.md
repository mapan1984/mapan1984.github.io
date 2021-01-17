# 下载 confluent

# ksql server

修改 ksql server 配置文件 `<path-to-confluent>/etc/ksql/ksql-server.properties`：

```
listeners=http://0.0.0.0:8088
bootstrap.servers=10.9.85.181:9092,10.9.90.214:9092,10.9.117.176:9092
```

启动服务:

    $ <path-to-confluent>/bin/ksql-server-start <path-to-confluent>/etc/ksql/ksql-server.properties

# ksql cli

    $ LOG_DIR=/data/ksql_logs ./bin/ksql http://localhost:8088
