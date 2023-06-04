---
type: note
created: 2023-06-04 15:12:27
updated: 2023-06-04 15:12:27
tags: []
categories: []
---

基于 token 登陆的流程大致是：

- 用户登陆成功，服务器生成一个 token 返回给客户端；
- 客户端发起请求时携带上 token；
- 服务端接收到请求，从请求中获取 token 并判断 token 的正确性，如果正确则认证成功。

首先创建一个工具类用于 token 的生成和验证：

```java
public class JwtUtil {

    // 生成token
    public static String create(String username) {

        DateTime issuedTime = DateUtil.date();
        DateTime expiresTime = DateUtil.offsetDay(issuedTime, 1);
        return JWT.create()
                .setIssuedAt(issuedTime)
                .setExpiresAt(expiresTime)
                .setPayload("username", username)
                .setKey("123456".getBytes())
                .sign();
    }

    // 验证token
    public static boolean verify(String token) {
        if(!JWTUtil.verify(token, "123456".getBytes())) {
            return false;
        }

        boolean flag = true;
        try {
            JWTValidator.of(token).validateDate(DateUtil.date());
        } catch (ValidateException ex) {
           flag = false;
        }

        return flag;
    }

    // 获取token中的用户名信息
    public static String name(String token) {
        return (String) JWTUtil.parseToken(token).getPayload("username");
    }
}

```

之后是登陆成功之后下发 token，根据 SpringSecurity 的逻辑，这一步可以在 `UsernamePasswordAuthenticationFilter` 的回调中处理。

```java
public class AuthenticationSuccessHandler implements org.springframework.security.web.authentication.AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Result<String> ok = Result.ok("登陆成功", JwtUtil.create(authentication.getName()));
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.getWriter().print(JSONUtil.toJsonStr(ok));
    }
}
```

```java
loginFilter.setAuthenticationSuccessHandler(new AuthenticationSuccessHandler());
```

在前端页面中可以把返回的 token 存储在 `localStorage` 中，然后每次请求都从其中获取 token 添加到请求中。

```js
function loginHandler() {
    login(userName.value, passWord.value).then(
        //登陆
        data => {
            if (data.code == 200) {
                localStorage.setItem("token", data.data)
                router.push({
                    path: '/home',
                })
            }
        }
    )
}
```

```js
request.interceptors.request.use(function (config) {
    // 添加
    config.headers.set("token", localStorage.getItem("token"))
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
```

最后是在服务端创建一个 token 验证的过滤器，它的大致逻辑是拦截请求，获取 token 值并进行校验，如果成功则生成一个 `Authentication` 放入 SecurityContextHolder 中，表示认证成功。

```java
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {


    private IUserService userService;


    private AntPathRequestMatcher path = new AntPathRequestMatcher("/login",
            "POST");

    public JwtAuthenticationTokenFilter(IUserService userService) {
        this.userService = userService;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {


        if(path.matches(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = request.getHeader("token");

        if(ObjectUtil.isNull(token)) {
            filterChain.doFilter(request, response);
            return;
        }


        if(!JwtUtil.verify(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String name = JwtUtil.name(token);

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", name);

        List<User> userList = userService.list(queryWrapper);

        if(userList.size() != 1) {
            filterChain.doFilter(request, response);
            return;
        }


        User user = userList.get(0);
        UserHolder.setUser(user);
        UsernamePasswordAuthenticationToken authenticated = UsernamePasswordAuthenticationToken.authenticated(
                user.getUsername(), user.getPassword(), null);

        authenticated.setDetails(new WebAuthenticationDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticated);

        filterChain.doFilter(request, response);
    }
}

```
