---
title: vim 使用channel
tags: [vim, channel]
---

### 操作channel

使用`ch_open`打开一个channel

``` vim
let channel = ch_open({address} [, {options}])
if ch_status(channel) == "open"
    " use the channel
```

`{address}`是一个形式为"hostname:port"的字符串，指定address的channel意味着channel使用socket进行通信。

*如果是通过`start_job`打开job，并使用`job_getchannel`获得channel，并且jog的{options}指明了io方式为pipe(默认)，那么channel使用pipe进行通信*

`{options}`是一个字典类型，可选值有:

1. "mode": 交换信息的格式
    * "json"
    * "js"
    * "nl"   - 以NL结尾的信息
    * "raw"
2. "callback": 一个当信息被接收到时会调用的函数，形式为:
    ``` vim
    func Handle(channel, msg)
        echo 'Received: ' . a:msg
    endfunc

	let channel = ch_open("localhost:8765", {"callback": "Handle"})
    ```
3. "close_cb": 一个当channel关闭是调用的函数，形式为：
    ``` vim
    func CloseHandler(channel)
    ```
4. "drop"： 指定什么时候丢弃信息：
    * "auto": 当没有会调函数处理信息时
    * "never": 所有的信息都会保存
5. "waittime":
6. "timeout":

使用`ch_close`关闭一个channel，当channel使用socket通信是，`ch_close`会关闭所有的socket，当channel使用pipes通信时，如果pipes使用了stdin, stdout, stderr时，它们也会关闭，所以***谨慎使用ch_close***，关闭job使用`job_stop`会更加合适。

``` vim
" 获得channel的状态
ch_status(channel)
"fail"		Failed to open the channel.
"open"		The channel can be used.
"buffered"	The channel was closed but there is data to read.
"closed"	The channel was closed.

" 获得和channel关联的job
ch_getjob(channel)


" 从channel中读取信息(使用channel的timeout)
let output = ch_read(channel)

" 从channel中读取信息(不适用channel的timeout)
let output = ch_read(channel, {'timeout':0})
```

### 交换信息

#### JSON or JS

当mode是JSON或者JS时，可以通过`ch_evalexpr`交换信息:

``` vim
let response = ch_evalexpr(channel, {expr})
```

它会异步等待另一边传回的信息

如果仅仅向另一边发送信息，不处理相应或者让channel注册的回调函数处理相应，可以使用`ch_sendexper`

``` vim
call ch_sendexpr(channel, {expr})
```

发送信息并指定特别的回调函数出来响应:

``` vim
call ch_sendexpr(channel, {expr}, {'callback': Handler})
```

#### RAW or NL

当mode是RAW或者NL时，可以通过`ch_evalraw`交换信息:

``` vim
let response = ch_evalraw(channel, {string})
call ch_sendraw(channel, {string})
call ch_sendraw(channel, {string}, {'callback': 'MyHandler'})
```

