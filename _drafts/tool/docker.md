## Docker是什么

Docker属于Linux容器的一种封装，可以将应用程序与该程序的依赖打包在一个文件里面(image文件)。运行这个文件，就会生成一个虚拟容器，这个容器对进程进行隔离，对容器内的进行来说，它接触到的各类资源都是虚拟的，从而实现了与底层系统的隔离。

另外，Docker是Server/Client架构，运行`docker`命令时，需要连接到运行的Docker服务。

## image文件

Docker根据image文件生成Container，image文件可以继承，而且是在各平台兼容的，所以在实际的开发中，我们可以直接使用他人制作好的image文件，或基于他人的image文件做自己的定制。

Docker提供了官方的image文件仓库[Docker Hub](https://hub.docker.com/)。

    $ docker image pull [library/]hello-world

    $ docker image ls

    $ docker image rm [imageName]

上传文件，You need to tag your image correctly first with your registryhost:

    $ docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]

Then docker push using that same tag.

    $ docker push NAME[:TAG]

打包本地镜像:

    $ docker save -o name-tag.tar name[:tag]

导入镜像：

    $ docker load < name-tag.tar

## container

根据Image文件可以生成运行的容器(Container)实例(container run可以自动抓取image文件)：

    $ docker container run hello-world

    $ docker container run -it ubuntu bash

    $ docker container start [containerID]

    $ docker container stop [containerID]

    $ docker container logs [containerID]

    $ docker container exec -it [containerID] /bin/bash

    $ docker container cp [containerID]:[/path/to/file]

    $ docker container kill [containerID]

Image文件生成的容器实例，本身也是一个文件，称为容器文件，关闭容器不会删除容器文件，只会停止容器的运行。

    $ docker container ls [--all]

    $ docker container rm [containerID]

## Dockerfile


``` dockerfile
# 该image文件继承官方的python image
FROM python:3.6-alpine

ENV FLASK_APP flasky.py
ENV FLASK_CONFIG production

RUN adduser -D flasky
USER flasky

# 指定工作路径为/home/flasky
WORKDIR /home/flasky

# 将当前目录下的requirements文件拷贝进image文件的/home/flasky目录中
COPY requirements requirements
# 在工作路径下运行命令创建虚拟环境
RUN python -m venv venv
# 安装依赖，所有依赖都将打包进入image文件
RUN venv/bin/pip install -r requirements/docker.txt

COPY app app
COPY migrations migrations
COPY flasky.py config.py boot.sh ./

# run-time configuration
# 将容器的5000端口暴露出来，允许外部连接这个端口
EXPOSE 5000
ENTRYPOINT ["./boot.sh"]

# 运行服务
# CMD flask run
```

Docker根据`Dockerfile`生成image文件：

    $ docker image build -t flasky[:0.0.1] .

`-t`表示image文件的名字，可选指定标签，最后的`.`表示Dockerfile所在的路径。

    $ docker container run -p 8000:5000 -it flasky /bin/bash

## 微服务

将不同的Docker容器组合，每个容器承载一个服务，运行多个容器组成应用程序。

``` yaml
# docker-compose.yml
```

    $ docker-compose up
    $ docker-compose stop
    $ docker-compose rm
    $ docker-compose down
    $ docker-compose down --volumes

## machine

    $ docker-machine ip
