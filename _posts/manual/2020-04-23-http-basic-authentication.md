---
title: HTTP Basic 身份验证
tags: [http]
---

# HTTP Basic 身份验证

![HTTP Basic Auth]({{site.url}}/resources/images/manual/HTTPAuth.png)

## Nginx Basic Auth 配置

```
location / {
    auth_basic "authentication required ";
    auth_basic_user_file /etc/nginx/conf.d/htpasswd;
    try_files $uri /index.html;
}
```

`/etc/nginx/conf.d/htpasswd` 文件中包含用户信息，生成方法为：

    printf "username:$(openssl passwd -crypt password)\n" >> /etc/nginx/conf.d/htpasswd

## Koa 获取 Basic Auth 用户信息

Koa 读取 HTTP Authorization 请求头，并获取用户信息

``` javascript
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
```

## Flask Basic Auth 实现

``` python
from flask import Flask, request, jsonify
app = Flask(__name__)


users = {
    'bob': 'bobpass',
    'neo': 'neopass',
}


def unauthorized(message):
    response = jsonify({'error': 'unauthorized', 'message': message})
    response.status_code = 401
    return response


@app.before_request
def authorization():
    # 验证用户信息
    if request.authorization:
        username = request.authorization.username
        password = request.authorization.password
        if password is not None and users.get(username) == password:
            print(f'{username} authorization')
            return None

    # 没有携带用户信息，获取用户信息不匹配，返回 401
    return (
        unauthorized('Invalid credentials'),
        401,
        {'WWW-Authenticate': 'Basic realm="Login Required"'}
    )


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
```

## 参考

- HTTP 身份验证: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication

