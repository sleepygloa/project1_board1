package com.seonhoblog.settings.svce;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.core.mvc.ParagonService;
import com.core.parameters.CommParams;
import com.core.parameters.Params;
import com.core.parameters.datatable.DataTable;

@Service
public class MenuService extends ParagonService {
	
	private static final Log LOG = LogFactory.getLog(MenuService.class);

	public Params getSidebarMenu(Params inParams) {
		LOG.debug("getSidebarMenu");
		System.out.println("ddddd");
		
		Params outParams = getSqlManager().selectGridParams("MenuService.getSidebarMenu", inParams);
//		List<Map<String, Object>> list = ("MenuService.getSidebarMenu");
//		DataTable dt = new CommDataTable(list);
		
		return outParams;
	}
	
	public Params updateMenu(Params inParams) {
		Params outParams = new CommParams();
		
		getSqlManager().update("MenuService.updateMenu", inParams);
		
		outParams.setStsCd(200);
		return outParams; 
	}
	
}
