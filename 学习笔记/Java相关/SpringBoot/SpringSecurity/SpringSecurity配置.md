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

## 用户名密码认证

### 登陆页面

SpringSecurity 中默认支持了使用密码和用户名登陆，只要引入 SpringSecurity 相关依赖后我们的应用就被保护起来了，这时候访问任意一个连接都会跳转到如下页面，需要输入用户名和密码后才能继续访问。

![](附件/image/SpringSecurity配置_image_1.png)

默认配置下会创建一个名为 `user` 的用户，在后台日志中可以看到该用户的密码，需要注意的是每次程序启动都会生成一个新的密码。

![](附件/image/SpringSecurity配置_image_2.png)

SpringSecurity 支持了我们对登陆页面的自定义，方式如下：

```java
http.formLogin()
        .usernameParameter("username") // 用户名参数名
        .passwordParameter("password") // 密码参数名
        .loginPage("/loginPage")       // 登陆页面路径,访问时如果用户没登陆会跳转到该页面
        .loginProcessingUrl("/longin") // 登陆处理路径,登陆时提交数据的地址
        .successForwardUrl("/success") // 登陆成功后返回的地址
        .failureForwardUrl("/fail");   // 登陆失败后返回的地址                     
```

如果程序采用前后端分离的方式，那么登陆成功或失败的时候应该返回 `json` 数据，可以选择使用 `successHandler` 和 `failureHandler`。

```java
http.formLogin()
        .successHandler()
        .failureHandler();
```

这两个方法分别需要传入一个 `AuthenticationSuccessHandler` 和 `AuthenticationFailureHandler`，在登陆成功或失败的时候会分别调用 `onAuthenticationSuccess` 和 `onAuthenticationFailure`。

```java
public final T successHandler(AuthenticationSuccessHandler successHandler) {
    this.successHandler = successHandler;
    return getSelf();
}

public interface AuthenticationSuccessHandler {

    void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException;

}
```

```java
public final T failureHandler(AuthenticationFailureHandler authenticationFailureHandler) {
    this.failureUrl = null;
    this.failureHandler = authenticationFailureHandler;
    return getSelf();
}

public interface AuthenticationFailureHandler {

    void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException;

}
```

想要返回 `json` 数据可以实现这两个方法，如下面的代码所示：

```java
public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Result<String> ok = Result.ok("登陆成功", JwtUtil.create(authentication.getName()));
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.getWriter().print(JSONUtil.toJsonStr(ok));
}
```

### 密码存储

#### 存储在内存

默认配置下程序启动时会创建一个名为 `user` 用户，原因是在 SrpingSecurity 自动配置中注入了一个 `InMemoryUserDetailsManager` 实例，它实现了 `UserDetailsService` 接口，是获取用户名的组件。

```java
@Bean
@Lazy
public InMemoryUserDetailsManager inMemoryUserDetailsManager(SecurityProperties properties,
        ObjectProvider<PasswordEncoder> passwordEncoder) {
    SecurityProperties.User user = properties.getUser();
    List<String> roles = user.getRoles();
    return new InMemoryUserDetailsManager(
            User.withUsername(user.getName()).password(getOrDeducePassword(user, passwordEncoder.getIfAvailable()))
                    .roles(StringUtils.toStringArray(roles)).build());
}
```

如果想用添加自定义的用户，需要 Spring 向容器中添加一个新的 `InMemoryUserDetailsManager`，需要注意的是添加用户时使用的密码应该为加密后的。

```java
@Bean
public UserDetailsService users() {
    UserDetails user = User.builder()
        .username("user")
        .password("{bcrypt}$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW")
        .roles("USER")
        .build();
    UserDetails admin = User.builder()
        .username("admin")
        .password("{bcrypt}$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW")
        .roles("USER", "ADMIN")
        .build();
    return new InMemoryUserDetailsManager(user, admin);
}
```

#### 存储在数据库

在内存重存储的数据一段程序重启就丢失了，所以密码在生产环境中应该存储到数据库（如 MySQL）中，SpringSecurity 提供了这方面的支持，只要添加一个 `JdbcUserDetailsManager` 实例即可，需要注意的是使用数据的时候需要提前在数据库中创建对应的用户表，创建表的 SQL 语句存放在 `org/springframework/security/core/userdetails/jdbc/users.ddl` 中。

```java
@Bean
UserDetailsService users(DataSource dataSource) {
    UserDetails user = User.builder()
        .username("user")
        .password("{bcrypt}$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW")
        .roles("USER")
        .build();
    UserDetails admin = User.builder()
        .username("admin")
        .password("{bcrypt}$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW")
        .roles("USER", "ADMIN")
        .build();
    JdbcUserDetailsManager users = new JdbcUserDetailsManager(dataSource);
    users.createUser(user);
    users.createUser(admin);
    return users;
}
```

```sql
create table users(username varchar_ignorecase(50) not null primary key,password varchar_ignorecase(500) not null,enabled boolean not null);
create table authorities (username varchar_ignorecase(50) not null,authority varchar_ignorecase(50) not null,constraint fk_authorities_users foreign key(username) references users(username));
create unique index ix_auth_username on authorities (username,authority);
```

这种方式的问题在于需要创建一个单独的用户表来存储信息，使用起来不够灵活，自定义的用户还需要创建其他表来存放，解决方法是实现一个自己的 `UserDetailsService`，在 `loadUserByUsername` 方法中可以从任意数据源获取用户信息。

```java
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private IUserService userService;

    public UserDetailsService(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        List<User> userList = userService.list(queryWrapper);
        if(userList.size() != 1) {
            throw new UsernameNotFoundException("用户不存在！");
        }
        User user = userList.get(0);
        return new com.liang.cfile.config.security.UserDetails(user);
    }
}
```

## Session 管理

### 超时设置

Session 超时设置是 SpringBoot 原生支持的，时间单位为秒，最小有效期为 60 秒，也就是说即使你设置为小于 60 秒的值，其有效期还是为 60 秒。

```java
server:
  servlet:
    session:
      timeout: 1000
```

### 创建时机

SpringSecurity 通过了四种创建 Session 的策略：

- ALWAYS：总是创建 Session
- NEVER：不主动创建 Seesion，但会使用已存在的 Session
- IF_REQUIRED：近在需要的时候创建 Session
- STATELESS：从不使用 Session

需要注意的是这里仅是 SpringSecurity 的 Session 创建策略，没办法控制应用中的其他部分，假设使用了 `STATELESS` 策略，也仅仅表示 SpringSecurity 不会使用或者操作 Session，但我们仍能在 `Controller` 中创建 Session 和使用 Session。

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    return http.build();
}
```

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http
        .logout(logout -> logout
            .deleteCookies("JSESSIONID")
        );
    return http.build();
}
```

### 失效处理

当 Session 过期之后，可以选择跳转到指定页面 (如登陆页面)：

```java
http.sessionManagement()
        .invalidSessionUrl("/login/page"); 
```

也可以使用自定义的失效处理策略：

```java
http.sessionManagement()
        .invalidSessionStrategy(invalidSessionStrategy) // 自己实现的策略
```

### 并发控制

要对 Session 进行并发控制，首先要做的是向容器中添加一个监听器，之后可以在配置中设置最大的并发量。

```java
@Bean
public HttpSessionEventPublisher httpSessionEventPublisher() {
    return new HttpSessionEventPublisher();
}
```

```java
http.sessionManagement()
        .maximumSessions(1)
        .maxSessionsPreventsLogin(true); // 默认情况下后登陆的会把先登陆的顶掉
								         // 该配置用于阻止后登陆
```

## 授权


## Remenber Me

#todo

## 密码问题
