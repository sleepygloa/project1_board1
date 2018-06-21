package paragon.core.utility.scheduler;

import org.quartz.Job;

public abstract class QuartzJob
  implements Job
{
  protected String JOB_KEY;
  
  public QuartzJob() {}
}
