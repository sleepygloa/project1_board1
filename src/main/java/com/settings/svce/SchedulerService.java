package com.settings.svce;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import paragon.core.mvc.stereotype.ParagonService;
import paragon.core.paramaters.Params;
import paragon.core.paramaters.ParamsFactory;
import paragon.core.paramaters.datatable.datarow.DataRow;
import paragon.core.utility.scheduler.JobScheduler;
import paragon.core.utility.scheduler.ScheduleJob;

@Service
public class SchedulerService extends ParagonService {

	private static final Log LOG = LogFactory.getLog(SchedulerService.class);

	public Params getSchedulerList(Params inParams) {
		LOG.debug("SchedulerService getSchedulerList() : " + inParams);
		return getSqlManager().selectGridParams("SchedulerService.getSchedulerList", inParams);
	}

	public Params saveScheduler(Params inParams) {
		Params outParams = ParamsFactory.createParams(inParams);
		int cnt = 0;
		for(DataRow dr: inParams.getDataTable("dt_scheduler")){
			String modFlag = (String) dr.getString("modFlag");
			dr.setParam("s_userId", inParams.getString("s_userId"));
			if(modFlag.equals("INSERT")){
				cnt +=  getSqlManager().insert("SchedulerService.insertScheduler",dr);
			}else if(modFlag.equals("UPDATE")){
				cnt +=  getSqlManager().update("SchedulerService.updateScheduler",dr);
			}else if(modFlag.equals("DELETE")){
				ScheduleJob job =  new ScheduleJob();
				job.setJobId(dr.getString("scheSeq"));
				job.setJobName(dr.getString("scheNm"));
				JobScheduler.deleteJob(job);
				cnt +=  getSqlManager().delete("SchedulerService.deleteScheduler",dr);
			}
		}
		outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
		return outParams;
	}


	   public Params saveDomain(Params inParams) {

	        Params outParams = ParamsFactory.createParams(inParams);
	        int cnt = 0;

	        for(DataRow dr: inParams.getDataTable("dt_domain")){

	            LOG.debug("inParams dr: " + dr.toString());
	            String modFlag = (String) dr.getString("modFlag");
	            dr.setParam("s_companyCd", inParams.getString("s_companyCd"));
	            dr.setParam("s_userId", inParams.getString("s_userId"));

	            if(modFlag.equals("INSERT")){
	                cnt +=  getSqlManager().insert("DomainService.insertDomain",dr);
	            }else if(modFlag.equals("UPDATE")){
	                cnt +=  getSqlManager().update("DomainService.updateDomain",dr);
	            }

	        }

	          if(!outParams.getStsCd().equals("999")){

	                outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});

	            }

	          return outParams;

	   }


	public Params getSchedulerInfo(Params inParams) {
		LOG.debug("SchedulerService getSchedulerInfo : " + inParams);
		return getSqlManager().selectOneParams("SchedulerService.getSchedulerInfo", inParams);
	}

	public int updateSchedulerUseYn(Params inParams) {
		LOG.debug("SchedulerService updateSchedulerUseYn : " + inParams);
		return getSqlManager().update("SchedulerService.updateSchedulerUseYn", inParams);
	}

    /**
     * 스케줄러 삭제
     *
     * @Author jhlee
     * @Date 2018. 2. 06.
     */
    public Params deleteScheduler(Params inParams){
    	LOG.debug("SchedulerService deleteScheduler : " + inParams);
        Params outParams = ParamsFactory.createParams(inParams);

        int cnt = 0;
        for(DataRow dr: inParams.getDataTable("dt_scheduler")){
            dr.setParam("s_companyCd", inParams.getString("s_companyCd"));
            cnt += getSqlManager().delete("SchedulerService.deleteScheduler", dr);
        }
        if(!outParams.getStsCd().equals("999")){
            outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
        }
        return outParams;
    }
}
