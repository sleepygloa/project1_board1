package com.settings.svce;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.core.parameters.Params;
import com.settings.dao.MenuDao;

@Service("menuService")
public class MenuServiceImpl implements MenuService {

	@Resource(name="menuDao")
	private MenuDao menuDao;
	
	@Override
	public List<Map<String, Object>> getSidebarMenu() throws Exception{
		return menuDao.getSidebarMenu();
	}
	
	@Override
	public void updateMenu(Params inParams) throws Exception{
		System.out.println("modifyProgram :" + inParams);
		
		
		String flag = null;
		flag = inParams.getString("flag");
		
		if(flag.equals("insert")) {
			System.out.println("1");
			menuDao.insertMenu(inParams);
		}else if(flag.equals("update")) {
			System.out.println("2");
			menuDao.updateMenu(inParams);
		}else if(flag.equals("delete")) {
			System.out.println("3");
			menuDao.deleteMenu(inParams);
		}
	};
	
}
