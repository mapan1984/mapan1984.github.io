---
title: ssh 配置与 git 多用户设置
tags: [SSH]
---

## ssh config

ssh 用户配置文件 `~/.ssh/config`，系统配置文件 `/etc/ssh/ssh_config`

``` sshconfig
# 主机别名
Host aws
    # 主机名
    HostName 18.182.5.110
    # 指定密钥路径
    IdentityFile ~/.ssh/mapan.pem
    # 用户名
    user ubuntu
    # 端口
    Port 22
    ForwardX11Trusted yes
    TCPKeepAlive yes
```

文件权限：

    $ chown $USER ~/.ssh/config
    $ chmod 600 ~/.ssh/config

登录主机：

    $ ssh aws

## 多 git 用户

利用 ssh 的 config 文件可以在一台主机上配置多个 github 用户

``` sshconfig
# 默认 git 用户的配置
Host github.com
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa
# xouox git 用户的配置，id_rsa.xouox 是用 xouox 用户的邮箱生成的密钥
Host github.com.xouox
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa.xouox
```

### 本地仓库，采用默认 git 用户配置

添加并推送本地 git 仓库到默认用户的远程 git 仓库：

    git remote add origin git@github.com:mapan1984/mapan1984.github.io.git
    git push origin master


### 同一个本地仓库，关联到不同账户的远程仓库

为同一个本地仓库关联到另一个用户(xouox)的远程仓库：

    git remote add xouox git@github.com.xouox:xOuOx/xOuOx.github.io.git
    git push xouox master

与之对应的 git config 文件：

``` gitconfig
# 默认账户
[remote "origin"]
	url = git@github.com:mapan1984/mapan1984.github.io.git
	fetch = +refs/heads/*:refs/remotes/origin/*
# 新增加的 xouox 账户设置
[remote "xouox"]
	url = git@github.com.xouox:xOuOx/xOuOx.github.io.git
	fetch = +refs/heads/*:refs/remotes/xouox/*
```

### 不同本地仓库，关联到不同账户的远程仓库

为不同的本地仓库添加另一个用户(xouox)的远程仓库：

    git remote add origin git@github.com.xouox:xOuOx/xOuOx.github.io.git
    git push origin master

为项目添加用户信息：

    git config user.name "xouox"
    git config user.email "xouox@xouox.com"

与之对应的 git config 文件：

``` gitconfig
[remote "origin"]
	url = git@github.com.xouox:xOuOx/xOuOx.github.io.git
	fetch = +refs/heads/*:refs/remotes/xouox/*
[user]
	name = xouox
	email = xouox@xouox.com
```
