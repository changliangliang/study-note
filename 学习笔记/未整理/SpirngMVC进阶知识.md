---
---

## 处理流程

DispatcherServlet 是 SpringMVC 的入口，当 Tomcat 将请求交给 DispatcherServlet 处理后，将会经历以下流程：

![](附件/image/SpirngMVC进阶知识_image_1.png)

1. 请求被 SpringMVC​ 前端控制器 DispatherServlet​ 捕获；
2. 前端控制器对请求调用 HandlerMapping​；
3. 前端控制器获得返回的 HandlerExecutionChain​（包括 Handler​ 对象以及 Handler​ 对象对应的拦截器）；
4. DispatcherServlet​ 根据获得的 HandlerExecutionChain​，选择一个合适的 HandlerAdapter​，如果成功获得 HandlerAdapter​ 后，将开始执行拦截器的 preHandler(...)​ 方法；
5. ​HandlerAdapter​ 提取 Request​ 中的模型数据，填充 Handler​ 入参，开始执行 Handler，在填充 Handler​ 的入参过程中，根据配置，Spring​ 将做一些额外的工作：
    1. HttpMessageConveter​：将请求消息（如 Json​、xml​ 等数据）转换成一个对象，将对象转换为指定的响应信息；
    2. 数据转换：对请求消息进行数据转换。如 String​ 转换成 Integer​、Double​ 等；
    3. 数据格式化：如将字符串转换成格式化数字或格式化日期等；
    4. 数据验证：验证数据的有效性（长度、格式等），验证结果存储到 BindingResult​ 或 Error​ 中）；
6. Handler​ 执行完毕，返回一个 ModelAndView ​（即模型和视图）给 HandlerAdaptor​;
7. HandlerAdaptor​ 适配器将执行结果 ModelAndView​ 返回给前端控制器；
8. 前端控制器接收到 ModelAndView​ 后，请求对应的视图解析器；
9. 视图解析器解析 ModelAndView​ 后返回对应 View​；
10. 渲染视图并返回渲染后的视图给前端控制器；
11. 最终前端控制器将渲染后的页面响应给用户或客户端。

## 视图解析器和视图

### 视图解析器

视图解析器的作用是把一个逻辑视图解析成视图，如下面的 Controller 中 home 方法返回了一个字符串，这个字符创可以表示最终的输出内容，也可以表示某个 html 文件，具体将其解释为什么含义，那么就是由视图解析器来决定的。

```java
@Controller
public class Home {
    @GetMapping("/home")
    public String home() {
        return "home";
    }
}
```

SpirngMVC 内置了许多视图解析器，通常可以满足我们的大部分需求。

| 视图解析器                     | 描述                                                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| BeanNameViewResolver           | 将视图解析为 Spring 应用上下文中的 bean，其中 bean 的 ID 与视图的名字相同                                                              |
| ContentNegotiatingViewResolver | 通过考虑客户端需要的内容类型来解析视图，委托给另外一个能够产生对应内容类型的视图解析器                                                 |
| FreeMarkerViewResolver         | 将视图解析为 FreeMarker 模板                                                                                                           |
| InternalResourceViewResolver   | 将视图解析为 Web 应用的内部资源（一般为 JSP）|
| JasperReportsViewResolver      | 将视图解析为 JasperReports 定义                                                                                                        |
| ResourceBundleViewResolver     | 将视图解析为资源 bundle（一般为属性文件）|
| TilesViewResolver              | 将视图解析为 Apache Tile 定义，其中 tile ID 与视图名称相同。注意有两个不同的 TilesViewResolver 实现，分别对应于 Tiles 2.0 和 Tiles 3.0 |
| UrlBasedViewResolver           | 直接根据视图的名称解析视图，视图的名称会匹配一个物理视图的定义                                                                         |
| VelocityLayoutViewResolver     | 将视图解析为 Velocity 布局，从不同的 Velocity 模板中组合页面                                                                           |
| VelocityViewResolver           | 将视图解析为 Velocity 模板                                                                                                             |
| XmlViewResolver                | 将视图解析为特定 XML 文件中的 bean 定义。类似于 BeanNameViewResolver                                                                   |
| XsltViewResolver               | 将视图解析为 XSLT 转换后的结果                                                                                                         |

```java
public interface ViewResolver {
    View resolverViewName(String viewName, Locale locale) throws Exception;
}
```

### 视图

视图简单的理解就是最后返回给用户的内容，它实现了 `View` 接口，有一个 `render` 方法。

