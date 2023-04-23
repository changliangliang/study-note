
---
type: blog
status: 未发布
created: 2023-04-9 11:45:12
updated: 2023-04-19 20:12:45
tags:
categories: 
---



## 引入 SpringMVC

### 通过 web. xml 中引入

SpringMVC 是以 `DispatcherServlet` 类为入口的，该类本质上也是一个 `Servlet`，所以配置方式和普通的 `Servlet` 差不多。

```xml
<web-app>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/app-context.xml</param-value>
    </context-param>
    <servlet>
        <servlet-name>app</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value></param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>app</servlet-name>
        <url-pattern>/app/*</url-pattern>
    </servlet-mapping>
</web-app>
```

* 监听器 [`org.springframework.web.context.ContextLoaderListener`](学习笔记/卡片/Java类/org.springframework.web.context.ContextLoaderListener.md) 的作用就是启动 `Web` 容器时自动装配 `ApplicationContext` ，这里指的就是 Spring 容器。因为它实现了 `ServletContextListener` 这个接口，服务器启动容器时，就会默认执行它实现的方法。`ApplicationContext ` 配置文件的默认路径是 ` /WEB-INF/applicationContext. xml `，在 ` WEB-INF ` 目录下创建的 ` xml ` 文件的名称必须是 ` applicationContext. xml `。如果是要自定义文件名可以在 ` web. xml ` 里加入 ` contextConfigLocation ` 这个参数。如果有多个 ` xml ` 文件，可以写在一起并以“,”号分隔，也可以这样 ` applicationContext-*. xml ` 采用通配符。
* 使用 `Spring MVC`，配置 `DispatcherServlet` 是第一步。`DispatcherServlet` 是一个 `Servlet`，所以可以配置多个 `DispatcherServlet`。这个 `Servlet` 用于拦击请求，使请求进入到 `SpringMVC` 中的逻辑中，它还会引入一个 `SpringMVC` 容器，该容器配置文件的默认路径为 `/WEB-INF/<servlet-name>-servlet.xml`，如果自定义配置文件位置的话，和 `Spring` 容器是一样的。

### Java 配置引入

在 Servlet 3 规范中允许使用 Java 类来代替 `web.xml` 文件进行配置，具体方式是创建一个 AbstractAnnotationConfigDispatcherServletInitializer 的子类。

```java
public class MyWebInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {  
  
    @Override  
    protected String[] getServletMappings() {  
        return new String[] { "/" };  
    }  
  
    @Override  
    protected Class<?>[] getRootConfigClasses() {  
        return new Class<?>[] { RootConfig.class };  
    }  
  
    @Override  
    protected Class<?>[] getServletConfigClasses() {  
        return new Class<?>[] { WebConfig.class };  
    }  
  
}
```

- `getRootConfigClasses()` 返回根容器的 Java 配置文件，对应到 web. xml 就是 `contextConfigLocation` 配置的 xml 文件；
	```xml
	<listener>
	        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>/WEB-INF/app-context.xml</param-value>
	</context-param>
	```

- `getServletConfigClasses()` 返回的就是 `DispatcherServlet` 中容器的 Java 配置文件；
- `getServletMappings​()` 返回的是 `DispatcherServlet` 要处理的路径。

Javap 类配置的原理是在 Servlet 3.0 环境中，容器会在类路径中查找实现 `javax.servlet.ServletContainerInitializer` 接口的类，如果能发现的话，就会用它来配置 Servlet 容器。Spring 提供了这个接口的实现，名为 `SpringServletContainerInitializer`，这个类反过来又会查找实现 `WebApplicationInitializer` 的类并将配置的任务交给它们来完成。Spring 3.2 引入了一个便利的 WebApplicationInitializer 基础实现，也就是 `AbstractAnnotationConfigDispatcherServletInitializer`。 

如果想对 `DispatcherServlet` 进行更丰富的设置，可以通过重写 `customizeRegistration` 方法来实现，如下面设置了上传文件时的临时文件夹。

```java
@Override
protected void customizeRegistration(Dynamic registration) {  
    registration.setMultipartConfig(  
            new MultipartConfigElement("/tmp/spittr/uploads");  
    );  
}
```


