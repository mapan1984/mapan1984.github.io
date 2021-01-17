---
title: 利用 git submodule 和 vim pack 进行插件管理
tags: [vim, Git, submodule]
---

## runtimepath

vim 有很多做插件管理的扩展，本质都是下载插件代码，并且将下载插件的路径添加到 `runtimepath` 变量。

可以在 vim 中执行 `:set runtimepath` 查看 `runtimepath` 的值是一个 `,` 分隔的路径列表，vim 运行时会载入这个路径下的 viml 文件。

例如，我们可以简单的下载插件：

    $ git clone https://github.com/zxqfl/tabnine-vim

然后修改 `.vimrc`：

``` vim
set rtp+=~/tabnine-vim
```

之后启动 vim 就会加载 `tabnine` 这个插件。

## 使用 submodule 和 vim8 pack 进行插件管理

### vim8 与 package

在 vim8 中引入了 `package` 的概念，一个 `package` 是多个 `plugin` 的集合，`package` 内的 `plugin` 之间可以有相互依赖关系

在 `~/.vim/pack` 下新建一个目录，这个目录就是一个 `package`，

```
~/.vim/pack/<packname>/start/<pluginname>
~/.vim/pack/<packname>/opt/<pluginname>
```

`start` 下的插件会在启动 vim 时自动加载，`opt` 下的插件可以在 vim 中用 `:packadd pluginname` 加载

### git submodule

可以使用 git 管理 `~/.vim` 目录中的 vim 配置代码，利用 git submodul 将插件代码添加到 vim 配置的 git 仓库中，并利用 vim package 管理插件：

1. 下载插件（将插件作为 submodule 加入）：

        $ mkdir -p pack/foo/start
        $ git submodule add git://github.com/yianwillis/vimcdoc.git pack/foo/start/vimcdoc

2. 升级插件（更新 submodule）：

        $ cd pack/foo/start/vimcdoc
        $ git pull origin master

3. 升级所有插件（更新所有 submodule）

        $ git submodule foreach git pull origin master

        $ git submodule update --recursive --remote

        $ git submodule update --init --recursive

4. 删除

        $ git submodule deinit -f pack/foo/start/vimcdoc
        $ rm -rf .git/modules/pack/foo/start/vimcdoc
        $ git rm -f pack/foo/start/vimcdoc

5. 在其他机器使用

        $ git clone http://github.com/mapan1984/.vim.git ~/.vim
        $ cd ~/.vim
        $ git submodule init
        $ git submodule update

        # 或者
        $ git clone --recursive http://github.com/mapan1984/.vim.git ~/.vim

