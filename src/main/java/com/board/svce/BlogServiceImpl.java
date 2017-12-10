package com.board.svce;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.board.ctrl.FileDownloader;
import com.board.dao.BlogDAO;
import com.common.common.CommandMap;
import com.common.util.FileUtils;

@Service("blogSerivce")
public class BlogServiceImpl implements BlogService{
	Logger log = Logger.getLogger(this.getClass());
	
	
	@Resource(name="fileUtils")
	private FileUtils fileUtils;
	
	@Resource(name="blogDAO")
	private BlogDAO blogDAO;
	
	@Override
	public List<Map<String, Object>> selectBlogList(Map<String, Object> map) throws Exception {
		return blogDAO.selectBlogList(map);
	}

	@Override
	public void insertBoard(Map<String, Object> map, HttpServletRequest request) throws Exception {
		log.debug("insert data : "+ map);
		System.out.println(map);
		blogDAO.insertBoard(map);
		log.debug("After insertBoard data : "+ map);
		List<Map<String,Object>> list = fileUtils.parseInsertFileInfo(map, request);
		log.debug("list data : "+ list);
		for(int i=0, size=list.size(); i<size; i++){
			blogDAO.insertFile(list.get(i));
		}
	}

	@Override
	public Map<String, Object> selectBoardDetail(Map<String, Object> map) throws Exception {
		log.debug("/openBoardDeatil.do map >>>>>>>>>>> " + map);
		blogDAO.updateHitCnt(map);
		Map<String, Object> resultMap = new HashMap<String,Object>();
		Map<String, Object> tempMap = blogDAO.selectBoardDetail(map);
		resultMap.put("map", tempMap);
		
		List<Map<String,Object>> list = blogDAO.selectFileList(map);
		resultMap.put("list", list);
		log.debug("/list >>>>>>>>>>> " + resultMap);
		return resultMap;
	}

	@Override
	public void updateBoard(Map<String, Object> map, HttpServletRequest request) throws Exception{
		log.debug("/updateBoard.do start  ");
		log.debug("/updateBoard.do map >>>>>>>>>>> " + map);
		blogDAO.updateBoard(map);
		
		blogDAO.deleteFileList(map);
		List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(map, request);
		Map<String,Object> tempMap = null;
		for(int i=0, size=list.size(); i<size; i++){
			tempMap = list.get(i);
			if(tempMap.get("IS_NEW").equals("Y")){
				blogDAO.insertFile(tempMap);
			}
			else{
				blogDAO.updateFile(tempMap);
			}
		}
		log.debug("/updateBoard.do end  ");
	}

	@Override
	public void deleteBoard(Map<String, Object> map) throws Exception {
		log.debug("/deleteBoard.do start  ");
		log.debug("/deleteBoard.do map >>>>>>>>>>> " + map);
		blogDAO.deleteBoard(map);
		log.debug("/openBoardDeatil.do end  ");
	}

}
