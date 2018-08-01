package com.main.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;
import com.core.parameters.Params;
import com.core.parameters.datatable.datarow.DataRow;

@Repository("mainDAO")
public class MainDAO extends AbstractDAO{

//	public void loginInsert(Map<String, Object> map) throws Exception{
//		insert("LoginService.loginInsert", map);
//	}
//	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getSidebarMenu() throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.getSidebarMenu");
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> loadingMainBlogContent() throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.loadingMainBlogContent");
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getBlogTitleDropdown(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.getBlogTitleDropdown");
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
	
	public void deleteBlogTitleContent(Params inParams) throws Exception{
		delete("MainService.deleteBlogTitleContent", inParams);
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
	
	public void insertMainBlogFile(Map<String, Object> map) throws Exception{
		insert("MainService.insertMainBlogFile", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectFileList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.getMainBlogSelectFileList", map);
	}
	
	public void deleteMainBlogFileList(Map<String, Object> map) throws Exception{
		update("MainService.deleteMainBlogFileList", map);
	}
	
	public void updateMainBlogFile(Map<String, Object> map) throws Exception{
		update("MainService.updateMainBlogFile", map);
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> getBlogcontentLastIdx(Params inParams) throws Exception{
		return (Map<String, Object>)selectOne("MainService.getBlogcontentLastIdx", inParams);
	}
	
	public void deleteBlogContentBox(Map<String, Object> map) throws Exception{
		delete("MainService.deleteBlogContentBox", map);
	}

	public void insertBlogContentBox(Params inParams) throws Exception{
		insert("MainService.insertBlogContentBox", inParams);
	}
}
