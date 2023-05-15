---
type: note
created: 2023-05-15 13:22:14
updated: 2023-05-15 13:22:14
tags: []
categories: []
---

## 异步任务

在 SpringBoot 要启用异步任务需要在配置类上添加 `@EnableAsync` 注解，之后在需要异步执行的方法上添加 `@Async` 注解，当该方法被调用是就会在其他线程中执行。

```java
@SpringBootApplication
@EnableAsync
@MapperScan("com.liang.cfile.mapper")
public class CflieApplication {
}
```

```java
@Async
public void test() throws InterruptedException {
	Thread.sleep(1000);
	System.out.println(Thread.currentThread() + "+++++++++++++");
}
```


## 定时任务

