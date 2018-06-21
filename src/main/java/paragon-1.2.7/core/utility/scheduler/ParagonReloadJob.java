package paragon.core.utility.scheduler;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

public class ParagonReloadJob
  extends QuartzJobBean
{
  private static final Log LOG = LogFactory.getLog(ParagonReloadJob.class);
  
  public ParagonReloadJob() {}
  
  protected void executeInternal(JobExecutionContext ctx) throws JobExecutionException { LOG.debug("QParagonReloadJob :!!!!!!!!!!! uarts Common Code Job End now."); }
}
