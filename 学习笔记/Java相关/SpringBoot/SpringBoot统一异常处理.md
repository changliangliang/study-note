---
type: note
date: 2023-05-02 15:55:09
update: 2023-05-02 18:09:14
tags: []
categories: []
---

## 为什么要统一处理异常

程序运行过程中可能会出现各种各样的错误，比如下面 `Controller` 中，业务处理过程中可能出现异常，那么在 `Controller` 中就必须捕获可能出现的异常并进行处理。

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping("add")
    public ResponseEntity<String> add( @RequestBody UserParam userParam) {
    
        try {
            // 业务处理
        } catch(Exception e) {
            // 处理异常;
        }
        return ResponseEntity.ok("success");
    }
}
```

这样的处理方式有两个缺陷：

- 如果需要处理的异常比较多，那么代码中会充斥这大量的 `try...catch...` 语句；
- 如果要改变某种异常的处理方式，需要在多处进行修改，可能会出现遗漏的情况。

为了解决以上问题，`SpringBoot` 对统一异常处理提供了支持：

## 基于 @ControllerAdvice 实现异常统一处理

`SpringBoot` 中异常统一处理使用到了 `@ControllerAdvice` 注解和 `@ExceptionHandler` 注解，其中 `@ControllerAdvice` 用在类上表明该类用于给 `Controller` 添加统一的操作和处理，`@ExceptionHandler` 用在方法上表明该方法用于处理异常，并且可以指定处理哪种异常，如下面的代码中 `handler` 方法用于处理 `CustomizeException` 及其子类异常。

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ResponseBody
    @ExceptionHandler(CustomizeException.class)
    public Result<Object> handler(Exception e) {
        return Result.fail(e.getMessage());
    }
}
```

之后在 `Controller` 层中就可以把异常处理的代码去掉，当有异常发生时会自动跳转到 ` @ExceptionHandler` 标注的方法中处理。

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping("add")
    public ResponseEntity<String> add( @RequestBody UserParam userParam) {
    
	    // 业务处理
        return ResponseEntity.ok("success");
    }
}
```

## 原理解析

`DispatcherServlet` 是 `SpringMVC` 入口，它有一个 ` initStrategies ` 方法用于初始化当前 `DispatcherServlet` 使用的策略，如使用哪个文件处理器（[[initMultipartResolver]]) 或者使用哪些视图解析器（[[initViewResolvers]]）。

```java
/**
 * Initialize the strategy objects that this servlet uses.
 * <p>May be overridden in subclasses in order to initialize further strategy objects.
 */
protected void initStrategies(ApplicationContext context) {
	initMultipartResolver(context);
	initLocaleResolver(context);
	initThemeResolver(context);
	initHandlerMappings(context);
	initHandlerAdapters(context);
	initHandlerExceptionResolvers(context);
	initRequestToViewNameTranslator(context);
	initViewResolvers(context);
	initFlashMapManager(context);
}
```

其中 `initHandlerExceptionResolvers` 是与异常相关的，它会从容器中获取所有的 `HandlerExceptionResolver`。

```java
private void initHandlerExceptionResolvers(ApplicationContext context) {
		this.handlerExceptionResolvers = null;

		if (this.detectAllHandlerExceptionResolvers) {
			// 从容器中获取所有的HandlerExceptionResolver
			Map<String, HandlerExceptionResolver> matchingBeans = BeanFactoryUtils
					.beansOfTypeIncludingAncestors(context, HandlerExceptionResolver.class, true, false);
			if (!matchingBeans.isEmpty()) {
				this.handlerExceptionResolvers = new ArrayList<>(matchingBeans.values());
				// We keep HandlerExceptionResolvers in sorted order.
				AnnotationAwareOrderComparator.sort(this.handlerExceptionResolvers);
			}
		}
		else {
			try {
				HandlerExceptionResolver her =
						context.getBean(HANDLER_EXCEPTION_RESOLVER_BEAN_NAME, HandlerExceptionResolver.class);
				this.handlerExceptionResolvers = Collections.singletonList(her);
			}
			catch (NoSuchBeanDefinitionException ex) {
				// Ignore, no HandlerExceptionResolver is fine too.
			}
		}

		// Ensure we have at least some HandlerExceptionResolvers, by registering
		// default HandlerExceptionResolvers if no other resolvers are found.
		if (this.handlerExceptionResolvers == null) {
			this.handlerExceptionResolvers = getDefaultStrategies(context, HandlerExceptionResolver.class);
			if (logger.isTraceEnabled()) {
				logger.trace("No HandlerExceptionResolvers declared in servlet '" + getServletName() +
						"': using default strategies from DispatcherServlet.properties");
			}
		}
	}
```

![](附件/image/SpringBoot统一异常处理_image_1.png)

通过调试可以得知 `initHandlerExceptionResolvers` 方法执行后，会有一个 `ExceptionHandlerExceptionResolver`，并且根据注释可知它就是处理 `@ExceptionHandler` 注解的，它会读取容器中所有 `@ControllerAdvice` 注解的类中所有的 `@ExceptionHandler` 注解的方法。

![](附件/image/SpringBoot统一异常处理_image_2.png)

```java
@Override
public void afterPropertiesSet() {
	// Do this first, it may add ResponseBodyAdvice beans
	initExceptionHandlerAdviceCache();

	if (this.argumentResolvers == null) {
		List<HandlerMethodArgumentResolver> resolvers = getDefaultArgumentResolvers();
		this.argumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);
	}
	if (this.returnValueHandlers == null) {
		List<HandlerMethodReturnValueHandler> handlers = getDefaultReturnValueHandlers();
		this.returnValueHandlers = new HandlerMethodReturnValueHandlerComposite().addHandlers(handlers);
	}
}

private void initExceptionHandlerAdviceCache() {
	if (getApplicationContext() == null) {
		return;
	}

	// 找到所有@ControllerAdvice注解的类
	List<ControllerAdviceBean> adviceBeans = ControllerAdviceBean.findAnnotatedBeans(getApplicationContext());
	for (ControllerAdviceBean adviceBean : adviceBeans) {
		Class<?> beanType = adviceBean.getBeanType();
		if (beanType == null) {
			throw new IllegalStateException("Unresolvable type for ControllerAdviceBean: " + adviceBean);
		}
		// 所有@ExceptionHandler注解的方法
		ExceptionHandlerMethodResolver resolver = new ExceptionHandlerMethodResolver(beanType);
		if (resolver.hasExceptionMappings()) {
			this.exceptionHandlerAdviceCache.put(adviceBean, resolver);
		}
		if (ResponseBodyAdvice.class.isAssignableFrom(beanType)) {
			this.responseBodyAdvice.add(adviceBean);
		}
	}

	if (logger.isDebugEnabled()) {
		int handlerSize = this.exceptionHandlerAdviceCache.size();
		int adviceSize = this.responseBodyAdvice.size();
		if (handlerSize == 0 && adviceSize == 0) {
			logger.debug("ControllerAdvice beans: none");
		}
		else {
			logger.debug("ControllerAdvice beans: " +
					handlerSize + " @ExceptionHandler, " + adviceSize + " ResponseBodyAdvice");
		}
	}
}
```
