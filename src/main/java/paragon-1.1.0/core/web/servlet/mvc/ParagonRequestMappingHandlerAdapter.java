package paragon.core.web.servlet.mvc;

import java.util.ArrayList;
import java.util.List;
import org.springframework.util.CollectionUtils;
import org.springframework.web.method.annotation.ErrorsMethodArgumentResolver;
import org.springframework.web.method.annotation.ExpressionValueMethodArgumentResolver;
import org.springframework.web.method.annotation.MapMethodProcessor;
import org.springframework.web.method.annotation.ModelAttributeMethodProcessor;
import org.springframework.web.method.annotation.ModelMethodProcessor;
import org.springframework.web.method.annotation.RequestHeaderMapMethodArgumentResolver;
import org.springframework.web.method.annotation.RequestHeaderMethodArgumentResolver;
import org.springframework.web.method.annotation.RequestParamMethodArgumentResolver;
import org.springframework.web.method.annotation.SessionStatusMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.mvc.method.annotation.HttpEntityMethodProcessor;
import org.springframework.web.servlet.mvc.method.annotation.ModelAndViewMethodReturnValueHandler;
import org.springframework.web.servlet.mvc.method.annotation.ModelAndViewResolverMethodReturnValueHandler;
import org.springframework.web.servlet.mvc.method.annotation.PathVariableMethodArgumentResolver;
import org.springframework.web.servlet.mvc.method.annotation.RedirectAttributesMethodArgumentResolver;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestPartMethodArgumentResolver;
import org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor;
import org.springframework.web.servlet.mvc.method.annotation.ServletCookieValueMethodArgumentResolver;
import org.springframework.web.servlet.mvc.method.annotation.ServletModelAttributeMethodProcessor;
import org.springframework.web.servlet.mvc.method.annotation.ServletRequestMethodArgumentResolver;
import org.springframework.web.servlet.mvc.method.annotation.ServletResponseMethodArgumentResolver;
import org.springframework.web.servlet.mvc.method.annotation.UriComponentsBuilderMethodArgumentResolver;
import org.springframework.web.servlet.mvc.method.annotation.ViewMethodReturnValueHandler;
import org.springframework.web.servlet.mvc.method.annotation.ViewNameMethodReturnValueHandler;

public class ParagonRequestMappingHandlerAdapter extends RequestMappingHandlerAdapter
{
  private HandlerMethodArgumentResolver paramsArgumentResolver;
  private HandlerMethodReturnValueHandler paramsReturnValueHandler;
  
  public ParagonRequestMappingHandlerAdapter()
  {
    paramsArgumentResolver = null;
    paramsReturnValueHandler = null;
  }
  
  public void afterPropertiesSet() { super.afterPropertiesSet();
    List<HandlerMethodArgumentResolver> resolvers = getDefaultArgumentResolvers();
    setArgumentResolvers(resolvers);
    List<HandlerMethodReturnValueHandler> returnValueHandlers = getDefaultReturnValueHandlers();
    setReturnValueHandlers(returnValueHandlers);
  }
  
  private List<HandlerMethodArgumentResolver> getDefaultArgumentResolvers() {
    List<HandlerMethodArgumentResolver> resolvers = new ArrayList();
    resolvers.add(new RequestParamMethodArgumentResolver(getBeanFactory(), false));
    resolvers.add(new org.springframework.web.method.annotation.RequestParamMapMethodArgumentResolver());
    resolvers.add(new PathVariableMethodArgumentResolver());
    resolvers.add(new ServletModelAttributeMethodProcessor(false));
    resolvers.add(new RequestResponseBodyMethodProcessor(getMessageConverters()));
    resolvers.add(new RequestPartMethodArgumentResolver(getMessageConverters()));
    resolvers.add(new RequestHeaderMethodArgumentResolver(getBeanFactory()));
    resolvers.add(new RequestHeaderMapMethodArgumentResolver());
    resolvers.add(new ServletCookieValueMethodArgumentResolver(getBeanFactory()));
    resolvers.add(new ExpressionValueMethodArgumentResolver(getBeanFactory()));
    
    resolvers.add(new ServletRequestMethodArgumentResolver());
    resolvers.add(new ServletResponseMethodArgumentResolver());
    resolvers.add(new HttpEntityMethodProcessor(getMessageConverters()));
    resolvers.add(paramsArgumentResolver);
    
    resolvers.add(new RedirectAttributesMethodArgumentResolver());
    resolvers.add(new ModelMethodProcessor());
    resolvers.add(new MapMethodProcessor());
    resolvers.add(new ErrorsMethodArgumentResolver());
    resolvers.add(new SessionStatusMethodArgumentResolver());
    resolvers.add(new UriComponentsBuilderMethodArgumentResolver());
    
    if (getCustomArgumentResolvers() != null) {
      resolvers.addAll(getCustomArgumentResolvers());
    }
    
    resolvers.add(new RequestParamMethodArgumentResolver(getBeanFactory(), true));
    resolvers.add(new ServletModelAttributeMethodProcessor(true));
    
    return resolvers;
  }
  
  private List<HandlerMethodReturnValueHandler> getDefaultReturnValueHandlers() { List<HandlerMethodReturnValueHandler> handlers = new ArrayList();
    handlers.add(new ModelAndViewMethodReturnValueHandler());
    handlers.add(paramsReturnValueHandler);
    handlers.add(new ModelMethodProcessor());
    handlers.add(new ViewMethodReturnValueHandler());
    handlers.add(new HttpEntityMethodProcessor(getMessageConverters()));
    handlers.add(new ModelAttributeMethodProcessor(false));
    handlers.add(new RequestResponseBodyMethodProcessor(getMessageConverters()));
    handlers.add(new ViewNameMethodReturnValueHandler());
    handlers.add(new MapMethodProcessor());
    
    if (getCustomReturnValueHandlers() != null) {
      handlers.addAll(getCustomReturnValueHandlers());
    }
    if (!CollectionUtils.isEmpty(getModelAndViewResolvers())) {
      handlers.add(new ModelAndViewResolverMethodReturnValueHandler(getModelAndViewResolvers()));
    } else {
      handlers.add(new ModelAttributeMethodProcessor(true));
    }
    return handlers;
  }
  
  public void setParamsArgumentResolver(HandlerMethodArgumentResolver paramsArgumentResolver) {
    this.paramsArgumentResolver = paramsArgumentResolver;
  }
  
  public void setParamsReturnValueHandler(HandlerMethodReturnValueHandler paramsReturnValueHandler)
  {
    this.paramsReturnValueHandler = paramsReturnValueHandler;
  }
  
  public HandlerMethodArgumentResolver getParamsArgumentResolver() { return paramsArgumentResolver; }
  
  public HandlerMethodReturnValueHandler getParamsReturnValueHandler() {
    return paramsReturnValueHandler;
  }
}
