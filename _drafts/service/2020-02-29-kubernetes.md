---
title: Kubernetes
tags: [Kubernetes, k8s]
---

## 是什么

用于容器集群的自动化部署、扩容以及运维的平台

* 按规则部署容器：通过 yaml 文件描述目标容器
* 分配宿主机资源：管理宿主机资源，检测每台机器的 CPU 和内存，当请求部署容器时，识别容器的资源要求，并找到最佳服务器进行部署
* 高可用：容器可以设置为多副本运行，请求流量可以均衡到每个副本，副本掉线后可以自动恢复（例如宿主机宕机后在其他正常集群恢复容器）
* 弹性扩缩：通过描述文件更新容器集群资源，平滑扩缩容
* 服务发现与负载均衡：提供服务代理入口 Service，可以将请求流量衡到多个容器，并且可以通过内部 DNS 记录绑定域名访问，提供服务发现能力

## 架构

* Master:
    * 负责管理集群，是集群的资源数据访问入口
    * 运行 API Server, Controller Manager 以及 Scheduler 服务
        * API Server: 各组件通信的中枢，外部请求的入口
        * Controller Manager: 执行集群级功能，例如复制组件，跟踪 Node 节点，处理节点故障等等
        * Scheduler: 负责应用调度的组件，根据各种条件（如可用的资源、节点的亲和性等）将容器调度到 Node 上运
        * Etcd: 高可用键值存储服务，存储集群的配置信息
* Node:
    * 集群操作的单元，是 Pod 运行的宿主机
    * 运行 kubelet, kube-proxy，以及提供容器运行时
        * kubelet: agent 进程，维护和管理该 Node 上所有容器的创建，启停等
        * kube-proxy: 服务发现，反向代理和负载均衡
        * Container Runtime: 容器运行时，如 docker engine

* kubectl: 客户端命令接口，通过命令行与 API Server 交互，实现在集群中进行各种资源的维护与管理

### virtual-kubelet

virtual-kubelet 可以模拟 kubelet 向上提供资源信息，从而在 k8s 集群中提供伪装的虚拟节点，这个节点对应的可能不是一台真实的主机，真实的资源的可能是一个共享的资源池，从而让 k8s 集群本身也变成按需创建的了。

## 核心概念

### Pod

运行于 Node 节点上，若干相关容器的组合

* 创建、调度和管理的最小单位
* 可以包含一个或多个容器
    * Pod 中所有容器共享存储卷
    * Pod 中所有容器共享一个 IP 地址和端口空间。
    * Pod 内的容器可以使用 `localhost` 互相通信

### Replication Controller (RC)

管理 Pod 的副本，保证集群中存在指定数量的 Pod 副本，针对不同用途有多种类型：

* Deployment：无状态应用（如 Web 服务、REST API 等）
* StatefulSet：管理有状态应用的控制器
    * 为每个 Pod 提供固定的标识和持久化存储，当 Pod 被调度到其他任何节点时，标识与存储不变
    * Pod 按顺序（0, 1, 2 ... n）创建，并以相反的顺序（n ... 2, 1, 0）终止
    * 每个 Pod 会有自己的域名，由 headless Service 提供 DNS 解析
* Job
* CronJob
* DaemonSet

#### Deployment

#### StatefulSet

StatefulSet 中的 Pod 会根据其序号自动分配一个唯一的名称

可以通过设置环境变量引用 Downward API 在容器内部获取 Pod 的名称

``` yaml
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
```

StatefulSet 中每个 Pod 都有一个唯一的 `statefulset.kubernetes.io/pod-name` 标签，其值为 Pod 名称

### Service

一般情况下，不会直接通过 Pod IP 地址访问服务，因为：

* Pod 只能在 kubernetes 集群所在虚拟网络内访问
* Pod 生命周期短暂，可能会被频繁删除或重建，导致 IP 地址不固定

通过 Service 对象，可以将一组 Pod（通常是通过标签选择器指定的一组 Pod）作为一个逻辑服务对外暴露。

Service 提供的能力：

1. 提供稳定的网络访问能力，Service 可以提供固定的虚拟 IP，使得客户端无需关心 Pod 的变化
2. 提供负载均衡的能力，可以将客户端请求分发到其代理的多个 Pod 上
3. 提供服务发现能力，Service 会在 Kubernetes 内部注册一个 DNS 记录，允许通过域名访问，而不需要直接使用 IP

Service 类型：

1. ClusterIP：默认类型，仅在集群内部访问，提供一个虚拟 IP 地址，供集群内其他服务或者 Pod 访问。
    * Headless Service：`clusterIP` 字段设置为 `None`，表示不分配 ClusterIP，直接返回后端 Pod 的 IP，适用于直接与 Pod 通信的场景（如 StatefulSet）
2. NodePort：将服务暴露到集群节点的固定端口上，可以通过 `<NodeIP>:<NodePort>` 进行访问，适用于简单的外部访问场景
3. LoadBalancer：借助云服务商的负载均衡器，将服务暴露到外部，适用于生产环境中需要公开访问的服务。
4. ExternalName：将服务映射到一个外部的 DNS 名称，适用于需要访问非 Kubernetes 集群的外部服务。

在 k8s 集群内部有内置 DNS 服务，每个 Service 都有一个内部域名，格式为：

    `<service-name>.<namespace>.svc.cluster.local`

对于 StatefulSet，如果指定一个 Headless Service，Service 会代理每个 Pod，不同 Pod 的内部域名为：

    `<pod-name>.<service-name>.<namespace>.svc.cluster.local`

### 存储

Pod 使用 `volumes` 声明依赖的存储，使用 `volumeMounts` 将存储挂载到容器内文件路径。

