## NIO (Non-blocking IO)

## Channels and Buffers

数据从 Channels 读到 Buffers，或从 Buffers 写到 Channels

单线程中从 Channels 读取数据到 Buffers，同时可用继续做别的事情，当数据读取到 Buffers 中后，线程再继续处理数据。

- Channel
    - FileChannel: 文件的数据读写
    - DatagramChannel: UDP 的数据读写
    - SocketChannel: TCP 的数据读写
    - ServerSocketChannel: 监听 TCP 链接请求，每个请求会创建一个 SocketChannel

``` java
RandomAccessFile aFile = new RandomAccessFile("data/nio-data.txt", "rw");
FileChannel inChannel = aFile.getChannel();

ByteBuffer buf = ByteBuffer.allocate(48);

int bytesRead = inChannel.read(buf);
while (bytesRead != -1) {

  System.out.println("Read " + bytesRead);
  buf.flip();  //

  while(buf.hasRemaining()){
      System.out.print((char) buf.get());
  }

  buf.clear();
  bytesRead = inChannel.read(buf);
}
aFile.close();
```
- Buffer
    - ByteBuffer
    - CharBuffer
    - DoubleBuffer
    - FloatBuffer
    - IntBuffer
    - LongBuffer
    - ShortBuffer

利用 Buffer 读写数据，通常遵循 4 个步骤：
1. 把数据写入 Buffer
2. 调用 `flip`，把 Buffer 从写模式调整未读模式
3. 从 Buffer 中读取数据
4. 调用 `buffer.clear()` 清空整个 Buffer，或者调用 `buffer.compact()` 清空已读取的数据，未读取的数据会被移动到 Buffer 的开始位置，写入位置则紧跟着未读数据之后

``` java
RandomAccessFile aFile = new RandomAccessFile("data/nio-data.txt", "rw");
FileChannel inChannel = aFile.getChannel();

//create buffer with capacity of 48 bytes
ByteBuffer buf = ByteBuffer.allocate(48);

int bytesRead = inChannel.read(buf); //read into buffer.
while (bytesRead != -1) {

  buf.flip();  //make buffer ready for read

  while(buf.hasRemaining()){
      System.out.print((char) buf.get()); // read 1 byte at a time
  }

  buf.clear(); //make buffer ready for writing
  bytesRead = inChannel.read(buf);
}
aFile.close();
```

### Buffer Capacity, Position, Limit

- Capacity
- Position：
    - 当写入数据到 Buffer 时需要从一个确定的位置开始，默认初始化为 0，随写入数据增加，最大值未 Capacity - 1
    - 当从 Buffer 读数据时需要从一个确定位置开始，默认初始为 0，随读取数据增加
- Limit：
    - 在写模式，Limit 代表能写入的最大的数据量，等同于 Buffer 的容量
    - 在读模式，Limit 代表能读取的最大数据量

## Scatter/Gather

Scatter read 指从 Channel 读取的操作能把数据写入到多个 Buffer

``` java
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body   = ByteBuffer.allocate(1024);

ByteBuffer[] bufferArray = { header, body };

channel.read(bufferArray);
```

Gather write 指从多个 Buffer 把数据写入到一个 Channel

``` java
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body   = ByteBuffer.allocate(1024);

//write data into buffers
ByteBuffer[] bufferArray = { header, body };

channel.write(bufferArray);
```

## Channel Transfers

### transferFrom()

FileChannel.transferFrom 方法把数据从通道源传输到 FileChannel：

``` java
RandomAccessFile fromFile = new RandomAccessFile("fromFile.txt", "rw"); FileChannel      fromChannel = fromFile.getChannel();

RandomAccessFile toFile = new RandomAccessFile("toFile.txt", "rw");
FileChannel      toChannel = toFile.getChannel();

long position = 0;
long count    = fromChannel.size();

toChannel.transferFrom(fromChannel, position, count);
```
transferFrom 的参数 position 和 count 表示目标文件的写入位置和最多写入的数据量。如果通道源的数据小于 count 那么就传实际有的数据量。 另外，有些 SocketChannel 的实现在传输时只会传输哪些处于就绪状态的数据，即使 SocketChannel 后续会有更多可用数据。因此，这个传输过程可能不会传输整个的数据。

### transferTo()

transferTo 方法把 FileChannel 数据传输到另一个 channel, 下面是案例：

``` java
RandomAccessFile fromFile = new RandomAccessFile("fromFile.txt", "rw");
FileChannel      fromChannel = fromFile.getChannel();

RandomAccessFile toFile = new RandomAccessFile("toFile.txt", "rw");
FileChannel      toChannel = toFile.getChannel();

long position = 0;
long count    = fromChannel.size();

fromChannel.transferTo(position, count, toChannel);
```

这段代码和之前介绍 transfer 时的代码非常相似，区别只在于调用方法的是哪个 FileChannel.

SocketChannel 的问题也存在与 transferTo.SocketChannel 的实现可能只在发送的 buffer 填充满后才发送，并结束。


## Selectors

Selectors 可以检测多个 Channels 的事件状态（例如：链接打开，数据到达），这样单线程就可以操作多个通道的数据。

将 Channel 注册到 Selector 上，然后就可以调用 Selector 的 `select()` 方法，这个方法会一直阻塞到一个 Channel 的状态符合条件。

``` java
Selector selector = Selector.open();

channel.configureBlocking(false);

SelectionKey key = channel.register(selector, SelectionKey.OP_READ);

while(true) {
  int readyChannels = selector.select();

  if (readyChannels == 0) {
    continue;
  }

  Set<SelectionKey> selectedKeys = selector.selectedKeys();

  Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

  while(keyIterator.hasNext()) {
    SelectionKey key = keyIterator.next();

    if(key.isAcceptable()) {
        // a connection was accepted by a ServerSocketChannel.

    } else if (key.isConnectable()) {
        // a connection was established with a remote server.

    } else if (key.isReadable()) {
        // a channel is ready for reading

    } else if (key.isWritable()) {
        // a channel is ready for writing
    }

    keyIterator.remove();
  }
}
```

