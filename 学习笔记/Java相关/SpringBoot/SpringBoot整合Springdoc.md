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

### 依赖引入

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

### 信息配置

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

### 扫描路径

接着配置需要扫描的接口所在的包，方法是在容器中注入一个 `GroupedOpenApi`，如下面的配置中 `Springdoc` 将会扫描 `com.liang.cfile.controller` 但是不包括 `com.liang.cfile.controller.admin` 包。

```java
@Bean
public GroupedOpenApi userApi() {
	return GroupedOpenApi.builder()
			.group("user")
			.packagesToScan("com.liang.cfile.controller")
			.packagesToExclude("com.liang.cfile.controller.admin")
			.build();
}
```

需要注意的是只有类上有 `@Tag` 注解以及方法上有 `@Operation` 注解的接口才会被 `Springdoc` 扫描到。

```java
@Tag(name = "用户接口")
@Controller
@RequestMapping("/user")
public class UserController {

    @Operation
    @GetMapping("/login")
    public void login() {

    }

}
```

然后启动项目就能看到 `UserController` 中的借口被展示出来了。

![](附件/image/SpringBoot整合Springdoc_image_5.png)

`Springdoc` 还支持 `api` 的分组展示，只需要像容器中注入另一个 `GroupedOpenApi` 即可，在页面顶部选择框中能够对接口分组进行切换。

```java
@Bean
public GroupedOpenApi adminApi() {
	return GroupedOpenApi.builder()
			.group("admin")
			.packagesToScan("com.liang.cfile.controller.admin")
			.build();
}
```

![](附件/image/SpringBoot整合Springdoc_image_6.png)

## 常用注解

### `@Tag`

`@Tag` 注解使用在 `Controller` 类上，只有这样该 `Controller` 类才会被 `Springdoc` 扫描到。

```java
@Tag(name = "用户接口", description = "所有用户相关的操作")
@Controller
@RequestMapping("/user")
public class UserController {
	// 省略接口
}
```

![](附件/image/SpringBoot整合Springdoc_image_7.png)

### `@Operation`

`@Operation` 注解用在 `Controller` 类的方法上，表示当前方法是一个接口，之后会被展示在页面上。

![](附件/image/SpringBoot整合Springdoc_image_8.png)

```java
@Operation(summary = "用户登陆")
@GetMapping("/login")
public void login() {

}
```

### `@Parameters` 和 `@Parameter`

`@Parameters` 注解用在方法上，`@Parameter` 注解用在 `@Parameters` 内部或者方法的属性上，用于

```java
@Operation(summary = "用户登陆")
@GetMapping("/login")
public void login(@Parameter(description = "用户名") String username) {

}
```


```java
@Operation(summary = "用户登陆")
@Parameters({
		@Parameter(name = "username", description = "用户名")
})
@GetMapping("/login")
public void login(String username) {

}
```

![](附件/image/SpringBoot整合Springdoc_image_9.png)

@Parameters	Controller 方法上
@Parameter (description=“参数描述”)	Controller 方法上 @Parameters 里
@Parameter (description=“参数描述”)	Controller 方法的参数上
@Parameter (hidden = true) 或 @Operation (hidden = true) 或 @Hidden	-
@Schema	DTO 类上
@Schema	DTO 属性上

## 参考资料

- [OpenAPI 3 Library for spring-boot](https://springdoc.org/index.html#Introduction)
