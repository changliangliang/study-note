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

### 注解方式

在 SpringBoot 中使用定时任务需要添加 `@EnableScheduling` 注解，之后需要在方法上使用 `@Scheduled` 注解，其中 `cron` 属性为可以添加 `cron` 表达式。

```java
@SpringBootApplication
@EnableScheduling
@MapperScan("com.liang.cfile.mapper")
public class CflieApplication {
}
```

```java
@Scheduled(cron = "*/5 * * * * ?")
public void test() throws InterruptedException {
	System.out.println(Thread.currentThread() + "+++++++++++++");
}
```

### 接口方式

