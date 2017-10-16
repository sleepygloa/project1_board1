package first.sample.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import first.common.common.CommandMap;
import first.common.util.FileUtils;
import first.sample.controller.FileDownloader;
import first.sample.dao.BoardDAO;

@Service("boardService")
public class BoardServiceImpl implements BoardService{
	Logger log = Logger.getLogger(this.getClass());
	
	
	@Resource(name="fileUtils")
	private FileUtils fileUtils;
	
	@Resource(name="boardDAO")
	private BoardDAO boardDAO;
	
	@Override
	public List<Map<String, Object>> selectBoardList(Map<String, Object> map) throws Exception {
		return boardDAO.selectBoardList(map);
	}

	@Override
	public void insertBoard(Map<String, Object> map, HttpServletRequest request) throws Exception {
		log.debug("insert data : "+ map);
		System.out.println(map);
		boardDAO.insertBoard(map);
		log.debug("After insertBoard data : "+ map);
		List<Map<String,Object>> list = fileUtils.parseInsertFileInfo(map, request);
		log.debug("list data : "+ list);
		for(int i=0, size=list.size(); i<size; i++){
			boardDAO.insertFile(list.get(i));
		}
	}

	@Override
	public Map<String, Object> selectBoardDetail(Map<String, Object> map) throws Exception {
		log.debug("/openBoardDeatil.do map >>>>>>>>>>> " + map);
		boardDAO.updateHitCnt(map);
		Map<String, Object> resultMap = new HashMap<String,Object>();
		Map<String, Object> tempMap = boardDAO.selectBoardDetail(map);
		resultMap.put("map", tempMap);
		
		List<Map<String,Object>> list = boardDAO.selectFileList(map);
		resultMap.put("list", list);
		log.debug("/list >>>>>>>>>>> " + resultMap);
		return resultMap;
	}

	@Override
	public void updateBoard(Map<String, Object> map, HttpServletRequest request) throws Exception{
		log.debug("/updateBoard.do start  ");
		log.debug("/updateBoard.do map >>>>>>>>>>> " + map);
		boardDAO.updateBoard(map);
		
		boardDAO.deleteFileList(map);
		List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(map, request);
		Map<String,Object> tempMap = null;
		for(int i=0, size=list.size(); i<size; i++){
			tempMap = list.get(i);
			if(tempMap.get("IS_NEW").equals("Y")){
				boardDAO.insertFile(tempMap);
			}
			else{
				boardDAO.updateFile(tempMap);
			}
		}
		log.debug("/updateBoard.do end  ");
	}

	@Override
	public void deleteBoard(Map<String, Object> map) throws Exception {
		log.debug("/deleteBoard.do start  ");
		log.debug("/deleteBoard.do map >>>>>>>>>>> " + map);
		boardDAO.deleteBoard(map);
		log.debug("/openBoardDeatil.do end  ");
	}

}