### 容器配置

无论是使用 xml 还是使用 Java 类进行配值，两个容器本质上还是 Spring 容器，所以配置上是一样的。不同的地方在于 `DispatcherServlet` ​ 创建的容器中会使用一些特殊的 Bean，这些 Bean​ 是 SpringMVC​ 的一部分，如映射器、视图解析器之类。

```java
@Configuration
@EnableWebMvc
public class WebConfig {

}
```

在 SpringMVC 的配置文件中，可以添加 `@EnableWebMvc` 注解，它的主要作用是向容器中添加默认的 Bean，例如默认的试图解析器 `BeanNameViewResolver`。

## url-pattern 配置

这部分属于 web 容器的配置，主要是决定哪些 url 请求转发给 SpringMVC 来处理。Servlet 中 url-pattern​ 有三种匹配模式：精确匹配、路径匹配和后缀匹配，三种匹配模式的优先级也依次降低。

### 精确匹配

```xml
<servlet-mapping>
    <servlet-name>MyServlet</servlet-name>
    <url-pattern>/user</url-pattern>
</servlet-mapping>
```

上面的配置只能匹配：

```
http://localhost:8080/appDemo/user​ 
```


### 路径匹配

以 `/` ​ 开头以 `/*` 结尾的都属于路径匹配。

```xml
<servlet-mapping>
    <servlet-name>MyServlet</servlet-name>
    <url-pattern>/user/*</url-pattern>
</servlet-mapping>
```

上面的 servlet​ 可以匹配如下路径：

```txt
http://localhost:8080/appDemo/user/users.html
http://localhost:8080/appDemo/user/addUser.action
http://localhost:8080/appDemo/user/updateUser.actionl
```

### 后缀匹配

以 `*.` ​ 开头的属于后缀匹配，需要注意的是路径和后缀不能同时设置。

```xml
<servlet-mapping>
    <servlet-name>MyServlet</servlet-name>
    <url-pattern>*.jsp</url-pattern>
    <url-pattern>*.action</url-pattern>
</servlet-mapping>
```

上面的 servlet​ 可以匹配如下路径：

```
http://localhost:8080/appDemo/user/users.jsp
http://localhost:8080/appDemo/toHome.action
```

### `/` 和 `/*` 的区别

当其他 servlet​ 无法匹配时，会匹配到 url-pattern​ 设置为 `/` 的 servlet​， `/*` 属于路径匹配，可以用来匹配任何路径。

### tomcat 中的默认配置

​tomcat​ 默认配置了两个 servlet​，如下所示：

```xml
<servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>

<!-- The mappings for the JSP servlet -->
<servlet-mapping>
    <servlet-name>jsp</servlet-name>
    <url-pattern>*.jsp</url-pattern>
    <url-pattern>*.jspx</url-pattern>
</servlet-mapping>
```

### welcome-file-list

​web.xml​ 中有如下设置，用于配置欢迎页面，当用户在 url​ 中输入工程名称或者输入 web​ 容器 url​ 如 `http://localhost:8080/`​ 时直接跳转到 welcome-file-list​ 设置的路径。

```xml
<welcome-file-list>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.jsp</welcome-file>
    <welcome-file>index.action</welcome-file>
</welcome-file-list>
```


## SpringMVC 配置

###  WebMvcConfigurer 配置

在 java​ 配置中需要使用 @EnableWebMvc​ 注解来开启 MVC​ 配置，而在 XML​ 配置中需要使用 <mvc:annotation-driven/>​，它们默认会导入一些类。

```java
@Configuration
@EnableWebMvc
public class WebConfig {
  
}
```

使用 java​ 代码进行配置需要编写 WebMvcConfigurer​ 实现类，XML​ 中可以使用 <mvc:annotation-driven/>​ 的属性和子元素进行配置。

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    // Implement configuration methods...
}
```


### 类型转化

默认情况下，SpringMVC​ 安装了 Number​ 和 Date​ 类型的格式化程序，包括对 @NumberFormat​ 和 @DateTimeFormat​ 注解的支持。如果 Classpath​ 中存在 Joda-Time​，则还将安装对 Joda-Time​ 格式库的完全支持。

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        // ...
    }
}
```

