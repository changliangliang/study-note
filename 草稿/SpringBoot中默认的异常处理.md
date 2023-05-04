---
type: note
date: 2023-05-04 15:53:04
update: 2023-05-04 15:53:04
tags: []
categories: []
---

## 默认表现

当请求出现错误时 SpringBoot 会进行默认的异常处理，可能会返回一个错误页面或者 `json` 数据，则取决于请求的数据类型。

![](附件/image/SpringBoot中默认的异常处理_image_1.png)

![](附件/image/SpringBoot中默认的异常处理_image_2.png)

## 原理

在错误自动配置文件 `ErrorMvcAutoConfiguration` 中，自动配置了以下组件：

![](附件/image/SpringBoot中默认的异常处理_image_3.png)

![](附件/image/SpringBoot中默认的异常处理_image_3.png)

![](附件/image/SpringBoot中默认的异常处理_image_4.png)

![](附件/image/SpringBoot中默认的异常处理_image_5.png)

一但系统出现 `4xx` 或者 `5xx` 之类的错误，SpringBoot 会将错误抛给 Tomcat，Tomcat 会将请求转发到 `ErrorPageCustomizer` 配置的路径，默认是 `/error` 。请求会被 `BasicErrorController` 处理，如果请求的是 `html` ，将会由 `DefaultErrorViewResolver` 解析得到的。

![](附件/image/SpringBoot中默认的异常处理_image_6.png)

![](附件/image/SpringBoot中默认的异常处理_image_7.png)