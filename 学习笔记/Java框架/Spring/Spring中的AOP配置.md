---
type: blog
created: 2023-03-14 21:19:41
updated: 2023-03-14 21:19:41
tags: [Spring]
categories: [Spring学习笔记]
---

## 基于注解的配置

### 启用@AspectJ 支持

`Spring` 中使用 `@AspectJ` 切面，所以首先需要启用，下面展示了 `java` 和 `xml` 两种配置方式。

```java
@Configuration
@EnableAspectJAutoProxy
public class AppConfig {

}
```

```xml
<aop:aspectj-autoproxy/>
```

### 声明切面

启用 `@AspectJ` 支持后，`Spring` 会自动检测应用程序上下文中使用 `@AspectJ` 注解的 `Bean` 作为切面用于配置 Spring AOP，该 `bean` 和普通的类一样，可以有自己的方法和属性。

```xml
<bean id="myAspect" class="org.xyz.NotVeryUsefulAspect">
    <!-- configure properties of the aspect here -->
</bean>
```

```java
package org.xyz;
import org.aspectj.lang.annotation.Aspect;

@Aspect
public class NotVeryUsefulAspect {

}
```

### 声明切入点

在切面的方法上添加 `@Pointcut` 注解用于表示一个切面，下面的示例定义一个名为 `anyOldTransfer` 的切入点，该切入点与任何名为 `transfer` 的方法的执行相匹配。

```java
@Pointcut("execution(* transfer(..))")// the pointcut expression
private void anyOldTransfer() {}// the pointcut signature
```

Spring AOP 支持以下在切入点表达式中使用的 `AspectJ` 切入点指示符如下：

* `execution`：用于匹配方法执行的连接点。这是使用 Spring AOP 时要使用的主要切入点指示符。
* `within`：将匹配限制为某些类型内的连接点 (使用 Spring AOP 时，在匹配类型内声明的方法的执行)。
* `this`：将匹配限制为连接点 (使用 Spring AOP 时方法的执行)，其中 bean 引用 (Spring AOP 代理) 是给定类型的实例。
* `target`：将目标对象 (正在代理的应用程序对象) 是给定类型的实例的连接点 (使用 Spring AOP 时，方法的执行) 限制为匹配。
* `args`：将参数限制为给定类型的实例的连接点 (使用 Spring AOP 时方法的执行) 限制匹配。
* `@target`：将执行对象的类具有给定类型的注解的连接点 (使用 Spring AOP 时，方法的执行) 限制为匹配。
* `@args`：限制匹配的连接点 (使用 Spring AOP 时方法的执行)，其中传递的实际参数的运行时类型具有给定类型的 注解。
* `@within`：将匹配限制为具有给定注解的类型内的连接点 (使用 Spring AOP 时，使用给定注解的类型中声明的方法的执行)。
* `@annotation`：将匹配限制为连接点的主题 (在 Spring AOP 中正在执行的方法) 具有给定注解的连接点。

#### 切入点示例

* 任何公共方法的执行：

```java
execution(public * *(..))
```

* 名称以 `set` 开头的任何方法的执行：

```java
execution(* set*(..))
```

* `AccountService` 接口定义的任何方法的执行：

```java
execution(* com.xyz.service.AccountService.*(..))
```

* `service` 软件包中定义的任何方法的执行：

```java
execution(* com.xyz.service.*.*(..))
```

* 服务包或其子包之一中定义的任何方法的执行：

```java
execution(* com.xyz.service..*.*(..))
```

* 服务包中的任何连接点 (仅在 Spring AOP 中执行方法)：

```java
within(com.xyz.service.*)
```

* 服务包或其子包之一中的任何连接点 (仅在 Spring AOP 中执行方法)：

```java
within(com.xyz.service..*)
```

* 代理实现 `AccountService` 接口的任何连接点 (仅在 Spring AOP 中执行方法)：

```java
this(com.xyz.service.AccountService)
```

* 目标对象实现 `AccountService` 接口的任何连接点 (仅在 Spring AOP 中执行方法)：

