---
title: HTTP Basic authentication
tags: [http, authentication]
---

## nginx 配置

```
location / {
    auth_basic "authentication required ";
    auth_basic_user_file /etc/nginx/conf.d/htpasswd;
    try_files $uri /index.html;
}
```

`/etc/nginx/conf.d/htpasswd` 文件中包含用户信息，生成方法为：

    printf "pan.ma:$(openssl passwd -crypt pan.ma.password)\n" >> /etc/nginx/conf.d/htpasswd

## koa 中获取用户信息

``` javascript
const fs = require("fs");
const path = require("path");

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
app.use(bodyParser());

// 通过 Authorization header 获取用户认证信息
app.use(async (ctx, next) => {
    let params = {}

    const auth = ctx.get('Authorization').split(' ')[1]
    const [username, password] = Buffer.from(auth, 'base64').toString('ascii').split(':')

    logger.info('Authorization: ', ctx.get('Authorization'), username, password)

    if (username) {
        params['UserName'] = username
    }
    if (password) {
        params['PassWord'] = password
    }

    ctx.request['authInfo'] = params

    await next();
})

app.use(async ctx => {
    const params = {
        ...ctx.request.query,
        ...ctx.request.body,
        ...ctx.request.authInfo,
    };

    ctx.body = params;
});

app.listen(5000, () => {
    console.log("Server start at 5000...");
});

// 将主进程ID写入pid文件
const pidfile = path.join(__dirname, "app.pid");
fs.writeFileSync(pidfile, process.pid);

// 脚本停止或重启应用时删除pid文件
process.on("SIGTERM", () => {
    if (fs.existsSync(pidfile)) {
        fs.unlinkSync(pidfile);
    }
    process.exit(0);
});
```

[HTTP 身份验证 - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication)
