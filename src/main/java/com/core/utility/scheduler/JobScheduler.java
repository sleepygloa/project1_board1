package com.core.utility.scheduler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.SimpleTrigger;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.impl.matchers.GroupMatcher;

import com.core.parameters.datatable.datarow.DataRow;
import com.core.utility.config.Config;


public class JobScheduler implements IJob {

   private static Scheduler scheduler;
   private static SqlSessionTemplate sqlSession;
   private static SchedulerFactory sf;

   private static final Log LOG = LogFactory.getLog(JobScheduler.class);


   public Scheduler getScheduler() {
	   return scheduler;
   }
    public JobScheduler() {
		super();
		try {
			sf = new StdSchedulerFactory();
			scheduler = sf.getScheduler();
			scheduler.start();
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
	}
    public static void init(){
    	try {
    		sf = new StdSchedulerFactory();
    		scheduler = sf.getScheduler();
    		scheduler.start();
    	} catch (SchedulerException e) {
    		e.printStackTrace();
    	}

    }

    public static void deleteJob(ScheduleJob scheduleJob) {
        JobKey key = new JobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
        try {
            scheduler.deleteJob(key);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
  //트리거 수정
    public static void updateJob(ScheduleJob scheduleJob) {
        try {
            TriggerKey key = TriggerKey.triggerKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
            CronTrigger newTrigger = TriggerBuilder.newTrigger()
                    .withIdentity(key)
                    .withSchedule(CronScheduleBuilder.cronSchedule(scheduleJob.getCronExpression()))
                    .build();
            scheduler.rescheduleJob(key, newTrigger);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }

    }
    public static void loadScheduler(){
    	//app.xml 에서 사용유무 확인
    	String jobSchedulerUseYn = Config.getString("jobScheduler.useYn");
    	if(jobSchedulerUseYn != null){
    		if(jobSchedulerUseYn.equals("Y")){
    	    	if(scheduler == null){
    	    		init();
    	    	}
    	    	Map<String, Object> map = new HashMap<String, Object>();
    	    	map.put("useYn", "Y");
    	    	List<Map<String, Object>> list = sqlSession.selectList("SchedulerService.getSchedulerList", map);

    	    	LOG.debug("JobScheduler loaded. ");
    	    	for(Map<String, Object> mapList : list) {
    				StringBuffer sb =  new StringBuffer();
    				sb.append(mapList.get("SCHE_SEC")).append(" ");
    				sb.append(mapList.get("SCHE_MIN")).append(" ");
    				sb.append(mapList.get("SCHE_HOUR")).append(" ");
    				sb.append(mapList.get("SCHE_DAY")).append(" ");
    				sb.append(mapList.get("SCHE_MONTH")).append(" ");
    				sb.append(mapList.get("SCHE_YEAR"));
    				ScheduleJob sj = new ScheduleJob((String)mapList.get("SCHE_SEQ"), (String)mapList.get("SCHE_NM"), (String)mapList.get("SCHE_CLASS_PATH"), sb.toString(), "0");
    				addDefaultJob(sj);
    				LOG.debug("JobScheduler added '"+(String)mapList.get("SCHE_NM")+"' cronExpression :" + sb.toString());
    	    	}
    		}
    	}
    }

    private static void addDefaultJob(ScheduleJob job) {

    	try {

    		TriggerKey triggerKey = TriggerKey.triggerKey(job.getJobName(), job.getJobGroup());
    		CronTrigger trigger = null;
    		if(triggerKey != null){
    			trigger = (CronTrigger) scheduler.getTrigger(triggerKey);
    		}
    		if (null == trigger) {

    			Class clzz = Class.forName(job.getJobClass());
    			JobDetail jobDetail = JobBuilder.newJob(clzz).withIdentity(job.getJobName(), job.getJobGroup()).build();

    			jobDetail.getJobDataMap().put("scheduleJob", job);
    			CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
    			trigger = TriggerBuilder.newTrigger().withIdentity(job.getJobName(), job.getJobGroup()).withSchedule(scheduleBuilder).build();
    			scheduler.scheduleJob(jobDetail, trigger);
    		} else {
    			CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
    			trigger = trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();
    			scheduler.rescheduleJob(triggerKey, trigger);
    		}

    	} catch (SchedulerException e) {
    		e.printStackTrace();
    	} catch (ClassNotFoundException e) {
    		e.printStackTrace();
    	}
    }


	public boolean addJob(ScheduleJob job) {

        try {

            TriggerKey triggerKey = TriggerKey.triggerKey(job.getJobName(), job.getJobGroup());
            CronTrigger trigger = null;
            if(triggerKey != null){
            	trigger = (CronTrigger) scheduler.getTrigger(triggerKey);
        	}
            if (null == trigger) {

                Class c = Class.forName(job.getJobClass());
                JobDetail jobDetail = JobBuilder.newJob(c).withIdentity(job.getJobName(), job.getJobGroup()).build();

                jobDetail.getJobDataMap().put("scheduleJob", job);
                CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
                trigger = TriggerBuilder.newTrigger().withIdentity(job.getJobName(), job.getJobGroup()).withSchedule(scheduleBuilder).build();
                scheduler.scheduleJob(jobDetail, trigger);
            } else {
                CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpression());
                trigger = trigger.getTriggerBuilder().withIdentity(triggerKey).withSchedule(scheduleBuilder).build();
                scheduler.rescheduleJob(triggerKey, trigger);
            }

        } catch (SchedulerException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }


        return true;
    }


    public List<JobDetail> getJobs(){
        try {
            GroupMatcher<JobKey> matcher = GroupMatcher.anyJobGroup();
            Set<JobKey> jobKeys = scheduler.getJobKeys(matcher);

            List<JobDetail> jobDetails = new ArrayList<JobDetail>();

            for (JobKey key : jobKeys) {
                jobDetails.add(scheduler.getJobDetail(key));
            }
            return jobDetails;
        } catch (SchedulerException e) {
            e.printStackTrace();
        }

        return null;
    }


    public List<ScheduleJob> getTriggersInfo() {
        try {
            GroupMatcher<TriggerKey> matcher = GroupMatcher.anyTriggerGroup();
            Set<TriggerKey> Keys = scheduler.getTriggerKeys(matcher);
            List<ScheduleJob> triggers = new ArrayList<ScheduleJob>();

            for (TriggerKey key : Keys) {
                Trigger trigger = scheduler.getTrigger(key);
                ScheduleJob pageTrigger = new ScheduleJob();
                pageTrigger.setJobName(trigger.getJobKey().getName());
                pageTrigger.setJobGroup(trigger.getJobKey().getGroup());
                pageTrigger.setJobStatus(scheduler.getTriggerState(key) + "");
                if (trigger instanceof SimpleTrigger) {
                    SimpleTrigger simple = (SimpleTrigger) trigger;
                    pageTrigger.setCronExpression("중복차수:" + (simple.getRepeatCount() == -1 ?"무한" : simple.getRepeatCount()) + ",중복간격:" + (simple.getRepeatInterval() / 1000L)+"(초)");
                    pageTrigger.setDesc(simple.getDescription());
                }
                if (trigger instanceof CronTrigger) {
                    CronTrigger cron = (CronTrigger) trigger;
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


    public void stopJob(ScheduleJob scheduleJob) {
    	LOG.debug("name : "+scheduleJob.getJobName()+", group : "+scheduleJob.getJobGroup());
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
        	LOG.debug("scheduleJob : " + scheduleJob.toString());
            JobKey key = new JobKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());

            LOG.debug("key : " + key);
            Class c = Class.forName(scheduleJob.getJobClass());
            JobDetail job = JobBuilder.newJob(c).storeDurably().build();

            scheduler.addJob(job, false);
            scheduler.triggerJob(job.getKey());
        } catch (SchedulerException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
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

    //트리거 수정
    public void modifyTrigger(ScheduleJob scheduleJob) {
        try {
            TriggerKey key = TriggerKey.triggerKey(scheduleJob.getJobName(), scheduleJob.getJobGroup());
            CronTrigger newTrigger = TriggerBuilder.newTrigger()
                    .withIdentity(key)
                    .withSchedule(CronScheduleBuilder.cronSchedule(scheduleJob.getCronExpression()))
                    .build();
            scheduler.rescheduleJob(key, newTrigger);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }

    }

    public void stopScheduler() {
        try {
            if (!scheduler.isInStandbyMode()) {
                scheduler.standby();
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
    public void startScheduler() {
    	try {
    		if (!scheduler.isInStandbyMode()) {
    			scheduler.start();
    		}
    	} catch (SchedulerException e) {
    		e.printStackTrace();
    	}
    }

}
