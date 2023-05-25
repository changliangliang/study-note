---
type: note
created: 2023-05-08 22:26:00
updated: 2023-05-08 22:26:00
tags: []
categories: []
---

## 过滤器链

在 Tomcat 之类的 web 容器中，用户请求在被 Servlet 处理之前会首先通过一组过滤器，在过滤器中可以更改用户请求或者拦截请求。

![](附件/image/SpringSecurity原理_image_1.png)

SpringMVC 的入口 DispatcherServlet 本质上也是一个 Servlet，所有被 SpringMVC 处理的请求也都要通过过滤器，那么就可以在过滤器中对请求进行权限校验，SpringSecurity 也正是这么做的，它在 web 容器的过滤器链中插入了一个 DelegatingFilterProxy 作为自己的入口。

![](附件/image/SpringSecurity原理_image_2.png)

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
- AuthorizationFilter
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

SpringSecurity 中有一个 `SecurityContextHolder` 类用于存储用于认证和权限的相关信息，并且默认情况下使用 `ThreadLocal` 来存储，所以在过滤器链中的任何一个过滤器中都能向 `SecurityContextHolder` 中添加认证信息或者从中获取认证信息，例如下面的代码片段就是创建了一个已认证的用户信息并添加到了 `SecurityContextHolder` 中。在 `FilterSecurityInterceptor` 或者 `AuthorizationFilter` 过滤器中会获取 `SecurityContextHolder` 中的信息，判断用户是否已经认证以及拥有访问当前资源的权限。

```java
UsernamePasswordAuthenticationToken authenticated = UsernamePasswordAuthenticationToken.authenticated(
            user.getUsername(), user.getPassword(), null);

authenticated.setDetails(new WebAuthenticationDetails(request));
SecurityContextHolder.getContext().setAuthentication(authenticated);
```

![](附件/image/SpringSecurity原理_image_3.png)

SpringSecurity 负责认证的组件的是 `AuthenticationManager`，其中 `ProviderManager` 是它的一个具体实现，内部保存了一个 `AuthenticationProvider` 列表，每个 `AuthenticationProvider` 都能用于验证特定的令牌。

![](附件/image/SpringSecurity原理_image_4.png)

以常用的用户名密码登陆展示一下 SpringSecurity 中的认证流程如下：

- 用户发起请求，提交用户名密码；
- 请求经过 SpringSecurity 的过滤器链，并被 `UsernamePasswordAuthenticationFilter` 过滤器拦截；
- `UsernamePasswordAuthenticationFilter` 从请求中提取用户名密码，并构建出一个 `UsernamePasswordAuthenticationToken` 对象，本质上就是一个未被认证过的 `Authentication`；
- 使用 `AuthenticationManager` 对 `UsernamePasswordAuthenticationToken` 进行认证，简单的理解就是比对用户名和密码；
    - 如果通过认证，则将认证完成的 `UsernamePasswordAuthenticationToken` 放入 `SecurityContextHolder` 进行后续的处理流程；
    - 如果没有通过认证，则就进行认证失败的处理流程。

![](附件/image/SpringSecurity原理_image_5.png)

![](附件/image/SpringSecurity原理_image_6.png)
