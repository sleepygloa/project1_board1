package com.login.ctrl;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.login.svce.LoginService;


@Controller
public class LoginController {
	
	private static final Log LOG = LogFactory.getLog(LoginController.class);
	
	@Autowired(required = true)
	private HttpServletRequest request;
	
	@Autowired(required = true)
	private LoginService loginService;
	
	//로그인페이지 이동
	@RequestMapping("/loadingLoginPg")
	public String login() {
		return "login/login";
	}
	
//	@RequestMapping("/loginUser")
//	public Params login(Params inParams) {
//		return mainService.loginUser(inParams);
//	}
	
	//로그인페이지 내용 불러오기
	@RequestMapping("/loadingMainContent")
	public ModelAndView loadingMainContent() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("/main/main_content");
		return mv;
	}
	
	//회원가입 페이지 이동
	@RequestMapping("/loadingLoginInsertPg")
	public String loadingLoginInsertPg() {
		return "login/loginInsert";
	}
	
	//회원가입처리
//	@RequestMapping("/loginInsert")
//	public Params loadingLoginInsert(Params inParam, Map map) {
//		return loginService.loginInsert(inParam, map);
//	}
	
	
}