### 数据校验

默认情况下，如果 Bean Validation​ 存在于 Classpath​ 中，例如 Hibernate Validator​，则 LocalValidatorFactoryBean​ 被注册为全局 Validator​，以便与控制器方法参数上的 @Valid​ 和 Validated​ 一起使用。在 Java​ 配置中，可以自定义全局 Validator​ 实例：

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public Validator getValidator(); {
        // ...
    }
}
```

还可以在本地添加校验器。

```java
@Controller
public class MyController {

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(new FooValidator());
    }

}
```

### 拦截器

拦截器的作用是在 Controller 处理请求之前拦截请求进行一些处理。

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LocaleChangeInterceptor());
        registry.addInterceptor(new ThemeChangeInterceptor()).addPathPatterns("/**").excludePathPatterns("/admin/**");
        registry.addInterceptor(new SecurityInterceptor()).addPathPatterns("/secure/*");
    }
}
```


### 消息转换器

下图展示了消息转换器的作用，主要是把 http 请求中的信息转化为 Java 对象，或者把 Java 对象转化为相应数据如 Json 之类的。

![](附件/image/SpringMVC配置_image_1.png)

```java
@Configuration
@EnableWebMvc
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder()
                .indentOutput(true)
                .dateFormat(new SimpleDateFormat("yyyy-MM-dd"))
                .modulesToInstall(new ParameterNamesModule());
        converters.add(new MappingJackson2HttpMessageConverter(builder.build()));
        converters.add(new MappingJackson2XmlHttpMessageConverter(builder.createXmlMapper(true).build()));
    }
}
```

### 查看控制器

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("home");
    }
}
```

```xml
<mvc:view-controller path="/" view-name="home"/>
```

### 视图解析器

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.enableContentNegotiation(new MappingJackson2JsonView());
        registry.jsp();
    }
}
```

### 静态资源处理

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
            .addResourceLocations("/public", "classpath:/static/")
            .setCachePeriod(31556926);
    }
}
```

### 默认 servlet

​SpringMVC​ 中没有做出映射的请求，交给容器默认的 Servlet​ 去处理。

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }
}
```


## 请求映射

### @RequestMapping​ 

​@RequestMapping​ 用来将请映射到控制器方法，SpringMVC​ 中还提供了下面的注解来指定特定的 http​ 请求。

-   ​@GetMapping​
-   ​@PostMapping​
-   ​@PutMapping​
-   ​@DeleteMapping​
-   ​@PatchMapping​

```java
@RestController
@RequestMapping("/persons")
class PersonController {

    @GetMapping("/user")
    public Person getPerson(@PathVariable Long id) {
        // ...
    }

}
```

上面的例子中，/persons/user​ 请求会进入到 getPerson​ 方法中进行处理。

​@RequestMapping​ 中的路径可以使用以下 glob​ 模式和通配符来映射请求：

-   ​?​ 匹配一个字符，如 /a?b​ 可以用来匹配 /abc​ 和 /avc​
-   ​* 匹配路径段中的零个或多个字符，如 /a/ * /c​ 可以用来匹配 /a/b/c​
-   ​** ​ 匹配零个或多个路径段，如 /a/ ** /d​ 可以用来匹配 /a/b/c/d​

### Content-Type 属性

通过 consumes​ 属性指定提交内容 Content-Type​ 缩小映射范围。

```java
@PostMapping(path = "/pets", consumes = "application/json")
public void addPet(@RequestBody Pet pet) {
    // ...
}
```

​!​ 表示非的含义，下面例子中的方法接收 Content-Type​ 不是 application/json​ 的 POST​ 请求。

```java
@PostMapping(path = "/pets", consumes = "!application/json") 
public void addPet(@RequestBody Pet pet) {
    // ...
}
```

​produces​ 和 consumes​ 差不多，不同的地方在于前者对应的 Accept​，即响应内容 Content-Type​。

