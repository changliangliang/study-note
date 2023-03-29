
---
status: 
type: note
---

![](附件/SpringMVC容器结构_image_1.png)

Spring Web 应用在启动的时候会将两个容器，一个容器由 `ContextLoaderListener` 创建，一个由 `DispatcherServlet` 创建。

`DispatcherServlet` 是整个 SpringMVC 的入口，它创建的容器主要用来存放与 SpringMVC 相关的类，如映射器、视图解析器和控制器等，`ContextLoaderListener` 创建的容器用来存放应用中其他的 Bean，主要是我们自己编写的，如 Dao 层和 Service 层的 Bean。`DispatcherServlet` 开始创建容器的时候会把 `ContextLoaderListener` 设置为自己的父容器，所以 `ContextLoaderListener` 容器对 `DispatcherServlet` 容器是可见的。
