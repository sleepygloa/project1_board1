package com.main.svce;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.core.parameters.Params;

public interface MainService{

	List<Map<String, Object>> getProgramPath(Params inParams) throws Exception;
	
	List<Map<String, Object>> loadingMainBlogContent() throws Exception;
	
	List<Map<String, Object>> getBlogTitleDropdown(Params inParams) throws Exception;
	
	void insertBlogAddContent(Params inParams) throws Exception;
	
	Map<String, Object> viewBlogContent(Params inParams) throws Exception;
	
	void saveBlogContent(Params inParams) throws Exception;
	void saveBlogFileUpload(Params inParams, MultipartHttpServletRequest req) throws Exception;
	
	void deleteBlogContent(Params inParams) throws Exception;
	
	List<Map<String, Object>> getMainViewReContent(Params inParams) throws Exception;
	
	void insertMainBlogReContent(Params inParams, HttpServletRequest request) throws Exception;

	void deleteMainBlogReContent(Params inParams) throws Exception;

	void deleteMainBlogReContentRefAll(Params inParams) throws Exception;
	
	void insertViewBlogReReContent(Params inParams, HttpServletRequest request) throws Exception;
}
