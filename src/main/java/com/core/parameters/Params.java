package com.core.parameters;

import java.io.Serializable;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.core.parameters.datatable.DataTable;

public abstract interface Params
  extends Map<String, Object>, Serializable
{
  public abstract boolean isPageable();
  
  public abstract void setPageable(boolean paramBoolean);
  
  public abstract boolean isFileable();
  
  public abstract boolean isCountable();
  
  public abstract void setFileable(boolean paramBoolean);
  
  public abstract void setParam(String paramString, Object paramObject);
  
  public abstract Object getParam(String paramString);
  
  @Deprecated
  public abstract int getIntParam(String paramString);
  
  @Deprecated
  public abstract String getStrParam(String paramString);
  
  @Deprecated
  public abstract List<String> getStrListParam(String paramString);
  
  public abstract List<String> getStringList(String paramString);
  
  public abstract Long getLong(String paramString);
  
  public abstract float getFloat(String paramString);
  
  public abstract boolean getBoolean(String paramString);
  
  public abstract String getString(String paramString);
  
  public abstract int getInteger(String paramString);
  
  public abstract void setDataTable(DataTable paramDataTable);
  
  public abstract void setDataTable(String paramString, DataTable paramDataTable);
  
  public abstract DataTable getDataTable(String paramString);
  
  public abstract DataTable getDataTable();
  
  public abstract void setErrCd(int paramInt);
  
  public abstract String getErrCd();
  
  public abstract void setStsCd(int paramInt);
  
  public abstract String getStsCd();
  
//  public abstract void setMsgCd(String paramString);
//  
//  public abstract void setMsgCd(String paramString, Object[] paramArrayOfObject);
//  
//  public abstract String getMsgCd();
//  
//  public abstract void setMsgTxt(String paramString);
//  
//  public abstract String getMsgTxt();
//  
//  public abstract void setRtnUri(String paramString);
//  
//  public abstract String getRtnUri();
//  
//  public abstract void setLocale(Locale paramLocale);
//  
//  public abstract Locale getLocale();
//  
//  public abstract void setLanguage(String paramString);
//  
//  public abstract String getLanguage();
  
  public abstract void init();
  
  public abstract void setTotalCount(int paramInt);
  
  public abstract int getTotalCount();
}