```java
public interface View {  
    void render(@Nullable Map<String, ?> model, HttpServletRequest request, HttpServletResponse response)  
         throws Exception;  
  
}
```

我们可以实现自己的视图，只要实现这个接口就可以了。

## 其他细节

​DispatcherServlet​ 中有一个属性 throwExceptionIfNoHandlerFound​，默认情况下它被设置为 false​，在这种情况下 DispatcherServlet​ 如果找不到相关请求的处理程序，会将响应状态设置为 404​ 而不会引发异常。如果还配置了默认 servlet​ 处理，则始终将未解决的请求转发到默认 servlet​。

### HandlerAdapter 的作用

HandlerAdapter 字面上的意思就是处理适配器，它的作用用一句话概括就是调用具体的方法对用户发来的请求来进行处理。当 handlerMapping 获取到执行请求的 controller 时，DispatcherServlte 会根据 controller 对应的 controller 类型来调用相应的 HandlerAdapter 来进行处理。

#### HandlerAdapter 的注册

DispatcherServlte 会根据配置文件信息注册 HandlerAdapter，如果在配置文件中没有配置，那么 DispatcherServlte 会获取 HandlerAdapter 的默认配置，如果是读取默认配置的话，DispatcherServlte 会读取 DispatcherServlte. Properties 文件, 该文件中配置了三种 HandlerAdapter：HttpRequestHandlerAdapter，SimpleControllerHandlerAdapter 和 AnnotationMethodHandlerAdapter。DispatcherServlte 会将这三个 HandlerAdapter 对象存储到它的 handlerAdapters 这个集合属性中，这样就完成了 HandlerAdapter 的注册。

#### HandlerAdapter 的执行

HandlerAdapter 接口方法如下:

```java
Public interface HandlerAdapter {
    Boolean supports (Object handler);
    ModelAndView handle (HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;
    Long getLastModified (HttpServletRequest request, Object handler);
}
```

DispatcherServlte 会根据 handlerMapping 传过来的 controller 与已经注册好了的 HandlerAdapter 一一匹配，看哪一种 HandlerAdapter 是支持该 controller 类型的，这调用的是 supports 方法，如果支持的话就会返回 true. 如果找到了其中一种 HandlerAdapter 是支持传过来的 controller 类型，那么该 HandlerAdapter 会调用自己的 handle 方法，handle 方法运用 java 的反射机制执行 controller 的具体方法来获得 ModelAndView, 例如 SimpleControllerHandlerAdapter 是支持实现了 controller 接口的控制器，如果自己写的控制器实现了 controller 接口，那么 SimpleControllerHandlerAdapter 就会去执行自己写控制器中的具体方法来完成请求。

今天再来看源码，发现处理器根本就不只有 Controller 这一种。还有 HttpRequestHandler，Servlet 等处理器。下面来介绍一下几种适配器对应的处理器以及这些处理器的作用

1. AnnotationMethodHandlerAdapter 主要是适配注解类处理器，注解类处理器就是我们经常使用的 @Controller 的这类处理器
2. HttpRequestHandlerAdapter 主要是适配静态资源处理器，静态资源处理器就是实现了 HttpRequestHandler 接口的处理器，这类处理器的作用是处理通过 SpringMVC 来访问的静态资源的请求
3. SimpleControllerHandlerAdapter 是 Controller 处理适配器，适配实现了 Controller 接口或 Controller 接口子类的处理器，比如我们经常自己写的 Controller 来继承 MultiActionController.
4. SimpleServletHandlerAdapter 是 Servlet 处理适配器, 适配实现了 Servlet 接口或 Servlet 的子类的处理器，我们不仅可以在 web. Xml 里面配置 Servlet，其实也可以用 SpringMVC 来配置 Servlet，不过这个适配器很少用到，而且 SpringMVC 默认的适配器没有他，默认的是前面的三种。

## 父子容器

![](附件/image/SpirngMVC进阶知识_image_2.png)

Spring Web 应用在启动的时候会将两个容器，一个容器由 `ContextLoaderListener` 创建，一个由 `DispatcherServlet` 创建。

`DispatcherServlet` 是整个 SpringMVC 的入口，它创建的容器主要用来存放与 SpringMVC 相关的类，如映射器、视图解析器和控制器等，`ContextLoaderListener` 创建的容器用来存放应用中其他的 Bean，主要是我们自己编写的，如 Dao 层和 Service 层的 Bean。`DispatcherServlet` 开始创建容器的时候会把 `ContextLoaderListener` 设置为自己的父容器，所以 `ContextLoaderListener` 容器对 `DispatcherServlet` 容器是可见的。
