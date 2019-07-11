package com.core.utility.scheduler;

import java.util.Date;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ScheduleJob {

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
    	this.jobGroup = "DEFAULT_GROUP";
    }

    public ScheduleJob(String jobId, String jobName, String jobClass, String cronExpression, String desc) {
        this.jobId = jobId;
        this.jobName = jobName;
        this.jobClass = jobClass;
        this.cronExpression = cronExpression;
        this.desc = desc;

        this.jobGroup = "DEFAULT_GROUP";
    }
    public ScheduleJob(Map map) { 
//    	LOG.debug(scheParmas.toString());
    	StringBuffer sb =  new StringBuffer();
		sb.append(map.get("SCHE_SEC")).append(" ");
		sb.append(map.get("SCHE_MIN")).append(" ");
		sb.append(map.get("SCHE_HOUR")).append(" ");
		sb.append(map.get("SCHE_DAY")).append(" ");
		sb.append(map.get("SCHE_MONTH")).append(" ");
		sb.append(map.get("SCHE_YEAR"));
    	
    	this.jobId = (String)map.get("SCHE_SEQ");
    	this.jobName = (String)map.get("SCHE_NM");
    	this.jobClass = (String)map.get("SCHE_CLASS_PATH");
    	this.cronExpression = sb.toString();
    	this.desc = "0";
    	
    	this.jobGroup = "DEFAULT_GROUP";
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
