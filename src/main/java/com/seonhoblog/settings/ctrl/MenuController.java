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

	//메뉴 선택시 페이지 이동
	@RequestMapping("")
	public String listToProgramPageMove(Params inParams)  {
		return "settings/menu";
	}
	
	@RequestMapping("/listMainSideMenu")
	public Params listMainSideMenu(Params inParams)  {
		return menuService.listMainSideMenu(inParams);
	}

	@RequestMapping("/listMenu")
	public Params listMenu(Params inParams)  {
		return menuService.listMainSideMenu(inParams);
	}


	//추가, 수정, 삭제
	@RequestMapping("/updateMenu")
	public Params updateMenu(Params inParams) {
		return menuService.updateMenu(inParams);
	}
	
}
