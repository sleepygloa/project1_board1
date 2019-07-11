package com.core.interceptor;

import java.util.Properties;

import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;


@Intercepts({ @org.apache.ibatis.plugin.Signature(type = StatementHandler.class, method = "prepare", args = {java.sql.Connection.class }) })
public class PrepareStatementInterceptor implements Interceptor {


	@SuppressWarnings("unchecked")
	public Object intercept(Invocation invocation) throws Throwable {
		return invocation.proceed();
	}
	
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}
	public void setProperties(Properties properties) {
	}
	
}