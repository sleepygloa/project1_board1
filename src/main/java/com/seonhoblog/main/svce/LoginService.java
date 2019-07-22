package com.seonhoblog.main.svce;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

import com.core.mvc.ParagonService;
import com.core.parameters.Params;
import com.core.parameters.datatable.DataTable;
import com.core.parameters.datatable.datarow.DataRow;

@Service
public class LoginService extends ParagonService {

	public Params mainLoginUser(HttpSession session, Params inParams) {
		System.out.println("mainLoginUser " + inParams);
		
		Params outParams = getSqlManager().selectGridParams("LoginService.listMainLoginUser", inParams);
		
		DataTable dt = outParams.getDataTable("dt_grid");
		
		if(dt.size() == 0) {
			//에러, 아이디가 존재하지 않습니다.
			outParams.setStsCd(101);
			return outParams;
		}
		
		DataRow dr = dt.get(0);
		
		//비밀번호 검사
		if(!dr.getString("PW").equals(inParams.getString("pw"))) {
			//에러, 비밀번호가 틀립니다.
			outParams.setStsCd(102);
			return outParams;
		}
		
		session.setAttribute("s_userId", inParams.getString("id"));
		
		System.out.println("로그인성공");
		outParams.setStsCd(200);
		//성공
		return outParams;
	}
	
	
	/*
	 * @Override public void loginInsert(Map<String, Object> map) throws Exception {
	 * log.debug("loginInsert data : "+ map);
	 * 
	 * loginDAO.loginInsert(map); }
	 * 
	 * @Override public List<Map<String, Object>> loginInfoCheck(Map<String, Object>
	 * map) throws Exception{ return loginDAO.loginInfoCheck(map); }
	 */
	
}
