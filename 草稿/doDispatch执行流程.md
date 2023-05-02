---
type: note
date: 2023-05-02 18:12:56
update: 2023-05-02 18:15:37
tags: []
categories: []
---

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
	HttpServletRequest processedRequest = request;
	HandlerExecutionChain mappedHandler = null;
	boolean multipartRequestParsed = false;

	WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

	try {
		ModelAndView mv = null;
		Exception dispatchException = null;

		try {
			processedRequest = checkMultipart(request);
			multipartRequestParsed = (processedRequest != request);

			// Determine handler for the current request.
			mappedHandler = getHandler(processedRequest);
			if (mappedHandler == null) {
				noHandlerFound(processedRequest, response);
				return;
			}

			// Determine handler adapter for the current request.
			HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

			// Process last-modified header, if supported by the handler.
			String method = request.getMethod();
			boolean isGet = HttpMethod.GET.matches(method);
			if (isGet || HttpMethod.HEAD.matches(method)) {
				long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
				if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
					return;
				}
			}

			if (!mappedHandler.applyPreHandle(processedRequest, response)) {
				return;
			}

			// Actually invoke the handler.
			mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

			if (asyncManager.isConcurrentHandlingStarted()) {
				return;
			}

			applyDefaultViewName(processedRequest, mv);
			mappedHandler.applyPostHandle(processedRequest, response, mv);
		}
		catch (Exception ex) {
			dispatchException = ex;
		}
		catch (Throwable err) {
			// As of 4.3, we're processing Errors thrown from handler methods as well,
			// making them available for @ExceptionHandler methods and other scenarios.
			dispatchException = new NestedServletException("Handler dispatch failed", err);
		}
		processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
	}
	catch (Exception ex) {
		triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
	}
	catch (Throwable err) {
		triggerAfterCompletion(processedRequest, response, mappedHandler,
				new NestedServletException("Handler processing failed", err));
	}
	finally {
		if (asyncManager.isConcurrentHandlingStarted()) {
			// Instead of postHandle and afterCompletion
			if (mappedHandler != null) {
				mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
			}
		}
		else {
			// Clean up any resources used by a multipart request.
			if (multipartRequestParsed) {
				cleanupMultipart(processedRequest);
			}
		}
	}
}
```

## processDispatchResult

```java
private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,
		@Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv,
		@Nullable Exception exception) throws Exception {

	boolean errorView = false;

	if (exception != null) {
		if (exception instanceof ModelAndViewDefiningException) {
			logger.debug("ModelAndViewDefiningException encountered", exception);
			mv = ((ModelAndViewDefiningException) exception).getModelAndView();
		}
		else {
			Object handler = (mappedHandler != null ? mappedHandler.getHandler() : null);
			mv = processHandlerException(request, response, handler, exception);
			errorView = (mv != null);
		}
	}

	// Did the handler return a view to render?
	if (mv != null && !mv.wasCleared()) {
		render(mv, request, response);
		if (errorView) {
			WebUtils.clearErrorRequestAttributes(request);
		}
	}
	else {
		if (logger.isTraceEnabled()) {
			logger.trace("No view rendering, null ModelAndView returned.");
		}
	}

	if (WebAsyncUtils.getAsyncManager(request).isConcurrentHandlingStarted()) {
		// Concurrent handling started during a forward
		return;
	}

	if (mappedHandler != null) {
		// Exception (if any) is already handled..
		mappedHandler.triggerAfterCompletion(request, response, null);
	}
}
```

## processHandlerException

```java
@Nullable
protected ModelAndView processHandlerException(HttpServletRequest request, HttpServletResponse response,
		@Nullable Object handler, Exception ex) throws Exception {

	// Success and error responses may use different content types
	request.removeAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);

	// Check registered HandlerExceptionResolvers...
	ModelAndView exMv = null;
	if (this.handlerExceptionResolvers != null) {
		for (HandlerExceptionResolver resolver : this.handlerExceptionResolvers) {
			exMv = resolver.resolveException(request, response, handler, ex);
			if (exMv != null) {
				break;
			}
		}
	}
	if (exMv != null) {
		if (exMv.isEmpty()) {
			request.setAttribute(EXCEPTION_ATTRIBUTE, ex);
			return null;
		}
		// We might still need view name translation for a plain error model...
		if (!exMv.hasView()) {
			String defaultViewName = getDefaultViewName(request);
			if (defaultViewName != null) {
				exMv.setViewName(defaultViewName);
			}
		}
		if (logger.isTraceEnabled()) {
			logger.trace("Using resolved error view: " + exMv, ex);
		}
		else if (logger.isDebugEnabled()) {
			logger.debug("Using resolved error view: " + exMv);
		}
		WebUtils.exposeErrorRequestAttributes(request, ex, getServletName());
		return exMv;
	}

	throw ex;
}
```