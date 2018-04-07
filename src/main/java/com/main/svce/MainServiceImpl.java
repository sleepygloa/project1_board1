package com.main.svce;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.common.common.CommandMap;
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
	
}
