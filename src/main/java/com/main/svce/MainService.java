package com.main.svce;

import java.util.List;
import java.util.Map;

import com.common.common.CommandMap;

public interface MainService{

	List<Map<String, Object>> mainBlogContent() throws Exception;
	
	List<Map<String, Object>> getBlogAddDropdownList() throws Exception;
	
	void insertBlogAddContent(Map<String, Object> map) throws Exception;
	
	
}
