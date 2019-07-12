package com.seonhoblog.settings.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.core.parameters.Params;
import com.seonhoblog.settings.svce.MenuService;

@Controller
@RequestMapping("/ctrl/settings/menu")
public class MenuController {
	
	@Autowired
	private MenuService menuService;

	
	//사이드바 메뉴불러오기
//	@RequestMapping("/getMenu")
//	public ModelAndView getSidebarMenu() throws Exception {
//		ModelAndView mv = new ModelAndView("jsonView");
//		mv.addObject("list", menuService.getSidebarMenu());
//		return mv;
//	}
	
	@RequestMapping("/getMenu")
	public Params getSidebarMenu(Params inParams) throws Exception {
		return menuService.getSidebarMenu(inParams);
	}
	
	//사이드바 메뉴불러오기
//	@RequestMapping("/getIcon")
//	public ModelAndView getIcon() throws Exception {
//		ModelAndView mv = new ModelAndView("pages/icons/index");
//			return mv;
//	}

	//추가, 수정, 삭제
	@RequestMapping("/updateMenu")
	public Params updateMenu(Params inParams) throws Exception{
		return menuService.updateMenu(inParams);
	}
	
}
