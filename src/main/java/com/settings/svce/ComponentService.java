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
public class ComponentService extends ParagonService {
	
	private static final Log LOG = LogFactory.getLog(ComponentService.class);

	public Params getComponentGridList(Params inParams) {
		LOG.debug("getComponentGridList");
		return getSqlManager().selectGridParams("ComponentService.getComponentList",inParams);
	}

	public DataTable getComponentNameList(Params inParams) {
		return getSqlManager().selectDataTable("ComponentService.getComponentNameList",inParams);
	}

	public Params saveComponent(Params inParams) {
		Params outParams = ParamsFactory.createParams(inParams);
		int cnt = 0;
		for(DataRow dr: inParams.getDataTable("dt_component")){
			String modFlag = (String) dr.getVal("modFlag");
			dr.setVal("s_companyCd", inParams.getParam("s_companyCd"));
			dr.setVal("s_userId", inParams.getParam("s_userId"));
			if(modFlag.equals("INSERT")){
				cnt +=  getSqlManager().insert("ComponentService.insertComponent",dr);
			}else if(modFlag.equals("UPDATE")){
				cnt +=  getSqlManager().update("ComponentService.updateComponent",dr);
			}else if(modFlag.equals("DELETE")){
				cnt +=  getSqlManager().delete("ComponentService.deleteComponent",dr);
			}
		}
		outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt}); 
		return outParams;
	}

	public Params getLangColumns(Params inParams) {
		String val = getSqlManager().selectOne("ComponentService.getLangColumns",inParams);
		List<String> list = new ArrayList<String>();
		if(val != null){
			list = Arrays.asList(val.split("\\|"));
		}
		inParams.setParam("colNames",list);
		return inParams;
	}

}
