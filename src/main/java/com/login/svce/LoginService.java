package com.login.svce;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

@Service
public class LoginService{

	private static final Log LOG = LogFactory.getLog(LoginService.class);
	
//	public Params loginInsert(Params inParams, Map map) {
//		LOG.debug("loginInsert inParams : "+inParams);
//		LOG.debug("loginInsert map : "+map);
//		Params outParams =  ParamsFactory.createParams(inParams);
//		
//		int cnt = 0;
//		//아이디 중복체크
//		outParams = getSqlManager().selectGridParams("LoginService.checkLoginInsertId", inParams);
//
//		LOG.debug(outParams);
//		
////		if(cnt > 0) {
////			getSqlManager().insert("LoginService.loginInsert", inParams);
////			outParams.setParam("YN", "SUCCESS");
////			outParams.setParam("MSG", "가입되었습니다.");
////		}else {
////			outParams.setParam("YN", "DUPLICATION");
////			outParams.setParam("MSG", "동일한 아이디가 존재합니다.");
////		}
//		return outParams;
//	}
	
}
