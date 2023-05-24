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

## 过滤器链

在 Tomcat 之类的 web 容器中，用户请求在被 Servlet 处理之前会首先通过一组过滤器，在过滤器中可以更改用户请求或者拦截请求。

![](附件/image/SpringSecurity配置_image_1.png)

SpringMVC 的入口 DispatcherServlet 本质上也是一个 Servlet，所有被 SpringMVC 处理的请求也都要通过过滤器，那么就可以在过滤器中对请求进行权限校验，SpringSecurity 也正是这么做的，它在 web 容器的过滤器链中插入了一个 DelegatingFilterProxy 作为自己的入口。

![](附件/image/SpringSecurity配置_image_2.png)

DelegatingFilterProxy 会将请求委托给 FilterChainProxy 来处理，FilterChainProxy 又将请你交给 SecurityFilterChain，正在干活的是 SecurityFilterChain 中一个个的过滤器。

SecurityFilterChain 中可能包含以下过滤器（不包括我们自定义的过滤器），默认情况各个过滤器的顺序也如下：

- ForceEagerSessionCreationFilter
- ChannelProcessingFilter
- WebAsyncManagerIntegrationFilter
- SecurityContextPersistenceFilter
- HeaderWriterFilter
- CorsFilter
- CsrfFilter
- LogoutFilter
- OAuth2AuthorizationRequestRedirectFilter
- Saml2WebSsoAuthenticationRequestFilter
- X509AuthenticationFilter
- AbstractPreAuthenticatedProcessingFilter
- CasAuthenticationFilter
- OAuth2LoginAuthenticationFilter
- Saml2WebSsoAuthenticationFilter
- UsernamePasswordAuthenticationFilter
- DefaultLoginPageGeneratingFilter
- DefaultLogoutPageGeneratingFilter
- ConcurrentSessionFilter
- DigestAuthenticationFilter
- BearerTokenAuthenticationFilter
- BasicAuthenticationFilter
- RequestCacheAwareFilter
- SecurityContextHolderAwareRequestFilter
- JaasApiIntegrationFilter
- RememberMeAuthenticationFilter
- AnonymousAuthenticationFilter
- OAuth2AuthorizationCodeGrantFilter
- SessionManagementFilter
- ExceptionTranslationFilter
- FilterSecurityInterceptor
- SwitchUserFilter

## 异常处理

SpringSecurity 中异常处理通过 `ExceptionTranslationFilter` 来实现，它的 ` doFilter ` 方法源码如下，

```java
private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            chain.doFilter(request, response);
        }
        catch (IOException ex) {
            throw ex;
        }
        catch (Exception ex) {
            // Try to extract a SpringSecurityException from the stacktrace
            Throwable[] causeChain = this.throwableAnalyzer.determineCauseChain(ex);
            RuntimeException securityException = (AuthenticationException) this.throwableAnalyzer
                    .getFirstThrowableOfType(AuthenticationException.class, causeChain);
            if (securityException == null) {
                securityException = (AccessDeniedException) this.throwableAnalyzer
                        .getFirstThrowableOfType(AccessDeniedException.class, causeChain);
            }
            if (securityException == null) {
                rethrow(ex);
            }
            if (response.isCommitted()) {
                throw new ServletException("Unable to handle the Spring Security Exception "
                        + "because the response is already committed.", ex);
            }
            handleSpringSecurityException(request, response, chain, securityException);
        }
    }
    
    private void handleSpringSecurityException(HttpServletRequest request, HttpServletResponse response,
            FilterChain chain, RuntimeException exception) throws IOException, ServletException {
        if (exception instanceof AuthenticationException) {
            handleAuthenticationException(request, response, chain, (AuthenticationException) exception);
        }
        else if (exception instanceof AccessDeniedException) {
            handleAccessDeniedException(request, response, chain, (AccessDeniedException) exception);
        }
    }
```

整个 `doFilter` 方法的逻辑可以精简为：

```java
try {
    filterChain.doFilter(request, response); 
} catch (AccessDeniedException | AuthenticationException ex) {
    if (!authenticated || ex instanceof AuthenticationException) {
        startAuthentication(); 
    } else {
        accessDenied(); 
    }
}
```

## 认证原理
