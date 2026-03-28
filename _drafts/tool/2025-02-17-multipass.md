# multipass

https://canonical.com/multipass/docs

multipass find

multipass list

multipass shell

multipass launch

## 安装 docker

安装 docker

    sudo apt update
    sudo apt install -y docker.io
    sudo systemctl enable --now docker

测试

    sudo docker run hello-world
    sudo docker ps -a

开放网络访问

    sudo vim /etc/docker/daemon.json

    cat /etc/docker/daemon.json
    {
      "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
    }

编辑 `docker.servie`，启动命令去掉 `-H fd://` 参数

    sudo vim /lib/systemd/system/docker.service

    # ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
    ExecStart=/usr/bin/dockerd --containerd=/run/containerd/containerd.sock

重启 docker 服务

    sudo systemctl daemon-reload
    sudo systemctl restart docker

   	sudo usermod -aG docker $USER

## 外部访问 docker

    export DOCKER_HOST=tcp://192.168.64.2:2375

    docker ps -a

## 安装 minikube

    sudo apt install -y curl wget apt-transport-https conntrack

    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-arm64
    sudo install minikube-linux-arm64 /usr/local/bin/minikube

    minikube start --driver=docker

## 安装 kubectl
