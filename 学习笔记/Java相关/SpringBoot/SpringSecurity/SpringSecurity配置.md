---
type: note
created: 2023-05-13 15:42:12
updated: 2023-05-13 15:42:12
tags: []
categories: []
---

## 依赖

在 SpringBoot 中使用 SpringSecurity 只需要引入如下依赖即可，其中包含了对 SpringSecurity 的自动配置。

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

## HttpSecurity 配置

SpringSecurity 中最核心的就是 `SecurityFilterChain`，在默认的自动配置中会像 Spring 容器中添加一个 `SecurityFilterChain`。

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
class SpringBootWebSecurityConfiguration {


    @Configuration(proxyBeanMethods = false)
    @ConditionalOnDefaultWebSecurity
    static class SecurityFilterChainConfiguration {

        @Bean
        @Order(SecurityProperties.BASIC_AUTH_ORDER)
        SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
            http.authorizeRequests().anyRequest().authenticated();
            http.formLogin();
            http.httpBasic();
            return http.build();
        }

    }
}
```

如果需要自定义过滤器链，只需要向 Srping 容器中添加一个 `SecurityFilterChain` 替换掉默认的即可。

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .formLogin(withDefaults())
        .httpBasic(withDefaults());
    return http.build();
}
```

### 用户名密码认证

SpringSecurity 中默认支持了使用密码和用户名登陆，只要引入 SpringSecurity 相关依赖后我们的应用就被保护起来了，这时候访问任意一个连接都会跳转到如下页面，需要输入用户名和密码后才能继续访问。

![](附件/image/SpringSecurity配置_image_1.png)

默认配置下用户名为 `user`，在后台日志中可以看到默认生成的密码。

![](附件/image/SpringSecurity配置_image_2.png)

当然大部分时候默认的处理都不能满足我们的需要，所以 SpringSecurity 支持我们对登陆页面进行自定义配置，如下面的代码所示。

```java
http.formLogin()
        .usernameParameter("username")
        .passwordParameter("password")
        .loginPage("/loginPage")
        .loginProcessingUrl("/longin")
        .successForwardUrl("/success")
        .failureForwardUrl("/fail");                        
```
