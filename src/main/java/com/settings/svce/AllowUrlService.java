package com.settings.svce;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import paragon.core.mvc.stereotype.ParagonService;
import paragon.core.paramaters.Params;
import paragon.core.paramaters.ParamsFactory;
import paragon.core.paramaters.datatable.datarow.DataRow;

@Service
public class AllowUrlService extends ParagonService {

	private static final Log LOG = LogFactory.getLog(AllowUrlService.class);
	
	public Params saveUsere(Params p) {
		Params outParam = ParamsFactory.createParams(p);
		int cnt = 0;
		for(DataRow dr: p.getDataTable("dt_user")){
			LOG.debug(dr);
			String modFlag = (String) dr.getVal("modFlag");
			if(modFlag.equals("INSERT")){
				cnt +=  getSqlManager().insert("UserService.insertUser",dr);
			}else if(modFlag.equals("UPDATE")){
				cnt +=  getSqlManager().update("UserService.updateUser",dr);
			}else if(modFlag.equals("DELETE")){
				cnt +=  getSqlManager().delete("UserService.deleteUser",dr);
			}
		}
		outParam.setParam("saveCnt", cnt);
		return outParam;
	}
	public Params getUserList(Params p) {
		return getSqlManager().selectGridParams("UserService.getUserList", p);
	}
}
