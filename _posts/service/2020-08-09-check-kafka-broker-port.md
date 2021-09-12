---
title: 利用 MetadataRequest 检测 kafka 端口
tags: [kafka]
---

## 检测原理

向服务端口发送 `MetadataRequest` 请求，判断服务是否可以返回正确的响应数据。

Kafka 服务协议：https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol

## 检测方式

在 node10 环境下允许检测脚本：

    $ node check.js <host> <port>

脚本有以下返回值：

1. 0：该端口是 Kafka 服务端口
2. 1：该端口连接错误
3. 2：该端口可以连接，但不是 Kafka 服务端口

## 检测代码

> [下载 check.js]({{ site.url }}/resources/code/kafka/check.js)

``` javascript
var net = require('net')
var util = require('util')

/*
 * RequestOrResponse => Size (RequestMessage | ResponseMessage)
 *   Size => int32
 *
 * RequestMessage => ApiKey ApiVersion CorrelationId ClientId RequestMessage
 *   ApiKey => int16
 *   ApiVersion => int16
 *   CorrelationId => int32
 *   ClientId => string
 *   RequestMessage => MetadataRequest | ProduceRequest | FetchRequest | OffsetRequest | OffsetCommitRequest | OffsetFetchRequest
 *
 * Response => CorrelationId ResponseMessage
 *   CorrelationId => int32
 *   ResponseMessage => MetadataResponse | ProduceResponse | FetchResponse | OffsetResponse | OffsetCommitResponse | OffsetFetchResponse
 *
 * MetadataResponse => [Broker][TopicMetadata]
 *   Broker => NodeId Host Port  (any number of brokers may be returned)
 *     NodeId => int32
 *     Host => string
 *     Port => int32
 *   TopicMetadata => TopicErrorCode TopicName [PartitionMetadata]
 *     TopicErrorCode => int16
 *   PartitionMetadata => PartitionErrorCode PartitionId Leader Replicas Isr
 *     PartitionErrorCode => int16
 *     PartitionId => int32
 *     Leader => int32
 *     Replicas => [int32]
 *     Isr => [int32]
 */


const metadataRequest = {
    type: 'Buffer',
    data: [
        0, 0, 0, 32,  // Size 32 bytes
        0, 3,  // ApiKey 3 MetadataRequest
        0, 0,  // ApiVersion 0
        0, 0, 0, 0,  // CorrelationId 0
        // clientId
        0, 18,  // string len 18 bytes
        107, 97, 102, 107, 97, 45, 97, 103, 101, 110, 116, 45, 99, 108, 105, 101, 110, 116, // string content `kafka-agent-client`
        0, 0, 0, 0
    ]
}

const host = process.argv[2] || '127.0.0.1'
const port = process.argv[3] || 9092

let request = Buffer.from(metadataRequest.data)
console.log('request buffer: ', request)
let result = {}
let isKafka = true

const client = new net.Socket()
client.connect(port, host, () => {
    console.log('Connected')
    client.write(request)
})

client.on('data', data => {
    // console.log('Received data(raw): ' + data)
    try {
        let size = data.readIntBE(0, 4)
        let correlationId = data.readIntBE(4, 4)
        let brokerNum = data.readIntBE(8, 4)
        result['size'] = size
        result['correlationId'] = correlationId
        result['brokerNum'] = brokerNum
        result['hosts'] = []

        console.log(`size: ${size}, correlationId: ${correlationId}, brokerNum: ${brokerNum}`)
        let allhostsLen = 0
        for (let i = 0; i < brokerNum; i++) {
            let nodeId = data.readIntBE(12 + i * (4 + 2 + 4) + allhostsLen, 4)
            let hostLen = data.readIntBE(12 + i * (4 + 2 + 4) + allhostsLen + 4, 2)
            let hostIP = data.toString('utf8', 12 + i * (4 + 2 + 4) + allhostsLen + 4 + 2, 12 + i * (4 + 2 + 4) + allhostsLen + 4 + 2 + hostLen)
            let port = data.readIntBE(12 + i * (4 + 2 + 4) + allhostsLen + 4 + 2 + hostLen, 4)

            let host = {
                nodeId: nodeId,
                hostIP: hostIP,
                port: port,
            }
            result.hosts.push(host)

            allhostsLen += hostLen

            console.log(`nodeId: ${nodeId}, hostLen: ${hostLen}, hostIP: ${hostIP}, port: ${port}`)
        }
        console.log(`result: ${util.inspect(result)}`)
    } catch (err) {
        isKafka = false
        console.error(err)
    } finally {
        if (!isCorrect(result)) {
            isKafka = false
        }
        client.destroy()
    }
})

client.on('close', () => {
    console.log('Connection closed')
    if (!isKafka || Object.keys(result).length === 0) {
        process.exit(2)
    }
})

function isNumber(num) {
    if (typeof num === 'number') {
        return num - num === 0
    }
    if (typeof num === 'string' && num.trim() !== '') {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num)
    }
    return false;
}

function isCorrect(result) {
    if (Object.keys(result).length === 0) {
        return false
    }
    if (!result.size || !isNumber(result.size) || result.size <= 0) {
        return false
    }
    if (!result.brokerNum || !isNumber(result.brokerNum) || result.brokerNum <= 0) {
        return false
    }
    if (!result.hosts) {
        return false
    }

    for (let host of result.hosts) {
        if (!host.nodeId) {
            return false
        }
        if (!host.port || !isNumber(host.port) || host.port <= 0) {
            return false
        }
    }

    return true
}
```