```java
@GetMapping(path = "/pets/{petId}", produces = "application/json;charset=UTF-8") (1)
@ResponseBody
public Pet getPet(@PathVariable String petId) {
    // ...
}
```

### Parmes 和 Header 属性

可以使用请求参数条件或者 header​ 条件来缩小映射范围。

```java
@GetMapping(path = "/pets/{petId}", params = "myParam=myValue")
public void findPet(@PathVariable String petId) {
    // ...
}
```

```java
@GetMapping(path = "/pets", headers = "myHeader=myValue")
public void findPet(@PathVariable String petId) {
    // ...
}
```


## 参数绑定

### 简单使用

#### 默认支持的类型

在 Controller​ 方法形参中可以随时添加如下类型的参数，处理适配器会自动识别并进行赋值

-   ​HttpServletRequest​：通过 request​ 对象获取请求信息
-   ​HttpServletResponse​：通过 response​ 处理响应信息
-   ​HttpSession​：通过 session​ 对象得到 session​ 中存放的对象
-   ​InputStream​
-   ​OutputStream​
-   ​Reader​
-   ​Writer​
-   ​Model/ModelAndView​

#### 简单数据类型

简单参数类型指的是 java​ 内置的八种基本类型及其对应的封装类（如 StringBuffer​ 等），假设请求的 url​ 如下：

```
http://localhost:8080/admin/login?username=123&password=123
```

-   如果 http​ 请求参数的 key​ 和 Controller​ 方法的形参名称一致时，所有的参数都会被 SpringMVC​ 会直接进行赋值。

```java
@PostMapping({"/admin", "/admin/login"})
public String login(String username, String password) {
  	return ""
}
```

-   当请求参数的 key​ 和 Controller​ 方法的形参名称不一致时，需要使用 @RequestParam​ 注解才能将请求参数绑定成功。

```java
@PostMapping({"/admin", "/admin/login"})
public String login(@RequestParam("username") String name, String password) {
  	return ""
}
```

#### JavaBean

当控制器方法中的参数是对象时，对象中和参数名一致的所有属性会被赋值，假设请求的 url​ 为如下内容：

```
http://localhost:8080/param/bindPojo?id=3&name=小米&price=3760
```

```java
@RequestMapping(value = "bindPojo")
public Item bindPojo(Item item) {
	return item;
}

class Item {
    private String id; 
    private String name; 
    private String price; 
}
```

#### 包装类

包装类本身也是 javabean​，只是它的内部包含了其他的 javabean​，比如下面的 Order​ 类：

```java
class Order {
    private String id;
    private Book book;
}

class Book {
    private String name;
}
```

包装类内部的普通属性和 javabean​ 类的要求是一样的，内部 javabean​ 属性绑定时，需要使用如下形式：

```
http://localhost:8080/param/bindPojo?book.name=name
```

#### 数组

请求中有多个名称相同的参数，可以使用数组类型进行接收。

```
http://localhost:8080/param/simpleArray?ids=1&ids=2&ids=3&ids=4
```

```java
@RequestMapping(value = "simpleArray")
public String[] simpleArray(String[] ids) {
	return ids;
}
```

#### List

​List​ 不能直接放在参数列表中使用，必须放在实体类中作为属性。

```java
class Order {
    private String id;
    private List<Book> books;
}

class Book {
    private String name;
}
```

请求提交时的 key​ 对应为 books[0].name​、books[0].name​。

#### Map

和 List​ 一样，Map​ 也必须放在实体类中，请求时对应的 key​ 为 books["key"].name​。

### @PathVariable

可以用来将路径中带的值绑定到控制器方法的参数中，假如下面的方法接收的请求是 /owners/1/pets/2​，那么 findPet​ 方法中的两个参数分别会被传入 1​ 和 2​。默认情况下只支持简单类型的传递(int​，long​，Date​ 等)，如果需要支持其他类型，可以配置类型转换器和数据绑定器。

```java
@GetMapping("/owners/{ownerId}/pets/{petId}")
public Pet findPet(@PathVariable Long ownerId, @PathVariable Long petId) {
    // ...
}
```

这个注解还支持使用正则表达式：

