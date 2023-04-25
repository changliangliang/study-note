---
{}
---


Spring 是一个 Java 语言框架，它的出现极大的简化了 Java 的开发过程，使用过程中最明显的感觉是各种类都不要手动取实例化了，通过配置文件就可以定制出各种需要的类，直接从 Spring 中获取即可。

Spring 的一个特点是对代码的侵入性低，几乎可以在不改变原有代码的基础上使用 Spring，不需要对原有的类进行改变（如继承某个类或实现某个接口），这就极大的降低了开发者使用 Spring 时的顾虑，在以后如果不想使用 Spring 了可以很方便的将其移除，这也是 Spring 可以快速在开发者中推广开来的原因之一。

### 非侵入性

Spring 的非侵入性主要体现在他可以通过配置将任何常见的类作为自己的组件，如下面的 `HelloWorldBean`。

```java
@Component
public class HelloWorldBean {
    public String sayHello() {
        return "Hello World";
    }
}
```

```java
@ComponentScan  
public class App   
{  
    public static void main( String[] args )  
    {  
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(App.class);  
        HelloWorldBean bean = context.getBean(HelloWorldBean.class);  
        String s = bean.sayHello();  
        System.out.println(s);  
    }  
}
```

此处不需要理解 `@ComponentScan` 和 `@Component` 的具体含义，只需要知道它们是 Spring 使用的注解即可。我们只是在目标类上加了 `@Componet` 注解就可以实现从 Spring 提供的 `AnnotationConfigApplicationContext` 容器中获取到该类型的实例。

从这个例子中可以体会到 Spring 的非侵入性，虽然在类上添加了注解，但我们都知道注解只是给类提供了额外的信息，需要有对应的处理程序来解析这些信息，如果不需要处理这些信息，那么可以直接将注解无视，所以注解的存在并不会影响该类在其他地方的使用。

Spring 还有使用 XML 配置文件的方式来将类变为 Spring 的组件，不过由于 XML 配置过于繁琐，目前大家使用的都是上述 Java 类的配置方式。

### 对象之间的关系

只是将普通类编程 Spring 的组件作用并不大，Spring 跟强大的地方在于它可以维护对象之间的关系。在传统的编程中，对象与对象之间的关系由程序员来维护，如下面 `Worker` 和 `Hammer` ，在 `Worker` 内部手动创建了一个 `Hammer`。

```java
public class Worker {  
      
    private Hammer hammer;  
          
	public Worker() {  
        hammer = new Hammer();  
    }  
      
    public void work() {  
        hammer.work();  
    }  
      
}
```

```java
public class Hammer {  
  
    public void work() {  
        System.out.println("锤子敲击");  
    }  
}
```

如果希望 `Worker` 能使用其他的工具，那么需用对 `Worker` 的源码进行修改，也就是要通过硬编码的方式替换工具。

根据类复用相关的学习，我们知道解决的方式是抽象出一个工具接口，让 `Worker` 持有这个工具接口而不是具体的工具，然后在创建 `Worker` 时在选择传递具体的工具。

```java
public interface Tool {  
  
    void work();  
}
```

```java
public class Hammer implements Tool{  
  
    public void work() {  
        System.out.println("锤子敲击");  
    }  
}
```

```java
public class Worker {  
  
    private Tool tool;  
  
  
    public Worker(Tool t) {  
        tool = t;  
    }  
  
    public void work() {  
        tool.work();  
    }  
  
}
```

```java
public static void main(String[] args) {  
    Worker worker = new Worker(new Hammer());  
    worker.work();  
}
```

这样做使得工人可以使用任何继承接口的工具了，但仍然需要手动的创建具体的工具实例，然后传递给工人。Spring 作为一个容器框架，所有的组件都是由它来管理的，那么针对 `Worker` 和 `Tool` 这样的关系，提供了更简单的装配方式。

```java
@Component  
public class Hammer implements Tool{  
  
    public void work() {  
        System.out.println("锤子敲击");  
    }  
}
```

