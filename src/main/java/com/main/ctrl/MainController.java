package com.main.ctrl;

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

}
