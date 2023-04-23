
---
type: blog
created: 2023-03-15 12:14:32
updated: 2023-03-15 12:19:56
tags: blog Spring
categories: Spring学习笔记
---

## 设置Profile

在实际的开发过程中，可能区分为开发环境、测试环境和生产环境，不同的环境中使用的 `Bean` 可能不同，Spring 中提供了 `@Profile` 注解来实现这一需求，该注解可用于类和方法。

```java
@Configuration
@Profile("development")
public class StandaloneDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }
}
```

```java
@Configuration
@Profile("production")
public class JndiDataConfig {

    @Bean(destroyMethod="")
    public DataSource dataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

```java
@Configuration
public class AppConfig {

    @Bean("dataSource")
    @Profile("development") (1)
    public DataSource standaloneDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }

    @Bean("dataSource")
    @Profile("production") (2)
    public DataSource jndiDataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

配置时可以使用如下逻辑符号，例如：`production & us-east`，但是多个混用时需要加括号`production & (us-east | eu-central)`

* `!`：配置文件的逻辑“非”
* `&`：配置文件的逻辑“与”
* `|`：配置文件的逻辑“或”

`xml`的配置如下：

```xml
<beans profile="development"
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:jdbc="http://www.springframework.org/schema/jdbc"
    xsi:schemaLocation="...">

    <jdbc:embedded-database id="dataSource">
        <jdbc:script location="classpath:com/bank/config/sql/schema.sql"/>
        <jdbc:script location="classpath:com/bank/config/sql/test-data.sql"/>
    </jdbc:embedded-database>
</beans>

<beans profile="production"
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:jee="http://www.springframework.org/schema/jee"
    xsi:schemaLocation="...">

    <jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/datasource"/>
</beans>
```

可以在一个文件中加入多个`beans`标签：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:jdbc="http://www.springframework.org/schema/jdbc"
    xmlns:jee="http://www.springframework.org/schema/jee"
    xsi:schemaLocation="...">

    <!-- other bean definitions -->

    <beans profile="development">
        <jdbc:embedded-database id="dataSource">
            <jdbc:script location="classpath:com/bank/config/sql/schema.sql"/>
            <jdbc:script location="classpath:com/bank/config/sql/test-data.sql"/>
        </jdbc:embedded-database>
    </beans>

    <beans profile="production">
        <jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/datasource"/>
    </beans>
</beans>
```

可以通过嵌套方式表达和的含义，不支持前面描述的配置文件表达式，但是可以使用`!`运算符取消配置文件。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:jdbc="http://www.springframework.org/schema/jdbc"
xmlns:jee="http://www.springframework.org/schema/jee"
xsi:schemaLocation="...">

<!-- other bean definitions -->

<beans profile="production">
<beans profile="us-east">
<jee:jndi-lookup id="dataSource" jndi-name="java:comp/env/jdbc/datasource"/>
</beans>
</beans>
</beans>
```

## 激活 Profile

**api方式**

```java
AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
ctx.getEnvironment().setActiveProfiles("profile1", "profile2");
ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
ctx.refresh();
```

**jvm属性配置**

```bash
-Dspring.profiles.active="profile1,profile2"
```

## 默认Profile

如果没有任何配置文件处于活动状态，则使用默认`profile`，可以通过在`Environment`上使用`setDefaultProfiles()`或在`jvm`中使用`spring.profiles.default`属性来更改默认配置文件的名称。

```java
@Configuration
@Profile("default")
public class DefaultDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .build();
    }
}
```

## MessageSource 进行国际化

`ApplicationContext`接口扩展了名为`MessageSource`的接口，因此提供了国际化功能。 `Spring`还提供了`HierarchicalMessageSource`接口，该接口可以分层解析消息。加载`ApplicationContext`时，它将自动搜索上下文中定义的`MessageSource` `bean`。 `Bean`必须具有名称`messageSource`。如果找到了这样的`bean`，则对先前方法的所有调用都将委派给消息源。如果找不到消息源，则`ApplicationContext`尝试查找包含同名`bean` 的父对象。如果是这样，它将使用该 `bean` 作为`MessageSource`。如果`ApplicationContext`找不到任何消息源，则实例化一个空的`DelegatingMessageSource`以便能够接受对上面定义的方法的调用。

Spring 提供了两个`MessageSource`实现`ResourceBundleMessageSource`和`StaticMessageSource`。两者都实现`HierarchicalMessageSource`以便进行嵌套消息传递。 `StaticMessageSource`很少使用，但提供了将消息添加到源中的编程方式。以下示例显示`ResourceBundleMessageSource`：

```xml
<beans>
    <bean id="messageSource"
            class="org.springframework.context.support.ResourceBundleMessageSource">
        <property name="basenames">
            <list>
                <value>format</value>
                <value>exceptions</value>
                <value>windows</value>
            </list>
        </property>
    </bean>
</beans>
```

```
# in exceptions.properties
argument.required=The {0} argument is required.
```

```
# in exceptions.properties
argument.required=The {0} argument is required.
```

```java
public static void main(String[] args) {
    MessageSource resources = new ClassPathXmlApplicationContext("beans.xml");
    String message = resources.getMessage("message", null, "Default", null);
    System.out.println(message);
}
```

