package com.manage.svce;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.common.util.FileUtils;
import com.core.parameters.Params;
import com.main.svce.MainService;
import com.manage.dao.BlogDao;

@Service("blogService")
public class BlogServiceImpl implements BlogService{

	@Resource(name="blogDao")
	private BlogDao blogDao;
	
	@Resource(name="fileUtils")
	private FileUtils fileUtils;
	
	@Override
	public List<Map<String, Object>> loadingMainBlogContent() throws Exception{
		return blogDao.loadingMainBlogContent();
	}

	
	@Override
	public List<Map<String, Object>> getBlogTitleDropdown(Params inParams) throws Exception{
		return blogDao.getBlogTitleDropdown(inParams);
	}
	
	@Override
	public void insertBlogAddContent(Params inParams) throws Exception{
		blogDao.insertBlogAddContent(inParams);
	}
	
	@Override
	public Map<String, Object> viewBlogContent(Params inParams) throws Exception{
		Map<String, Object> resultMap = new HashMap<String,Object>();
//		Map<String, Object> tempMap
		List<Map<String, Object>> list = blogDao.viewBlogContent(inParams);
		
		if(inParams.getString("update") == null) {
			for(int i = 0; i < list.size(); i++) {
				if(list.get(i).get("TYPE") == null){
					
				}else if(!(list.get(i)).get("TYPE").equals("img")) {
				
//					String content = (String)((list.get(i)).get("CONTENT"));
//					content = content.replaceAll("<", "&lt");
//					content = content.replaceAll(">", "&gt");
//					System.out.println(content);
//					(list.get(i)).put("CONTENT", content);
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
		
		List<Map<String,Object>> fileList = blogDao.selectFileList(inParams);
		if(fileList != null) {
			resultMap.put("fileList", fileList);
		}
		
		return resultMap;
	}
	
	@Override
	public void saveBlogContent(Params inParams) throws Exception{
		
		//글 수정
		if(inParams.getString("idx")!=null) {
			blogDao.saveBlogContent(inParams);
			
			blogDao.deleteBlogContentBox(inParams);
			List<Map<String, Object>> list = (ArrayList<Map<String, Object>>)inParams.getParam("dataDt");
			for(int i = 0; i < list.size(); i++) {
				inParams.setParam("idx", list.get(i).get("idx"));
				inParams.setParam("i", list.get(i).get("i"));
				inParams.setParam("type", list.get(i).get("type"));
				inParams.setParam("content", list.get(i).get("content"));
				inParams.setParam("imgWidthScale", list.get(i).get("imgWidthScale"));
				blogDao.insertBlogContentBox(inParams);
			}
			
		}else {
		//새글
			blogDao.insertBlogAddContent(inParams);
			
			Map<String, Object> map = (Map<String, Object>)blogDao.getBlogcontentLastIdx(inParams);
			blogDao.deleteBlogContentBox(map);
			List<Map<String, Object>> list = (ArrayList<Map<String, Object>>)inParams.getParam("dataDt");
			for(int i = 0; i < list.size(); i++) {
				inParams.setParam("idx", map.get("idx"));
				inParams.setParam("i", list.get(i).get("i"));
				inParams.setParam("type", list.get(i).get("type"));
				inParams.setParam("content", list.get(i).get("content"));
				inParams.setParam("imgWidthScale", list.get(i).get("imgWidthScale"));
				blogDao.insertBlogContentBox(inParams);
			}
		}
		System.out.println("dd = "+ inParams);
	}
	
	@Override
	public void deleteBlogContent(Params inParams) throws Exception{
			
		blogDao.deleteBlogContentBox(inParams);
		
		blogDao.deleteBlogTitleContent(inParams);
	}
	
	
	@Override
	public void saveBlogFileUpload(Params inParams, MultipartHttpServletRequest req) throws Exception{
		
		blogDao.deleteMainBlogFileList(inParams);
		List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(inParams, req);
		Map<String,Object> tempMap = null;
		for(int i=0, size=list.size(); i<size; i++){
			tempMap = list.get(i);
			if(tempMap.get("IS_NEW").equals("Y")){
				blogDao.insertMainBlogFile(tempMap);
			}else{
				blogDao.updateMainBlogFile(tempMap);
			}
		}
	}
	
	@Override
	public List<Map<String, Object>> getMainViewReContent(Params inParams) throws Exception{
		return blogDao.getMainViewReContent(inParams);
	};
	
	@Override
	public void insertMainBlogReContent(Params inParams, HttpServletRequest request) throws Exception {
		blogDao.insertMainBlogReContent(inParams);

	}
	
	@Override
	public void deleteMainBlogReContent(Params inParams) throws Exception {
		blogDao.deleteMainBlogReContent(inParams);
	}
	
	@Override
	public void deleteMainBlogReContentRefAll(Params inParams) throws Exception {
		blogDao.deleteMainBlogReContentRefAll(inParams);
	}
	
	@Override
	public void insertViewBlogReReContent(Params inParams, HttpServletRequest request) throws Exception {
		System.out.println("insertViewBlogReReContent data : "+ inParams);
		blogDao.insertViewBlogReReContent(inParams);
	}
	
}
