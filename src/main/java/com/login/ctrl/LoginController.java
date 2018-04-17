package com.login.ctrl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.common.common.CommandMap;
import com.core.parameters.Params;
import com.login.svce.LoginService;


@Controller
@RequestMapping("/login")
public class LoginController {
	
	Logger log = Logger.getLogger(LoginController.class);
	
	@Autowired(required = true)
	private LoginService loginService;
	
	//로그인페이지 이동
	@RequestMapping("/loadingLoginPg")
	public String login() {
		return "login/login";
	}
	
	//로그인하기
	@RequestMapping("/loginUser")
	public ModelAndView login(HttpSession session, Params inParams) {
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		
		//아이디확인
		try {
			list = loginService.loginInfoCheck(inParams);	
		}catch(Exception e) {
			log.debug("loginInfoCheck ERROR "+e);
		}
		
		Map<String, Object> listMap = list.get(0);
		
		if(((Long)listMap.get("COUNT")).intValue() == 0) {

			mv.addObject("YN", "NON_ID");
			mv.addObject("MSG", "없는 아이디입니다.");
			return mv;
		}else if(!((String)listMap.get("PW")).equals((String)inParams.getString("pw"))) {

			mv.addObject("YN", "DIFF_PW");
			mv.addObject("MSG", "비밀번호가 틀렸습니다.");
			return mv;
		}else {
			session.setAttribute("s_userId", inParams.getString("id"));

			mv.addObject("YN", "SUCCESS");
			mv.addObject("MSG", "로그인에 성공하였습니다."+inParams.getString("id")+" 님! 반갑습니다.");
		}

		//성공
		return mv;
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
		return "login/loginInsert";
	}
	
	//회원가입처리
	@RequestMapping("/loginInsert")
	public ModelAndView loadingLoginInsert(Params inParams) {
		log.debug("loginInsertController = "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");
		
		try {
			loginService.loginInsert(inParams);
		}catch(Exception e) {
			log.debug("loginInsert ERROR" + e);
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
	public ModelAndView logout(HttpSession session) {
		ModelAndView mv = new ModelAndView("jsonView");
		
		session.invalidate();
		mv.addObject("MSG", "로그아웃되었습니다.");
		
		return mv;
	}
	
}
