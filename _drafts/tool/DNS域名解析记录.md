---
title: DNS域名记录
tags: [DNS]
---

注册完域名之后需要发布域名到服务器IP的映射，这是通过DNS(Domain Name Server)服务器的域名解析来完成的。
DNS服务器记录这些映射，完成域名解析的任务，记录有以下几种:

1. A(Address)记录：将域名指向一个IPv4地址，
2. AAAA记录：将域名指向一个IPv6地址，
2. CNAME(Canonical Name Record)记录：将域名指向另一个域名
3. NS(Name Server)记录：域名解析服务器记录，为某个域名的解析指定域名服务器
4. MX记录：邮件交换记录，由于知道负责处理发往收件人域名的邮件服务器
5. TXT记录：文本记录，异步指为某个主机名或域名设置的说明，一般做某种验证时会用到
6. SRV
7. CAA(Certification Authority Restriction): 认证机构授权，使用互联网的域名系统来允许域的持有人指定哪些证书颁发机构（CA）被允许颁发该域的证书。

如果我已有一个域名，增加子域名指向不同服务器，需增加A记录