```java
@GetMapping("/{name:[a-z-]+}-{version:\\d\\.\\d\\.\\d}{ext:\\.[a-z]+}")
public void handle(@PathVariable String version, @PathVariable String ext) {
    // ...
}
```

### @RequestParam

将请求参数(即查询参数或表单数据)绑定到控制器中的方法参数。

```java
@Controller
@RequestMapping("/pets")
public class EditPetForm {

    // ...

    @GetMapping
    public String setupForm(@RequestParam("petId") int petId, Model model) { (1)
        Pet pet = this.clinic.loadPet(petId);
        model.addAttribute("pet", pet);
        return "petForm";
    }

    // ...

}
```

默认情况下，使用此注解的方法参数是必需的，但是可以通过将 @RequestParam​ 注解的 required​ 标志设置为 false​ 或通过 java.util.Optional​ 包装器声明参数来指定方法参数是可选的。如果目标方法参数类型不是 String​，则会自动应用类型转换。将参数类型声明为数组或列表，可以为同一参数名称解析多个参数值。如果将 @RequestParam​ 注解声明为 Map<String, String>​ 或 MultiValueMap<String, String>​，而未在注解中指定参数名，则将使用每个给定参数名的请求参数值填充 Map​。

### @RequestHeader

将 header​ 中的值绑定到参数。

```java
@GetMapping("/demo")
public void handle(
        @RequestHeader("Accept-Encoding") String encoding, (1)
        @RequestHeader("Keep-Alive") long keepAlive) { (2)
    //...
}
```

如果目标方法的参数类型不是 String​，则将自动应用类型转换。在 Map<String, String>​，MultiValueMap<String, String>​ 或 HttpHeaders​ 参数上使用 @RequestHeader​ Comments 时，将使用所有 Headers​ 值填充 Map​。

### @CookieValue

将 Cookie​ 中的值绑定到参数。

```java
@GetMapping("/demo")
public void handle(@CookieValue("JSESSIONID") String cookie) { (1)
    //...
}
```

如果目标方法的参数类型不是 String​，那么将自动应用类型转换。

### @ModelAttribute

-   ​@ModelAttribute​ 注释 void​ 返回值的方法
    
    ```java
    @Controller
    public class HelloWorldController {
        @ModelAttribute
        public void populateModel(@RequestParam String abc, Model model) {
             model.addAttribute("attributeName", abc);
          }
    
        @RequestMapping(value = "/helloWorld")
        public String helloWorld() {
           return "helloWorld";
            }
    }
    ```
    
    这个例子，在获得请求 /helloWorld​ 后，populateModel​ 方法在 helloWorld​ 方法之前先被调用，它把请求参数（例如 /helloWorld?abc=text​ 中的 abc=text​）加入到一个名为 attributeName​ 的 model​ 属性中，在它执行后 helloWorld​ 被调用，返回视图名 helloWorld​，这里 model​ 已由 @ModelAttribute​ 方法生产好了。当请求中不包含此参数时，会报错，可以将该值设置为非必要。
    
-   ​@ModelAttribute​ 注释返回具体类的方法
    
    ```java
    @ModelAttribute 
    public Account addAccount(@RequestParam String number) { 
        return accountManager.findAccount(number); 
    } 
    ```
    
    这种情况 model​ 属性的名称没有指定，它由返回类型隐含表示，如这个方法返回 Account​ 类型，那么这个 model​ 属性的名称是 account​。
    
-   ​@ModelAttribute(value="")​ 注释返回具体类的方法
    
    ```java
    @Controller
    public class HelloWorldController {
        @ModelAttribute("attributeName")
        public String addAccount(@RequestParam String abc) {
            return abc;
          }
    
        @RequestMapping(value = "/helloWorld")
        public String helloWorld() {
            return "helloWorld";
        }
    }
    ```
    
    这个例子中使用 @ModelAttribute​ 注释的 value​ 属性，来指定 model​ 属性的名称，model​ 属性对象就是方法的返回值,它无须要特定的参数。
    
