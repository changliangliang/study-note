---
type: note
created: 2023-05-18 17:43:25
updated: 2023-05-18 17:43:25
tags: []
categories: []
---

## 默认处理

Jackson 是 SpringBoot 中默认的序列化工具，但是在使用的过程中发现对 `LocalDateTime` 类型的序列化存在一点问题。

```java

@Data
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String username;

    private String password;

    private String email;

    private LocalDateTime created;

    private LocalDateTime updated;

    private int deleted;

    private int role;
}
```

上面的 `User` 类实例被序列化后得到的 json 字符串可能为，其中 `LocalDateTime` 字段会被序列化为 `2023-04-29T11:05:58` 这样的格式。

```json
{
    "id": 1,
    "username": "chang",
    "password": "chang",
    "email": "changliangliang1996@fomxail.com",
    "created": "2023-04-29T11:05:58",
    "updated": "2023-04-29T11:06:00",
    "deleted": 0,
    "role": 0
}
```

## 全局修改

如果想要修改默认的日期格式，一种方式是创建 `ObjectMapper` 时针对 `LocalDateTime` 设置指定的序列化和反序列化器，如下面的代码所示，所有经过该 `objectMapper` 序列化的对象，其中 `LocalDateTime` 类型的属性都会按照我们设置的格式进行序列化。

```java
ObjectMapper objectMapper = new ObjectMapper();
        JavaTimeModule javaTimeModule = new JavaTimeModule();

        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        objectMapper.registerModule(javaTimeModule);
```

## 局部修改

如果仅想修改一部分日期的格式，可以使用 `@JsonFormat` 注解：

```java
@JsonFormat(pattern = "yyyy-MM-dd")
private LocalDateTime date;
```

或者使用 `@JsonSerialize` 指定一个序列化器，该序列化器我们可以自己实现：

```java
@JsonSerialize(using = LocalDateSerializer.class)
@JsonDeserialize(using = LocalDateDeserializer.class)
private LocalDateTime date;
```
