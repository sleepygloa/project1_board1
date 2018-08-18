package com.settings.svce;

import java.util.List;
import java.util.Map;

import com.core.parameters.Params;

public interface MenuService {

	List<Map<String, Object>> getSidebarMenu() throws Exception;
	
	void modifyMenu(Params inParams) throws Exception;
	
}
