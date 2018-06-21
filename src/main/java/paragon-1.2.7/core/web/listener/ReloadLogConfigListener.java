package paragon.core.web.listener;

import java.io.File;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.xml.DOMConfigurator;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.util.SystemPropertyUtils;

public class ReloadLogConfigListener implements ServletContextListener
{
  private static final Log LOG = LogFactory.getLog(ReloadLogConfigListener.class);
  private static final long CHECK_DELAY = 10000L;
  private static final DefaultResourceLoader DEFAULT_RESOURCE_LOADER = new DefaultResourceLoader();
  
  public ReloadLogConfigListener() {}
  
  public void contextInitialized(ServletContextEvent event) { try { String resourcePath = SystemPropertyUtils.resolvePlaceholders(event.getServletContext().getInitParameter("log4jConfigLocation"));
      
      Resource resource = DEFAULT_RESOURCE_LOADER.getResource(resourcePath);
      File file = resource.getFile();
      String absolutePath = file.getAbsolutePath();
      
      if (LOG.isDebugEnabled()) {
        LOG.debug("ReloadLogConfigListener resource info");
        LOG.debug("resource : " + resource);
        LOG.debug("absolutePath : " + absolutePath);
      }
      
      DOMConfigurator.configureAndWatch(absolutePath, 10000L);
    } catch (Exception e) {
      LOG.error("exception", e);
      e.printStackTrace();
    }
  }
  
  public void contextDestroyed(ServletContextEvent event) {}
}