```java
target(com.xyz.service.AccountService)
```

* 任何采用单个参数且运行时传递的参数为 `Serializable` 的连接点 (仅在 Spring AOP 中是方法执行)：

```java
args(java.io.Serializable)
```

* 目标对象带有 `@Transactional` 注解的任何连接点 (仅在 Spring AOP 中执行方法)：

```java
@target(org.springframework.transaction.annotation.Transactional)
```

* 目标对象的声明类型具有 `@Transactional` 注解 的任何连接点 (仅在 Spring AOP 中是方法执行)：

```java
@within(org.springframework.transaction.annotation.Transactional)
```

* 执行方法带有 `@Transactional` 注解的任何连接点 (仅在 Spring AOP 中是方法执行)：

```java
@annotation(org.springframework.transaction.annotation.Transactional)
```

* 任何采用单个参数且传递的参数的运行时类型具有 `@Classified` 注解 的连接点 (仅在 Spring AOP 中是方法执行)。

```java
@args(com.xyz.security.Classified)
```

* 名为 `tradeService` 的 Spring bean 上的任何连接点 (仅在 Spring AOP 中执行方法)：

```java
bean(tradeService)
```

* Spring Bean 上具有与通配符表达式 `*Service` 匹配的名称的任何连接点 (仅在 Spring AOP 中是方法执行)：

```java
bean(*Service)
```

#### 组合切入点

```java
@Pointcut("execution(public * *(..))")
private void anyPublicOperation() {} (1)

@Pointcut("within(com.xyz.someapp.trading..*)")
private void inTrading() {} (2)

@Pointcut("anyPublicOperation() && inTrading()")
private void tradingOperation() {} (3)
```

* **(1)** `anyPublicOperation` 匹配方法执行联接点是否表示任何公共方法的执行。
* **(2)** `inTrading` 如果 Transaction 模块中有方法执行则匹配。
* **(3)** `tradingOperation` 匹配，如果方法执行代表 Transaction 模块中的任何公共方法。

### 通知

#### 前置通知

前置通知在目标方法执行前执行。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

@Aspect
public class BeforeExample {

    @Before("com.xyz.myapp.SystemArchitecture.dataAccessOperation()")
    public void doAccessCheck() {
        // ...
    }

}
```

#### 返回通知

后置通知在方法执行后通知。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.AfterReturning;

@Aspect
public class AfterReturningExample {

    @AfterReturning("com.xyz.myapp.SystemArchitecture.dataAccessOperation()")
    public void doAccessCheck() {
        // ...
    }

}
```

可以捕获目标方法的返回值。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.AfterReturning;

@Aspect
public class AfterReturningExample {

    @AfterReturning(
        pointcut="com.xyz.myapp.SystemArchitecture.dataAccessOperation()",
        returning="retVal")
    public void doAccessCheck(Object retVal) {
        // ...
    }

}
```

#### 异常通知

在目标方法抛出错误时执行，可以对抛出的异常进行指定。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.AfterThrowing;

@Aspect
public class AfterThrowingExample {

    @AfterThrowing(
        pointcut="com.xyz.myapp.SystemArchitecture.dataAccessOperation()",
        throwing="ex")
    public void doRecoveryActions(DataAccessException ex) {
        // ...
    }

}
```

#### 最终通知

目标方法后执行后，并且无论目标方法是否出现异常都会执行。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.AfterReturning;

@Aspect
public class AfterReturningExample {

    @AfterReturning("com.xyz.myapp.SystemArchitecture.dataAccessOperation()")
    public void doAccessCheck() {
        // ...
    }

}
```

#### 环绕通知

方法的第一个参数必须为 `ProceedingJoinPoint` 类型，在 `ProceedingJoinPoint` 上调用 `proceed()` 会使底层方法执行。`proceed` 方法也可以传入 `Object[]`，数组中的值用作方法执行时的参数。

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.ProceedingJoinPoint;

@Aspect
public class AroundExample {

    @Around("com.xyz.myapp.SystemArchitecture.businessService()")
    public Object doBasicProfiling(ProceedingJoinPoint pjp) throws Throwable {
        // start stopwatch
        Object retVal = pjp.proceed();
        // stop stopwatch
        return retVal;
    }

}
```

