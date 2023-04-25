---
type: blog
status: 未发布
created: 2023-04-25 21:24:46
updated: 2023-04-25 21:24:46
tags: [springboot, 问题]
categories: [问题记录]
---

## 问题描述

在开发过程中用到了 `mybatis-plus`，启动时爆出如下错误，因怀疑是 `springboot` 和 `mybatis-plus` 版本不兼容所致，将 `springboot` 从 `3` 版本调至了 `2` 版本，重启后发现正常启动。

![](附件/image/springboot%203%20自动装配方式更改_image_1.png)

## 解决方法

网上搜索之后返现原因是 `springboot` 更改了启动时的自动装配方式，在 `2.7` 版本就不推荐使用 `spring.factories` 的方式进行自动装配了，在 `springboot 3` 将彻底移除对 `/META-INF/spring.factories` 的支持。

![](附件/image/springboot%203%20自动装配方式更改_image_2.png)

根据 `springboot 2.7` 的版本说明：[Spring Boot 2.7 Release Notes · spring-projects/spring-boot Wiki · GitHub](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.7-Release-Notes#changes-to-auto-configuration)，可以得知自动配置的文件被移动到了 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 中，文件格式是每行写一个自动配置类。

![](附件/image/springboot%203%20自动装配方式更改_image_3.png)

```
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration
org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration
org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration
```

## 参考资料

- [spring.factories要被弃用了，快来Get新写法！-Spring专区论坛-技术干货-SpringForAll社区](http://spring4all.com/forum-post/1638)
