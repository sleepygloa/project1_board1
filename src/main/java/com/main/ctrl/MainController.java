package com.main.ctrl;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.core.authority.rule.AuthorityRule;
import com.core.common.ParagonConstants;
import com.core.parameters.Params;
import com.core.utility.common.LocaleUtil;
import com.core.utility.config.Config;
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

//	@Autowired(required = true)
//	private AuthorityRule authRule;

	private static final Log LOG = LogFactory.getLog(MainController.class);


	//관리자 메인화면
	@RequestMapping("/")
	public String home(HttpSession session, HttpServletRequest request) throws Exception {
		LOG.debug("MainController home() ... ");
		LOG.debug("MAIN CHECK::"+Config.getString("session.timeoutSec"));

//		if(!authRule.isLogin(request)){

			session.setAttribute("s_ip", (String)request.getAttribute(ParagonConstants.CLIENT_IP));
			session.setAttribute("s_logined", false);
//			session.setAttribute("s_language", LocaleUtil.getUserLocale(session).getLanguage());
//			String sCountry = LocaleUtil.getUserLocale(session).getCountry();
//			if(sCountry ==""){
//				sCountry = Config.getString("locale.defaultCountry");
//			}
//			session.setAttribute("s_country", sCountry);
//			session.setAttribute("s_language_nm", LocaleUtil.getUserLocale(session).getDisplayLanguage());
			session.setAttribute("s_jSessionId", request.getRequestedSessionId());
			session.setAttribute("s_multiLogin", false);

			if(LOG.isDebugEnabled()){
				Enumeration<String> se = session.getAttributeNames();
				while(se.hasMoreElements()){
					String getse = se.nextElement()+"";
					LOG.debug("session Default Attribute : "+getse+" : "+session.getAttribute(getse));
				}
			}

			return "main/main";
//		}else{
//			return "main/main";
//		}
	}

	//사이드바 메뉴불러오기
	@RequestMapping("/getSidebarMenu")
	public List<Map<String, Object>> getSidebarMenu() throws Exception {
		return mainService.getSidebarMenu();
	}
























	@RequestMapping("/main/loadingSession")
	public ModelAndView loadingSession(HttpSession session) throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		String s_userId = (String)session.getAttribute("s_userId");

		mv.addObject("s_userId", s_userId);
		return mv;
	}

	@RequestMapping("/main/loadingMainBlogContent")
	public ModelAndView loadingMainBlogContent(HttpSession session) throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			list = mainService.loadingMainBlogContent();
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
	@RequestMapping("/main/viewPg")
	@ResponseBody
	public ModelAndView viewPg(Params inParams) {
		System.out.println("viewPg : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");

		mv.setViewName(inParams.getString("page"));
		return mv;
	}

///////////////////////////////////////////////////

	//블로그 글쓰기 콤보박스
	@RequestMapping("/main/getBlogTitleDropdown")
	public ModelAndView getBlogTitleDropdown(Params inParams) {
		System.out.println("getBlogTitleDropdown inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			list = mainService.getBlogTitleDropdown(inParams);
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

	//블로그 글 불러오기
	@RequestMapping("/main/viewBlogContent")
	@ResponseBody
	public ModelAndView viewBlogContent(Params inParams) {
		System.out.println("viewBlogContent : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");

		String idx = inParams.getString("idx");
		if(idx != "") {
			Map<String, Object> map = new HashMap<String, Object>();

			try {
				map = mainService.viewBlogContent(inParams);
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
	@RequestMapping("/main/saveBlogContent")
	@ResponseBody
	public ModelAndView saveBlogContent(Params inParams) {
		System.out.println("/main/SaveBlogContent inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		try {
			mainService.saveBlogContent(inParams);
		}catch(Exception e) {
			System.out.println("ERROR" + e);
			e.printStackTrace();
		}
		mv.addObject("SUCCESS", "글이 수정되었습니다.");
		return mv;
	}

	//블로그 글 수정하기
	@RequestMapping("/main/deleteBlogContent")
	@ResponseBody
	public ModelAndView deleteBlogContent(Params inParams) {
		System.out.println("/main/deleteBlogContent inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		try {
			mainService.deleteBlogContent(inParams);
		}catch(Exception e) {
			System.out.println("ERROR" + e);
			e.printStackTrace();
		}
		mv.addObject("SUCCESS", "글이 수정되었습니다.");
		return mv;
	}

	//블로그 글 수정완료 후 파일 업로드
	@RequestMapping("/main/saveBlogFileUpload")
	@ResponseBody
	public ModelAndView saveBlogFileUpload(Params inParams, MultipartHttpServletRequest req) {
		System.out.println("/main/saveBlogFileUpload inParams : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		try {
			mainService.saveBlogFileUpload(inParams, req);
		}catch(Exception e) {
			System.out.println("ERROR" + e);
			e.printStackTrace();
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
