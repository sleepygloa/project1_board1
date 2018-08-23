package com.manage.ctrl;

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
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.core.parameters.Params;
import com.manage.svce.BlogService;

@Controller
@EnableWebMvc
@RequestMapping("/manage/blog")
public class BlogController {

	@Autowired
	private BlogService blogService;

	@RequestMapping("/loadingSession")
	public ModelAndView loadingSession(HttpSession session) throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		String s_userId = (String)session.getAttribute("s_userId");

		mv.addObject("s_userId", s_userId);
		return mv;
	}

	@RequestMapping("/getBlog")
	public ModelAndView loadingMainBlogContent(HttpSession session) throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			list = blogService.loadingMainBlogContent();
		}catch(Exception e) {

		}

		mv.addObject("list", list);

		if(session.getAttribute("s_userId") != null) {
			String in_user_id = (String)session.getAttribute("s_userId");
			if(in_user_id.equals("sleepygloa")){
				mv.addObject("ADMIN_YN", "Y");
			}
		}
		return mv;
	}

	//블로그 글 페이지
	@RequestMapping("/viewPg")
	public ModelAndView viewPg(Params inParams) {
		System.out.println("viewPg : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");

		mv.setViewName(inParams.getString("page"));
		return mv;
	}

///////////////////////////////////////////////////

	//블로그 글쓰기 콤보박스
	@RequestMapping("/getBlogTitleDropdown")
	public ModelAndView getBlogTitleDropdown(Params inParams) {
		System.out.println("getBlogTitleDropdown inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			list = blogService.getBlogTitleDropdown(inParams);
		}catch(Exception e) {

		}
		mv.addObject("list", list);
		return mv;
	}

	//블로그 글쓰기 완료
	@RequestMapping("/insertBlogAddContent")
	public void insertBlogAddContent(Params inParams) {
		System.out.println("insertBlogAddContent"+inParams);
		try {
			blogService.insertBlogAddContent(inParams);
		}catch(Exception e) {
			System.out.println("에러에러");
		}
	}

	//블로그 글 불러오기
	@RequestMapping("/viewBlog")
	@ResponseBody
	public ModelAndView viewBlog(Params inParams) {
		System.out.println("viewBlog : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");

		String idx = inParams.getString("idx");
		if(idx != "") {
			Map<String, Object> map = new HashMap<String, Object>();

			try {
				map = blogService.viewBlog(inParams);
				mv.addObject("map", map.get("contents"));
				if(map.get("fileList") != null) {
					mv.addObject("list", map.get("fileList"));
				}

				mv.addObject("S_CHECK_ID", map.get("S_CHECK_ID"));
			}catch(Exception e) {
				mv.addObject("ERROR", "글 불러오 중 에러가 발생하였습니다.");
				e.printStackTrace();
				return mv;
			}
		}else {
			mv.addObject("S_CHECK_ID", inParams.getString("s_userId"));
		}

		return mv;
	}

	//블로그 글 수정하기
	@RequestMapping("/saveBlog")
	public ModelAndView saveBlogContent(Params inParams) {
		System.out.println("/SaveBlogContent inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		try {
			blogService.saveBlogContent(inParams);
		}catch(Exception e) {
			System.out.println("ERROR" + e);
			e.printStackTrace();
		}
		mv.addObject("SUCCESS", "글이 수정되었습니다.");
		return mv;
	}

	//블로그 글 수정하기
	@RequestMapping("/deleteBlog")
	@ResponseBody
	public ModelAndView deleteBlogContent(Params inParams) {
		System.out.println("/deleteBlogContent inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		try {
			blogService.deleteBlogContent(inParams);
		}catch(Exception e) {
			System.out.println("ERROR" + e);
			e.printStackTrace();
		}
		mv.addObject("SUCCESS", "글이 수정되었습니다.");
		return mv;
	}

	//블로그 글 수정완료 후 파일 업로드
	@RequestMapping("/saveBlogFileUpload")
	public ModelAndView saveBlogFileUpload(Params inParams, MultipartHttpServletRequest req) {
		System.out.println("/saveBlogFileUpload inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		try {
			blogService.saveBlogFileUpload(inParams, req);
		}catch(Exception e) {
			System.out.println("ERROR" + e);
			e.printStackTrace();
		}
		mv.addObject("SUCCESS", "글이 수정되었습니다.");
		return mv;
	}

	//블로그글 중 댓글 불러오기
	@RequestMapping("/getReBlog")
	public ModelAndView getReBlog(Params inParams) {
		System.out.println("getReBlog : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");

		try {
			List<Map<String,Object>> list = blogService.getReBlog(inParams);
			mv.addObject("list", list);
		}catch(Exception e) {

		}

		return mv;
	}
	//메일 블로그 댓글 쓰기
	@RequestMapping(value="/saveReBlog")
	public ModelAndView saveReBlog(Params inParams, HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("jsonView");
		blogService.saveReBlog(inParams, request);
		return mv;
	}

	//블로그 댓글 삭제
	@RequestMapping(value="/deleteReBlog")
	public ModelAndView deleteReBlog(Params inParams) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
			blogService.deleteReBlog(inParams);

			//프로시저 대체 항목
			int re_step = inParams.getInteger("re_step");
			if(re_step == 0) {
				blogService.deleteReBlogRefAll(inParams);
			}

		return mv;
	}


	@RequestMapping(value="/saveReReBlog")
	public ModelAndView saveBlogReReContent(Params inParams, HttpServletRequest request) throws Exception{
			ModelAndView mv = new ModelAndView("jsonView");
			blogService.saveReReBlog(inParams, request);
    	return mv;
	}
}
