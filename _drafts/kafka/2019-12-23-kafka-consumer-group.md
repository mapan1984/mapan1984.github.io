### 确定 GroupCoordinator 所在节点

    Utils.abs(groupId.hashCode) % numPartitions

`numPartitions` 是 `offsets.topic.num.partitions` 参数的值，是 `__consumer_offsets` partition 的数量，默认是 50

计算出 `__consumer_offsets` 的 partition 的 leader 就是 groupId 的 GroupCoordinator

