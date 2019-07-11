package com.core.mvc;

import com.core.web.listener.adapter.ParagonContextLoaderAdapter;

public class SqlManagerFactory {
	
	public static SqlManager getSqlManager(String dataSourceId) {
		return ((SqlManager) ParagonContextLoaderAdapter.getBean(dataSourceId));
	}

	public static SqlManager getSqlManager() {
		return ((SqlManager) ParagonContextLoaderAdapter.getBean("comSqlManager"));
	}
}
