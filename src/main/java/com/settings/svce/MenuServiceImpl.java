package com.settings.svce;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.settings.dao.MenuDao;

@Service("menuService")
public class MenuServiceImpl implements MenuService {

	@Resource(name="menuDao")
	private MenuDao menuDao;
	
	@Override
	public List<Map<String, Object>> getSidebarMenu() throws Exception{
		return menuDao.getSidebarMenu();
	}
	
}
