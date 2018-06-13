package com.main.svce;

import java.util.ArrayList;
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
import com.core.parameters.ParamsFactory;
import com.core.parameters.datatable.DataTable;
import com.core.parameters.datatable.datarow.DataRow;
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
	public List<Map<String, Object>> getBlogTitleDropdown(Params inParams) throws Exception{
		return mainDAO.getBlogTitleDropdown(inParams);
	}
	
	@Override
	public void insertBlogAddContent(Params inParams) throws Exception{
		mainDAO.insertBlogAddContent(inParams);
	}
	
	@Override
	public Map<String, Object> viewBlogContent(Params inParams) throws Exception{
		Map<String, Object> resultMap = new HashMap<String,Object>();
//		Map<String, Object> tempMap
		List<Map<String, Object>> list = mainDAO.viewBlogContent(inParams);
		
		if(inParams.getString("update") == null) {
			for(int i = 0; i < list.size(); i++) {
				if(list.get(i).get("TYPE") == null){
					
				}else if(!(list.get(i)).get("TYPE").equals("img")) {
					String content = (String)((list.get(i)).get("CONTENT"));
					content = content.replace("\n", "<br />");
					(list.get(i)).put("CONTENT", content);
				}
			}
		}
		resultMap.put("contents", list);
		
		//아이디체크
		if(inParams.getString("s_userId") != null && (list.get(0)).get("IN_USER_ID") != null) {
			String s_userId = inParams.getString("s_userId");
			String inUserId = (String)((list.get(0)).get("IN_USER_ID"));
			if(s_userId.equals(inUserId)) {
				System.out.println("ID_CHECK_OK");
				resultMap.put("S_CHECK_ID", true);
			}
		}else {
			resultMap.put("S_CHECK_ID", false);
		}
		
		List<Map<String,Object>> fileList = mainDAO.selectFileList(inParams);
		if(fileList != null) {
			resultMap.put("fileList", fileList);
		}
		
		return resultMap;
	}
	
	@Override
	public void saveBlogContent(Params inParams) throws Exception{
		
		//글 수정
		if(inParams.getString("idx")!=null) {
			mainDAO.saveBlogContent(inParams);
			
			mainDAO.deleteBlogContentBox(inParams);
			List<Map<String, Object>> list = (ArrayList<Map<String, Object>>)inParams.getParam("dataDt");
			for(int i = 0; i < list.size(); i++) {
				inParams.setParam("idx", list.get(i).get("idx"));
				inParams.setParam("i", list.get(i).get("i"));
				inParams.setParam("type", list.get(i).get("type"));
				inParams.setParam("content", list.get(i).get("content"));
				mainDAO.insertBlogContentBox(inParams);
			}
			
		}else {
		//새글
			mainDAO.insertBlogAddContent(inParams);
			
			Map<String, Object> map = (Map<String, Object>)mainDAO.getBlogcontentLastIdx(inParams);
			mainDAO.deleteBlogContentBox(map);
			List<Map<String, Object>> list = (ArrayList<Map<String, Object>>)inParams.getParam("dataDt");
			for(int i = 0; i < list.size(); i++) {
				inParams.setParam("idx", map.get("idx"));
				inParams.setParam("i", list.get(i).get("i"));
				inParams.setParam("type", list.get(i).get("type"));
				inParams.setParam("content", list.get(i).get("content"));
				mainDAO.insertBlogContentBox(inParams);
			}
		}
		Map<String, Object> map = (Map<String, Object>)mainDAO.getBlogcontentLastIdx(inParams);
		mainDAO.deleteBlogContentBox(map);
		List<Map<String, Object>> list = (ArrayList<Map<String, Object>>)inParams.getParam("dataDt");
		for(int i = 0; i < list.size(); i++) {
			inParams.setParam("idx", map.get("idx"));
			inParams.setParam("i", list.get(i).get("i"));
			inParams.setParam("type", list.get(i).get("type"));
			inParams.setParam("content", list.get(i).get("content"));
			mainDAO.insertBlogContentBox(inParams);
		}
	}
	
	@Override
	public void saveBlogFileUpload(Params inParams, MultipartHttpServletRequest req) throws Exception{
		
		mainDAO.deleteMainBlogFileList(inParams);
		List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(inParams, req);
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
