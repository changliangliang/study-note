---
type: note
created: 2023-05-13 15:42:12
updated: 2023-05-13 15:42:12
tags: []
categories: []
---

## 依赖

在 SpringBoot 中使用 SpringSecurity 只需要引入如下依赖即可，其中包含了对 SpringSecurity 的自动配置。

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```



## 过滤器链

在 Tomcat 之类的 web 容器中，用户请求在被 Servlet 处理之前会首先通过一组过滤器，在过滤器中可以更改用户请求或者拦截请求，

![](附件/image/SpringSecurity配置_image_1.png)
