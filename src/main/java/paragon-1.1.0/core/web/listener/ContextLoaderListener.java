package paragon.core.web.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import paragon.core.utility.scheduler.JobScheduler;
import paragon.core.web.listener.adapter.ContextLoaderAdapter;

public class ContextLoaderListener extends org.springframework.web.context.ContextLoaderListener
{
  private static final Log LOG = LogFactory.getLog(ContextLoaderListener.class);
  private ContextLoaderAdapter adapter;
  
  public ContextLoaderListener() {}
  
  public void contextInitialized(ServletContextEvent event) {
    loadContextLoaderAdapter(event);
    
    if (adapter != null) {
      adapter.beforeInitialize(event.getServletContext());
    }
    
    super.contextInitialized(event);
    
    if (adapter != null) {
      adapter.afterInitialize(event.getServletContext());
    }
  }
  



  public void contextDestroyed(ServletContextEvent event)
  {
    if (adapter != null) {
      adapter.beforeDestroy(event.getServletContext());
    }
    
    JobScheduler scheduler = (JobScheduler)WebApplicationContextUtils.getWebApplicationContext(event.getServletContext()).getBean("JobScheduler");
    if (scheduler != null) {
      try {
        scheduler.getScheduler().shutdown(true);
      } catch (SchedulerException e) {
        LOG.error("Exception", e);
      }
    }
    super.contextDestroyed(event);
    
    if (adapter != null) {
      adapter.afterDestroy(event.getServletContext());
    }
  }
  
  private void loadContextLoaderAdapter(ServletContextEvent event)
  {
    String adapterClassName = event.getServletContext().getInitParameter("contextLoaderAdapter");
    
    LOG.debug("adapterClassName : " + adapterClassName);
    if (StringUtils.isEmpty(adapterClassName)) {
      return;
    }
    try
    {
      Class<?> adapterClass = Class.forName(adapterClassName);
      adapter = ((ContextLoaderAdapter)adapterClass.newInstance());
    } catch (ClassNotFoundException e) {
      if (LOG.isErrorEnabled()) {
        LOG.error(e, e);
      }
    } catch (InstantiationException e) {
      if (LOG.isErrorEnabled()) {
        LOG.error(e, e);
      }
    } catch (IllegalAccessException e) {
      if (LOG.isErrorEnabled()) {
        LOG.error(e, e);
      }
    }
  }
}