```java
  
@Component  
public class Worker {  
  
    @Autowired  
    private Tool tool;  
  
  
    public Worker(Tool t) {  
        tool = t;  
    }  
  
    public void work() {  
        tool.work();  
    }  
  
    public static void main(String[] args) {  
        Worker worker = new Worker(new Hammer());  
        worker.work();  
    }  
  
}
```

```java
public static void main( String[] args )  
{  
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(App.class);  
    Worker bean = context.getBean(Worker.class);  
    bean.work();  
  
}
```

在容器启动的时候，Spring 会自动的创建工具和工人的实例，并将工具传递给工人，这样开发者就不要手动维护工人与工具直接的关系了。

### 面向切面编程

在编程工程中有一些模块是通用的，会在其他模块中反复调用，如日志模块。

当代码量比较小的时候可能看不出什么问题，但是随着项目规模的不断变大，这种调用关系就会出现一些明显的缺陷：
- 调用通用模块的代码会大量重复；
- 对通用模块的调用会使得核心逻辑变得不清晰。

Spring 中通过 AOP 来解决这一问题，以日志模块为例，原先它单独的在各个模块中调用，进引入 AOP 的理念后，就是将分散在各个业务逻辑代码中相同的代码通过横向切割的方式抽取到一个独立的模块中！​在 Spring 中主要通过代理的方式实现这一功能，即 Spring 会自动生成 `UserService` 类的一个代理类，在代理类中会进行日志的记录工作。

![](附件/image/对%20Spring%20的认识_image_1.png)



### 提供模板

Spring 的作用之一是简化开发，对于一些模板化的代码，如 JDBC 的操作等，都提供对应的封装，并统一命名为 `XXXTemplate` 。在传统的开发流程中，使用 JDBC 的代码大致如下，需要手动获取连接，执行命令等。

```java
public Employee getEmployeeById(long id) {
  
  Connection conn = null;
  PreparedStatement stmt = null;
  Result rs = null;
  
  try {
    conn = dataSource.getConnection();
    stmt = conn.prepareStatment(
      "select id, firstname, lastname, salary from " +
      "employee where id=?");
    stmt.setLong(1, id);
    rs = stmt.executeQuery();
    Employee employee = null;
    if (rs.next()) {
      employee = new Employee();
      employee.setId(rs.getLong("id"));
      employee.setFirstName(rs.getString("firstname"));
      employee.setLastName(rs.getString("lastname"));
      employee.setSalary(rs.getBigDecimal("salary"));
    }
    return employee;
  } catch (SQLException e) {
  } finally {
    if (rs != null) {
      try {
        rs.close();
      } catch (SQLException e) {
      }
    }
    
    if (stmt != null) {
      try {
        stmt.close();
      } catch (SQLException e) {
      }
    }
    
    if (conn != null) {
      try {
        conn.close();
      } catch (SQLException e) {
      }
    }    
  }
  return null;
}
```

Sping 中提供方便使用的封装 `jdbcTemplate`，极大的减少了模板代码。

```java
public Employee getEmployeeById(long id) {
  return jdbcTemplate.queryForObject(
    "select id, firstname, lastname, salary " +
    "from employee where id=?",
    new RowMapper<Employee>() {
      public Employee mapRow(ResultSet rs, int rowNum) throws SQLException {
        Employee employee = new Employee();
        employee.setId(rs.getLong("id"));
        employee.setFirstName(rs.getString("firstname"));
        employee.setLastName(rs.getString("lastname"));
        employee.setSalary(rs.getBigDecimal("salary"));
        return employee;
      }
    }, 
    id);
}
```

### 总结

Spring 主要解决了编程过程中各种类的创建和关系维护，同时支持了 AOP 功能，并对常用的模板代码做了封装。因为其在使用上具有较低的侵入性，所以得到了广泛的使用，也因此有何很好的生态系统。