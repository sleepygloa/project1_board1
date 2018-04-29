package com.main.ctrl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.core.parameters.Params;
import com.main.svce.MainService;


/**
 * @author "KimSeonHo"
 *
 */
@Controller
@EnableWebMvc
@RequestMapping("")
public class MainController {
	
	@Autowired
	private MainService mainService;
	
	@RequestMapping("/")
	public ModelAndView home(Params inParams) throws Exception {
		ModelAndView mv = new ModelAndView("/main/main");

		return mv;
	}
	
	@RequestMapping("/main/loadingSession")
	public ModelAndView loadingSession(HttpSession session) throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		String s_userId = (String)session.getAttribute("s_userId");
		
		mv.addObject("s_userId", s_userId);
		return mv;
	}	
	
	@RequestMapping("/main/loadingMainBlogContent")
	public ModelAndView loadingMainBlogContent() throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		
		try {
			list = mainService.mainBlogContent();	
		}catch(Exception e) {
			
		}
		
		mv.addObject("list", list);
		
		return mv;
	}
	
	
	//블로그 글쓰기 콤보박스
	@RequestMapping("/main/getBlogAddDropdownList")
	public ModelAndView getBlogAddDropdownList() {
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		
		try {
			list = mainService.getBlogAddDropdownList();
		}catch(Exception e) {
			
		}
		mv.addObject("list", list);
		return mv;
	}
	
	//블로그 글쓰기 완료
	@RequestMapping("/main/insertBlogAddContent")
	@ResponseBody
	public void insertBlogAddContent(Params inParams) {
		System.out.println("insertBlogAddContent"+inParams);
		try {
			mainService.insertBlogAddContent(inParams);
		}catch(Exception e) {
			System.out.println("에러에러");
		}
	}

	//블로그 글 페이지
	@RequestMapping("/main/viewPg")
	@ResponseBody
	public ModelAndView viewPg(Params inParams) {
		System.out.println("viewPg : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		
		mv.setViewName(inParams.getString("page"));
		return mv;
	}
	
	//블로그 글 불러오기
	@RequestMapping("/main/viewBlogContent")
	@ResponseBody
	public ModelAndView viewBlogContent(Params inParams) {
		System.out.println("viewBlogContent : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		Map<String, Object> map = new HashMap<String, Object>();
		
		try {
			map = mainService.viewBlogContent(inParams);
			mv.addObject("map", map.get("map"));
			mv.addObject("list", map.get("list"));
			mv.addObject("S_CHECK_ID", map.get("S_CHECK_ID"));
		}catch(Exception e) {
			mv.addObject("ERROR", "글 불러오 중 에러가 발생하였습니다.");
			System.out.println("ERROR" + e);
			return mv;
		}
		
		return mv;
	}
	
	//블로그 글 수정하기
	@RequestMapping("/main/saveBlogContent")
	@ResponseBody
	public ModelAndView saveBlogContent(Params inParams, HttpServletRequest req) {
		System.out.println("/main/SaveBlogContent inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		
		try {
			mainService.saveBlogContent(inParams, req);
		}catch(Exception e) {
			System.out.println("ERROR" + e);
		}
		
		mv.addObject("SUCCESS", "글이 수정되었습니다.");
		
		
		return mv;
	}
	
	//블로그글 중 댓글 불러오기
	@RequestMapping("/main/getMainViewReContent")
	@ResponseBody
	public ModelAndView getMainViewReContent(Params inParams) {
		System.out.println("getMainViewReContent : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		
		try {
			List<Map<String,Object>> list = mainService.getMainViewReContent(inParams);
			mv.addObject("list", list);
		}catch(Exception e) {
			
		}
		
		return mv;
	}
	//메일 블로그 댓글 쓰기
	@RequestMapping(value="/main/insertMainBlogReContent")
	@ResponseBody
	public ModelAndView insertMainBlogReContent(Params inParams, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("jsonView");
		mainService.insertMainBlogReContent(inParams, request);
		return mv;
	}
	
	//블로그 댓글 삭제
	@RequestMapping(value="/main/deleteMainBlogReContent")
	@ResponseBody
	public ModelAndView deleteMainBlogReContent(Params inParams) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
			mainService.deleteMainBlogReContent(inParams);
			
			//프로시저 대체 항목
			int re_step = inParams.getInteger("re_step");
			if(re_step == 0) {
				mainService.deleteMainBlogReContentRefAll(inParams);
			}
			
		return mv;
	}
	
	
	@RequestMapping(value="/main/insertViewBlogReReContent")
	@ResponseBody
	public ModelAndView insertViewBlogReReContent(Params inParams, HttpServletRequest request) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
			mainService.insertViewBlogReReContent(inParams, request);
    	return mv;
	}
	
}
