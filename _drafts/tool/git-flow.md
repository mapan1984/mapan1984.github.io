# Git 协作流程

## master 分支

master 永远处于稳定状态，这个分支代码可以随时用来部署。不允许在该分支直接提交代码。

## develop 分支

开发分支，包含了项目最新的功能和代码，所有开发都在 develop 上进行。一般情况下小的修改直接在这个分支上提交代码。

## feature 分支

如果要改的一个东西会有比较多的修改，或者改的东西影响会比较大，请从 develop 分支开出一个 feature 分支，分支名约定为`feature/xxx`，开发完成后合并回 develop 分支并且删除这个 feature 分支，相应的操作如下：

```bash
$ git checkout -b feature/xxx develop
# 写代码，提交，写代码，提交。。。
# feature 开发完成，合并回 develop
$ git checkout develop
# 务必加上 --no-ff，以保持分支的合并历史
$ git merge --no-ff feature/xxx
$ git branch -d feature/xxx
```

如果想要当前分支能保持与 develop 的更新，请用 rebase，操作如下：

```bash
# 假设当前在 feature/xxx 分支
$ git rebase develop
```

rebase 会修改历史，如果你的 feature 分支是跟人合作开发的，请互相做好协调。

## release 分支

当 develop 上的功能和 bug 修得差不多的时候，我们就要发布新版本了，这个时候从 develop 分支上开出一个 release 分支，来做发布前的准备，分支名约定为`release/20121221`，主要是测试有没有什么 bug，如果有 bug 就直接在这个分支上修复，确定没有问题后就会合并到 master 分支。相应操作如下：

```bash
$ git checkout -b release/20121221 develop
# 修复 bug、检查没问题后合并到 master 分支并删除
$ git checkout master
$ git merge --no-ff release/20121221
```

为了让 release 分支上 bug 修改作用到 develop 分支，我们还需要把这个 release 分支合并回 develop 分支：

```bash
$ git checkout develop
$ git merge --no-ff release/20121221
# 到此，这个 release 分支完成了它的使命，可以被删除了
$ git branch -d release/20121221
```

## hotfix 分支

如果我们发现线上的代码（也就是 master）有 bug，但是这个时候我们的 develop 上的有些功能还没完成，还不能发布，这个时候我们可以从 master 分支上开出一个 hotfix 分支（记住：直接在 master 上提交代码是不允许的！），分支名约定为`hotfix/xxx`，在这个分支上修改完 bug 后需要把这个分支同时合并到 master 和 develop 分支。相应操作如下：

```bash
$ git checkout -b hotfix/xxx master
# 修完 bug 后
$ git checkout master
$ git merge --no-ff hotfix/xxx
$ git checkout develop
$ git merge --no-ff hotfix/xxx
# hotfix 分支完成使命
$ git branch -d hotfix/xxx
```

例外：当 hotfix 分支完成，这个时候如果有 release 分支存在，那么这个 hotfix 就应该合并到 release，而不是 develop 分支。

## proj 分支

proj 分支为项目分支，所有的项目分支都从 master 上开出来，约定的分支名为`proj/xxx`。所有的项目定制内容都直接在项目分支上提交。为了保证项目的更新，每当项目有新版本发布时都需要把 master 分支合并到 proj 分支上。相应操作如下：

```bash
$ git checkout -b proj/xxx master
# 定制。。。
# 如果 master 分支有更新
$ git checkout proj/xxx master
$ git merge --no-ff master
```
