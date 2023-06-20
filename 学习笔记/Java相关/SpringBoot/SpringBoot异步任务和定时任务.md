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

接口方式实现定时任务可以向容器中添加一个 `SchedulingConfigurer` 类，比起注解方式它的优势是可以将任务执行时间放在数据库中，做到动态的修改任务的执行时间，不用每次更改都重启程序。

```java
@Bean
public SchedulingConfigurer schedulingConfigurer() {
    return new SchedulingConfigurer() {
        @Override
        public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
            taskRegistrar.addTriggerTask(new Runnable() {
                @Override
                public void run() {
                    // 需要执行的任务
                }
            }, new Trigger() {
                @Override
                public Date nextExecutionTime(TriggerContext triggerContext) {

                    // 返回下次执行的时间
                    // 可以动态的获取cron,比如放在数据库中
                    return new CronTrigger("cron").nextExecutionTime(triggerContext);
                }
            });
        }
    };
}
```
