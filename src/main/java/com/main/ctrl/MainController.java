package com.main.ctrl;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.core.common.ParagonConstants;
import com.core.parameters.Params;
import com.main.svce.MainService;


/**
 * @author "KimSeonHo"
 *
 */
@Controller
@RequestMapping("/")
public class MainController {

	@Autowired
	private MainService mainService;

	//관리자 메인화면
	@RequestMapping("")
	public String home(HttpSession session, HttpServletRequest request) throws Exception {

		//접속자 IP
		session.setAttribute("s_ip", (String)request.getAttribute(ParagonConstants.CLIENT_IP));
		
		//필수 테이블과 데이터 확인

		return "main/main";
	}
	
	//메뉴 선택시 페이지 이동
	@RequestMapping("/main/toProgram")
	public ModelAndView toProgram(Params inParams) throws Exception {
		System.out.println("toProgram");
		List<Map<String, Object>> list = mainService.getProgramPath(inParams);
		String path = (String)list.get(0).get("CALL_URL");
		ModelAndView mv = new ModelAndView(path);
		
		return mv;
	}
	
	//블로그 글 페이지
	@RequestMapping("/viewPg")
	public ModelAndView viewPg(Params inParams) {
		System.out.println("viewPg : "+inParams);
		ModelAndView mv = new ModelAndView("jsonView");

		mv.setViewName(inParams.getString("page"));
		return mv;
	}
}
