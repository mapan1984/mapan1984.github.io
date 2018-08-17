## 定义数据结构

在`.proto`文件中定义需要串行化的数据结构信息。

``` proto
message Person {
    required string name=1;
    required int32 id=2;
    optional string email=3;

    enum PhoneType {
        MOBILE=0;
        HOME=1;
        WORK=2;

    }
    message PhoneNumber {
        required string number=1;
        optional PhoneType type=2 [default=HOME];

    }

    repeated PhoneNumber phone=4;
}
```

## 编译为特定语言的类

使用ProtocolBuffer编译器将`.proto`文件编译陈特定语言的类，这些类提供了串行化和反串行化的方法以及访问每个字段的方法。

    $ protoc -I=$SRC_DIR --python_out=$DST_DIR addressbook.proto
