---
type: blog
status: 未发布
created: 2023-04-25 23:07:47
updated: 2023-04-25 23:07:47
tags: []
categories: []
---

## 介绍

`Springdoc` 的作用是把应用中的接口以文档的形式展示出来，同时可以直接在文档中对接口进行测试，方便开发的进行。

![](附件/image/SpringBoot整合Springdoc_image_1.png)

![](附件/image/SpringBoot整合Springdoc_image_2.png)

## 依赖

根据 [Springdoc官方文档](https://springdoc.org/#getting-started)，想要在项目中使用 `Springdoc` 只需要引入如下依赖即可：

```
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-ui</artifactId>
  <version>1.7.0</version>
</dependency>
```


之后像容器注入 `OpenAPI`，可以用来配置

```java
@Bean
public OpenAPI springShopOpenAPI() {
  return new OpenAPI()
		  .info(new Info().title("SpringShop API")
		  .description("Spring shop sample application")
		  .version("v0.0.1")
		  .license(new License().name("Apache 2.0").url("http://springdoc.org")))
		  .externalDocs(new ExternalDocumentation()
		  .description("SpringShop Wiki Documentation")
		  .url("https://springshop.wiki.github.org/docs"));
}
```



```
```