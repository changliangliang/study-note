---
type: note
created: 2023-05-15 10:16:37
updated: 2023-05-15 10:16:37
tags: []
categories: []
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

原因在于 `GenericJackson2JsonRedisSerializer` 不支持 `LocalDateTime` 的序列化，那么要解决这个问题可以添加一个针对 `LocalDateTime` 类型的序列化和反序列化器：

```java
ObjectMapper objectMapper = new ObjectMapper();
JavaTimeModule javaTimeModule = new JavaTimeModule();

javaTimeModule.addSerializer(LocalDateTime.class, new  LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
objectMapper.registerModule(javaTimeModule);
objectMapper.activateDefaultTyping(objectMapper.getPolymorphicTypeValidator(), ObjectMapper.DefaultTyping.EVERYTHING, JsonTypeInfo.As.PROPERTY);

GenericJackson2JsonRedisSerializer valueSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);
```

其中 `objectMapper.activateDefaultTyping(objectMapper.getPolymorphicTypeValidator(), ObjectMapper.DefaultTyping.EVERYTHING, JsonTypeInfo.As.PROPERTY)` 是为了在序列化时记录当前实例的类型，会以 `@class` 为 `key`。

```json
{
  "@class": "com.liang.cfile.entity.User",
  "id": 1,
  "username": "chang",
  "password": "chang",
  "email": "changliangliang1996@fomxail.com",
  "created": [
    "java.time.LocalDateTime",
    "2023-04-29"
  ],
  "updated": [
    "java.time.LocalDateTime",
    "2023-04-29 11:06:00"
  ],
  "deleted": 0,
  "role": 0
}
```
