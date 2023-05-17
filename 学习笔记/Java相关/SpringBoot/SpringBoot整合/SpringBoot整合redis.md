---
type: note
created: 2023-05-15 10:16:37
updated: 2023-05-15 10:16:37
tags:
categories: 
---

## 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## 配置文件

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: 123456
    database: 0
```

## LocalDateTime 序列化失败