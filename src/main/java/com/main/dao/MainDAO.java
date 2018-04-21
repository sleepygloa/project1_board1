package com.main.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;
import com.core.parameters.Params;

@Repository("mainDAO")
public class MainDAO extends AbstractDAO{

//	public void loginInsert(Map<String, Object> map) throws Exception{
//		insert("LoginService.loginInsert", map);
//	}
//	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> mainBlogContent() throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.mainBlogContent");
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getBlogAddDropdownList() throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.getBlogAddDropdownList");
	}
	
	public void insertBlogAddContent(Params inParams) throws Exception{
		insert("MainService.insertBlogAddContent", inParams);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> viewBlogContent(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.viewBlogContent", inParams);
	}
	
	public void saveBlogContent(Params inParams) throws Exception{
		insert("MainService.saveBlogContent", inParams);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getMainViewReContent(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.getMainViewReContent", map);
	}
	
	public void insertMainBlogReContent(Params inParams) throws Exception{
		insert("MainService.insertMainBlogReContent", inParams);
	}

	public void deleteMainBlogReContent(Params inParams) throws Exception{
		update("MainService.deleteMainBlogReContent", inParams);
	}
	
	public void deleteMainBlogReContentRefAll(Params inParams) throws Exception{
		update("MainService.deleteMainBlogReContentRefAll", inParams);
	}
	
	public void insertViewBlogReReContent(Params inParams) throws Exception{
		insert("MainService.insertViewBlogReReContent", inParams);
	}
	
}
