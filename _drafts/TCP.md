                       客户                          服务器
                  socket|                              |socket, bind, listen
                        |                              |LISTEN(被动打开)
                        |                              |accept(阻塞)
          connect(阻塞) |-----------SYN J------------->|SYN_RCVD
      (主动打开)SYN_SENT|                            / |
                        |                           /  |
             ESTABLISHED|<------SYN K, ACK J+1-----+   |
             connect返回|-----------ACK K+1 ---------->|ESTABLISHED
                        |                              |accept返回
                        |                              |read(阻塞)
          <客户构造请求>|                              |
                   write|-----------数据(请求)-------->|read(返回)
              read(阻塞)|                              |<服务器处理请求>
                        |                              |
                read返回|<-----数据(应答)(应答ACK)-----|write(阻塞)
                        | \                            |read
                        |  \                           |
                        |   +------应答ACK------------>|
                        |                              |
                   close|----------- FIN M------------>|CLOSE_WAIT(被动关闭)
    (主动关闭)FIN_WAIT_1|                            +-|read返回0
                        |                           /  |
              FIN_WAIT_2|<----------ACK M+1--------+   |
                        |                              |
               TIME_WAIT|<-----------FIN N-------------|close
                        | \                            |LAST_ACK
                        |  \                           |
                        |   +-------ACK N+1----------->|CLOSED
