package com.main.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;

@Repository("loginDAO")
public class LoginDAO extends AbstractDAO{

	public void loginInsert(Map<String, Object> map) throws Exception{
		insert("LoginService.loginInsert", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> loginInfoCheck(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("LoginService.loginInfoCheck", map);
	}
}
