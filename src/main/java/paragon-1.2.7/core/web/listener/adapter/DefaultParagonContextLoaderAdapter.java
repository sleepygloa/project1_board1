package paragon.core.web.listener.adapter;

import javax.servlet.ServletContext;
import javax.servlet.ServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.support.RequestContextUtils;
import paragon.core.utility.config.Config;


public class DefaultParagonContextLoaderAdapter
  implements ContextLoaderAdapter
{
  private static final Log LOG = LogFactory.getLog(DefaultParagonContextLoaderAdapter.class);
  private static WebApplicationContext webApplicationContext;
  private static ApplicationContext applicationContext;
  
  public DefaultParagonContextLoaderAdapter() {}
  
  public void beforeInitialize(ServletContext context) { LOG.debug("systemConfigLocation : " + context.getInitParameter("systemConfigLocation"));
    Config.setConfigLocation(context.getInitParameter("systemConfigLocation"));
  }
  

  public void afterInitialize(ServletContext context)
  {
    webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(context);
  }
  
  public void beforeDestroy(ServletContext context) {
    if (LOG.isDebugEnabled())
      LOG.debug("## beforeInitialize beforeDestroy");
  }
  
  public void afterDestroy(ServletContext context) {
    if (LOG.isDebugEnabled())
      LOG.debug("## beforeInitialize afterDestroy");
  }
  
  public static final Object getBean(String beanName) {
    if (webApplicationContext == null) {
      if (applicationContext != null) {
        return applicationContext.containsBean(beanName) ? applicationContext.getBean(beanName) : null;
      }
      return null;
    }
    return webApplicationContext.containsBean(beanName) ? webApplicationContext.getBean(beanName) : null;
  }
  
  public static final void setWebApplicationContext(ServletRequest request) {
    webApplicationContext = RequestContextUtils.getWebApplicationContext(request);
  }
  
  public static final void setWebApplicationContext(WebApplicationContext context) {
    webApplicationContext = context;
  }
  
  public static final void setApplicationContext(ApplicationContext context) {
    applicationContext = context;
  }
  
  public static final ApplicationContext getApplicationContext() {
    return applicationContext;
  }
  
  public static final WebApplicationContext getWebApplicationContext() {
    return webApplicationContext;
  }
}
