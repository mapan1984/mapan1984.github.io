---
title: Java Servlet
tags: [Java, Servlet]
---

## Servlet

Servlet 是一个标准规范，类似 Python 的 WSGI，规定了 Web 服务器如何调用 Web 应用程序的代码，Servlet 接口的定义如下：

``` java
package javax.servlet;

import java.io.IOException;

/**
 * Defines methods that all servlets must implement.
 *
 * <p>
 * A servlet is a small Java program that runs within a Web server. Servlets
 * receive and respond to requests from Web clients, usually across HTTP, the
 * HyperText Transfer Protocol.
 *
 * <p>
 * To implement this interface, you can write a generic servlet that extends
 * <code>javax.servlet.GenericServlet</code> or an HTTP servlet that extends
 * <code>javax.servlet.http.HttpServlet</code>.
 *
 * <p>
 * This interface defines methods to initialize a servlet, to service requests,
 * and to remove a servlet from the server. These are known as life-cycle
 * methods and are called in the following sequence:
 * <ol>
 * <li>The servlet is constructed, then initialized with the <code>init</code>
 * method.
 * <li>Any calls from clients to the <code>service</code> method are handled.
 * <li>The servlet is taken out of service, then destroyed with the
 * <code>destroy</code> method, then garbage collected and finalized.
 * </ol>
 *
 * <p>
 * In addition to the life-cycle methods, this interface provides the
 * <code>getServletConfig</code> method, which the servlet can use to get any
 * startup information, and the <code>getServletInfo</code> method, which allows
 * the servlet to return basic information about itself, such as author,
 * version, and copyright.
 *
 * @see GenericServlet
 * @see javax.servlet.http.HttpServlet
 */
public interface Servlet {

    /**
     * Called by the servlet container to indicate to a servlet that the servlet
     * is being placed into service.
     *
     * <p>
     * The servlet container calls the <code>init</code> method exactly once
     * after instantiating the servlet. The <code>init</code> method must
     * complete successfully before the servlet can receive any requests.
     *
     * <p>
     * The servlet container cannot place the servlet into service if the
     * <code>init</code> method
     * <ol>
     * <li>Throws a <code>ServletException</code>
     * <li>Does not return within a time period defined by the Web server
     * </ol>
     *
     *
     * @param config
     *            a <code>ServletConfig</code> object containing the servlet's
     *            configuration and initialization parameters
     *
     * @exception ServletException
     *                if an exception has occurred that interferes with the
     *                servlet's normal operation
     *
     * @see UnavailableException
     * @see #getServletConfig
     */
    public void init(ServletConfig config) throws ServletException;

    /**
     *
     * Returns a {@link ServletConfig} object, which contains initialization and
     * startup parameters for this servlet. The <code>ServletConfig</code>
     * object returned is the one passed to the <code>init</code> method.
     *
     * <p>
     * Implementations of this interface are responsible for storing the
     * <code>ServletConfig</code> object so that this method can return it. The
     * {@link GenericServlet} class, which implements this interface, already
     * does this.
     *
     * @return the <code>ServletConfig</code> object that initializes this
     *         servlet
     *
     * @see #init
     */
    public ServletConfig getServletConfig();

    /**
     * Called by the servlet container to allow the servlet to respond to a
     * request.
     *
     * <p>
     * This method is only called after the servlet's <code>init()</code> method
     * has completed successfully.
     *
     * <p>
     * The status code of the response always should be set for a servlet that
     * throws or sends an error.
     *
     *
     * <p>
     * Servlets typically run inside multithreaded servlet containers that can
     * handle multiple requests concurrently. Developers must be aware to
     * synchronize access to any shared resources such as files, network
     * connections, and as well as the servlet's class and instance variables.
     * More information on multithreaded programming in Java is available in <a
     * href
     * ="http://java.sun.com/Series/Tutorial/java/threads/multithreaded.html">
     * the Java tutorial on multi-threaded programming</a>.
     *
     *
     * @param req
     *            the <code>ServletRequest</code> object that contains the
     *            client's request
     *
     * @param res
     *            the <code>ServletResponse</code> object that contains the
     *            servlet's response
     *
     * @exception ServletException
     *                if an exception occurs that interferes with the servlet's
     *                normal operation
     *
     * @exception IOException
     *                if an input or output exception occurs
     */
    public void service(ServletRequest req, ServletResponse res)
            throws ServletException, IOException;

    /**
     * Returns information about the servlet, such as author, version, and
     * copyright.
     *
     * <p>
     * The string that this method returns should be plain text and not markup
     * of any kind (such as HTML, XML, etc.).
     *
     * @return a <code>String</code> containing servlet information
     */
    public String getServletInfo();

    /**
     * Called by the servlet container to indicate to a servlet that the servlet
     * is being taken out of service. This method is only called once all
     * threads within the servlet's <code>service</code> method have exited or
     * after a timeout period has passed. After the servlet container calls this
     * method, it will not call the <code>service</code> method again on this
     * servlet.
     *
     * <p>
     * This method gives the servlet an opportunity to clean up any resources
     * that are being held (for example, memory, file handles, threads) and make
     * sure that any persistent state is synchronized with the servlet's current
     * state in memory.
     */
    public void destroy();
}
```

javax 同时定义了 `javax.servlet.http.HttpServlet` 类和 `javax.servlet.annotation.WebServlet` 注解，帮助程序更方便的处理 http 请求。

``` java
@WebServlet(urlPatterns = "/")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("text/html");
        PrintWriter pw = resp.getWriter();
        pw.write("<h1>Hello, world!</h1>");
        pw.flush();
    }
}
```

## Servlet 容器

我们的程序只是根据 Servlet 定义和编写了处理 http 的方法，并没有启动服务的入口。

要想启动服务并开始处理 http 请求，要先启动 Web 服务器，由服务器处理 TCP 连接，解析 HTTP 协议，并加载我们编写的 Servlets，用对应的 Servlet 处理请求，获取响应，并实际的 http 响应返回。

支持 Servlet 接口的 Web 服务器又叫 Servlet 容器，常用的有：

- [Jetty](https://www.eclipse.org/jetty/) is an open source Java HTTP web server and a servlet container.
- [Tomcat](https://tomcat.apache.org/)

## JAX-RS

[jersey]


## war (web archivefile)

    jar -xf server.war


* META-INF
* WEB-INF
    * classes: java 类文件
    * lib: jar 文件
    * web.xml

