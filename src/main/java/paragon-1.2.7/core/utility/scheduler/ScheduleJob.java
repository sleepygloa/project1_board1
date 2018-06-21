package paragon.core.utility.scheduler;

import java.util.Date;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import paragon.core.paramaters.Params;





public class ScheduleJob
{
  private String jobId;
  private String jobName;
  private String jobClass;
  private String jobGroup;
  private String jobStatus;
  private String cronExpression;
  private String desc;
  private Date executeTime;
  private Date lastExecuteTime;
  private static final Log LOG = LogFactory.getLog(ScheduleJob.class);
  
  public ScheduleJob() {
    jobGroup = "DEFAULT_GROUP";
  }
  
  public ScheduleJob(String jobId, String jobName, String jobClass, String cronExpression, String desc) {
    this.jobId = jobId;
    this.jobName = jobName;
    this.jobClass = jobClass;
    this.cronExpression = cronExpression;
    this.desc = desc;
    
    jobGroup = "DEFAULT_GROUP";
  }
  
  public ScheduleJob(Params scheParmas) {
    StringBuffer sb = new StringBuffer();
    sb.append(scheParmas.getParam("SCHE_SEC")).append(" ");
    sb.append(scheParmas.getParam("SCHE_MIN")).append(" ");
    sb.append(scheParmas.getParam("SCHE_HOUR")).append(" ");
    sb.append(scheParmas.getParam("SCHE_DAY")).append(" ");
    sb.append(scheParmas.getParam("SCHE_MONTH")).append(" ");
    sb.append(scheParmas.getParam("SCHE_YEAR"));
    
    jobId = scheParmas.getString("SCHE_SEQ");
    jobName = scheParmas.getString("SCHE_NM");
    jobClass = scheParmas.getString("SCHE_CLASS_PATH");
    cronExpression = sb.toString();
    desc = "0";
    
    jobGroup = "DEFAULT_GROUP";
  }
  
  public String getJobId() {
    return jobId;
  }
  
  public void setJobId(String jobId) {
    this.jobId = jobId;
  }
  
  public String getJobName() {
    return jobName;
  }
  
  public void setJobName(String jobName) {
    this.jobName = jobName;
  }
  
  public String getJobClass() {
    return jobClass;
  }
  
  public void setJobClass(String jobClass) {
    this.jobClass = jobClass;
  }
  
  public String getJobGroup() {
    return jobGroup;
  }
  
  public void setJobGroup(String jobGroup) {
    this.jobGroup = jobGroup;
  }
  
  public String getJobStatus() {
    return jobStatus;
  }
  
  public void setJobStatus(String jobStatus) {
    this.jobStatus = jobStatus;
  }
  
  public String getCronExpression() {
    return cronExpression;
  }
  
  public void setCronExpression(String cronExpression) {
    this.cronExpression = cronExpression;
  }
  
  public String getDesc() {
    return desc;
  }
  
  public void setDesc(String desc) {
    this.desc = desc;
  }
}
