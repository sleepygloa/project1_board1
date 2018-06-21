package paragon.core.utility.scheduler;

import java.util.List;
import org.apache.commons.logging.Log;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.SimpleTrigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.matchers.GroupMatcher;
import paragon.core.paramaters.Params;
import paragon.core.paramaters.datatable.datarow.DataRow;

public class JobScheduler implements IJob
{
  private static Scheduler scheduler;
  private static SchedulerFactory sf;
  private static final Log LOG = org.apache.commons.logging.LogFactory.getLog(JobScheduler.class);
  
  public Scheduler getScheduler()
  {
    return scheduler;
  }
  
  public JobScheduler() {
    try {
      sf = new org.quartz.impl.StdSchedulerFactory();
      scheduler = sf.getScheduler();
      scheduler.start();
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public static void init() {
    try { sf = new org.quartz.impl.StdSchedulerFactory();
      scheduler = sf.getScheduler();
      scheduler.start();
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public static void deleteJob(ScheduleJob scheduleJob)
  {
    JobKey key = new JobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
    try {
      scheduler.deleteJob(key);
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public static void updateJob(ScheduleJob scheduleJob) {
    try {
      TriggerKey key = TriggerKey.triggerKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
      CronTrigger newTrigger = 
      

        (CronTrigger)TriggerBuilder.newTrigger().withIdentity(key).withSchedule(CronScheduleBuilder.cronSchedule(scheduleJob.getCronExpression())).build();
      scheduler.rescheduleJob(key, newTrigger);
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public static void loadScheduler() {
    if (scheduler == null) {
      init();
    }
    paragon.core.mvc.stereotype.SqlManager sqlManager = paragon.core.mvc.stereotype.SqlManagerFactory.getSqlManager();
    Params params = new paragon.core.paramaters.CommParams();
    params.setParam("useYn", "Y");
    params = sqlManager.selectParams("dt_scheduler", "SchedulerService.getSchedulerList", params);
    
    LOG.debug("JobScheduler loaded. ");
    for (DataRow dr : params.getDataTable("dt_scheduler")) {
      StringBuffer sb = new StringBuffer();
      sb.append(dr.getString("SCHE_SEC")).append(" ");
      sb.append(dr.getString("SCHE_MIN")).append(" ");
      sb.append(dr.getString("SCHE_HOUR")).append(" ");
      sb.append(dr.getString("SCHE_DAY")).append(" ");
      sb.append(dr.getString("SCHE_MONTH")).append(" ");
      sb.append(dr.getString("SCHE_YEAR"));
      ScheduleJob sj = new ScheduleJob(dr.getString("SCHE_SEQ"), dr.getString("SCHE_NM"), dr.getString("SCHE_CLASS_PATH"), sb.toString(), "0");
      addDefaultJob(sj);
      LOG.debug("JobScheduler added '" + dr.getString("SCHE_NM") + "' cronExpression :" + sb.toString());
    }
  }
  

  private static void addDefaultJob(ScheduleJob job)
  {
    try
    {
      TriggerKey triggerKey = TriggerKey.triggerKey(job.getJobName(), job.getJobGroup());
      CronTrigger trigger = null;
      if (triggerKey != null) {
        trigger = (CronTrigger)scheduler.getTrigger(triggerKey);
      }
      if (trigger == null)
      {
        Class clzz = Class.forName(job.getJobClass());
        JobDetail jobDetail = JobBuilder.newJob(clzz).withIdentity(job.getJobName(), job.getJobGroup()).build();
        
        jobDetail.getJobDataMap().put("scheduleJob", job);
        CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
        trigger = (CronTrigger)TriggerBuilder.newTrigger().withIdentity(job.getJobName(), job.getJobGroup()).withSchedule(scheduleBuilder).build();
        scheduler.scheduleJob(jobDetail, trigger);
      } else {
        CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
        trigger = (CronTrigger)trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();
        scheduler.rescheduleJob(triggerKey, trigger);
      }
    }
    catch (SchedulerException e) {
      e.printStackTrace();
    } catch (ClassNotFoundException e) {
      e.printStackTrace();
    }
  }
  

  public boolean addJob(ScheduleJob job)
  {
    try
    {
      TriggerKey triggerKey = TriggerKey.triggerKey(job.getJobName(), job.getJobGroup());
      CronTrigger trigger = null;
      if (triggerKey != null) {
        trigger = (CronTrigger)scheduler.getTrigger(triggerKey);
      }
      if (trigger == null)
      {
        Class c = Class.forName(job.getJobClass());
        JobDetail jobDetail = JobBuilder.newJob(c).withIdentity(job.getJobName(), job.getJobGroup()).build();
        
        jobDetail.getJobDataMap().put("scheduleJob", job);
        CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
        trigger = (CronTrigger)TriggerBuilder.newTrigger().withIdentity(job.getJobName(), job.getJobGroup()).withSchedule(scheduleBuilder).build();
        scheduler.scheduleJob(jobDetail, trigger);
      } else {
        CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
        trigger = (CronTrigger)trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();
        scheduler.rescheduleJob(triggerKey, trigger);
      }
    }
    catch (SchedulerException e) {
      e.printStackTrace();
    } catch (ClassNotFoundException e) {
      e.printStackTrace();
    }
    

    return true;
  }
  
  public List<JobDetail> getJobs()
  {
    try {
      GroupMatcher<JobKey> matcher = GroupMatcher.anyJobGroup();
      java.util.Set<JobKey> jobKeys = scheduler.getJobKeys(matcher);
      
      List<JobDetail> jobDetails = new java.util.ArrayList();
      
      for (JobKey key : jobKeys) {
        jobDetails.add(scheduler.getJobDetail(key));
      }
      return jobDetails;
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
    
    return null;
  }
  
  public List<ScheduleJob> getTriggersInfo()
  {
    try {
      GroupMatcher<TriggerKey> matcher = GroupMatcher.anyTriggerGroup();
      java.util.Set<TriggerKey> Keys = scheduler.getTriggerKeys(matcher);
      List<ScheduleJob> triggers = new java.util.ArrayList();
      
      for (TriggerKey key : Keys) {
        org.quartz.Trigger trigger = scheduler.getTrigger(key);
        ScheduleJob pageTrigger = new ScheduleJob();
        pageTrigger.setJobName(trigger.getJobKey().getName());
        pageTrigger.setJobGroup(trigger.getJobKey().getGroup());
        pageTrigger.setJobStatus(scheduler.getTriggerState(key));
        if ((trigger instanceof SimpleTrigger)) {
          SimpleTrigger simple = (SimpleTrigger)trigger;
          pageTrigger.setCronExpression("중복차수:" + (simple.getRepeatCount() == -1 ? "무한" : Integer.valueOf(simple.getRepeatCount())) + ",중복간격:" + simple.getRepeatInterval() / 1000L + "(초)");
          pageTrigger.setDesc(simple.getDescription());
        }
        if ((trigger instanceof CronTrigger)) {
          CronTrigger cron = (CronTrigger)trigger;
          pageTrigger.setCronExpression(cron.getCronExpression());
          pageTrigger.setDesc(cron.getDescription());
        }
        triggers.add(pageTrigger);
      }
      return triggers;
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
    return null;
  }
  
  public void stopJob(ScheduleJob scheduleJob)
  {
    LOG.debug("name : " + scheduleJob.getJobName() + ", group : " + scheduleJob.getJobGroup());
    JobKey key = new JobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
    try {
      scheduler.pauseJob(key);
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public void restartJob(ScheduleJob scheduleJob) {
    JobKey key = new JobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
    try {
      scheduler.resumeJob(key);
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public void startNowJob(ScheduleJob scheduleJob) {
    try {
      JobKey key = new JobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
      JobDetail job = JobBuilder.newJob(
        scheduler.getJobDetail(key).getJobClass())
        .storeDurably()
        .build();
      scheduler.addJob(job, false);
      scheduler.triggerJob(job.getKey());
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public void delJob(ScheduleJob scheduleJob) {
    JobKey key = new JobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
    try {
      scheduler.deleteJob(key);
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public void modifyTrigger(ScheduleJob scheduleJob)
  {
    try {
      TriggerKey key = TriggerKey.triggerKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
      CronTrigger newTrigger = 
      

        (CronTrigger)TriggerBuilder.newTrigger().withIdentity(key).withSchedule(CronScheduleBuilder.cronSchedule(scheduleJob.getCronExpression())).build();
      scheduler.rescheduleJob(key, newTrigger);
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public void stopScheduler()
  {
    try {
      if (!scheduler.isInStandbyMode()) {
        scheduler.standby();
      }
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
  
  public void startScheduler() {
    try { if (!scheduler.isInStandbyMode()) {
        scheduler.start();
      }
    } catch (SchedulerException e) {
      e.printStackTrace();
    }
  }
}
