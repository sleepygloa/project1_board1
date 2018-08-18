package com.main.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;
import com.core.parameters.Params;
import com.core.parameters.datatable.datarow.DataRow;

@Repository("mainDAO")
public class MainDAO extends AbstractDAO{

//	public void loginInsert(Map<String, Object> map) throws Exception{
//		insert("LoginService.loginInsert", map);
//	}
//	
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getProgramPath(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("MainService.getProgramPath", inParams);
	}
	

}
