package com.settings.svce;

import java.util.List;
import java.util.Map;

public interface MenuService {

	List<Map<String, Object>> getSidebarMenu() throws Exception;
	
}
