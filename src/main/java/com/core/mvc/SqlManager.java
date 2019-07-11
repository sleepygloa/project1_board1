package com.core.mvc;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StopWatch;

import com.core.common.ParagonConstants;
import com.core.parameters.CommParams;
import com.core.parameters.Params;
import com.core.parameters.ParamsFactory;
import com.core.parameters.datatable.CommDataTable;
import com.core.parameters.datatable.DataTable;
import com.core.utility.config.Config;
import com.core.web.observer.ConfigObserver;

public class SqlManager extends SqlSessionDaoSupport implements ConfigObserver {

	private static final Log LOG = LogFactory.getLog(SqlManager.class);
	public static final String TRANSACTION_MANAGER = "transactionManager";
	private static final int DEFAULT_MAXROWS = Config.getInteger("maxDataRows", 10000000);

	@Autowired(required = false)
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		super.setSqlSessionFactory(sqlSessionFactory);
	}


	public int selectInteger(String statement, Object inParams) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int cnt = (Integer)getSqlSession().selectOne(statement,inParams);
		stopWatch.stop(); 
		loggingElapsedTime(stopWatch, statement);
		return cnt;
	}
	
	public int selectInteger(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int cnt = (Integer)getSqlSession().selectOne(statement);
		stopWatch.stop(); 
		loggingElapsedTime(stopWatch, statement);
		return cnt;
	}
	
	
	public Params selectParams(String statement, Params inParams) { 
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result = getSqlSession().selectList(statement,inParams, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		Params outParams = ParamsFactory.createOutParams((Params)new CommParams());
		outParams.setDataTable(ParagonConstants.DATA_TABLE, dt); 
		return outParams;
	}
	public Params selectParams(String statement, Object obj) { 
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result = getSqlSession().selectList(statement,obj, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		Params outParams = ParamsFactory.createOutParams((Params)new CommParams());
		outParams.setDataTable(ParagonConstants.DATA_TABLE, dt); 
		return outParams;
	}
	
	public Params selectParams(String dataTableName, String statement, Params inParams) { 
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result = getSqlSession().selectList(statement,inParams, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		Params outParams = ParamsFactory.createOutParams((Params)new CommParams());
		outParams.setDataTable(dataTableName, dt); 
		return outParams;
	}
	public Params selectParams(String dataTableName,String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result = getSqlSession().selectList(statement, new RowBounds(0, DEFAULT_MAXROWS + 1)); 
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		
		Params outParams = ParamsFactory.createOutParams((Params)new CommParams());
		outParams.setDataTable(dataTableName, dt);
		return outParams;
	}
	public Params selectParams(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result = getSqlSession().selectList(statement, new RowBounds(0, DEFAULT_MAXROWS + 1)); 
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		
		Params outParams = ParamsFactory.createOutParams((Params)new CommParams());
		outParams.setDataTable(ParagonConstants.DATA_TABLE,dt);
		return outParams;
	}
	
	public Params selectGridParams(String dtNm,String statement,Params inParams) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		
		List<Map<String,Object>> result ; 
		if(inParams.isPageable()){
			result = getSqlSession().selectList(statement,inParams,new RowBounds(inParams.getInteger("startRow"),inParams.getInteger("endRow")));
		}else{
			result = getSqlSession().selectList(statement,inParams, new RowBounds(0, DEFAULT_MAXROWS + 1));
		}
		if(inParams.isCountable()){
			inParams.put("pragonAutoCounting", "true");
			Map<String,Object> totalCnt  = getSqlSession().selectOne(statement,inParams);
			inParams.setTotalCount(Integer.parseInt(String.valueOf(totalCnt.get("TOTAL_COUNT")))); 
//			inParams.put("pragonAutoCounting", "false");
			inParams.remove("pragonAutoCounting");
		}
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		inParams.setDataTable(dtNm, dt);
		return inParams;
	}
	public Params selectGridParams(String statement,Params inParams) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		
		List<Map<String,Object>> result ; 
		if(inParams.isPageable()){
			result = getSqlSession().selectList(statement,inParams,new RowBounds(inParams.getInteger("startRow"),inParams.getInteger("endRow")));
		}else{
			result = getSqlSession().selectList(statement,inParams, new RowBounds(0, DEFAULT_MAXROWS + 1));
		}
		if(inParams.isCountable()){
			inParams.setParam("pragonAutoCounting", "true");
			Map<String,Object> totalCnt  = getSqlSession().selectOne(statement,inParams);
			inParams.setTotalCount(Integer.parseInt(String.valueOf(totalCnt.get("TOTAL_COUNT")))); 
//			inParams.setParam("pragonAutoCounting", "false");
			inParams.remove("pragonAutoCounting");
			
		}
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		inParams.setDataTable(ParagonConstants.DATA_TABLE,dt);
		return inParams;
	}
	public DataTable selectDataTable(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result = getSqlSession().selectList(statement, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dataTable = new CommDataTable(result); 
		return dataTable;
	}
	public DataTable selectDataTable(String statement,Params inParams) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result ;
		if(inParams.isPageable()){
			LOG.debug("isPagealbe : "+ inParams.isPageable());
			result = getSqlSession().selectList(statement,inParams,new RowBounds(inParams.getInteger("startRow"), inParams.getInteger("endRow")));
		}else{
			LOG.debug("isPagealbe : "+ inParams.isPageable());
			result = getSqlSession().selectList(statement,inParams, new RowBounds(0, DEFAULT_MAXROWS + 1));
		}
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result); 
		return dt;
	}
	public DataTable selectDataTable(String statement,DataTable inDt) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result ;
		result = getSqlSession().selectList(statement,inDt, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result); 
		return dt;
	}
