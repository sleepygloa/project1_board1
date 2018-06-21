package paragon.core.web.listener.adapter;

import java.util.List;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.support.WebApplicationContextUtils;
import paragon.core.utility.common.AllowedURIUtil;
import paragon.core.utility.common.DomainUtil;
import paragon.core.utility.config.Config;
import paragon.core.utility.scheduler.JobScheduler;
import paragon.core.web.observer.ConfigCheck;
import paragon.core.web.observer.ParagonAnnotationFinder;

public class ParagonContextLoaderAdapter
  extends DefaultParagonContextLoaderAdapter
{
  public ParagonContextLoaderAdapter() {}
  
  private static final Log LOG = LogFactory.getLog(ParagonContextLoaderAdapter.class);
  
  public void afterInitialize(ServletContext context) {
    LOG.debug("ParagonContextLoaderAdapter : afterInitialize");
    setWebApplicationContext(WebApplicationContextUtils.getWebApplicationContext(context));
    
    ParagonAnnotationFinder finder = new ParagonAnnotationFinder(context);
    List<Object> objList = finder.find("O", ConfigCheck.class);
    LOG.debug("objList : " + objList.toString());
    Config.loadConfig("O", objList);
    








    JobScheduler.loadScheduler();
    
    AllowedURIUtil.loadAllowedURIList();
    DomainUtil.loadDomainList();
  }
  

  public void beforeDestroy(ServletContext context)
  {
    LOG.debug("ParagonContextLoaderAdapter : beforeDestroy");
    super.beforeDestroy(context);
    
    Config.cancelConfigChangeCheckTimer();
    

    AllowedURIUtil.shutdownAllowedURICheckTimer();
    DomainUtil.shutdownDomainCheckTimer();
  }
}
