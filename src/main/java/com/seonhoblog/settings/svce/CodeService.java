package com.seonhoblog.settings.svce;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.core.mvc.ParagonService;
import com.core.parameters.CommParams;
import com.core.parameters.Params;
import com.core.parameters.datatable.DataTable;

@Service
public class CodeService extends ParagonService {
	
	private static final Log LOG = LogFactory.getLog(CodeService.class);

	public DataTable listCodeCombo(Params inParams) {
		LOG.debug("listCodeCombo" + inParams);
		return getSqlManager().selectDataTable("CodeService.listCodeCombo", inParams);
	}
	public Params listCode(Params inParams) {
		LOG.debug("listCode" + inParams);
		return getSqlManager().selectGridParams("CodeService.listCode", inParams);
	}
	
	public Params updateCode(Params inParams) {
		System.out.println(" - -" + inParams);
		Params outParams = new CommParams();
		
		String flag = inParams.getString("flag");
		if(flag.equals("INSERT")) {
			getSqlManager().update("MenuService.insertMenu", inParams);
		}else if(flag.equals("UPDATE")) {
			getSqlManager().update("MenuService.updateMenu", inParams);
		}
		
		outParams.setStsCd(200);
		return outParams; 
	}
	
}
