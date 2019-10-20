```
message.max.bytes
replica.fetch.max.bytes
```

### 数据可靠性和持久性保证

```
request.required.acks
min.insync.replicas
```

### 消费者

`max.poll.interval.ms`：如果 poll 处理大于这个值，发送心跳会失败

`max.poll.records`：每次 poll

### 生产者

`acks`:
    * 0：表示 producer 请求立即返回，不需要等待 leader 的任何确认
    * -1：表示分区 leader 必须等待消息被成功写入到所有的 ISR 副本中才任务 producer 成功
    * 1：表示 leader 副本必须应答此 producer 请求并写入消息到本地日志，之后 producer 请求被认为成功

`buffer.memory`：指定 producer 端用户缓存消息的缓冲区大小，单位为 byte。kafka 采用异步发送的消息架构，producer 启动时会首先创建一块内存缓冲区用于保存待发送的消息，然后又一个专属线程负责重缓冲区读取消息进行真正的发送
    * 消息持续发送过程中，当缓冲区被填满后，producer立即进入阻塞状态直到空闲内存被释放出来，这段时间不能超过 `max.blocks.ms` 设置的值，一旦超过，producer则会抛出 `TimeoutException` 异常，因为Producer是线程安全的，若一直报TimeoutException，需要考虑调高buffer.memory 了。
    * 用户在使用多个线程共享kafka producer时，很容易把 buffer.memory 打满。

`compression.type`

`retries`：producer重试的次数设置。重试时producer会重新发送之前由于瞬时原因出现失败的消息。瞬时失败的原因可能包括：元数据信息失效、副本数量不足、超时、位移越界或未知分区等。倘若设置了retries > 0，那么这些情况下producer会尝试重试。
    * producer还有个参数：max.in.flight.requests.per.connection。如果设置该参数大约1，那么设置retries就有可能造成发送消息的乱序。
    * 版本为0.11.1.0的kafka已经支持"精确到一次的语义”，因此消息的重试不会造成消息的重复发送。

`batch.size`：producer都是按照batch进行发送的，因此batch大小的选择对于producer性能至关重要。producer会把发往同一分区的多条消息封装进一个batch中，当batch满了后，producer才会把消息发送出去。但是也不一定等到满了，这和另外一个参数 `linger.ms` 有关。默认值为16K，合计为16384.
    * batch 越小，producer的吞吐量越低，越大，吞吐量越大。

`linger.ms`：producer是按照batch进行发送的，但是还要看linger.ms的值，默认是0，表示不做停留。这种情况下，可能有的batch中没有包含足够多的produce请求就被发送出去了，造成了大量的小batch，给网络IO带来的极大的压力。
    * 为了减少了网络IO，提升了整体的TPS。假设设置linger.ms=5，表示producer请求可能会延时5ms才会被发送。

`max.in.flight.requests.per.connection`：producer的IO线程在单个Socket连接上能够发送未应答produce请求的最大数量。增加此值应该可以增加IO线程的吞吐量，从而整体上提升producer的性能。不过就像之前说的如果开启了重试机制，那么设置该参数大于1的话有可能造成消息的乱序。
    * 默认值5是一个比较好的起始点,如果发现producer的瓶颈在IO线程，同时各个broker端负载不高，那么可以尝试适当增加该值.
    * 过大增加该参数会造成producer的整体内存负担，同时还可能造成不必要的锁竞争反而会降低TPS

`request.timeout.ms`：指定了生产者在发送数据时等待服务器返回响应的时间。

`metadata.fetch.timeout.ms`：指定了生产者在获取元数据（比如目标分区的首领是谁）时等待服务器返回响应的时间。如果等待响应超时，那么生产者要么重试发送数据，要么返回一个错误（抛出异常或执行回调）。

`max.block.ms`：该参数指定了在调用 send() 方法或使用 partitionsFor() 方法获取元数据时生产者的阻塞时间。当生产者的发送缓冲区已满，或者没有可用的元数据时，这些方法就会阻塞。在阻塞时间达到 max.block.ms 时，生产者会抛出超时异常。

`max.request.size`：该参数用于控制生产者发送的请求大小。它可以指能发送的单个消息的最大值，也可以指单个请求里所有消息总的大小。例如，假设这个值为 1MB，那么可以发送的单个最大消息为 1MB，或者生产者可以在单个请求里发送一个批次，该批次包含了 1000 个消息，每个消息大小为 1KB。另外，broker 对可接收的消息最大值也有自己的限制（`message.max.bytes`），所以两边的配置最好可以匹配，避免生产者发送的消息被 broker 拒绝。

`receive.buffer.bytes` 和 `send.buffer.bytes`：这两个参数分别指定了 TCP socket 接收和发送数据包的缓冲区大小。如果它们被设为 -1，就使用操作系统的默认值。如果生产者或消费者与 broker 处于不同的数据中心，那么可以适当增大这些值，因为跨数据中心的网络一般都有比较高的延迟和比较低的带宽。

`retries` 和 `max.in.flight.requests.per.connection`： Kafka 可以保证同一个分区里的消息是有序的。也就是说，如果生产者按照一定的顺序发送消息，broker 就会按照这个顺序把它们写入分区，消费者也会按照同样的顺序读取它们。 在某些情况下，顺序是非常重要的。例如，往一个账户存入 100 元再取出来，这个与先取钱再存钱是截然不同的。不过，有些场景对顺序不是很敏感。 如果把 retries 设为非零整数，同时把 max.in.flight.requests.per.connection 设为比 1 大的数，那么，如果第一个批次消息写入失败，而第二个批次写入成功，broker 会重试写入第一个批次。如果此时第一个批次也写入成功，那么两个批次的顺序就反过来了。 一般来说，如果某些场景要求消息是有序的，那么消息是否写入成功也是很关键的，所以不建议把 retries 设为 0。可以把 max.in.flight.requests.per.connection 设为 1，这样在生产者尝试发送第一批消息时，就不会有其他的消息发送给 broker。不过这样会严重影响生产者的吞吐量，所以只有在对消息的顺序有严格要求的情况下才能这么做。

