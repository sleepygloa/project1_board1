package com.manage.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;
import com.core.parameters.Params;

@Repository("blogDao")
public class BlogDao extends AbstractDAO{
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> loadingMainBlogContent() throws Exception{
		return (List<Map<String, Object>>)selectList("blogService.loadingMainBlogContent");
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getBlogTitleDropdown(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("blogService.getBlogTitleDropdown");
	}
	
	public void insertBlogAddContent(Params inParams) throws Exception{
		insert("blogService.insertBlogAddContent", inParams);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> viewBlogContent(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("blogService.viewBlogContent", inParams);
	}
	
	public void saveBlogContent(Params inParams) throws Exception{
		insert("blogService.saveBlogContent", inParams);
	}
	
	public void deleteBlogTitleContent(Params inParams) throws Exception{
		delete("blogService.deleteBlogTitleContent", inParams);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getMainViewReContent(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("blogService.getMainViewReContent", map);
	}
	
	public void insertMainBlogReContent(Params inParams) throws Exception{
		insert("blogService.insertMainBlogReContent", inParams);
	}

	public void deleteMainBlogReContent(Params inParams) throws Exception{
		update("blogService.deleteMainBlogReContent", inParams);
	}
	
	public void deleteMainBlogReContentRefAll(Params inParams) throws Exception{
		update("blogService.deleteMainBlogReContentRefAll", inParams);
	}
	
	public void insertViewBlogReReContent(Params inParams) throws Exception{
		insert("blogService.insertViewBlogReReContent", inParams);
	}
	
	public void insertMainBlogFile(Map<String, Object> map) throws Exception{
		insert("blogService.insertMainBlogFile", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectFileList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("blogService.getMainBlogSelectFileList", map);
	}
	
	public void deleteMainBlogFileList(Map<String, Object> map) throws Exception{
		update("blogService.deleteMainBlogFileList", map);
	}
	
	public void updateMainBlogFile(Map<String, Object> map) throws Exception{
		update("blogService.updateMainBlogFile", map);
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> getBlogcontentLastIdx(Params inParams) throws Exception{
		return (Map<String, Object>)selectOne("blogService.getBlogcontentLastIdx", inParams);
	}
	
	public void deleteBlogContentBox(Map<String, Object> map) throws Exception{
		delete("blogService.deleteBlogContentBox", map);
	}

	public void insertBlogContentBox(Params inParams) throws Exception{
		insert("blogService.insertBlogContentBox", inParams);
	}
	
}
