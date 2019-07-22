package com.seonhoblog.main.ctrl;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.core.parameters.Params;
import com.seonhoblog.main.svce.LoginService;


@Controller
@RequestMapping("/ctrl/login")
public class LoginController {
	
	@Autowired(required = true)
	private LoginService loginService;
	
	//로그인하기
	@RequestMapping("/mainLoginUser")
	public Params mainLoginUser(HttpSession session, Params inParams) {
		return loginService.mainLoginUser(session, inParams);
	}
	
	//세션 불러오기
	@RequestMapping("/listSession")
	public Params listSession(HttpSession session, Params inParams) {
		
		String s_userId = (String)session.getAttribute("s_userId");
		
		inParams.setParam("s_userId", s_userId);
		
		return inParams;
	}	
	
	//로그인페이지 내용 불러오기
	@RequestMapping("/loadingMainContent")
	public ModelAndView loadingMainContent(HttpSession session) {
		ModelAndView mv = new ModelAndView();
		String s_userId = (String)session.getAttribute("s_userId");
		mv.addObject("s_userId", s_userId);
		mv.setViewName("/main/main_content");
		return mv;
	}
	
	//회원가입 페이지 이동
	@RequestMapping("/loadingLoginInsertPg")
	public String loadingLoginInsertPg() {
		return "login/loginNew";
	}
	
	//회원가입처리
	@RequestMapping("/loginInsert")
	public ModelAndView loadingLoginInsert(Params inParams) {
		ModelAndView mv = new ModelAndView("jsonView");
		
		try {
//			loginService.loginInsert(inParams);
		}catch(Exception e) {
			mv.addObject("YN", "FAIL");
			mv.addObject("MSG", "가입에 실패하였습니다. 관리자에게 문의하세요.");
			return mv;
		}
		mv.addObject("YN", "SUCCESS");
		mv.addObject("MSG", "가입되었습니다.");
		return mv;
	}
	
	//로그아웃처리
	@RequestMapping("/logout")
	public Params logout(HttpSession session, Params inParams) {
		session.invalidate();
		return inParams;
	}
	
}
