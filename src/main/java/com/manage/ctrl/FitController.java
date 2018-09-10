package com.manage.ctrl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.core.parameters.Params;
import com.manage.svce.FitService;

@Controller
@RequestMapping("/manage/fit")
public class FitController {

	@Autowired
	private FitService fitService;
	
	@RequestMapping("")
	public ModelAndView toFitPage() {
		ModelAndView mv = new ModelAndView("/manage/fit/fit");
		return mv;
	}
	
	@RequestMapping("/getFit")
	public ModelAndView getFit(Params inParams) {
		ModelAndView mv = new ModelAndView("jsonView");
		List<Map<String, Object>> content = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			content = fitService.getFit(inParams);
			list = fitService.getFitList(inParams);
		}catch(Exception e) {

		}
		mv.addObject("content", content);
		mv.addObject("list", list);
		return mv;
	}
	
}
