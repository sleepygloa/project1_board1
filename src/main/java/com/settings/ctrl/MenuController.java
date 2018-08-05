package com.settings.ctrl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.settings.svce.MenuService;

@Controller
@ResponseBody
@RequestMapping("/menu")
public class MenuController {
	
	@Autowired
	private MenuService menuService;

	
	//사이드바 메뉴불러오기
	@RequestMapping("/getSidebarMenu")
	public ModelAndView getSidebarMenu() throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject("list", menuService.getSidebarMenu());
		return mv;
	}
	
	
	
	
	//사이드바 메뉴불러오기
		@RequestMapping("/getIcon")
		public ModelAndView getIcon() throws Exception {
			ModelAndView mv = new ModelAndView("pages/icons/index");
			return mv;
		}
}
