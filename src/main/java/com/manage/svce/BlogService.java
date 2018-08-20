package com.manage.svce;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.core.parameters.Params;

public interface BlogService {
	
	List<Map<String, Object>> loadingMainBlogContent() throws Exception;
	
	List<Map<String, Object>> getBlogTitleDropdown(Params inParams) throws Exception;
	
	void insertBlogAddContent(Params inParams) throws Exception;
	
	Map<String, Object> viewBlogContent(Params inParams) throws Exception;
	
	void saveBlogContent(Params inParams) throws Exception;
	void saveBlogFileUpload(Params inParams, MultipartHttpServletRequest req) throws Exception;
	
	void deleteBlogContent(Params inParams) throws Exception;
	
	List<Map<String, Object>> getReBlog(Params inParams) throws Exception;
	
	void saveReBlog(Params inParams, HttpServletRequest request) throws Exception;

	void deleteReBlog(Params inParams) throws Exception;

	void deleteReBlogRefAll(Params inParams) throws Exception;
	
	void saveReReBlog(Params inParams, HttpServletRequest request) throws Exception;
}
