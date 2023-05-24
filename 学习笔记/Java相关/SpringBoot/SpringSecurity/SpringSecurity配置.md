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

SpringSecurity 中最核心的就是 `SecurityFilterChain`，在默认的自动配置中会像 Spring 容器中添加一个 `SecurityFilterChain`，如果我们想要自己定义 `SecurityFilterChain` 只需要

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

	/**
	 * Configures the {@link ErrorPageSecurityFilter}.
	 */
	@Configuration(proxyBeanMethods = false)
	@ConditionalOnClass(WebInvocationPrivilegeEvaluator.class)
	@ConditionalOnBean(WebInvocationPrivilegeEvaluator.class)
	static class ErrorPageSecurityFilterConfiguration {

		@Bean
		FilterRegistrationBean<ErrorPageSecurityFilter> errorPageSecurityFilter(ApplicationContext context) {
			FilterRegistrationBean<ErrorPageSecurityFilter> registration = new FilterRegistrationBean<>(
					new ErrorPageSecurityFilter(context));
			registration.setDispatcherTypes(DispatcherType.ERROR);
			return registration;
		}

	}

	/**
	 * Adds the {@link EnableWebSecurity @EnableWebSecurity} annotation if Spring Security
	 * is on the classpath. This will make sure that the annotation is present with
	 * default security auto-configuration and also if the user adds custom security and
	 * forgets to add the annotation. If {@link EnableWebSecurity @EnableWebSecurity} has
	 * already been added or if a bean with name
	 * {@value BeanIds#SPRING_SECURITY_FILTER_CHAIN} has been configured by the user, this
	 * will back-off.
	 */
	@Configuration(proxyBeanMethods = false)
	@ConditionalOnMissingBean(name = BeanIds.SPRING_SECURITY_FILTER_CHAIN)
	@ConditionalOnClass(EnableWebSecurity.class)
	@EnableWebSecurity
	static class WebSecurityEnablerConfiguration {

	}

}```

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
