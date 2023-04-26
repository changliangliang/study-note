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

## 配置

根据 [Springdoc官方文档](https://springdoc.org/#getting-started)，想要在项目中使用 `Springdoc` 只需要引入如下依赖即可：

```
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-ui</artifactId>
  <version>1.7.0</version>
</dependency>
```

之后即可在 `http://server:port/context-path/swagger-ui.html` 看到如下界面：

![](附件/image/SpringBoot整合Springdoc_image_3.png)

如果想要配置额外的信息，可以在容器中注入一个 `OpenAPI`，这些信息将会在页面中展示。

```java
@Bean
public OpenAPI springShopOpenAPI() {
	return new OpenAPI()
			.info(new Info().title("Cfile API")
					.description("一个在线文件解析网站")
					.version("v0.0.1")
					.license(new License()
							.name("Apache 2.0")
							.url("http://www.cfile.com"))
					.contact(new Contact()
							.email("changliangliang1996@foxmail.com")
							.name("chang")
							.url("http://changliangliang.github.io"))
			);
}
```

![](附件/image/SpringBoot整合Springdoc_image_4.png)

## 参考资料

- [OpenAPI 3 Library for spring-boot](https://springdoc.org/index.html#Introduction)
- 