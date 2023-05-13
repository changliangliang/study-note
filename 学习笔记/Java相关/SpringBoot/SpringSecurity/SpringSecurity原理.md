---
type: note
created: 2023-05-08 22:26:00
updated: 2023-05-08 22:26:00
tags:
categories: 
---

## 原理



![](附件/image/SpringSecurity配置_image_1.png)

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
	// do something before the rest of the application
    chain.doFilter(request, response); // invoke the rest of the application
    // do something after the rest of the application
}
```


![](附件/image/SpringSecurity配置_image_2.png)


