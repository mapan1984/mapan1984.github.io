### Cluster

它可以通过一个父进程管理一堆子进程的方式来实现集群的功能。

cluster 底层就是 child_process，master 进程做总控，启动 1 个 agent 和 n 个 worker，agent 来做任务调度，获取任务，并分配给某个空闲的 worker 来做。

需要注意的是：每个 worker 进程通过使用 child_process.fork() 函数，基于 IPC（Inter-Process Communication，进程间通信），实现与 master 进程间通信。

fork 出的子进程拥有和父进程一致的数据空间、堆、栈等资源（fork 当时），但是是独立的，也就是说二者不能共享这些存储空间。 那我们直接用 fork 自己实现不就行了。

这样的方式仅仅实现了多进程。多进程运行还涉及父子进程通信，子进程管理，以及负载均衡等问题，这些特性 cluster 帮你实现了。

``` javascript
// 计算 start, 至 start + range 之间的素数
function generatePrimes(start, range) {
    let primes = []
    let isPrime = true
    let end = start + range
    for (let i = start; i < end; i++) {
        for (let j = min; j < Math.sqrt(end); j++) {
            if (i !== j && i%j === 0) {
                isPrime = false
                break
            }
        }

        if (isPrime) {
            primes.push(i)
        }

        isPrime = true
    }
    return primes
}


/**
 * - 加载clustr模块
 * - 设定启动进程数为cpu个数
 */
var cluster = require('cluster')
var numCPUs = require('os').cpus().length

// 素数的计算
const min = 2
const max = 1e7 // = 10000000
let primes = []


if (cluster.isMaster) {
    const range = Math.ceil((max - min) / numCPUs)
    let start = min

    for (var i = 0; i < numCPUs; i++) {
        const worker = cluster.fork() // 启动子进程
        //  在主进程中，这会发送消息给特定的工作进程
        worker.send({ start: start, range: range })

        start += range

        worker.on('message', (msg) => {
            primes = primes.concat(msg.data)
            worker.kill()
        })

    }
    // 当任何一个工作进程关闭的时候，cluster 模块都将会触发 'exit' 事件
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died')
    })
} else {
    // 监听子进程发送的信息
    process.on('message', (msg) => {
        console.log(msg)
        const { start, range} = msg
        const data = generatePrimes(start, range)
        // 在工作进程中，这会发送消息给主进程
        process.send({ data: data })
    })
}
```

### child_process

在Node.js中，提供了一个 child_process 模块，通过它可以开启多个子进程，在多个子进程之间可以共享内存空间，可以通过子进程的互相通信来实现信息的交换。

> child_process_main.js

``` javascript
const { fork } = require('child_process')
const worker = fork(__dirname + '/child_process_worker.js')
var numCPUs = require('os').cpus().length

// 接收工作进程计算结果
let max = 1e7
let min = 2
let start = 2
let primes = []

const range = Math.ceil((max - min) / numCPUs)

for (var i = 0; i < numCPUs; i++) {
    worker.send({ start: start, range: range })
    start += range
    worker.on('message', (msg) => {
        primes = primes.concat(msg.data)
        worker.kill()
    })
}
```

> child_process_worker.js

``` javascript
// 素数的计算
function generatePrimes(start, range) {
    let primes = []
    let isPrime = true
    let end = start + range
    for (let i = start; i < end; i++) {
        for (let j = 2; j < Math.sqrt(end); j++) {
            if (i !== j && i%j === 0) {
                isPrime = false
                break
            }
        }

        if (isPrime) {
            primes.push(i)
        }

        isPrime = true
    }
    return primes
}


// 监听子进程发送的信息
process.on('message', (msg) => {
    const { start, range} = msg
    console.log(msg)
    const data = generatePrimes(start, range)
    // 在工作进程中，这会发送消息给主进程
    process.send({ data: data })
})

// 收到kill信息，进程退出
process.on('SIGHUP', function() {
    process.exit()
})
```

### worker_threads

worker_threads 比使用 child_process 或 cluster可以获得的并行性更轻量级。 此外，worker_threads 可以有效地共享内存。

``` javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (isMainThread) {
  // This code is executed in the main thread and not in the worker.

  // Create the worker.
  const worker = new Worker(__filename);
  // Listen for messages from the worker and print them.
  worker.on('message', (msg) => { console.log(msg); });
} else {
  // This code is executed in the worker and not in the main thread.

  // Send a message to the main thread.
  parentPort.postMessage('Hello world!');
}
```

* Worker: 该类用于创建 worker对象。有一个必填参数__filename（文件路径），该文件会被worker执行。同时我们可以在主线程中通过worker.on监听message事件
* isMainThread: 该对象用于区分是主线程（true）还是工作线程（false）
* parentPort: 该对象的 postMessage 方法用于 worker 线程向主线程发送消息

``` javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

function generatePrimes(start, range) {
  let primes = []
  let isPrime = true
  let end = start + range
  for (let i = start; i < end; i++) {
    for (let j = 2; j < Math.sqrt(end); j++) {
      if (i !== j && i%j === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) {
      primes.push(i)
    }
    isPrime = true
  }
  return primes
}


if (isMainThread) {
  const max = 1e7
  const min = 2
  let primes = []

  const threadCount = +process.argv[2] || 2
  const threads = new Set()
  console.log(`Running with ${threadCount} threads...`)
  const range = Math.ceil((max - min) / threadCount)
  let start = min

  for (let i = 0; i < threadCount - 1; i++) {
    const myStart = start
    threads.add(new Worker(__filename, { workerData: { start: myStart, range }}))
    start += range
  }

  threads.add(new Worker(__filename, { workerData: { start, range: range + ((max - min + 1) % threadCount)}}))

  for (let worker of threads) {
    worker.on('error', (err) => { throw err })
    worker.on('exit', () => {
      threads.delete(worker)
      console.log(`Thread exiting, ${threads.size} running...`)
      if (threads.size === 0) {
        // console.log(primes.join('\n'))
      }
    })

    worker.on('message', (msg) => {
      primes = primes.concat(msg)
    })
  }
} else {
  const data = generatePrimes(workerData.start, workerData.range)
  parentPort.postMessage(data)
}
```
