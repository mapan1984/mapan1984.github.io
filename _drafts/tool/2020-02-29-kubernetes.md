---
title: Kubernetes
tags: [Kubernetes, k8s]
---

# 是什么

自动化的容器编排平台：
* 按规则部署容器
* 分配宿主机资源，弹性部署
* 管理容器
* 服务发现与负载均衡

> 您可以将Kubernetes视为调度程序。
> Kubernetes检查您的基础设施（物理机或云，公共或私有）并检测每台机器的CPU和内存。
> 当您请求部署一个容器时，Kubernetes会识别容器的内存要求，并找到满足您请求的最佳服务器。
> 您无法决定部署应用程序的具体位置。
> 数据中心已经把这个步骤抽象出来。
> 换句话说，Kubernetes将使用您的基础设施像玩俄罗斯方块一样玩转容器。
> Docker容器就是方块；服务器是板，Kubernetes就是玩家。

# 架构

* Master: decide where to run you application
    * 负责管理集群，集群的资源数据访问入口
    * 运行 API Server, Controller Manager 以及 Scheduler 服务
    * Etcd 高可用键值存储服务
* Node:
    * 集群操作的单元，是 Pod 运行的宿主机
    * kubelet：agent 进程，维护和管理该 Node 上所有容器的创建，启停等
    * kube-proxy：服务发现，反向代理和负载均衡
    * docker engine
* Pod...
    * 运行于 Node 节点上，若干相关容器的组合
    * 创建、调度和管理的最小单位

# 核心概念

* Replication Controller(RC)：管理 Pod 的副本，保证集群中存在指定数量的 Pod 副本
    * Deployment：Kubernetes "deployments" are the high-level construct that define an application
        * "deployments" are the central metaphor for what we'd consider "apps" or "services"
        * "deployments" are descrived as a collection of resources and references
        * "deployments" take many forms based on the type of services being deployed
    * Job
* Service：提供一个统一的服务访问入口以及服务代理和发现机制
* Persistent Volume(PV), Persistent Volume Claim(PVC)：数据卷

* "Pods" are instances of a container in a deployment
* "Services" are endpoints that export port to the outside world

# kubectl

You can create, delete, modify, and retrieve information about any of these using the `kubectl` command

* kubectl provides access to nearly every Kubernetes
* Primary command line access tool

列出所有 pods

    $ kubectl get pods [pod name]

展示 pod 的详细信息：

    $ kubectl describe pod [pod name]

展示端口：

    $ kubectl expose <type name> <identifier/name> [--port=external port] [--target-post=container-port] [--type=service-type]

    $ kubectl expose deployment tomcat-deployment --type=NodePort

转发本地端口到pod：

    $ kubectl port-forward <pod name> [[LOCAL_PORT:]REMOTE_PORT]

Attaches to a process that is already running inside an existing container

    $ kubectl attach <pod name> -c <container>

Execute a command in a container
    * `-i` option will pass stdin to the container
    * `-t` option will specify stdin is a TTY

        $ kubectl exec [-it] <pod name> [-c CONTAINE] COMMAND [args...]

Updates the labels on a resource

    $ kubectl label [--overwrite] <type> KEY_1=VAL_1 ...

Run a particular image on the cluster

    $ kubectl run <name> --image=image

## practical: a tomcat deployment

we'll deploy the Tomcat App Server using the official docker image

### Define the deployment

最简单的deployment 是一个 single pod，一个 pod 是一个 instance of a container，Deployment 可以有任意数量的pod。

``` yaml
# deployment.yaml
apiVersion: apps/v1beta2
kind: Deployment
metadata:
    name: tomcat-deployment
spec:
    selector:
        matchLabels:
            app: tomcat
    replicas: 1
    template:
        metadata:
            labels:
                app: tomcat
        spec:
            containers:
            - name: tomcat
              image: tomcat: 9.0
              ports:
              - containerPost: 8080
```

    $ kubectl apply -f ./deployment.yaml

### Expose its services

    $ kubectl expose deployment tomcat-deployment --type=NodePort

查看服务的url

    $ minikube service tomcat-deployment --url

# API

> Kubernetes作为数据中心的API层
> 你在Kubernetes所做的一切都是你的一个API调用。
> 你需要部署一个容器吗？有一个REST端点。
> 也许你想配置负载均衡器？不是问题。只需调用此API即可。
> 你想配置存储吗？请发送POST请求到此URL。
> 你在Kubernetes所做的一切都是调用API。

