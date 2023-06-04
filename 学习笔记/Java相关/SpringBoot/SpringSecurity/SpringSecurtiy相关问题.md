---
type: note
created: 2023-06-04 15:32:56
updated: 2023-06-04 15:32:56
tags: []
categories: []
---

### 问题 1：后只有 get 接口可以使用，post 等接口失效

#### 问题描述：

使用 SpringSecurity 后访问接口，只有 get 方法的请求可以返回正确结果，其他方法的请求无法使用，返回内容如下：

```json
{
  "timestamp": "2021-08-01T11:27:50.173+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Forbidden",
  "path": "/admin/tags/1419300249225678849"
}
```

#### 问题原因：

但是 springSecurity 在 2.0 之后会默认自动开启 CSRF 跨站防护，而一旦开启了 CSRF，所有经的 http 请求以及资源都被会 CsrfFilter 拦截，仅仅 GET|HEAD|TRACE|OPTIONS 这 4 类方法会被放行。

#### 解决方案：

在配置文件中关闭 CSRF。

```java

http.csrf().disable();
```
