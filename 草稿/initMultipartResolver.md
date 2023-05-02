---
type: note
date: 2023-05-02 17:44:07
update: 2023-05-02 17:44:07
tags:
categories: 
---

```java
private void initMultipartResolver(ApplicationContext context) {
	try {
		this.multipartResolver = context.getBean(MULTIPART_RESOLVER_BEAN_NAME, MultipartResolver.class);
		if (logger.isTraceEnabled()) {
			logger.trace("Detected " + this.multipartResolver);
		}
		else if (logger.isDebugEnabled()) {
			logger.debug("Detected " + this.multipartResolver.getClass().getSimpleName());
		}
	}
	catch (NoSuchBeanDefinitionException ex) {
		// Default is no multipart resolver.
		this.multipartResolver = null;
		if (logger.isTraceEnabled()) {
			logger.trace("No MultipartResolver '" + MULTIPART_RESOLVER_BEAN_NAME + "' declared");
		}
	}
}
```


