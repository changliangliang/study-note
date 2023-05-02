---
type: note
date: 2023-05-02 15:55:09
update: 2023-05-02 16:23:08
tags: []
categories: []
---

## 为什么要统一处理异常

程序运行过程中可能会出现各种各样的错误，比如下面 `Controller` 中，业务处理过程中可能出现异常，那么在 `Controller` 中就必须捕获可能出现的异常并进行处理。

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping("add")
    public ResponseEntity<String> add( @RequestBody UserParam userParam) {
    
        try {
            // 业务处理
        } catch(Exception e) {
            // 处理异常;
        }
        return ResponseEntity.ok("success");
    }
}
```

这样的处理方式有两个缺陷：

- 如果需要处理的异常比较多，那么代码中会充斥这大量的 `try...catch...` 语句；
- 如果要改变某种异常的处理方式，需要在多处进行修改，可能会出现遗漏的情况。

为了解决以上问题， `SpringBoot` 对统一异常处理提供了支持：

## 基于 @ControllerAdvice 实现异常统一处理

`SpringBoot` 中异常统一处理使用到了 `@ControllerAdvice` 注解和 `@ExceptionHandler` 注解，其中 `@ControllerAdvice` 用在类上表明该类用于给 `Controller` 添加统一的操作和处理，`@ExceptionHandler` 用在方法上表明该方法用于处理异常，并且可以指定处理哪种异常，如下面的代码中 `handler` 方法用于处理 `CustomizeException` 及其子类异常。

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ResponseBody
    @ExceptionHandler(CustomizeException.class)
    public Result<Object> handler(Exception e) {
        return Result.fail(e.getMessage());
    }
}
```

之后在 `Controller` 层中就可以把异常处理的代码去掉，当有异常发生时会自动

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping("add")
    public ResponseEntity<String> add( @RequestBody UserParam userParam) {
    
	    // 业务处理
        return ResponseEntity.ok("success");
    }
}
```