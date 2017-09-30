package first.sample.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import first.common.common.CommandMap;
import first.sample.dao.BoardDAO;
import first.sample.service.BoardService;

@Controller
public class BoardController {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="boardService")
	private BoardService boardService;
	
	@RequestMapping("/openBoard.do")
    public ModelAndView openBoard() throws Exception{
		ModelAndView mv = new ModelAndView("/board/boardList");
		
    		return mv;
    }
	
    /*
     * 게시글 List
     * 
     * */
	@RequestMapping("/selectBoardList.do")
	public ModelAndView openBoardList(HttpServletResponse res, CommandMap commandMap) throws Exception{
	    	ModelAndView mv = new ModelAndView("jsonView");
	    	
	    	List<Map<String,Object>> list = boardService.selectBoardList(commandMap.getMap());
	    	mv.addObject("list", list);
	    	
	    	if(list.size() > 0){
	    		mv.addObject("TOTAL", list.get(0).get("TOTAL_COUNT"));
	    	}
	    	else{
	    		mv.addObject("TOTAL", 0);
	    	}
	    	
	    	return mv;
	}
    
	@RequestMapping(value="/openBoardWrite.do")
	public ModelAndView openBoardWrite(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("board/boardInsert");
		
		return mv;
	}

	@RequestMapping(value="/insertBoard.do")
	public ModelAndView insertBoard(CommandMap commandMap, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/openBoard.do");
		
		boardService.insertBoard(commandMap.getMap(), request);
		
		return mv;
	}
	
	@RequestMapping(value="/openBoardDetail.do")
	public ModelAndView openBoardDetail(CommandMap commandMap) throws Exception{
		log.debug("/openBoardDeatil.do start >>>>>>>>>>> ");
		ModelAndView mv = new ModelAndView("board/boardDetail");
		
		Map<String,Object> map = boardService.selectBoardDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("list", map.get("list"));
		log.debug("/openBoardDeatil.do end >>>>>>>>>>> ");
		return mv;
	}
	
	@RequestMapping(value="/openBoardUpdate.do")
	public ModelAndView openBoardUpdate(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("board/boardUpdate");
		
		Map<String,Object> map = boardService.selectBoardDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("list", map.get("list"));
		
		return mv;
	}
	
	@RequestMapping(value="/updateBoard.do")
	public ModelAndView updateBoard(CommandMap commandMap, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/openBoardDetail.do");
		
		boardService.updateBoard(commandMap.getMap(), request);
		
		mv.addObject("IDX", commandMap.get("IDX"));
		return mv;
	}
	
	@RequestMapping(value="/deleteBoard.do")
	public ModelAndView deleteBoard(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/openBoard.do");
		
		boardService.deleteBoard(commandMap.getMap());
		
		return mv;
	}
}