//	WMS 추가
	public DataTable selectDataTable(String statement, Object object) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		List<Map<String,Object>> result;
		result = getSqlSession().selectList(statement,object, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		DataTable dt = new CommDataTable(result);
		return dt;
	}
//	WMS 추가 끝



	public Params selectOneParams(String statement, Object inParams) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		Map<String,Object> result = getSqlSession().selectOne(statement,inParams);
		stopWatch.stop(); 
		loggingElapsedTime(stopWatch, statement);
		return new CommParams(result);
	}
	
	public Params selectOneParams(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		Map<String,Object> result = getSqlSession().selectOne(statement);
		stopWatch.stop(); 
		loggingElapsedTime(stopWatch, statement);
		return new CommParams(result);
	}
	
	public int insert(String statement, DataTable DataTable) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int result = getSqlSession().insert(statement, DataTable);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}
	
	
	/**
	 *************************************************************************************************************************************
	 ******************************************************** <pre>reutrn : Object</pre>**************************************************
	 *************************************************************************************************************************************
	 */
	
	
	/*************************************						ORI-SELECT						************************************/
	public <T> T selectOne(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		T obj = getSqlSession().selectOne(statement);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return obj;
	}
	public <T> T selectOne(String statement, Object p) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		T obj = getSqlSession().selectOne(statement,p);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return obj;
	}
	public <T> T selectOne(String statement, Params inParams) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		T obj = getSqlSession().selectOne(statement,inParams);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return obj;
	}
	public <E> List<E> selectList(String statement, Params inParams) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		
		List<E> result = getSqlSession().selectList(statement,inParams, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement); 
		return result;
	}
	public <E> List<E> selectList(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		
		List<E> result = getSqlSession().selectList(statement, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}
	public <E> List<E> selectList(String statement, Object obj) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		
		List<E> result = getSqlSession().selectList(statement,obj, new RowBounds(0, DEFAULT_MAXROWS + 1));
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}
	
	/*************************************						ORI-INSERT						************************************/
	public int insert(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int result = getSqlSession().insert(statement);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}
	public int insert(String statement, Object object) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int result = getSqlSession().insert(statement, object);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}

	/*************************************					ORI-DELETE							************************************/
	public int delete(String statement, Object object) {
		int deleteCount = 0;
		try {
			StopWatch stopWatch = new StopWatch();
			stopWatch.start();
			deleteCount = getSqlSession().delete(statement, object);
			stopWatch.stop();
			loggingElapsedTime(stopWatch, statement);
		} catch (RuntimeException e) {
			throw e;
		}
		return deleteCount;
	}

	public int delete(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int result = getSqlSession().delete(statement);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}
	
	
	
	/*************************************					ORI-UPDATE							************************************/

	public int update(String statement) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int result = getSqlSession().update(statement);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}
	
	public int update(String statement,Object object) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		int result = getSqlSession().update(statement, object);
		stopWatch.stop();
		loggingElapsedTime(stopWatch, statement);
		return result;
	}

	
	
	private void loggingElapsedTime(StopWatch stopWatch, String statement) {
		if (LOG.isInfoEnabled()) {
			StringBuilder elapsedTime = new StringBuilder("Query [");
			elapsedTime.append(statement).append("] Elapsed Time : ");
			elapsedTime.append(stopWatch.getTotalTimeMillis()/1000f).append(" sec");
			LOG.info(elapsedTime);
		}
	}
	@Override
	public void update() {
//		DEFAULT_MAXROWS = Config.getInteger("defaultMaxRows", 2147483646);
//	    if (LOG.isInfoEnabled()){
//	      LOG.info("DefaultMaxRows : " + DEFAULT_MAXROWS);
//		}
	}

	
}
