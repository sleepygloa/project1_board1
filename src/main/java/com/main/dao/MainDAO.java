package com.main.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.common.CommandMap;
import com.common.dao.AbstractDAO;

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
	
	public void insertBlogAddContent(Map<String, Object> map) throws Exception{
		insert("MainService.insertBlogAddContent", map);
	}
}
