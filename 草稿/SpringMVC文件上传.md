---
type: blog
status: 未发布
created: 2023-04-30 15:05:58
updated: 2023-04-30 15:05:58
tags: blog
categories: 
---


要启用 Multipart​ 处理，需要在 DispatcherServlet​ 配置中声明名称为 multipartResolver​ 的 MultipartResolver​ 类型的 bean​。收到 Content Type​ 为 multipart/form-data​ 的 POST​ 时，解析程序将解析内容并将当前 HttpServletRequest​ 包装为 MultipartHttpServletRequest​ 以提供对已解析部分的访问权限。

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