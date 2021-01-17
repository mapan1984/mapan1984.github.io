## nice 优先级

    nice [OPTION] [COMMAND [ARG]...]

`nice` 命令可以运行程序并指定优先级，值从 `-20`（最有利于程序）到 `19`（最不利于程序）

OPTION:

    -n, --adjustment=N
           add integer N to the niceness (default 10)

    --help display this help and exit

    --version
           output version information and exit

## cgroups

## docker oom kill

避免在容器使用内存超过限制时容器被杀死：

    --oom-kill-disable

或者调整容器被 oom kill 的优先级（范围是[-1000, 1000]，默认为 0）

    --oom-score-adj

## 限制 nodejs 内存

    node --max-old-space-size=512 test.js  # 单位为 MB

    node --max-new-space-size=1024 test.js  # 单位为 KB

[参考](https://medium.com/@ashleydavis75/node-js-memory-limitations-30d3fe2664c0)

``` javascript
//
// Small program to test the maximum amount of allocations in multiple blocks.
// This script searches for the largest allocation amount.
//

//
// Allocate a certain size to test if it can be done.
//
function alloc (size) {
    const numbers = size / 8;
    const arr = []
    arr.length = numbers; // Simulate allocation of 'size' bytes.
    for (let i = 0; i < numbers; i++) {
        arr[i] = i;
    }
    return arr;
};

//
// Keep allocations referenced so they aren't garbage collected.
//
const allocations = [];

//
// Allocate successively larger sizes, doubling each time until we hit the limit.
//
function allocToMax () {

    console.log("Start");

    const field = 'heapUsed';
    const mu = process.memoryUsage();
    console.log(mu);
    const gbStart = mu[field] / 1024 / 1024 / 1024;
    console.log(`Start ${Math.round(gbStart * 100) / 100} GB`);

    let allocationStep = 100 * 1024;

    while (true) {
        // Allocate memory.
        const allocation = alloc(allocationStep);

        // Allocate and keep a reference so the allocated memory isn't garbage collected.
        allocations.push(allocation);

        // Check how much memory is now allocated.
        const mu = process.memoryUsage();
        const mbNow = mu[field] / 1024 / 1024 / 1024;
        //console.log(`Total allocated       ${Math.round(mbNow * 100) / 100} GB`);
        console.log(`Allocated since start ${Math.round((mbNow - gbStart) * 100) / 100} GB`);

        // Infinite loop, never get here.
    }

    // Infinite loop, never get here.
};

allocToMax();

// Infinite loop, never get here.
```
