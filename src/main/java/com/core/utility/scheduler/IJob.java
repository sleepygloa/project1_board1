package com.core.utility.scheduler;

import java.util.List;

public interface IJob {


    boolean addJob(ScheduleJob job);

    List<ScheduleJob> getTriggersInfo();

    void stopJob(ScheduleJob scheduleJob);

    void restartJob(ScheduleJob scheduleJob);

    void startNowJob(ScheduleJob scheduleJob);
    void delJob(ScheduleJob scheduleJob);

    void modifyTrigger(ScheduleJob scheduleJob);

    void stopScheduler();
}
