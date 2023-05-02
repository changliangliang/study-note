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

所以 `SpringBoot` 对统一异常处理提供了支持，