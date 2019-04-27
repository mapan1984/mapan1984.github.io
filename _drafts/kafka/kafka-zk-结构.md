### 消费者


```
- /consumers
    - /[group name]
        - /ids
            - /[consumer id]
        - /owners
            - /[topic name]
                - /[partitions id]
                - /[partitions id]
            - /[topic name]
                - /[partitions id]
                - /[partitions id]
        - /offsets
            - /[topic name]
                - /[partitions id]
                - /[partitions id]
            - /[topic name]
                - /[partitions id]
                - /[partitions id]
```


```
/brokers
    /ids
        /<1>
            {"listener_security_protocol_map":{"PLAINTEXT":"PLAINTEXT"},"endpoints":["PLAINTEXT://10.9.167.48:9092"],"jmx_port":9999,"host":"10.9.167.48","timestamp":"1543300074836","port":9092,"version":4}
        /<2>
            {"listener_security_protocol_map":{"PLAINTEXT":"PLAINTEXT"},"endpoints":["PLAINTEXT://10.9.83.108:9092"],"jmx_port":9999,"host":"10.9.83.108","timestamp":"1543300074835","port":9092,"version":4}
        /<3>
            {"listener_security_protocol_map":{"PLAINTEXT":"PLAINTEXT"},"endpoints":["PLAINTEXT://10.9.5.109:9092"],"jmx_port":9999,"host":"10.9.5.109","timestamp":"1543300081496","port":9092,"version":4}
    /topics
        /<foo>
            /partitions
                /<0>
                    /state
                        {"controller_epoch":1,"leader":3,"version":1,"leader_epoch":55,"isr":[1,2,3]}
                /<1>
                /<2>
        /<bar>
            /partitions
    /seqid
/cluster
    /id
        {"version":"1","id":"1N7JbZwjS-aW9JCXTZUbGQ"}
```
