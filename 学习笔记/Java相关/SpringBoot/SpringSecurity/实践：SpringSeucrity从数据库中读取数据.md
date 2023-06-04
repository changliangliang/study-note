---
type: note
created: 2023-06-02 20:52:37
updated: 2023-06-02 20:52:37
tags: []
categories: []
---

使用默认的配置时要想将用户数据存储到数据库中，需要根据 `org/springframework/security/core/userdetails/jdbc/users.ddl` 中的 SQ 创建一个数据表，如果我们想用自己的用户表，那么就需要编写代码实现自己的用户加载逻辑，即实现一个 `UserDetailsService`。

```java
public class MyUserDetailsService implements UserDetailsService {


    // service层，获取用户数据
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
        return new MyUserDetails(user);
    }
}

```

`loadUserByUsername` 方法需要返回一个 `UserDetails` 类型的数据：

```java
public class MyUserDetails implements UserDetails {


    private User user;

    public UserDetails(User user) {
        this.user = user;
    }

    // 获取用户拥有的权限
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        // 因为数库中存放的数据时int类型，这里进行了转化
        ArrayList<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(user.getUsername()));

        switch (user.getRole()) {
            case 0:
                grantedAuthorities.add(new SimpleGrantedAuthority("admin"));
                break;
            case 1:
                grantedAuthorities.add(new SimpleGrantedAuthority("user"));
        }
        return grantedAuthorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    // 是否过期
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 是否被锁定
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 密码是否过期
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 是否可用
    @Override
    public boolean isEnabled() {
        return true;
    }
}

```

如果使用的是默认的 `UsernamePasswordAuthenticationFilter` 进行登陆的验证，那么只需要进行如下配置即可：

```java
http.userDetailsService(new MyUserDetailsService());
```

如果自己手动创建了一个 `UsernamePasswordAuthenticationFilter` 或者是 `AbstractAuthenticationProcessingFilter` 的子类添加到了过滤器链中，那么需要进行的配置就比较多

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}


@Bean
public UserDetailsService userDetailsService() {
    return new MyUserDetailsService(userService);
}

@Bean
public AuthenticationManager authenticationManager() {
    return new ProviderManager(authenticationProvider());
}

@Bean
public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    daoAuthenticationProvider.setUserDetailsService(userDetailsService());
    return daoAuthenticationProvider;
}
```

```java
UsernamePasswordAuthenticationFilter loginFilter = new UsernamePasswordAuthenticationFilter();
loginFilter.setAuthenticationManager(authenticationManager());
```
