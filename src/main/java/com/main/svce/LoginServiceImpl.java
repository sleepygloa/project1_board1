package com.main.svce;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.main.dao.LoginDAO;

@Service("loginService")
public class LoginServiceImpl implements LoginService{
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="loginDAO")
	private LoginDAO loginDAO;
	
	@Override
	public void loginInsert(Map<String, Object> map) throws Exception {
		log.debug("loginInsert data : "+ map);

		loginDAO.loginInsert(map);
	}
	
	@Override
	public List<Map<String, Object>> loginInfoCheck(Map<String, Object> map) throws Exception{
		return loginDAO.loginInfoCheck(map);
	}
	
}
