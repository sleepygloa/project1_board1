package paragon.core.paramaters;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import paragon.core.paramaters.datatable.DataTable;

public abstract class BaseParams extends java.util.HashMap<String, Object> implements Params
{
  private static final long serialVersionUID = 8353839181195949510L;
  private Locale locale;
  private boolean pageable;
  private boolean oracleDb;
  private boolean fileable;
  private boolean countable;
  
  public BaseParams() {}
  
  public void init()
  {
    setParam("stsCd", Integer.valueOf(100));
    setParam("errCd", "");
    setParam("msgCd", Integer.valueOf(0));
    setParam("msgTxt", "");
    setParam("rtnUri", "");
    setParam("oracleDb", Boolean.valueOf(true));
  }
  
  public void setTotalCount(int totalRowCnt) { int pageSize = getIntParam("pageSize");
    int endPage = 1;
    if (endPage > 0) {
      endPage = (totalRowCnt + pageSize - 1) / pageSize;
    }
    setParam("endPage", Integer.valueOf(endPage));
    setParam("totalRowCnt", Integer.valueOf(totalRowCnt));
  }
  
  public int getTotalCount() { return getIntParam("totalRowCnt"); }
  
  public boolean isPageable()
  {
    if (getBoolean("pageable")) {
      return true;
    }
    return pageable;
  }
  
  public boolean isOracle()
  {
    if (getBoolean("oracleDb")) {
      return true;
    }
    return oracleDb;
  }
  
  public boolean isCountable()
  {
    if (getBoolean("countable")) {
      return true;
    }
    return countable;
  }
  
  public void setPageable(boolean pageable)
  {
    this.pageable = pageable;
    fileable = false;
  }
  
  public void setOracle(boolean oracleDb)
  {
    this.oracleDb = oracleDb;
  }
  
  public boolean isFileable() {
    if (getBoolean("fileable")) {
      return true;
    }
    return fileable;
  }
  
  public void setFileable(boolean fileable)
  {
    pageable = false;
    this.fileable = fileable;
  }
  
  public void setParam(String key, Object value) {
    put(key, value);
  }
  
  public Object getParam(String key) {
    return get(key);
  }
  
  public int getIntParam(String key) {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return Integer.parseInt(get(key).toString());
    }
    return 0;
  }
  
  public String getStrParam(String key) {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return String.valueOf(get(key));
    }
    return null;
  }
  
  public int getInteger(String key) {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return Integer.parseInt(get(key).toString());
    }
    return 0;
  }
  
  public String getString(String key) {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return String.valueOf(get(key));
    }
    return null;
  }
  
  public boolean getBoolean(String key) {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return Boolean.parseBoolean(get(key).toString());
    }
    return false;
  }
  
  public Long getLong(String key)
  {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return Long.valueOf(Long.parseLong(get(key).toString()));
    }
    return Long.valueOf(0L);
  }
  
  public float getFloat(String key) {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return Float.parseFloat(get(key).toString());
    }
    return 0.0F;
  }
  
  public void setDataTable(String key, DataTable value)
  {
    setParam(key, value);
  }
  
  public void setDataTable(DataTable value) {
    setParam("dt_grid", value);
  }
  
  public DataTable getDataTable(String key) {
    return (DataTable)getParam(key);
  }
  
  public DataTable getDataTable() {
    return (DataTable)getParam("dt_grid");
  }
  
  public void setStsCd(int value) {
    setParam("stsCd", Integer.valueOf(value));
  }
  
  public String getStsCd() {
    return String.valueOf(getParam("stsCd"));
  }
  
  public void setErrCd(int value) {
    setParam("errCd", Integer.valueOf(value));
  }
  
  public String getErrCd() {
    return String.valueOf(getParam("errCd"));
  }
  
  public void setMsgCd(String value) {
    setParam("msgCd", value);
    setParam("msgTxt", paragon.core.utility.i18n.NoticeMessageUtil.getMessage(value));
  }
  
  public void setMsgCd(String value, Object[] msgValues) {
    setParam("errCd", Integer.valueOf(0));
    setParam("msgCd", value);
    setParam("msgTxt", paragon.core.utility.i18n.NoticeMessageUtil.getMessage(value, msgValues, locale));
  }
  
  public String getMsgCd() {
    return String.valueOf(getParam("msgCd"));
  }
  
  public void setMsgTxt(String value) {
    setParam("msgTxt", value);
  }
  
  public String getMsgTxt() {
    return String.valueOf(getParam("msgTxt"));
  }
  
  public void setRtnUri(String value) {
    setParam("rtnUri", value);
  }
  
  public String getRtnUri() {
    return String.valueOf(getParam("rtnUri"));
  }
  
  public void setLocale(Locale locale) { this.locale = locale; }
  
  public Locale getLocale() {
    return locale;
  }
  
  public void setLanguage(String value) {
    setParam("language", value);
  }
  
  public String getLanguage() {
    return String.valueOf(getParam("language"));
  }
  
  public List<String> getStrListParam(String key)
  {
    Object obj = getParam(key);
    if ((obj instanceof List)) {
      return (ArrayList)get(key);
    }
    return null;
  }
  


  public List<String> getStringList(String key)
  {
    Object obj = getParam(key);
    if ((obj instanceof List)) {
      return (ArrayList)get(key);
    }
    return null;
  }
}
