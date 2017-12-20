package com.board.ctrl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.board.svce.BlogService;
import com.common.common.CommandMap;

@Controller
@RequestMapping("/board")
public class BlogController {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="blogSerivce")
	private BlogService blogService;
	
	@RequestMapping("/blog.do")
    public ModelAndView blog() throws Exception{
		ModelAndView mv = new ModelAndView("/board/blog");
		
		return mv;
    }
	
    /*
     * 게시글 List
     * 
     * */
	@RequestMapping("/blogList.do")
	public ModelAndView blogList(HttpServletResponse res, CommandMap commandMap) throws Exception{
	    	ModelAndView mv = new ModelAndView("jsonView");
	    	log.debug("Map Parameter : "+commandMap.getMap());
	    	
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
	public ModelAndView blogWrite(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("board/blogWrite");
		
		return mv;
	}

	@RequestMapping(value="/blogWriteInsert.do")
	public ModelAndView blogWriteInsert(CommandMap commandMap, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/board/blog.do");
		
		blogService.insertBlog(commandMap.getMap(), request);
		
		return mv;
	}
	
	@RequestMapping(value="/blogDetail.do")
	public ModelAndView blogDetail(CommandMap commandMap) throws Exception{
		log.debug("/blogDetail.do start >>>>>>>>>>> ");
		ModelAndView mv = new ModelAndView("board/blogDetail");
		
		Map<String,Object> map = blogService.selectBlogDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("list", map.get("list"));
		log.debug("/blogDetail.do end >>>>>>>>>>> ");
		return mv;
	}
	
	@RequestMapping(value="/blogUpdate.do")
	public ModelAndView blogUpdate(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("board/blogUpdate");
		
		Map<String,Object> map = blogService.selectBlogDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("list", map.get("list"));
		
		return mv;
	}
	
	@RequestMapping(value="/updateBlog.do")
	public ModelAndView updateBlog(CommandMap commandMap, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/board/blogDetail.do");
		
		blogService.updateBlog(commandMap.getMap(), request);
		
		mv.addObject("IDX", commandMap.get("IDX"));
		return mv;
	}
	
	@RequestMapping(value="/deleteBlog.do")
	public ModelAndView deleteBlog(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/board/blog.do");
		
		blogService.deleteBlog(commandMap.getMap());
		
		return mv;
	}
	
	@RequestMapping(value="/replyContentList.do")
	public ModelAndView replyContentList(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("jsonView");
		
		List<Map<String,Object>> list = blogService.getBlogReplyContentList(commandMap.getMap());
		mv.addObject("list", list);
		System.out.println("list + "+list);
    	if(list.size() > 0){
    		log.debug("dd");
    	}else{
    		log.debug("ee");
    	}
		
		return mv;
	}	

	@RequestMapping(value="/insertReplyContent.do")
	public ModelAndView insertReplyContent(CommandMap commandMap, HttpServletRequest request) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
	    	blogService.insertReplyContent(commandMap.getMap(), request);
    	return mv;
	}
	
	@RequestMapping(value="/deleteReplyContent.do")
	public ModelAndView deleteReplyContent(CommandMap commandMap) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
			blogService.deleteReplyContent(commandMap.getMap());
		return mv;
	}
	
	@RequestMapping(value="/addReReplyContent.do")
	public ModelAndView addReReplyContent(CommandMap commandMap, HttpServletRequest request) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
    	return mv;
	}
	
	@RequestMapping(value="/insertReReplyContent.do")
	public ModelAndView insertReReplyContent(CommandMap commandMap, HttpServletRequest request) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
	    	blogService.insertReReplyContent(commandMap.getMap(), request);
    	return mv;
	}
	
}
