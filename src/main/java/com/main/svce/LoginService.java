package com.main.svce;

import java.util.List;
import java.util.Map;

public interface LoginService{

	void loginInsert(Map<String, Object> map) throws Exception;
	
	List<Map<String, Object>> loginInfoCheck(Map<String, Object> map) throws Exception;
	
}