volume 根据用途有不同类型：

* EmptyDir：在 node 上创建一个和 pod 同生命周期的文件夹，容器出错或重启都会使用这个文件夹，但是容器删除后也会删除这个文件夹
* HostPath：使用 node 上已存在目录 (例如 /var/logs) 作为存储
* ConfigMap
* Secret
* PersistentVolumeClaim：使用 PVC 提供的存储

如果需要持久保存数据，可以使用 PV 与 PVC 声明存储资源

Persistent Volume(PV)

* 生命周期独立于 Pod，需要单独创建/删除
* 可以使用多种存储后端，如 NFS、Ceph、AWS EBS、GCE PD 等

Persistent Volume Claim(PVC)

* 对存储资源的请求，声明对存储的需求（大小，访问模式等），绑定到符合要求的 PV 资源

## kubectl

通过 `kubectl` 命令访问 kubernetes 集群，可以用来

1. 创建、删除、修改容器资源
2. 获取集群以及所管理资源信息

### 配置

默认配置文件为 `$HOME/.kube/config`，还可以指定配置文件：

1. 环境变量 `KUBECONFIG`
2. 命令行参数 `--kubeconfig`，例如：`kubectl --kubeconfig kubectl.conf get pods`

### 命令

集群信息

    $ kubectl cluster-info

列出所有 node

    $ kubectl get node

列出所有 service

    $ kubectl get services

列出所有 pods

    $ kubectl get pods [pod name]

查看 Pod IP 信息

    $ kubectl get pods -o wide [pod name]

查看 Pod label

    $ kubectl get pods --show-labels

通过 label 筛选 Pod

    $ kubectl get pods -l <label_key>=<lable_value>

展示 pod 的详细信息：

    $ kubectl describe pod [pod name]

获取 pod yaml 格式描述

    $ kubectl get pod [pod name] -o yaml

查看 pod 日志

    $ kubectl logs [pod name]

查看 pod 中 container 日志

    $ kubectl logs [pod name] -c [container name]

    $ kubectl logs -f [pod name] -c [container name]

列出所有 deployments

    $ kubectl get deployments

扩容 deployment

    $ kubectl scale deployment <deployment> --replicas=4

更新 deployment 镜像

    $ kubectl set image deployment/<deployment> <container>=<new_image>

删除 deployment

    $ kubectl delete deployment <deployment>

#### 添加访问入口

为已有的资源创建 Service

    $ kubectl expose <type name> <identifier/name> [--port=external port] [--target-post=container-port] [--type=service-type]

    $ kubectl expose deployment tomcat-deployment --type=NodePort

通过本地 kubectl 进程与目标 Pod/Service 建立临时转发隧道

    $ kubectl port-forward <pod name> [[LOCAL_PORT:]REMOTE_PORT]

#### 交互

连接到 Kubernetes 中正在运行的容器的主进程（通常是 PID 1）所附着的标准输入/输出流，以查看其当前输出，或与之交互（如果支持交互）

    $ kubectl attach [-it] <pod name> [-c <container>]

在容器中启动新进程，或与之交互（如果支持交互）

    $ kubectl exec [-it] <pod name> [-c <container>] COMMAND [args...]

参数：

* `-i`: 将 stdin 输入传递到容器进程
* `-t`: 请求分配 TTY

## namespace

namespace 可以视为逻辑上的虚拟集群，在一个 k8s 集群中可以创建多个 namespace。

k8s 集群创建后有 3 个默认的 namespace:

* `default`：如果没有指定，新的资源会默认创建在这里
* `kube-node-lease`：包含用于各个节点关联的 Lease 对象
* `kube-system`：k8s 系统组件使用
* `kube-public`：公共资源使用

查看 namespace:

    kubectl get namespaces

查看 namespace 下的 pods

    kubectl get pods --namespace=ns-test

## 多集群访问

`kubectl` 默认配置文件是 `~/.kube/config`，在文件中可以配置多个 `cluster`, `context`, `user`，通过 `kubectl config use-context` 切换访问集群。

查看当前配置的 `contexts`

    kubectl config get-contexts

切换当前使用的 `context`

    kubectl config use-context docker-desktop

切换 `context` 后可以查看集群 `nodes` 验证一下

    kubectl get nodes

## 定义文件

### Pod

``` yaml
apiVersion: v1                   # api版本
kind: Pod                        # 组件类型
metadata:
  name: nginx-mysql-pod          # pod 名称
  labels:                        # 自定义标签
    app: nginx-mysql             # 自定义标签
spec:
  containers:
    - name: nginx                # 容器1 名称
      image: nginx               # 容器1 image 地址
      ports:
        - containerPort: 80      # 容器需要监听的端口号
    - name: mysql                # 容器2 名称
      image: mysql               # 容器2 image 地址
```

### Volume

``` yaml
apiVersion: v1
kind: Pod
metadata:
  name: redis
spec:
  containers:
  - name: redis
    image: redis
    volumeMounts:
    - name: redis-persistent-storage
      mountPath: /data/redis
  volumes:
  - name: redis-persistent-storage
    emptyDir: {}                        # 临时目录
```

#### ConfigMap

#### PV

#### PVC

#### StorageClass

### Deployment

``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:                           # deployment 资源自身的标签，便于组织和筛选
    app: nginx
spec:
  replicas: 3                       # Pod 副本数
  selector:
    matchLabels:                    # 定义控制器要管理携带哪些标签的 pod 
      app: nginx                    # 管理带有此标签的 Pod
  template:                         # template 下是 Pod 的定义
    metadata:
      labels:
        app: nginx                  # 控制器创建的 Pod 的标签，必须与 selector 匹配
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```
