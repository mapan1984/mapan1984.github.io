---
title: vim 与 lsp
tags: [vim, lsp]
---

## lsp(Language Server Protocal)

* Language server: 在 project 级别做语义分析理解代码，
* LSP client: 一般与编辑器结合，向 server 提供代码信息与操作，获取 server 返回的结果，


![lsp]({{site.url}}/resources/images/tool/language-server-sequence.png)

luaguage server 都是一个个命令行程序，由编辑器（LSP client）启动，通过管道发送 JSON RPC 命令交流。

* [langserver.org](https://langserver.org/)
* [language-server-protocol](https://microsoft.github.io/language-server-protocol/overview)
