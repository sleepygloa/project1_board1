package com.settings.dao;

import java.util.List;
import java.util.Map;


import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;


@Repository("menuDao")
public class MenuDao extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getSidebarMenu() throws Exception{
		return (List<Map<String, Object>>)selectList("MenuService.getSidebarMenu");
	}
	
}