## 标准和自定义事件

`ApplicationContext`中的事件处理是通过`ApplicationEvent`类和`ApplicationListener`接口提供的。如果将实现`ApplicationListener`接口的 bean 部署到上下文中，则每次将`ApplicationEvent`发布到`ApplicationContext`时，都会通知该 bean。

| Event | Explanation                                                                                                                                                                                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ContextRefreshedEvent`      | 在初始化或刷新`ApplicationContext`时发布(例如，通过使用`ConfigurableApplicationContext`接口上的`refresh()`方法)。在这里，“已初始化”是指所有 Bean 都已加载，检测到并激活了后处理器 Bean，已预先实例化单例，并且已准备好使用`ApplicationContext`对象。只要尚未关闭上下文，只要选定的`ApplicationContext`实际上支持这种“热”刷新，就可以多次触发刷新。例如，`XmlWebApplicationContext`支持热刷新，但`GenericApplicationContext`不支持。 |
| `ContextStartedEvent`      | 在`ConfigurableApplicationContext`界面上使用`start()`方法启动`ApplicationContext`时发布。在这里，“启动”是指所有`Lifecycle` bean 都收到一个明确的启动 signal。通常，此 signal 用于在显式停止后重新启动 Bean，但也可以用于启动尚未配置为自动启动的组件(例如，尚未在初始化时启动的组件)。                                                            |
| `ContextStoppedEvent`      | 在`ConfigurableApplicationContext`接口上使用`stop()`方法停止`ApplicationContext`时发布。此处，“已停止”表示所有`Lifecycle` bean 都收到一个明确的停止 signal。停止的上下文可以通过`start()`调用重新启动。                                                                                                                                                   |
| `ContextClosedEvent`      | 在`ConfigurableApplicationContext`接口上使用`close()`方法关闭`ApplicationContext`时发布。此处，“封闭”表示所有单例 bean 都被破坏。封闭的情境到了生命的尽头。无法刷新或重新启动。                                                                                                                                                        |
| `RequestHandledEvent`      | 一个特定于 Web 的事件，告诉所有 Bean HTTP 请求已得到服务。请求完成后，将发布此事件。此事件仅适用于使用 Spring 的`DispatcherServlet`的 Web 应用程序。                                                                                                                                           |

可以创建和发布自己的自定义事件：

```java
public class BlackListEvent extends ApplicationEvent {

    private final String address;
    private final String content;

    public BlackListEvent(Object source, String address, String content) {
        super(source);
        this.address = address;
        this.content = content;
    }

    // accessor and other methods...
}
```

要发布自定义`ApplicationEvent`，请在`ApplicationEventPublisher`上调用`publishEvent()`方法。通常，这是通过创建一个实现`ApplicationEventPublisherAware`的类并将其注册为`Spring` `bean`来完成的。

```java
public class EmailService implements ApplicationEventPublisherAware {

    private List<String> blackList;
    private ApplicationEventPublisher publisher;

    public void setBlackList(List<String> blackList) {
        this.blackList = blackList;
    }

    public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    public void sendEmail(String address, String content) {
        if (blackList.contains(address)) {
            publisher.publishEvent(new BlackListEvent(this, address, content));
            return;
        }
        // send email...
    }
}
```

在配置时，Spring 容器检测到`EmailService`实现`ApplicationEventPublisherAware`并自动调用`setApplicationEventPublisher()`。实际上，传入的参数是 Spring 容器本身。您正在通过其`ApplicationEventPublisher`接口与应用程序上下文进行交互。要接收自定义`ApplicationEvent`，可以创建一个实现`ApplicationListener`的类并将其注册为 Spring Bean。

```java
public class BlackListNotifier implements ApplicationListener<BlackListEvent> {

    private String notificationAddress;

    public void setNotificationAddress(String notificationAddress) {
        this.notificationAddress = notificationAddress;
    }

    public void onApplicationEvent(BlackListEvent event) {
        // notify appropriate parties via notificationAddress...
    }
}
```

可以使用注解来实现监听。

```java
public class BlackListNotifier {

    private String notificationAddress;

    public void setNotificationAddress(String notificationAddress) {
        this.notificationAddress = notificationAddress;
    }

    @EventListener
    public void processBlackListEvent(BlackListEvent event) {
        // notify appropriate parties via notificationAddress...
    }
}
```

```java
@EventListener(condition = "#blEvent.content == 'my-event'")
public void processBlackListEvent(BlackListEvent blEvent) {
    // notify appropriate parties via notificationAddress...
}
```

可以对特定事件进行监听。

| Name            | Location           | Description                                                                                                                     | Example                          |
| ----------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Event           | root object        | 实际的`ApplicationEvent`。                                                                                                                        | `#root.event`                                 |
| Arguments array | root object        | 用于调用目标的参数(作为数组)。                                                                                                  | `#root.args[0]`                                 |
| *Argument name*                | evaluation context | 任何方法参数的名称。如果由于某种原因名称不可用(例如，因为没有调试信息)，则参数名称也可以在`#a<#arg>`下获得，其中`#arg`代表参数索引(从 0 开始)。 | `#blEvent`或`#a0`(您也可以使用`#p0`或`#p<#arg>`表示法作为别名) |