-   ​@ModelAttribute​ 和 @RequestMapping​ 同时注释一个方法
    
    ```java
    @Controller
    public class HelloWorldController {
        @RequestMapping(value = "/helloWorld.do")
        @ModelAttribute("attributeName")
        public String helloWorld() {
             return "hi";
        }
    }
    ```
    
    这时这个方法的返回值并不是表示一个视图名称，而是 model​ 属性的值，视图名称由 RequestToViewNameTranslator​ 根据请求 "/helloWorld.do"​ 转换为逻辑视图 helloWorld​。model​ 属性名称由 @ModelAttribute(value=””)​ 指定，相当于在 request​ 中封装了 key=attributeName​，value=hi​。
    
-   ​@ModelAttribute​ 注释一个方法的参数
    
    ```java
    @Controller
    public class HelloWorldController {
        @ModelAttribute("user")
        public User addAccount() {
            return new User("jz","123");
        }
    
        @RequestMapping(value = "/helloWorld")
        public String helloWorld(@ModelAttribute("user") User user) {
               user.setUserName("jizhou");
               return "helloWorld";
        }
    }
    ```
    
    在这个例子里，@ModelAttribute("user") ​ 注释方法参数，参数 user​ 的值来源于 addAccount()​ 方法中添加的值。
    

### @SessionAttributes

​@SessionAttributes​ 用于在请求之间的 HTTP Servlet​ 会话中存储模型属性，它是类型级别的注解，用于声明特定控制器使用的会话属性。

```java
@Controller
@SessionAttributes("pet") (1)
public class EditPetForm {

    // ...

    @PostMapping("/pets/{id}")
    public String handle(Pet pet, BindingResult errors, SessionStatus status) {
        if (errors.hasErrors) {
            // ...
        }
            status.setComplete(); (2)
            // ...
        }
    }
}
```

-   （1）处添加了注解之后，该类中的所有方法向 model​ 中添加 key​ 为 pet​ 的值使，将会在 Session 中存储一份存储在 Servlet 会话中。
-   （2）处展示清除 Session 中设置的值。

通常不推荐使用该注解，某些情况下可能会出现错误，所以推荐使用原生 api 添加。

### @SessionAttribute

用于从 session​ 中获取数据。

```java
@RequestMapping("/")
public String handle(@SessionAttribute User user) { (1)
    // ...
}
```

### @RequestAttribute

类似于 @SessionAttribute​。

```java
@GetMapping("/")
public String handle(@RequestAttribute Client client) { (1)
    // ...
}
```

### @RequestBody

可以使用 @RequestBody​ 注解将请求正文读取并通过 HttpMessageConverter​ 反序列化为 Object​。

```java
@PostMapping("/accounts")
public void handle(@RequestBody Account account) {
    // ...
}
```

### HttpEntity

​HttpEntity​ 与使用 @RequestBody​ 大致相同，但是它基于一个容器对象，该对象包含了 Headers​ 和正文。

```java
@PostMapping("/accounts")
public void handle(HttpEntity<Account> entity) {
     entity.getBody();
     entity.getHeaders();
}
```

### @ResponseBody

可以使用 @ResponseBody​ 注解将请求正文通过 HttpMessageConverter​ 序列化并发送。

```java
@GetMapping("/accounts/{id}")
@ResponseBody
public Account handle() {
    // ...
}
```

### ResponseEntity

与 @ResponseBody​ 类似，但可以添加状态和标题。

```java
@GetMapping("/something")
public ResponseEntity<String> handle() {
    String body = ... ;
    String etag = ... ;
    return ResponseEntity.ok().eTag(etag).build(body);
}
```

### Multipart

要启用 Multipart​ 处理，需要在 DispatcherServlet​ 配置中声明名称为 multipartResolver​ 的 MultipartResolver​ 类型的 bean​。 收到 Content Type​ 为 multipart/form-data​ 的 POST​ 时，解析程序将解析内容并将当前 HttpServletRequest​ 包装为 MultipartHttpServletRequest​ 以提供对已解析部分的访问权限。

​MultipartResolver​ 有两种实现，基于一种基于 Apache Commons FileUpload​，一种基于 Servlet 3.0Multipart​ 请求。

#### Apache Commons FileUpload

