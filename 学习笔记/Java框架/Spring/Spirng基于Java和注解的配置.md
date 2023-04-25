---
type: blog
created: 2023-03-13 21:19:41
updated: 2023-03-13 21:19:41
tags: [Spring]
categories: [Spring学习笔记]
---

## XML 开启注解支持

Spring 用 xml 配置是比较繁琐的，所以 Spring 由提供了另一种配置方法：注解配置。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd"
        xmlns:context="http://www.springframework.org/schema/context"
        contex:schemaLocation="http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">  
    <context:annotation-config/>
    <context:component-scan base-package="com.chang.pojo"/>

   
</beans>
```

* 在 spring 配置文件中引入 context 文件头

  ```xml
  xmlns:context="http://www.springframework.org/schema/context"
  contex:schemaLocation="http://www.springframework.org/schema/context
  http://www.springframework.org/schema/context/spring-context.xsd"
  ```

* 开启属性注解支持

  ```xml
  <context:annotation-config/>
  ```

* 配置自动扫描路径

  ```xml
  <context:component-scan base-package="com.chang.pojo"/>
  ```

  自动扫描可以设置排除策略，而且可以叠加使用。

  ```xml
  <context:component-scan base-package="com.chang.pojo">
      <exclude-filter type="" expression="" />
      <!--
   	type的值可以为：
  	assignable: 排除指定类型（expression指定要排除的类）
  	annotation: 排除特定注解（expression指定要排除的注解）
  	aspectj:    通过切入点表达式排除（expression指定切入点表达式，只能用包切入点或类切入点）
  	regex:      通过正则
  	custom:     自定义排除策略（一般用于框架底层开发）
  	-->
  </context:component-scan>
  ```

  类似的，还可以自定义包含策略，不过需要使用 `use-default-filters` 属性关闭默认的扫描策略。

  ```xml
  use-default-filters="false"使默认扫描策略失效
  <context:component-scan base-package="com.chang.pojo" use-default-filters="false">
      <include-filter type="" expression="" />
      <!--
   	type的值可以为和排除方式一样
  	-->
  </context:component-scan>
  ```

之后创建容器的过程和 xml 配置是一样的。

```java
ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:/bean.xml");
Object student = applicationContext.getBean("student");
System.out.println(student.getClass());
```

## @Configuration

到目前为止，Spring 的配置还是逃脱不了在 xml，那么有没有办法直接不使用 xml 呢？答案是有的，Spring 提供了一种完全使用 Java 类替代 xml 的方式。

首先需要创建一个配置类，然后给他添加一个 `@Configuration` 注解，这样这个类对 Spring 来说就是一个配置类了，它的作用就类似于前面的 xml 文件。

```java
@Configuration
public class RedisConfig {

}
```

相应的，容器的要从 `ClassPathXmlApplicationContext` 转化为 `AnnotationConfigApplicationContext`，使用方法大致如下。

```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

`AnnotationConfigApplicationContext` 容器可以接受 `@Configuration` 类，`@Component` 类和带有 `JSR-330` 元数据注解的类，接收 `@Configuration` 类时，`@Configuration` 类本身被注册为 `bean`，并且该类中所有已声明的 `@Bean` 方法也被注册 `bean`，如果接收了 `@Component` 和 `JSR-330` 类，它们将注册为 `bean`。

可以在开始的时候构建无参数的容器，之后再利用 `register` 方法对容器进行配置。

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.register(AppConfig.class, OtherConfig.class);
    ctx.register(AdditionalConfig.class);
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

## @ComponentScan

该注解的作用是指定需要扫描的包，等同于 `xml` 配置中的如下内容：

```xml
<context:component-scan base-package="com.chang.pojo"/>
```

与 xm 配置类似，`@ComponentScan` 也可以自定义扫描策略，用到了 `@Filter` 注解。

```java
@Configuration
@ComponentScan(basePackages = "org.example",
        includeFilters = @Filter(type = FilterType.REGEX, pattern = ".*Stub.*Repository"),
        excludeFilters = @Filter(Repository.class))
public class AppConfig {
    ...
}
```

```xml
<beans>
    <context:component-scan base-package="org.example">
        <context:include-filter type="regex"
                expression=".*Stub.*Repository"/>
        <context:exclude-filter type="annotation"
                expression="org.springframework.stereotype.Repository"/>
    </context:component-scan>
</beans>
```

`@Filter` 中的类型有以下几种选择：

* `FilterType.ANNOTATION`：被注解标识的类。
* `FilterType.ASSIFNABLE`：类的子类或者接口的实现。
* `FilterType.ASPECTJ`：匹配给定的 Aspectj 表达式的类。
* `FilterType.REGEX`：类名与给定正则表达式匹配的类。
* `FilterType.CUSTOM`：自己实现 `org.springframework.core.type .TypeFilter` 接口。

