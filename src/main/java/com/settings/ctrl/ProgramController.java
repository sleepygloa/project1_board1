package com.settings.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.core.parameters.Params;
import com.settings.svce.ProgramService;

@Controller
@ResponseBody
@RequestMapping("/ctrl/set/program")
public class ProgramController {
	
	@Autowired
	private ProgramService programService;
	
	//프로그램 메뉴 불러오기 
	@RequestMapping("/getProgram")
	public ModelAndView getSidebarMenu() throws Exception {
		ModelAndView mv = new ModelAndView("jsonView");
		mv.addObject("list", programService.getProgram());
		return mv;
	}

	//추가, 수정, 삭제
	@RequestMapping("/modifyProgram")
	public ModelAndView modifyProgram(Params inParams) throws Exception{
		ModelAndView mv = new ModelAndView("jsonView");
		programService.modifyProgram(inParams);
		return mv;
	}
	
}
