## a few concepts to note

* Kubernetes "deployments" are the high-level construct that define an application
* "Pods" are instances of a container in a deployment
* "Services" are endpoints that export port to the outside world
* You can create, delete, modify, and retrieve information about any of these using the `kubectl` command

## minikube & kubectl

    $ minikube start

    $ kubectl run hello-minikube --image-gcr.io/google_containers/echoserver:1.4 --port=8080

    $ kubectl expose deployment hello-minikube --type=NodePort

    $ kubectl get pod

    $ curl $(minikube service hello-minikube --url)

    $ minikube stop

### kubectl

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


## deployments

* "deployments" are the central metaphor for what we'd consider "apps" or "services"
* "deployments" are descrived as a collection of resources and references
* "deployments" take many forms based on the type of services being deployed
* Typicall described in YAML format

### practical: a tomcat deployment

we'll deploy the Tomcat App Server using the official docker image

#### Define the deployment

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

#### Expose its services

    $ kubectl expose deployment tomcat-deployment --type=NodePort

查看服务的url

    $ minikube service tomcat-deployment --url

#### Deploy it to our cluster


* Master: decide where to run you application
* Node:
    * kubelet
    * kube-proxy
    * pod...
    * docker

#### 是什么

> 您可以将Kubernetes视为调度程序。
> Kubernetes检查您的基础设施（物理机或云，公共或私有）并检测每台机器的CPU和内存。
> 当您请求部署一个容器时，Kubernetes会识别容器的内存要求，并找到满足您请求的最佳服务器。
> 您无法决定部署应用程序的具体位置。
> 数据中心已经把这个步骤抽象出来。
> 换句话说，Kubernetes将使用您的基础设施像玩俄罗斯方块一样玩转容器。
> Docker容器就是方块；服务器是板，Kubernetes就是玩家。

#### API

> Kubernetes作为数据中心的API层
> 你在Kubernetes所做的一切都是你的一个API调用。
> 你需要部署一个容器吗？有一个REST端点。
> 也许你想配置负载均衡器？不是问题。只需调用此API即可。
> 你想配置存储吗？请发送POST请求到此URL。
> 你在Kubernetes所做的一切都是调用API。


# 什么是 Kubernetes

自动化的容器编排平台：
* 部署
* 弹性
* 管理

核心功能：
* 服务发现与负载均衡

# Kubernetes 的架构

# Kubernetes 的核心概念与 API

