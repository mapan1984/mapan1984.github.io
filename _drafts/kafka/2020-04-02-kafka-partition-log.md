## 目录结构

```
- <log.dirs>
    - <topic.name>-<partition.id>
        - <segment.offset>.log
        - <segment.offset>.index
        - <segment.offset>.timeindex
        - leader-epoch-checkpoint
    ...
    - cleaner-offset-checkpoint
    - log-start-offset-checkpoint
    - meta.properties
    - recovery-point-offset-checkpoint
    - replication-offset-checkpoin
...

```
## log.dirs

## 段文件

在 kafka 中，每个日志分段文件(segment) 都对应 2 个索引文件：

1. 偏移量索引文件：建立消息偏移量(offset)到物理地址之间的映射关系
2. 时间戳索引文件：根据指定的时间戳(timestamp)来查找对应的偏移信息

- *.index
- *.log: segment of a log

*.index               *.log
offset, position      offset, position, size, payload
0,0                   0,0,3,one
1,3                   1,3,3,two
2,6                   2,6,5,three
3,11                  3,11,4,four
