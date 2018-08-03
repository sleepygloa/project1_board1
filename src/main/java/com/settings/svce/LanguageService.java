package com.settings.svce;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;


import paragon.core.mvc.stereotype.ParagonService;
import paragon.core.paramaters.Params;
import paragon.core.paramaters.ParamsFactory;
import paragon.core.paramaters.datatable.DataTable;
import paragon.core.paramaters.datatable.datarow.DataRow;

@Service
public class LanguageService extends ParagonService {
	
	private static final Log LOG = LogFactory.getLog(LanguageService.class);

	public Params getLanguageGridList(Params inParams) {
		LOG.debug("LanguageService getLanguageGridList()");
		return getSqlManager().selectGridParams("LanguageService.getLanguageList",inParams);
	}

	public DataTable getLanguageNameList(Params inParams) {
		return getSqlManager().selectDataTable("LanguageService.getLanguageNameList",inParams);
	}

	public Params saveLanguage(Params inParams) {
		Params outParams = ParamsFactory.createParams(inParams);
		int cnt = 0;
		for(DataRow dr: inParams.getDataTable("dt_language")){
			String modFlag = (String) dr.getVal("modFlag");
			dr.setVal("s_companyCd", inParams.getParam("s_companyCd"));
			dr.setVal("s_userId", inParams.getParam("s_userId"));
			if(modFlag.equals("INSERT")){
				cnt +=  getSqlManager().insert("LanguageService.insertLanguage",dr);
			}else if(modFlag.equals("UPDATE")){
				cnt +=  getSqlManager().update("LanguageService.updateLanguage",dr);
			}else if(modFlag.equals("DELETE")){
				cnt +=  getSqlManager().delete("LanguageService.deleteLanguage",dr);
			}
		}
		outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt}); 
		return outParams;
	}

	public Params getLangColumns(Params inParams) {
		String val = getSqlManager().selectOne("LanguageService.getLangColumns",inParams);
		List<String> list = new ArrayList<String>();
		if(val != null){
			list = Arrays.asList(val.split("\\|"));
		}
		inParams.setParam("colNames",list);
		return inParams;
	}

}
