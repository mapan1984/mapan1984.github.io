### 过程

比如我们的邮件地址是(163.com)使用Outlook之类的软件写好邮件，填写对方的Email地址(sina.com)，发送邮件

Outlook即为MUA(Mail User Agent)

Email服务商如网易(如果我们的电子邮件是163.com)，即为MTA(Mail Transfer Agent)

...MTA

Email服务商如新浪(如果对方的电子邮件是sina.com)，即为MTA(Mail Transfer Agent)

新浪的服务器，电子邮件MDA(Mail Delivery Agent)

对方使用MUA，取到MDA上的邮件

### 发邮件

编写MUA把邮件发到MTA，使用SMTP(Simple Mail Transfer Protocol)，后面MTA--->MTA也是

1. 配置SMTP(端口25)服务器地址

如163.com请使用smtp.163.com，为了证明自己，需自己的邮件地址和密码

2. 邮件内容

* 正文
* MIME='text/plain'
* 编码

### 收邮件

编写MUA从MDA上收邮件，使用POP(Post Office Protocol)POP3;IMAP(Internet Message Access Protocol)可直接操作MDA上存储的邮件