使用容器的 `scan` 方法也可以实现类似功能。

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.scan("com.acme");
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
}
```

## @ImportResource 注解

如果已经有了部分 xml 配置文件，又想使用 Java 注解配置，那么可以使用该注解，它的作用是将 xml 配置导入容器中，不过需要注意的是，xml 的配置优先级要高于其他配置，如果 xml 配置和注解配置中存在了相同 `id` 的 `bean`，那么会以 xml 配置为准。

```java
@Configuration
@ImportResource("classpath:/com/acme/properties-config.xml")
public class AppConfig {

    @Value("${jdbc.url}")
    private String url;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        return new DriverManagerDataSource(url, username, password);
    }
}
```

## @Component

`@Component` 注解相当于 spring 配置文件中的 `bean` 标签，如果扫描路径下的类添加了该注解，那么 Spring 会把它添加到容器中。

```xml
<bean id="user" class="User"/>
```

`bean` 的默认 `id` 为类名首字母小写，可以用 `@Component` 注解的 `value` 属性自定义类的 `id` 值。如果 xml 配置文件中配置了相同 `id` 的 `bean`，注解配置会被 xml 配置覆盖。

```java
@Component(value="UserOne")
public class User {
    public String name = "chang";
}
```

`@Component` 有三个衍生注解，目的是为了更好的进行分层，目前使用哪一个功能都一样。

* `@Controller`：一般用于 web 层。
* `@Service`：一般位于 service 层。
* `@Repository`：一般位于 dao 层。

## @scope 注解

该注解用于控制 `bean` 是单实例还是多实例：

* `singleton`：单实例模式，默认情况下 Spring 会采用该模式创建对象，关闭 Spring 容器时，`bean` 会被销毁。
* `prototype`：多例模式，每次创建新的 `bean`，并且关闭 Spring 容器时，`bean` 不会被销毁。

```java
@Controller("user")
@Scope("prototype")
public class User {
    @Value("chang")
    public String name;
}
```

## @Lazy 注解

单实例情况下，Spring 会在工厂创建同时创建 `bean`，配置 `@Lazy` 注解后，会把 `bean` 的创建推迟到该 `bean` 被使用的时候。

## @Required

`@Required` 注解适用于 `bean` 的属性设置器方法，用于告诉 Spring 该属性必须注入。

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Required
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

## @Autowired

可以将 `@Autowired` 注解应用于构造函数，不过从 Spring Framework 4.3 开始，如果目标 `bean` 仅定义一个构造函数作为开始，则不再需要在此类构造函数上使用 `@Autowired` 注解。但是如果有几个构造函数可用，则必须至少注解一个，以告诉容器使用哪个构造函数。

```java
public class MovieRecommender {

    private final CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

还可以将 `@Autowired` 注解 应用于“传统”的 `setter` 方法，在属性设置阶段，进行自动注入。

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

如果有需要还可以将注解应用于具有任意名称和多个参数的方法、用于字段或者混合使用。

```java
public class MovieRecommender {

    private MovieCatalog movieCatalog;

    private CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public void prepare(MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

```java
public class MovieRecommender {

    private final CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    private MovieCatalog movieCatalog;

    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

可以用于数组、`List`、`Set` 和 `Map`（`key` 是 `String` 的情况下），Spring 会进行自动注入，在 `Map` 中注入时，使用的 `key` 是 `bean` 的 `id`。如果希望在数组和 `List` 中以某种顺序注入，需要在 `bean` 上使用 `@Order` 或 `@Priority` 注解指明优先级。

```java
public class MovieRecommender {

    @Autowired
    private MovieCatalog[] movieCatalogs;

    // ...
}
```

```java
public class MovieRecommender {

    private Set<MovieCatalog> movieCatalogs;

    @Autowired
    public void setMovieCatalogs(Set<MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }

    // ...
}
```

```java
public class MovieRecommender {

    private Map<String, MovieCatalog> movieCatalogs;

    @Autowired
    public void setMovieCatalogs(Map<String, MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }

    // ...
}
```

默认情况下，如果没有候选的 `bean` 可用，自动装配就会失败。默认行为是将带注解的方法，构造函数和字段视为指示必须的依赖项，通过 `required` 字段可以修改这一默认行为。

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired(required = false)
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

从 Spring Framework 5.0 开始，还可以使用 `@Nullable` 注解，告诉 Spring 字段可以为空。

```java
public class SimpleMovieLister {

    @Autowired
    public void setMovieFinder(@Nullable MovieFinder movieFinder) {
        ...
    }
}
```

## @Primary

注入时如果有多个候选项，优先注入使用该注解的 `bean`。

## @Qualifier

有的时候同一种类型的 `bean` 可能有多个，`@Autowired` 只能基于类型注入，如果希望注入某个指定的 `bean`，可以使用该注解表名具体要注入的 `bean` 的 `id`。`@Qualifier` 注解可以用于字段、`setter` 或者构造方法的参数。

```java
public class MovieRecommender {

    @Qualifier("id")
    private MovieCatalog movieCatalog;

    private CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public void prepare(@Qualifier("id")MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

还可以用于给 `bean` 添加标识，在注入的时候使用此标识。

```java
@Component("student")
@Qualifier("12")
public class StudentBean {

}
```

## @Resource

该注解是 JSR250 提供的注解，如有指定的 `name` 属性，先按该属性进行 `byName` 方式查找装配；其次再进行默认的 `byName` 方式进行装配；如果以上都不成功，则按 `byType` 的方式自动装配。

```java
public class User {
    //如果允许对象为null，设置required = false,默认为true
    @Resource(name = "cat2")
    private Cat cat;
    @Resource
    private Dog dog;
    private String str;
}
```

## @PostConstruct 和@PreDestroy

标识 `bean` 的初始化方法和销毁方法，在 xml 配置中提到过。

```java
public class CachingMovieLister {

