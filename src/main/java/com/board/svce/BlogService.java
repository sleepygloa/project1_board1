package com.board.svce;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;


public interface BlogService {

	List<Map<String, Object>> selectBlogList(Map<String, Object> map) throws Exception;

	void insertBlog(Map<String, Object> map, HttpServletRequest request) throws Exception;

	Map<String, Object> selectBlogDetail(Map<String, Object> map) throws Exception;

	void updateBlog(Map<String, Object> map, HttpServletRequest request) throws Exception;

	void deleteBlog(Map<String, Object> map) throws Exception;

	List<Map<String, Object>> getBlogReplyContentList(Map<String, Object> map) throws Exception;
	
	void insertReplyContent(Map<String, Object> map, HttpServletRequest request) throws Exception;
	
	void deleteReplyContent(Map<String, Object> map) throws Exception;
	
	void insertReReplyContent(Map<String, Object> map, HttpServletRequest request) throws Exception;
	
	
}
