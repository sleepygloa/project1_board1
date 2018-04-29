package com.main.svce;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.common.util.FileUtils;
import com.core.parameters.Params;
import com.main.dao.MainDAO;

@Service("mainService")
public class MainServiceImpl implements MainService{
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="mainDAO")
	private MainDAO mainDAO;
	
	@Resource(name="fileUtils")
	private FileUtils fileUtils;
	
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
	public Map<String, Object> viewBlogContent(Params inParams) throws Exception{
//		blogDAO.updateHitCnt(map);
		Map<String, Object> resultMap = new HashMap<String,Object>();
		Map<String, Object> tempMap = mainDAO.viewBlogContent(inParams);
		String content = (String)tempMap.get("CONTENT");
		content = content.replace("\n", "<br />");
		tempMap.put("CONTENT", content);
		resultMap.put("map", tempMap);
		//아이디체크
		if(inParams.getString("s_userId") != null && tempMap.get("IN_USER_ID") != null) {
			String s_userId = inParams.getString("s_userId");
			String inUserId = (String)tempMap.get("IN_USER_ID");
			System.out.println("s_userId"+s_userId);
			System.out.println("inUserId"+inUserId);
			if(s_userId.equals(inUserId)) {
				System.out.println("ID_CHECK_OK");
				resultMap.put("S_CHECK_ID", true);
			}
		}else {
			resultMap.put("S_CHECK_ID", false);
		}
		
		List<Map<String,Object>> list = mainDAO.selectFileList(inParams);
		resultMap.put("list", list);
		
		return resultMap;
	}
	
	@Override
	public void saveBlogContent(Params inParams, MultipartHttpServletRequest multipartHttpServletRequest) throws Exception{
		mainDAO.saveBlogContent(inParams);
//		List<Map<String,Object>> list = fileUtils.parseInsertFileInfo(inParams, req);
		
		mainDAO.deleteMainBlogFileList(inParams);
		List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(inParams, multipartHttpServletRequest);
		Map<String,Object> tempMap = null;
		for(int i=0, size=list.size(); i<size; i++){
			tempMap = list.get(i);
			if(tempMap.get("IS_NEW").equals("Y")){
				mainDAO.insertMainBlogFile(tempMap);
			}else{
				mainDAO.updateMainBlogFile(tempMap);
			}
		}
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
