package com.settings.dao;

import java.util.List;
import java.util.Map;


import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;
import com.core.parameters.Params;


@Repository("menuDao")
public class MenuDao extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getSidebarMenu() throws Exception{
		return (List<Map<String, Object>>)selectList("MenuService.getSidebarMenu");
	}
	
	public void insertMenu(Params inParams) throws Exception{
		System.out.println("insertMenu : "+ inParams);
		insert("MenuService.insertMenu", inParams);
	}

	public void updateMenu(Params inParams) throws Exception{
		update("MenuService.updateMenu", inParams);
	}
	
	public void deleteMenu(Params inParams) throws Exception{
		update("MenuService.deleteMenu", inParams);
	}
	
}