可以配置名称为 multipartResolver​ 的类型 CommonsMultipartResolver​ 的 bean​，同时还需要引入 commons-fileupload​ 依赖。

#### Servlet 3.0

需要通过 Servlet​ 容器配置启用 Servlet 3.0Multipart​ 解析，为此：
- 在 Java​ 中，在 Servlet​ 注册上设置 MultipartConfigElement​。
- 在 web.xml​ 中，将 `< multipart-config>` 部分添加到 Servlet​ 声明中


```java
public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    // ...

    @Override
    Protected void customizeRegistration (ServletRegistration. Dynamic registration) {

        // Optionally also set maxFileSize, maxRequestSize, fileSizeThreshold
        Registration.SetMultipartConfig (new MultipartConfigElement ("/tmp"));
    }

}

```

配置完成后可以添加名称为 multipartResolver​ 的类型为 StandardServletMultipartResolver​ 的 bean​。

#### 接收文件

通过下面的方式可以实现文件接收。

```java
@Controller
public class FileUploadController {

    @PostMapping("/form")
    public String handleFormUpload(@RequestParam("name") String name,
            @RequestParam("file") MultipartFile file) {

        if (!file.isEmpty()) {
            byte[] bytes = file.getBytes();
            // store the bytes somewhere
            return "redirect:uploadSuccess";
        }
        return "redirect:uploadFailure";
    }
}
```

当参数类型声明为 `List<MultipartFile>` ​ 可以为同一参数名称解析多个文件，如果将 @RequestParam​ 注解声明为 Map<String, MultipartFile>​ 或 MultiValueMap<String, MultipartFile>​，而未在注解中指定参数名称，则将使用每个给定参数名的 Multipart​ 文件填充 Map​。

## 跨域配置

### @CrossOrigin

该注解允许请求跨域，支持在类和方法上使用，默认情况下 @CrossOrigin​ 允许：

-   所有 origins​
-   所有 headers​
-   所有 http​ 方法

```java
@RestController
@RequestMapping ("/account")
Public class AccountController {

    @CrossOrigin
    @GetMapping ("/{id}")
    Public Account retrieve (@PathVariable Long id) {
        // ...
    }

    @DeleteMapping ("/{id}")
    Public void remove (@PathVariable Long id) {
        // ...
    }
}
```

### 全局配置

默认情况下，允许如下跨域请求：

-   所有 origins​
-   所有 headers​
-   ​GET​，HEAD​ 和 POST​ 方法。

要修改全局配置可以使用如下 java​ 或 xml​ 方式。

```java
@Configuration
@EnableWebMvc
Public class WebConfig implements WebMvcConfigurer {

    @Override
    Public void addCorsMappings (CorsRegistry registry) {

        Registry.AddMapping ("/api/**")
            .allowedOrigins (" http://domain2.com" )
            .allowedMethods ("PUT", "DELETE")
            .allowedHeaders ("header 1", "header 2", "header 3")
            .exposedHeaders ("header 1", "header 2")
            .allowCredentials (true). MaxAge (3600);

        // Add more mappings...
    }
}
```

```xml
<mvc:cors>

    <mvc: mapping path="/api/**"
        allowed-origins=" http://domain1.com , http://domain2.com"
        Allowed-methods="GET, PUT"
        Allowed-headers="header 1, header 2, header 3"
        Exposed-headers="header 1, header 2" allow-credentials="true"
        Max-age="123" />

    <mvc: mapping path="/resources/**"
        allowed-origins=" http://domain1.com" />

</mvc:cors>
```

### CORS 过滤器

还可以通过添加过滤器的方式实现跨域。

```java
@Bean
Public CorsFilter corsFilter () {
  
    CorsConfiguration config = new CorsConfiguration ();
    // Possibly...
    // config.ApplyPermitDefaultValues ()
    Config.SetAllowCredentials (true);
    config.AddAllowedOrigin (" http://domain1.com" );
    Config.AddAllowedHeader ("*");
    Config.AddAllowedMethod ("*");
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource ();
    Source.RegisterCorsConfiguration ("/**", config);
    CorsFilter filter = new CorsFilter (source);
    Return filter;
}
```