    @PostConstruct
    public void populateMovieCache() {
        // populates the movie cache upon initialization...
    }

    @PreDestroy
    public void clearMovieCache() {
        // clears the movie cache upon destruction...
    }
}
```

## @Value

该注解可以直接在属性上使用，Spring 会将值注入到属性中去，不可以用于静态属性，无法注入集合。

```java
@Component
class Person {
    @Value("chang")
    private String name;
  
    @Value("12")
    private int age;
}
```

有时候可以将一些属性放入配置文件中，`@Value` 可以取出配置文件中的这些属性，使用方式如下：

* 编写配置文

```properties
name=chang
age=12
```

* 在 Spring 的 xml 配置文件中指出配置文件的位置

  ```xml
  <context:property-placeholder location="properties配置文件位置" />
  ```

* 使用 `@Value` 注解

  ```java
  @Component
  class Person {
      @Value("${name}")
      private String name;

      @Value("${age}")
      private int age;
  }









## @PropertySource

`@Value` 注解要使用配置文件中的值，需要在 xml 中配置 `properties` 文件的位置。不过如果使用纯 Java 的方式配置以后，要怎么使用呢？其实 Spring 提供了另一个注解来代替这个配置，就是 `@PropertySource`。

```java
@Component
@PropertySource("配置文件位置")
class Person {
    @Value("${name}")
    private String name;
  
    @Value("${age}")
    private int age;
}
```

## @Bean

除了可以通过 Spring 自动扫描向容器中添加 `bean`，还可以手动的向容器中加入，`@Bean` 注解就用来实现这样的功能，类似于 `xml` 配置文件中的工厂方法。这种方式一般用于第三方框架，或者对象创建比较复杂的情况。

```java
@Configuration
public class RedisConfig {
    @Bean
    public User user() {
        return new User();
    }
}
```

默认情况下会使用方法名会作为 `bean` 的默认 `id`，如果需要定义成其他的 `id` 可以使用 `@Bean("id")`。前面提到的 `@Scope` 和 `@Qualifier` 注解也可以用于 `@Bean` 注解的方法，还可以给 `bean` 添加别名和描述。

```java
@Configuration
public class AppConfig {

    @Bean({"dataSource", "subsystemA-dataSource", "subsystemB-dataSource"})
    public DataSource dataSource() {
        // instantiate, configure and return DataSource bean...
    }
}
```

```java
@Configuration
public class AppConfig {

    @Bean
    @Description("Provides a basic example of a bean")
    public Thing thing() {
        return new Thing();
    }
}
```

`@Bean` 注解标注的方法支持自动注入，下面的列子中 Spring 会从容器中找到 `Person` 类型的 `bean` 赋给 `person` 参数。

```java
@Configuration
public class RedisConfig { 
    @Bean
    public User user(Person person) {
        return new User(person);
    }
}
```

如果是在 `@Configuration` 注解的配置类中，可以直接调用 `@Bean` 注解过的方法进行注入，其他情况下该方法不可使用。

```java
@Configuration
public class RedisConfig { 
  
    @Bean
    public Person person() {
        return new Person();
    }
  
    @Bean
    public User user() {
        // 这里直接调用了person方法注入对象。
        return new User(person());
    }
}
```

## @Import 注解

`@Import` 注解的作用是向容器中添加一个配置类或者 `bean`。

```java
@Configuration
public class ConfigA {

    @Bean
    public A a() {
        return new A();
    }
}

@Configuration
@Import(ConfigA.class)
public class ConfigB {

    @Bean
    public B b() {
        return new B();
    }
}
```

## Bean 优先级

对于不同配置中具有相同 `id` 的 `bean`，它们之间的优先级关系为：xml 配置 >`@Bean` 配置 > `@Component` 配置。
