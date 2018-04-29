package com.main.svce;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.core.parameters.Params;

public interface MainService{

	List<Map<String, Object>> mainBlogContent() throws Exception;
	
	List<Map<String, Object>> getBlogAddDropdownList() throws Exception;
	
	void insertBlogAddContent(Params inParams) throws Exception;
	
	Map<String, Object> viewBlogContent(Params inParams) throws Exception;
	
	void saveBlogContent(Params inParams, MultipartHttpServletRequest multipartHttpServletRequest) throws Exception;
	
	List<Map<String, Object>> getMainViewReContent(Params inParams) throws Exception;
	
	void insertMainBlogReContent(Params inParams, HttpServletRequest request) throws Exception;

	void deleteMainBlogReContent(Params inParams) throws Exception;

	void deleteMainBlogReContentRefAll(Params inParams) throws Exception;
	
	void insertViewBlogReReContent(Params inParams, HttpServletRequest request) throws Exception;
}
