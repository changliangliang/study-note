---
type: note
created: 2023-04-30 15:05:58
updated: 2023-04-30 15:05:58
tags: []
categories: []
status: 0
---

## MultipartResolver

在 `SpringMVC` 中负责处理文件上传的是 `MultipartResolver` 接口，它负责将上传请求包装成可以直接获取文件的数据，使得我们可以在 `Controller` 中轻易的处理文件，而不需要自己对文件进行解析。

`MultipartResolver` 接口有两个实现类：

- `CommonsMultipartResolver`：使用了 Apache 的 `commons-fileupload` 来完成具体的上传操作；
- `StandardServletMultipartResolver`：使用了 Servlet 3.0 标准的上传方式。

## CommonsMultipartResolver

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

## StandardServletMultipartResolver

`StandardServletMultipartResolver` 使用了 Servlet 3.0 标准的上传方式，因此不需要额外的添加依赖，并且在使用 `SpringBoot` 时容器中会自动注入一个 `StandardServletMultipartResolver`，所以我们也不需要在手动注入。

对于 `StandardServletMultipartResolver` 的配置可以选择在容器中注入一个 `MultipartConfigElement`：

```java
@Bean
public MultipartConfigElement multipartConfigElement() {
    MultipartConfigFactory multipartConfigFactory = new MultipartConfigFactory();
    multipartConfigFactory.setLocation("d:/");
    multipartConfigFactory.setMaxFileSize(DataSize.of(10, DataUnit.GIGABYTES));
    return multipartConfigFactory.createMultipartConfig();
}
```

或者在 `SpringBoot` 配置文件中进行配置：

```yaml
spring:
  servlet:
    multipart:
      location: "D:/code/temp/file"
      max-file-size: 1MB
```

## 接收文件

文件的接收比较简单，只要在接口中添加 `MultipartFile` 类型的参数即可：

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

## 下载文件

```java
@GetMapping(value = "/download/{id}")
public void downloadFile(@PathVariable("id") int id, HttpServletResponse response) throws Exception {

    File file = fileService.getById(id);

    if (null == file) {
        // todo 文件不存在处理
        throw new Exception();
    }

    //文件所在路径
    String filepath = String.join("/", fileLocation, file.getUuid());

    java.io.File downloadFile = new java.io.File(filepath);
    response.reset();
    response.setContentType("application/octet-stream");
    response.setContentLength((int) downloadFile.length());
    response.setHeader("Content-Disposition", "attachment;filename=" + file.getName());

    try(BufferedInputStream in = new BufferedInputStream(new FileInputStream(downloadFile))) {
        in.transferTo(response.getOutputStream());
    }
}

```
