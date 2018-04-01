//package com.board.svce;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import javax.annotation.Resource;
//import javax.servlet.http.HttpServletRequest;
//
//import org.apache.log4j.Logger;
//import org.springframework.stereotype.Service;
//
//import com.board.dao.BlogDAO;
//import com.common.util.FileUtils;
//
//@Service("blogSerivce")
//public class BlogServiceImpl implements BlogService{
//	Logger log = Logger.getLogger(this.getClass());
//	
//	
//	@Resource(name="fileUtils")
//	private FileUtils fileUtils;
//	
//	@Resource(name="blogDAO")
//	private BlogDAO blogDAO;
//	
////	@Override
////	public List<Map<String, Object>> selectBlogList(Map<String, Object> map) throws Exception {
////		return blogDAO.selectBlogList(map);
////	}
//
//	@Override
//	public void insertBlog(Map<String, Object> map, HttpServletRequest request) throws Exception {
//		log.debug("insertBlog data : "+ map);
//
//		blogDAO.insertBlog(map);
//
//		List<Map<String,Object>> list = fileUtils.parseInsertFileInfo(map, request);
//
//		for(int i=0, size=list.size(); i<size; i++){
//			blogDAO.insertFile(list.get(i));
//		}
//	}
//
//	@Override
//	public Map<String, Object> selectBlogDetail(Map<String, Object> map) throws Exception {
//		log.debug("/openBlogDeatil.do map >>>>>>>>>>> " + map);
//		blogDAO.updateHitCnt(map);
//		Map<String, Object> resultMap = new HashMap<String,Object>();
//		Map<String, Object> tempMap = blogDAO.selectBlogDetail(map);
//		resultMap.put("map", tempMap);
//		
//		List<Map<String,Object>> list = blogDAO.selectFileList(map);
//		resultMap.put("list", list);
//		log.debug("/list >>>>>>>>>>> " + resultMap);
//		return resultMap;
//	}
//
//	@Override
//	public void updateBlog(Map<String, Object> map, HttpServletRequest request) throws Exception{
//		log.debug("/updateBlog.do start  ");
//		log.debug("/updateBlog.do map >>>>>>>>>>> " + map);
//		blogDAO.updateBlog(map);
//		
//		blogDAO.deleteFileList(map);
//		List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(map, request);
//		Map<String,Object> tempMap = null;
//		for(int i=0, size=list.size(); i<size; i++){
//			tempMap = list.get(i);
//			if(tempMap.get("IS_NEW").equals("Y")){
//				blogDAO.insertFile(tempMap);
//			}
//			else{
//				blogDAO.updateFile(tempMap);
//			}
//		}
//		log.debug("/updateBlog.do end  ");
//	}
//
//	@Override
//	public void deleteBlog(Map<String, Object> map) throws Exception {
//		log.debug("/deleteBlog.do start  ");
//		log.debug("/deleteBlog.do map >>>>>>>>>>> " + map);
//		blogDAO.deleteBlog(map);
//		log.debug("/openBlogDeatil.do end  ");
//	}
//	
//	@Override
//	public List<Map<String, Object>> getBlogReplyContentList(Map<String, Object> map) throws Exception{
//		return blogDAO.getBlogReplyContentList(map);
//	};
//
//	@Override
//	public void insertReplyContent(Map<String, Object> map, HttpServletRequest request) throws Exception {
//		log.debug("insertReplyContent data : "+ map);
//		blogDAO.insertReplyContent(map);
//
//	}
//	
//	@Override
//	public void deleteReplyContent(Map<String, Object> map) throws Exception {
//		log.debug("/deleteReplyContent.do start = "+map);
//		blogDAO.deleteReplyContent(map);
//		log.debug("/deleteReplyContent.do end  ");
//	}
//	
//	@Override
//	public void insertReReplyContent(Map<String, Object> map, HttpServletRequest request) throws Exception {
//		log.debug("insertReReplyContent data : "+ map);
//		blogDAO.insertReReplyContent(map);
//
//	}
//	
//}
