package com.seonhoblog.manage.ctrl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.core.parameters.CommParams;
import com.core.parameters.Params;
import com.core.parameters.ParamsFactory;
import com.seonhoblog.manage.svce.BlogService;

@Controller
@RequestMapping("/ctrl/manage/blog")
public class BlogController {

	@Autowired
	private BlogService blogService;

//	@RequestMapping("/loadingSession")
//	public ModelAndView loadingSession(HttpSession session) throws Exception {
//		ModelAndView mv = new ModelAndView("jsonView");
//		String s_userId = (String)session.getAttribute("s_userId");
//
//		mv.addObject("s_userId", s_userId);
//		return mv;
//	}
	
	//블로그 페이지이동
	//메뉴 선택시 페이지 이동
	@RequestMapping("")
	public String toBlog(Params inParams)  {
		return "manage/blog";
	}

	//블로그 리스트 조회
	@RequestMapping("/listBlog")
	public Params listBlog(Params inParams) throws Exception {
		Params outParams  = blogService.listBlog(inParams);


		if(inParams.getString("s_userId") != null) {
			String in_user_id = inParams.getString("s_userId");
			if(in_user_id.equals("sleepygloa")){
				outParams.setParam("ADMIN_YN", "Y");
			}
		}
		return outParams;
	}
	

	
	//블로그 글 불러오기
	@RequestMapping(method = RequestMethod.POST, value="/viewBlog")
	public Params viewBlog(Params inParams) throws Exception {
		return blogService.viewBlog(inParams);
	}
	
	//블로그 글쓰기 완료
//	@RequestMapping("/insertBlogAddContent")
//	public void insertBlogAddContent(Params inParams) {
//		System.out.println("insertBlogAddContent"+inParams);
//		try {
//			blogService.insertBlogAddContent(inParams);
//		}catch(Exception e) {
//			System.out.println("에러에러");
//		}
//	}



	//블로그 글 수정하기
	@RequestMapping("/saveBlogContents")
	public Params saveBlogContents(Params inParams) {
		return blogService.saveBlogContents(inParams);
	}
//
//	//블로그 글 수정하기
//	@RequestMapping("/deleteBlog")
//	@ResponseBody
//	public ModelAndView deleteBlogContent(Params inParams) {
//		System.out.println("/deleteBlogContent inParams : "+inParams);
//		ModelAndView mv = new ModelAndView("jsonView");
//		try {
//			blogService.deleteBlogContent(inParams);
//		}catch(Exception e) {
//			System.out.println("ERROR" + e);
//			e.printStackTrace();
//		}
//		mv.addObject("SUCCESS", "글이 수정되었습니다.");
//		return mv;
//	}
//
//	//블로그 글 수정완료 후 파일 업로드
//	@RequestMapping("/saveBlogFileUpload")
//	public ModelAndView saveBlogFileUpload(Params inParams, MultipartHttpServletRequest req) {
//		System.out.println("/saveBlogFileUpload inParams : "+inParams);
//		ModelAndView mv = new ModelAndView("jsonView");
//		try {
//			blogService.saveBlogFileUpload(inParams, req);
//		}catch(Exception e) {
//			System.out.println("ERROR" + e);
//			e.printStackTrace();
//		}
//		mv.addObject("SUCCESS", "글이 수정되었습니다.");
//		return mv;
//	}
//
//	//블로그글 중 댓글 불러오기
//	@RequestMapping("/getReBlog")
//	public ModelAndView getReBlog(Params inParams) {
//		System.out.println("getReBlog : "+inParams);
//		ModelAndView mv = new ModelAndView("jsonView");
//
//		try {
//			List<Map<String,Object>> list = blogService.getReBlog(inParams);
//			mv.addObject("list", list);
//		}catch(Exception e) {
//
//		}
//
//		return mv;
//	}
//	//메일 블로그 댓글 쓰기
//	@RequestMapping(value="/saveReBlog")
//	public ModelAndView saveReBlog(Params inParams, HttpServletRequest request) throws Exception{
//		ModelAndView mv = new ModelAndView("jsonView");
//		blogService.saveReBlog(inParams, request);
//		return mv;
//	}
//
//	//블로그 댓글 삭제
//	@RequestMapping(value="/deleteReBlog")
//	public ModelAndView deleteReBlog(Params inParams) throws Exception{
//			ModelAndView mv = new ModelAndView("jsonView");
//			blogService.deleteReBlog(inParams);
//
//			//프로시저 대체 항목
//			int re_step = inParams.getInteger("re_step");
//			if(re_step == 0) {
//				blogService.deleteReBlogRefAll(inParams);
//			}
//
//		return mv;
//	}
//
//
//	@RequestMapping(value="/saveReReBlog")
//	public ModelAndView saveBlogReReContent(Params inParams, HttpServletRequest request) throws Exception{
//			ModelAndView mv = new ModelAndView("jsonView");
//			blogService.saveReReBlog(inParams, request);
//    	return mv;
//	}
}
