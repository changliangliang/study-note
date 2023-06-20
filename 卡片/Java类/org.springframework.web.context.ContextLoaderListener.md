---
---

```java
public class ContextLoaderListener extends ContextLoader implements ServletContextListener {

}
```

Spring 提供 ServletContentListener 的一个实现类 ContextLoaderListener 监听器，该类可以作为 Listener 使用，作用就是在启动 Tomcat 容器的时候自动装载 ApplicationContext 的配置信息，如果没有设置 contextConfigLocation 的初始参数则会使用默认参数 WEB-INF 路径下的 application. xml 文件。

ContextLoaderListener 会读取这些 XML 文件并产生 WebApplicationContext 对象，然后将这个对象放置在 ServletContext 的属性里，这样我们只要可以得到 Servlet 就可以得到 WebApplicationContext 对象，并利用这个对象访问 Spring 容器管理的 Bean。
