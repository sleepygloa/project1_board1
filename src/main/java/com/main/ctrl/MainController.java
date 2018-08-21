package com.main.ctrl;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.core.common.ParagonConstants;
import com.core.parameters.Params;
import com.core.utility.config.Config;
import com.main.svce.MainService;


/**
 * @author "KimSeonHo"
 *
 */
@Controller
@EnableWebMvc
@RequestMapping("/")
public class MainController {

	@Autowired
	private MainService mainService;

//	@Autowired(required = true)
//	private AuthorityRule authRule;

	private static final Log LOG = LogFactory.getLog(MainController.class);


	//관리자 메인화면
	@RequestMapping("")
	public String home(HttpSession session, HttpServletRequest request) throws Exception {
		LOG.debug("MainController home() ... ");
		LOG.debug("MAIN CHECK::"+Config.getString("session.timeoutSec"));

//		if(!authRule.isLogin(request)){

			session.setAttribute("s_ip", (String)request.getAttribute(ParagonConstants.CLIENT_IP));
			session.setAttribute("s_logined", false);
//			session.setAttribute("s_language", LocaleUtil.getUserLocale(session).getLanguage());
//			String sCountry = LocaleUtil.getUserLocale(session).getCountry();
//			if(sCountry ==""){
//				sCountry = Config.getString("locale.defaultCountry");
//			}
//			session.setAttribute("s_country", sCountry);
//			session.setAttribute("s_language_nm", LocaleUtil.getUserLocale(session).getDisplayLanguage());
			session.setAttribute("s_jSessionId", request.getRequestedSessionId());
			session.setAttribute("s_multiLogin", false);

			if(LOG.isDebugEnabled()){
				Enumeration<String> se = session.getAttributeNames();
				while(se.hasMoreElements()){
					String getse = se.nextElement()+"";
					LOG.debug("session Default Attribute : "+getse+" : "+session.getAttribute(getse));
				}
			}

			return "main/main";
//		}else{
//			return "main/main";
//		}
	}

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
