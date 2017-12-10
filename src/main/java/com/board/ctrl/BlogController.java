package com.board.ctrl;

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

import com.board.dao.BlogDAO;
import com.board.svce.BlogService;
import com.common.common.CommandMap;

@Controller
@RequestMapping("/board")
public class BlogController {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="blogSerivce")
	private BlogService blogService;
	
	@RequestMapping("/blog.do")
    public ModelAndView openBoard() throws Exception{
		ModelAndView mv = new ModelAndView("/board/blog");
    		return mv;
    }
	
    /*
     * 게시글 List
     * 
     * */
	@RequestMapping("/blogList.do")
	public ModelAndView openBoardList(HttpServletResponse res, CommandMap commandMap) throws Exception{
	    	ModelAndView mv = new ModelAndView("jsonView");
	    	
	    	List<Map<String,Object>> list = blogService.selectBlogList(commandMap.getMap());
	    	mv.addObject("list", list);
	    	
	    	if(list.size() > 0){
	    		mv.addObject("TOTAL", list.get(0).get("TOTAL_COUNT"));
	    	}
	    	else{
	    		mv.addObject("TOTAL", 0);
	    	}
	    	
	    	return mv;
	}
    
	@RequestMapping(value="/blogWrite.do")
	public ModelAndView openBoardWrite(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("board/blogWrite");
		
		return mv;
	}

	@RequestMapping(value="/blogWriteInsert.do")
	public ModelAndView insertBoard(CommandMap commandMap, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/board/blog.do");
		
		blogService.insertBoard(commandMap.getMap(), request);
		
		return mv;
	}
	
	@RequestMapping(value="/blogDetail.do")
	public ModelAndView openBoardDetail(CommandMap commandMap) throws Exception{
		log.debug("/blogDetail.do start >>>>>>>>>>> ");
		ModelAndView mv = new ModelAndView("board/blogDetail");
		
		Map<String,Object> map = blogService.selectBoardDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("list", map.get("list"));
		log.debug("/blogDetail.do end >>>>>>>>>>> ");
		return mv;
	}
	
	@RequestMapping(value="/openBoardUpdate.do")
	public ModelAndView openBoardUpdate(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("board/boardUpdate");
		
		Map<String,Object> map = blogService.selectBoardDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("list", map.get("list"));
		
		return mv;
	}
	
	@RequestMapping(value="/updateBoard.do")
	public ModelAndView updateBoard(CommandMap commandMap, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/openBoardDetail.do");
		
		blogService.updateBoard(commandMap.getMap(), request);
		
		mv.addObject("IDX", commandMap.get("IDX"));
		return mv;
	}
	
	@RequestMapping(value="/deleteBoard.do")
	public ModelAndView deleteBoard(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/openBoard.do");
		
		blogService.deleteBoard(commandMap.getMap());
		
		return mv;
	}
}
