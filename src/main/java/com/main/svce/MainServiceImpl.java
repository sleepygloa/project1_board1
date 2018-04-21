package com.main.svce;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.core.parameters.Params;
import com.main.dao.MainDAO;

@Service("mainService")
public class MainServiceImpl implements MainService{
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="mainDAO")
	private MainDAO mainDAO;
	
	@Override
	public List<Map<String, Object>> mainBlogContent() throws Exception{
		return mainDAO.mainBlogContent();
	}
	
	@Override
	public List<Map<String, Object>> getBlogAddDropdownList() throws Exception{
		return mainDAO.getBlogAddDropdownList();
	}
	
	@Override
	public void insertBlogAddContent(Params inParams) throws Exception{
		mainDAO.insertBlogAddContent(inParams);
	}
	
	@Override
	public List<Map<String, Object>> viewBlogContent(Params inParams) throws Exception{
		return mainDAO.viewBlogContent(inParams);
	}
	
	@Override
	public void saveBlogContent(Params inParams) throws Exception{
		mainDAO.saveBlogContent(inParams);
	}
	
	@Override
	public List<Map<String, Object>> getMainViewReContent(Params inParams) throws Exception{
		return mainDAO.getMainViewReContent(inParams);
	};
	
	@Override
	public void insertMainBlogReContent(Params inParams, HttpServletRequest request) throws Exception {
		mainDAO.insertMainBlogReContent(inParams);

	}
	
	@Override
	public void deleteMainBlogReContent(Params inParams) throws Exception {
		mainDAO.deleteMainBlogReContent(inParams);
	}
	
	@Override
	public void deleteMainBlogReContentRefAll(Params inParams) throws Exception {
		mainDAO.deleteMainBlogReContentRefAll(inParams);
	}
	
	@Override
	public void insertViewBlogReReContent(Params inParams, HttpServletRequest request) throws Exception {
		log.debug("insertViewBlogReReContent data : "+ inParams);
		mainDAO.insertViewBlogReReContent(inParams);
	}
}