#### 访问 JoinPoint

任何通知方法都可以将类型 `org.aspectj.lang.JoinPoint` 的参数声明为第一个参数，在环绕通知中必须声明类型 `JoinPoint` 的子类 `ProceedingJoinPoint` 的第一个参数。`JoinPoint` 接口提供了许多有用的方法：

* `getArgs()`：返回方法参数。
* `getThis()`：返回代理对象。
* `getTarget()`：返回目标对象。
* `getSignature()`：返回建议使用的方法的描述。
* `toString()`：打印有关所建议方法的有用描述。

#### 传递参数

切入点表达式的 `args(account,..)` 部分有两个作用。首先，它将匹配限制为仅方法采用至少一个参数并且传递给该参数的参数是 `Account` 的实例的方法执行。其次，它通过 `account` 参数使实际的 `Account` 对象可用于通知。

```java
@Before("com.xyz.myapp.SystemArchitecture.dataAccessOperation() && args(account,..)")
public void validateAccount(Account account) {
    // ...
}
```

```java
@Pointcut("com.xyz.myapp.SystemArchitecture.dataAccessOperation() && args(account,..)")
private void accountDataAccessOperation(Account account) {}

@Before("accountDataAccessOperation(account)")
public void validateAccount(Account account) {
    // ...
}
```

还可以使用 `argNames` 属性指明要传递的参数，如果第一个参数是 `JoinPoint`，`ProceedingJoinPoint` 或 `JoinPoint.StaticPart` 类型，则可以不用指出。

```java
@Before(value="com.xyz.lib.Pointcuts.anyPublicMethod() && target(bean) && @annotation(auditable)",
        argNames="bean,auditable")
public void audit(Object bean, Auditable auditable) {
    AuditCode code = auditable.value();
    // ... use code and bean
}
```

## 基于 XML 的配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd
 http://www.springframework.org/schema/aop
 http://www.springframework.org/schema/aop/spring-aop.xsd
 http://www.springframework.org/schema/context
 http://www.springframework.org/schema/context/spring-context.xsd
">

    <context:component-scan base-package="tech.pdai.springframework" />

    <aop:aspectj-autoproxy/>

    <!-- 目标类 -->
    <bean id="demoService" class="tech.pdai.springframework.service.AopDemoServiceImpl">
        <!-- configure properties of bean here as normal -->
    </bean>

    <!-- 切面 -->
    <bean id="logAspect" class="tech.pdai.springframework.aspect.LogAspect">
        <!-- configure properties of aspect here as normal -->
    </bean>

    <aop:config>
        <!-- 配置切面 -->
        <aop:aspect ref="logAspect">
            <!-- 配置切入点 -->
            <aop:pointcut id="pointCutMethod" expression="execution(* tech.pdai.springframework.service.*.*(..))"/>
            <!-- 环绕通知 -->
            <aop:around method="doAround" pointcut-ref="pointCutMethod"/>
            <!-- 前置通知 -->
            <aop:before method="doBefore" pointcut-ref="pointCutMethod"/>
            <!-- 后置通知；returning属性：用于设置后置通知的第二个参数的名称，类型是Object -->
            <aop:after-returning method="doAfterReturning" pointcut-ref="pointCutMethod" returning="result"/>
            <!-- 异常通知：如果没有异常，将不会执行增强；throwing属性：用于设置通知第二个参数的的名称、类型-->
            <aop:after-throwing method="doAfterThrowing" pointcut-ref="pointCutMethod" throwing="e"/>
            <!-- 最终通知 -->
            <aop:after method="doAfter" pointcut-ref="pointCutMethod"/>
        </aop:aspect>
    </aop:config>

    <!-- more bean definitions for data access objects go here -->
</beans>
```
