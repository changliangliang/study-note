---
type: blog
status: 未发布
created: 2023-04-30 15:05:58
updated: 2023-04-30 15:05:58
tags: []
categories: []
---

## MultipartResolver

在 `SpringMVC` 中负责处理文件上传的是 `MultipartResolver` 接口，它负责将上传请求包装成可以直接获取文件的数据，使得我们可以在 `Controller` 中轻易的处理文件，而不需要自己对文件进行解析。

`MultipartResolver` 接口有两个实现类：

- `CommonsMultipartResolver`：使用了 Apache 的 `commons-fileupload` 来完成具体的上传操作；
- `StandardServletMultipartResolver`：使用了 Servlet 3.0 标准的上传方式。

## CommonsMultipartResolver 使用

由于 `CommonsMultipartResolver` 基于 `commons-fileupload` 实现的，所以在使用前需要引入额外的依赖：

```xml
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.2.2</version>
</dependency>
```

之后想容器中添加一个 `CommonsMultipartResolver` 对象即可：

```java
@Bean
public CommonsMultipartResolver multipartResolver() {
	CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
	commonsMultipartResolver.setDefaultEncoding("utf-8");
	commonsMultipartResolver.setMaxUploadSize(500);
	return commonsMultipartResolver;
}
```




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
