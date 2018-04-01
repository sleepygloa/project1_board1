package com.main.ctrl;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


/**
 * @author "KimSeonHo"
 *
 */
@Controller
public class MainController {
	
	@RequestMapping("/")
	public ModelAndView home() throws Exception {
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
	

}
