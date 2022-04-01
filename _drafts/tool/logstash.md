# logstash

https://github.com/logstash-plugins/logstash-input-kafka

## 阶段

* input
* filter
* output

## 参数

* `-f`：指定 logstash 的配置文件
* `-e`：指定 logstash 的配置（如果是""，则默认使用stdin作为输入，stdout作为输出）
* `-l`：日志输出的地址（默认就是stdout直接在控制台中输出）
* `-t`：测试配置文件是否正确，然后退出。

## 配置

```
input{
    kafka{
        topics => ["users"]
        bootstrap_servers => "10.9.5.175:9092,10.9.29.94:9092,10.9.71.150:9092"
  }
}

filter{

}

output{
    elasticsearch {
        index => "users-%{+YYYY.MM.dd}"
        hosts => ["10.9.140.100:9200", "10.9.102.178:9200", "10.9.63.76:9200"]
    }
}
```

