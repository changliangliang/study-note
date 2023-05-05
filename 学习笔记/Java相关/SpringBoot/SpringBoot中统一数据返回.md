---
type: note
created: 2023-05-04 20:53:27
updated: 2023-05-04 20:53:27
tags: []
categories: [SpringBoot]
---

## 为什么要统一封装接口返回数据

现在大多数项目采用前后端分离的模式进行开发，使用统一的数据有利于前后端之间的信息交互。以查询某个用户接口而言，如果没有对返回数据进行封装，没有出现异常时返回结果可能如下：

```json
{
  "userId": 1,
  "userName": "chang"
}
```

出现异常时可能返回的结果为：

```json
{
  "code": 200,
  "message": "用户不存在"
}
```

由于成功和失败时返回的数据不同，那么前端接收到数据后需要额外的判断，当前数据是成功时的数据还是失败时的数据。不同的接口返回的数据各不相同，要对每个接口都进行判断时间很繁琐的事情。

如果对数据进行一个统一封装，就可以很好的解决这个问题，看下面的数据返回形式，根据返回数据中的 `code` 可以判断当前请求是成功还是失败，如果成功可从 `data` 中获取请求结构，如果失败则可从 `message` 中获取失败信息。

```json
// 成功时返回的数据
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 1,
    "userName": "赵一"
  }
}

// 异常时返回的数据
{
  "code": 300,
  "message": "用户不存在",
  "data": null
} 
```

## 实现案例

### 状态码封装

可以将所有的状态码和对应的信息放到一个枚举类中，方便进行修改：

```java
public enum CodeEnum {

    SUCCESS(200，"操作成功！"), FAIL(300, "操作失败！");

    private int value;

	private String message;

    CodeEnum(int value, String message) {
        this.value = value;
        this.message = message;
    }

    public int getValue() {
        return value;
    }

	public Strign getMessage() {
		return message;
	}
}
```

### 返回内容封装

接着定义统一的返回数据，可以根据自己的需求定义其中包含的信息，因为返回的真实数据类型多种多用，这里使用到了泛型，同时为了方便我们还能添加几个静态方法用于构造返回结果。

```java

public class Result<T> {

    private int code;

    private String message;

    private T data;

    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <E> Result<E> ok(String message, E data) {
        return new Result<>(CodeEnum.SUCCESS.getValue(), message, data);
    }

    public static <E> Result<E> fail(String message) {
        return new Result<>(CodeEnum.FAIL.getValue(), message, null);
    }

	public static <E> Result<E> fail() {
        return new Result<>(CodeEnum.FAIL.getValue(), CodeEnum.FAIL.getMessage(), null);
    }
}
```

### 接口返回

```java
@Operation(summary = "获取用户信息")
@GetMapping("/{id}")
public Result<User> getUser( @PathVariable("id") int id) {
	User user = userService.getById(id);
	return Result.ok(null, user);
}
```
