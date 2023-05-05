---
type: note
created: 2023-05-04 15:53:04
updated: 2023-05-04 15:53:04
tags: []
categories: []
---

## 默认表现

当请求出现错误时 SpringBoot 会进行默认的异常处理，可能会返回一个错误页面或者 `json` 数据，则取决于请求的数据类型。

![](附件/image/SpringBoot中默认的异常处理_image_1.png)

![](附件/image/SpringBoot中默认的异常处理_image_2.png)

## 执行流程

在错误自动配置文件 `ErrorMvcAutoConfiguration` 中，自动配置了以下组件：

![](附件/image/SpringBoot中默认的异常处理_image_3.png)

![](附件/image/SpringBoot中默认的异常处理_image_3.png)

![](附件/image/SpringBoot中默认的异常处理_image_4.png)

![](附件/image/SpringBoot中默认的异常处理_image_5.png)

一但系统出现 `4xx` 或者 `5xx` 之类的错误，SpringBoot 会将错误抛给 Tomcat，Tomcat 会将请求转发到 `ErrorPageCustomizer` 配置的路径，默认是 `/error`。请求会被 `BasicErrorController` 处理，如果请求的是 `html`，将会由 `DefaultErrorViewResolver` 解析得到的对应的视图（模板中写的 `4xx` 或 `5xx` 开头的页面），如果请求的是 `json`，则会直接返回数据。

![](附件/image/SpringBoot中默认的异常处理_image_6.png)

![](附件/image/SpringBoot中默认的异常处理_image_7.png)

![](附件/image/SpringBoot中默认的异常处理_image_8.png)

无论是返回 `html` 还是 `json`，其中的数据都通过 `DefaultErrorAttributes` 获得：

![](附件/image/SpringBoot中默认的异常处理_image_9.png)

## 定制返回页面

### 定制错误的页面

有模板引擎的情况下会返回，SpringBoot 最终会解析到的视图页面为 `error/状态码.html`，将错误页面命名为 `错误状态码.html` 放在模板引擎文件夹里面的 `error` 文件夹下，发生此状态码的错误就会来到对应的页面，在页面中可以获得的信息：

| 信息      | 含义     |
| --------- | -------- |
| timestamp | 时间戳   |
| status    | 状态码   |
| error     | 错误名称   |
| exception | 异常类型     |
| message   | 异常消息 |
| trace     | 错误堆栈   |
| path          |路径信息          |

没有使用模板引擎，或者模板引擎找不到对应的错误页面，将会在静态资源文件夹下找对应的页面，命名方式仍然为 `错误状态码.html`。如果还是没有找到，将返回 SpringBoot 默认的页面：

![](附件/image/SpringBoot中默认的异常处理_image_10.png)

### 添加额外数据

如果想在返回的 `html` 页面或 `json` 中添加额外的数据，根据错误的处理流程，我们可以实现一个
`DefaultErrorAttributes` 的子类，重写其中的 `getErrorAttributes` 方法。

```java
@Component
public class MyErrorAttributes  extends DefaultErrorAttributes {
    @Override
    public Map<String, Object> getErrorAttributes(WebRequest webRequest, boolean includeStackTrace) {
        Map<String, Object> map = super.getErrorAttributes(webRequest, includeStackTrace);
        if ((Integer)map.get("status") == 500) {
            map.put("message", "服务器内部错误!");
        }
        return map;
    }
}
```

## 统一异常处理

目前在开发过程中很少直接使用 SpringBoot 中默认的异常处理机制，因为处理起来不过灵活，统一异常处理是目前比较推荐的方法，跟多详细内容见：[SpringBoot统一异常处理](学习笔记/Java相关/SpringBoot/SpringBoot统一异常处理.md)。

```java
@ControllerAdvice
@ResponseBody
public class WebExceptionHandler {

    @ExceptionHandler
    public ResultBean unknownAccount(UnknownAccountException e) {
        log.error("账号不存在", e);
        return ResultBean.error(1, "账号不存在");
    }

    @ExceptionHandler
    public ResultBean incorrectCredentials(IncorrectCredentialsException e) {
        log.error("密码错误", e);
        return ResultBean.error(-2, "密码错误");
    }

    @ExceptionHandler
    public ResultBean unknownException(Exception e) {
        log.error("发生了未知异常", e);
        // 发送邮件通知技术人员.
        return ResultBean.error(-99, "系统出现错误, 请联系网站管理员!");
    }
}
```

## Springboot 如何跳转到 `/error`

Springboot 在启动的时候会默认添加下面这三个异常解析器，如果这几个异常解析器都没有处理异常，那么异常将抛给 Tomcat：

* `ExceptionHandlerExceptionResolver`：处理 `@ExceptionHandler` 注解
* `ResponseStatusExceptionResolver`：处理 `@ResponseStatus` 注解
* `DefaultHandlerExceptionResolver`：处理 SpringMVC 标准异常异常

在 Tomcat 中的 `web.xml` 异常处理配置如下图所示，可以根据错误代码处理异常，也可以根据异常类型处理异常。

![](附件/image/SpringBoot中默认的异常处理_image_11.png)

![](附件/image/SpringBoot中默认的异常处理_image_12.png)

SpringBoot 中 Tomcat 是以内嵌容器的形式出现的，所以将错误配置抽象成了 `ErrorPage` 类，而前文中的 `ErrorPageCustomizer` 就是用来配置 `ErrorPage` 的，它会读取配置文件中的 `server.error.path`，该值默认为 `/error`。

![](附件/image/SpringBoot中默认的异常处理_image_13.png)

![](附件/image/SpringBoot中默认的异常处理_image_14.png)
