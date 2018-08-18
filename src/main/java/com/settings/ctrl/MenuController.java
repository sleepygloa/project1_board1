package com.settings.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.core.parameters.Params;
import com.settings.svce.MenuService;

@Controller
@ResponseBody
@RequestMapping("/ctrl/set/menu")
public class MenuController {
	
	@Autowired
	private MenuService menuService;

	
	//사이드바 메뉴불러오기
	@RequestMapping("/getMenu")
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

	//추가, 수정, 삭제
	@RequestMapping("/modifyMenu")
	public ModelAndView modifyMenu(Params inParams) throws Exception{
		ModelAndView mv = new ModelAndView("jsonView");
		menuService.modifyMenu(inParams);
		return mv;
	}
	
}
