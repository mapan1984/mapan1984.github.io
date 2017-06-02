### 持久连接

HTTP/1.0默认不使用持久连接

    Connection: Keep-Alive
    Connection: close

HTTP/1.1默认使用持久连接

    Connection: close

* 优点：
    * 避免套接字打开、关闭重复操作
    * 避免TCP慢启动在每次连接早期对速度的限制
* 注意事项：
    * 哑代理
    * 服务器的`Content-Length`必须正确

### TIME_WAIT累积与端口耗尽

当某个TCP端点关闭TCP连接时，会在内存中维护一个控制块，用于记录最近所关闭的IP地址和端口号，这类信息会维持一段时间，通常是所估计的最大分段使用期的两倍（称为2MSL，通常为2分钟）左右，已确保在这段时间内不会创建具有相同地址和端口的新连接。

### 重定向

返回码3xx

    Location:

###

    Content-Type:
    Content-Length:

### 追踪报文

TRACE方法与Via首部

### 获取服务器支持方法

OPTIONS方法与Allow首部

### 缓存

缓存服务器向原始服务器进行缓存验证：

    GET /index.html HTTP/1.0
    If-Modified-Since: Sat, 29 Jun 2002, 14:30:00 GMT

    HTTP/1.0 304 Not Modified
    Expires: Fri, 05 Jul 2002, 05:00:00 GMT

通过Date首部判断是否为缓存命中：如果响应的Date首部早于请求的Date首部，则可判断缓存命中（响应是由缓存中取出）（Date首部是原始服务器最初产生这个对象的日期）

Web浏览器中有内建的私有缓存.

通过Expires或Cache-Control向文档附加一个「过期时间」：

    Expires: Fri, 05 Jul 2002, 05:00:00 GMT

    Cache-Control: max-age=484200

文档过期后，缓存必须与服务器进行核对，询问文档是否被修改过。

使用条件方法进行再验证：

* Last-Modified与If-Modified-Since: If-Modified-Since请求首部可以利用响应的Last-Modified首部；如果last-modified-date之后未修改，响应`304 Not Modified`，否则响应`200 OK`

        Last-Modified: <cached last-modified date>

        If-Modified-Since: <cached last-modified date>

* ETag与If-None-Match:

        ETag: <tags>

        If-None-Match: <tags>

服务器可以通过响应首部控制缓存：

* 禁止缓存响应：

        Cache-Control: no-store

* 可以存储在本地缓存区，但是在与原始服务其进行新鲜度在验证之前，缓存不能将其提供给客户端使用(Pragma是为了兼容HTTP/1.0+)：

        Pragma: no-cache
        Cache-Control: no-cache

* max-age表示的是从服务器将文档传来之时起，可以认为此文档处于新鲜状态的秒数(s-maxage行为与max-age类似，但仅适于共享缓存)：

        Cache-Control: max-age=3600
        Cache-Control: s-maxage=3600

* Expires:

        Expires: Fri, 05 Jul 2002, 05:00:00 GMT

* 在事先没有跟原始服务器进行在验证的情况下，不能提供这个对象的陈旧副本，如果进行验证时原始服务器不可用，缓存就返回`504 Gateway Timeout`:

        Cache-Control: must-revalidate

### 网关

HTTP/FTP

HTTP/HTTPS

HTTP/CGI

HTTP/API

### 中继

中继是进行盲转发的代理

### cookie

1. 会话cookie: 用户退出浏览器，cookie就被删除（由Discard参数设置，或者没有使用Expires或Max-Age参数说明过期时间）
2. 持久cookie: 持续时间更长，有显式的过期时间（使用了Expires或Max-Age参数说明过期时间）

cookie版本0：

    Set-Cookie: name=value [; expires=date] [; path=path] [; domain=domain] [; secure]
    Cookie: name1=value1 [; mane2=value2] ...

