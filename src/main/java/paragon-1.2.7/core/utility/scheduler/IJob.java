package paragon.core.utility.scheduler;

import java.util.List;

public abstract interface IJob
{
  public abstract boolean addJob(ScheduleJob paramScheduleJob);
  
  public abstract List<ScheduleJob> getTriggersInfo();
  
  public abstract void stopJob(ScheduleJob paramScheduleJob);
  
  public abstract void restartJob(ScheduleJob paramScheduleJob);
  
  public abstract void startNowJob(ScheduleJob paramScheduleJob);
  
  public abstract void delJob(ScheduleJob paramScheduleJob);
  
  public abstract void modifyTrigger(ScheduleJob paramScheduleJob);
  
  public abstract void stopScheduler();
}
