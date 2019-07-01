package com.core.parameters;

import java.io.Serializable;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.core.parameters.datatable.DataTable;


public interface Params extends Map<String,Object>, Serializable {
	
	
	public boolean isPageable();
	public boolean isOracle();
	public void setOracle(boolean pageable);
	public void setPageable(boolean pageable);
	public boolean isFileable();
	public boolean isCountable();
	public void setFileable(boolean fileable);
	public void setParam(String key , Object value);
	public Object getParam(String key);
	
	/**
	 * getInteger를 사용하세요
	*/
	@Deprecated
	public int getIntParam(String key);	
	
	/**
	 * getString을 사용하세요
	*/
	@Deprecated
	public String getStrParam(String key);
	
	@Deprecated
	public List<String> getStrListParam(String string);
	
	public List<String> getStringList(String string);
	
	public Long getLong(String key);
	public float getFloat(String key);
	public boolean getBoolean(String key);
	public String getString(String key);
	public int getInteger(String key);
	
	
	public void setDataTable(DataTable value);
	public void setDataTable(String key, DataTable value);
	public DataTable getDataTable(String key);
	public DataTable getDataTable();
	public void setErrCd(int value); 
	public String getErrCd();
	public void setStsCd(int value);
	public String getStsCd();
//	WMS 수정
//	MESSAGEUTIL.XML 이용
	public void setMsgCd(String value);
	public void setMsgCd(String value, Object[] msgValues);
//	MESSAGE DB 이용
	public void setMsgCd(String value, String[] msgValues);
	public void setMsgLangCd(String lang, String value);
	public void setMsgLangCd(String lang, String value, Object[] msgValues);
	public void setMsgLangCd(String lang, String value, String[] msgValues);
//	WMS 수정 끝
	public String getMsgCd();
	public void setMsgTxt(String value);
	public String getMsgTxt();
	public void setRtnUri(String value);
	public String getRtnUri();
	public void setLocale(Locale value);
	public Locale getLocale();
	public void setLanguage(String value);
	public String getLanguage();
	public void init();
	public void setTotalCount(int records);
	public int getTotalCount();
}
