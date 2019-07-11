package com.core.mvc;

public class ParagonService {
	
	public SqlManager getSqlManager(String dataSourceId) {
		return SqlManagerFactory.getSqlManager(dataSourceId);
	}

	public SqlManager getSqlManager() {
		return SqlManagerFactory.getSqlManager("paragonSqlManager");
	}
}
