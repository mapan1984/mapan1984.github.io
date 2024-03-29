# Linux Control Group

### 功能

是Linux内核的一个功能，用来限制，控制与分离一个进程组群的资源（如CPU、内存、磁盘输入输出等）

1. Resource limitation: 限制资源使用，比如内存使用上限以及文件系统的缓存限制。
2. Prioritization: 优先级控制，比如：CPU利用和磁盘IO吞吐。
3. Accounting: 一些审计或一些统计，主要目的是为了计费。
4. Control: 挂起进程，恢复执行进程。

经常用于：

1. 隔离一个进程集合（比如：nginx的所有进程），并限制他们所消费的资源，比如绑定CPU的核。
2. 为这组进程 分配其足够使用的内存
3. 为这组进程分配相应的网络带宽和磁盘存储限制
4. 限制访问某些设备（通过设置设备的白名单）

### 概念

* Tasks：系统的一个进程
* Control Group：一组按照某种标准划分的进程，cgroup 的表现方式为一个带一系列可配置文件的目录，目录中的 `tasks` 文件包含了进程 id
* Hierarchy：进程组可以按层级组织，子节点继承父节点的属性
* Subsystem：一个子系统就是一个资源控制器，比如CPU子系统就是控制CPU时间分配的一个控制器。子系统必须附加到一个层级上才能起作用，一个子系统附加到某个层级以后，这个层级上的所有控制族群都受到这个子系统的控制。Cgroup的子系统可以有很多，也在不断增加中。

### 实际使用

CGroup 的 API 以一个伪文件系统的方式实现，即用户可以通过文件操作实现 cgroups 的组织管理

    $ mount -t cgroup

``` sh
mkdir cgroup
mount -t tmpfs cgroup_root ./cgroup
mkdir cgroup/cpuset
mount -t cgroup -ocpuset cpuset ./cgroup/cpuset/
mkdir cgroup/cpu
mount -t cgroup -ocpu cpu ./cgroup/cpu/
mkdir cgroup/memory
mount -t cgroup -omemory memory ./cgroup/memory/
```

    $ lssubsys  -m
    cpuset /cgroup/cpuset
    cpu /cgroup/cpu
    cpuacct /cgroup/cpuacct
    memory /cgroup/memory
    devices /cgroup/devices
    freezer /cgroup/freezer
    net_cls /cgroup/net_cls
    blkio /cgroup/blkio


系统有 `cgroup` 的目录，这个目录下又有子目录（`cpuset`, `cpu`, `memory`, `blkio`）表示 cgroup 的子系统

    $ ls /cgroup/blkio/
    blkio.io_merged                   blkio.io_serviced_recursive      blkio.throttle.io_serviced        cgroup.clone_children
    blkio.io_merged_recursive         blkio.io_wait_time               blkio.throttle.read_bps_device    cgroup.procs
    blkio.io_queued                   blkio.io_wait_time_recursive     blkio.throttle.read_iops_device   cgroup.sane_behavior
    blkio.io_queued_recursive         blkio.leaf_weight                blkio.throttle.write_bps_device   docker
    blkio.io_service_bytes            blkio.leaf_weight_device         blkio.throttle.write_iops_device  notify_on_release
    blkio.io_service_bytes_recursive  blkio.reset_stats                blkio.time                        release_agent
    blkio.io_service_time             blkio.sectors                    blkio.time_recursive              tasks
    blkio.io_service_time_recursive   blkio.sectors_recursive          blkio.weight
    blkio.io_serviced                 blkio.throttle.io_service_bytes  blkio.weight_device

在相应子目录(比如 `/cgroup/blkio`) 下创建目录，目录下会生成相应配置文件:

    $ ls /cgroup/blkio/hello
    blkio.io_merged                   blkio.io_serviced             blkio.sectors_recursive           blkio.time_recursive
    blkio.io_merged_recursive         blkio.io_serviced_recursive   blkio.throttle.io_service_bytes   blkio.weight
    blkio.io_queued                   blkio.io_wait_time            blkio.throttle.io_serviced        blkio.weight_device
    blkio.io_queued_recursive         blkio.io_wait_time_recursive  blkio.throttle.read_bps_device    cgroup.clone_children
    blkio.io_service_bytes            blkio.leaf_weight             blkio.throttle.read_iops_device   cgroup.procs
    blkio.io_service_bytes_recursive  blkio.leaf_weight_device      blkio.throttle.write_bps_device   notify_on_release
    blkio.io_service_time             blkio.reset_stats             blkio.throttle.write_iops_device  tasks
    blkio.io_service_time_recursive   blkio.sectors                 blkio.time

将进程加入这个限制组:

    $ echo <pid> >> /cgroup/blkio/hello/tasks

通过修改以下文件限制进程 IO:

    blkio.throttle.read_bps_device
    blkio.throttle.read_iops_device
    blkio.throttle.write_bps_device
    blkio.throttle.write_iops_device


``` sh
echo "$major:$minor  $readBps" > $read_bps
echo "$major:$minor  $writeBps" > $write_bps
echo "$major:$minor  $readIops" > $read_iops
echo "$major:$minor  $writeIops" > $write_iops
```

### CGroup 的子系统

1. blkio
2. cpu
3. cpuacct
4. cpuset
5. devices
6. freezer
7. memory
8. net_cls
9. net_prio
10. hugetlb

手动 mount `net_cls` 和 `net_prio`

``` sh
modprobe cls_cgroup
mkdir /cgroup/net_cls
mount -t cgroup -o net_cls none /cgroup/net_cls

modprobe netprio_cgroup
mkdir /cgroup/net_prio
mount -t cgroup -o net_prio none /cgroup/net_prio
```

### 利用 Cgroup 限制 Docker 容器资源

默认情况下，Docker 启动一个容器，会在 `/cgroup/` 目录下的各个资源目录下生成已容器 ID 为名字的目录 (Control Group)

    $ ls /cgroup/blkio/docker/914dbea3a2a61829fdbf6d7e27dfaa51dd77b380096d38100d3f0cceec728a6c
    blkio.io_merged                   blkio.io_serviced             blkio.sectors_recursive           blkio.time_recursive
    blkio.io_merged_recursive         blkio.io_serviced_recursive   blkio.throttle.io_service_bytes   blkio.weight
    blkio.io_queued                   blkio.io_wait_time            blkio.throttle.io_serviced        blkio.weight_device
    blkio.io_queued_recursive         blkio.io_wait_time_recursive  blkio.throttle.read_bps_device    cgroup.clone_children
    blkio.io_service_bytes            blkio.leaf_weight             blkio.throttle.read_iops_device   cgroup.procs
    blkio.io_service_bytes_recursive  blkio.leaf_weight_device      blkio.throttle.write_bps_device   notify_on_release
    blkio.io_service_time             blkio.reset_stats             blkio.throttle.write_iops_device  tasks
    blkio.io_service_time_recursive   blkio.sectors                 blkio.time

在容器停止后，该目录会被删除

    $ docker run -d --name test1 --blkio-weight 100 --memory 10M --cpu-quota 25000 --cpu-period 2000 --cpu-shares 30 kafka_1.1.1
