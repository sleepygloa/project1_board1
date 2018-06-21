package paragon.core.paramaters;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import paragon.core.paramaters.datatable.CommDataTable;
import paragon.core.paramaters.datatable.DataTable;
import paragon.core.paramaters.datatable.datarow.DataRow;

public class LinkedParams
  extends BaseParams
  implements Params, Comparator<DataRow>
{
  private static final Log LOG = LogFactory.getLog(LinkedParams.class);
  
  private static final long serialVersionUID = 7376207292770939753L;
  
  private static final String _LEVEL_ = "LEVEL";
  private static final String _DEFAULT_ORDER_ = "ROW_ORDER";
  private static final String _ISLEAF_ = "ISLEAF";
  private static final String _CHILE_COUNT_ = "CHILE_CNT";
  private String _CUSTOM_KEY_ = "ROW_KEY";
  private String _CUSTOM_PARENT_KEY_ = "ROW_PARENT_KEY";
  private String _CUSTOM_ORDER_ = "ROW_ORDER";
  private String _CUSTOM_ORDER_KEY_ = "LINKED_ORDER";
  
  private String _TARGET_DATATABLE_ = null;
  private Boolean _SORT_ASC_DESC_ = Boolean.valueOf(true);
  private String _SORT_COLUNM_ = null;
  

  public LinkedParams() {}
  
  public LinkedParams(Params p)
  {
    super.putAll(p);
    createLevel();
  }
  
  public LinkedParams(Params p, String customParentKey, String customKey, String customOrder) { super.putAll(p);
    _CUSTOM_PARENT_KEY_ = customParentKey;
    _CUSTOM_KEY_ = customKey;
    _CUSTOM_ORDER_ = customOrder;
    createLevel();
  }
  
  public LinkedParams(Map<String, Object> result) {
    putAll(result);
  }
  
  public void setLevelKey(String customParentKey, String customKey)
  {
    _CUSTOM_PARENT_KEY_ = customParentKey;
    _CUSTOM_KEY_ = customKey;
  }
  
  public void setLevelKey(String customParentKey, String customKey, String customOrder) { _CUSTOM_PARENT_KEY_ = customParentKey;
    _CUSTOM_KEY_ = customKey;
    _CUSTOM_ORDER_ = customOrder;
  }
  

  public void createLevel() { createLevel("dt_grid"); }
  
  public void createLevel(String dataTableName) {
    LOG.debug("Create a level data table name : " + dataTableName);
    _TARGET_DATATABLE_ = dataTableName;
    

    if (_CUSTOM_ORDER_ == null) {
      _CUSTOM_ORDER_ = "ROW_ORDER";
    }
    DataTable targetDataTable = getDataTable(dataTableName);
    
    Map<String, Map<String, String>> paramLinkedCheckMap = new HashMap();
    try {
      for (Map<String, Object> orimap : targetDataTable) {
        Map<String, String> map = new HashMap();
        String levelkey = orimap.get(_CUSTOM_KEY_).toString();
        if (!paramLinkedCheckMap.containsKey(levelkey)) {
          map.put(_CUSTOM_KEY_, levelkey);
          map.put(_CUSTOM_PARENT_KEY_, orimap.get(_CUSTOM_PARENT_KEY_).toString());
          map.put("LEVEL", "0");
          map.put("CHILE_CNT", "0");
          map.put("ISLEAF", "true");
          if ((!_CUSTOM_ORDER_.equals("ROW_ORDER")) || (_CUSTOM_ORDER_.equals("ROW_ORDER"))) {
            map.put(_CUSTOM_ORDER_, StringUtils.leftPad(orimap.get(_CUSTOM_ORDER_).toString(), 5, "0"));
          } else {
            map.put(_CUSTOM_ORDER_, StringUtils.leftPad(levelkey, 5, "0"));
          }
          paramLinkedCheckMap.put(levelkey, map);
        }
      }
    } catch (Exception e) {
      LOG.error("키가 존재 하지 않습니다.", e);
    }
    
    String originalKey;
    
    for (DataRow targetDataRow : targetDataTable) {
      originalKey = targetDataRow.getString(_CUSTOM_KEY_);
      String originalParentKey = targetDataRow.getString(_CUSTOM_PARENT_KEY_);
      if (paramLinkedCheckMap.containsKey(originalParentKey)) {
        String parentLevel = (String)((Map)paramLinkedCheckMap.get(originalParentKey)).get("LEVEL");
        Map<String, String> myLinkedCheckMap = (Map)paramLinkedCheckMap.get(originalKey);
        myLinkedCheckMap.put("LEVEL", Integer.parseInt(parentLevel) + 1);
        
        Map<String, String> parentLinkedCheckMap = (Map)paramLinkedCheckMap.get(originalParentKey);
        String parentChildCount = (String)parentLinkedCheckMap.get("CHILE_CNT");
        parentLinkedCheckMap.put("CHILE_CNT", Integer.parseInt(parentChildCount) + 1);
        parentLinkedCheckMap.put("ISLEAF", "false");
        
        String childOrderValue = originalKey;
        if ((!_CUSTOM_ORDER_.equals("ROW_ORDER")) || (_CUSTOM_ORDER_.equals("ROW_ORDER"))) {
          childOrderValue = targetDataRow.getString(_CUSTOM_ORDER_);
        }
        myLinkedCheckMap.put(_CUSTOM_ORDER_, (String)((Map)paramLinkedCheckMap.get(originalParentKey)).get(_CUSTOM_ORDER_) + StringUtils.leftPad(childOrderValue, 5, "0"));
        paramLinkedCheckMap.put(originalKey, myLinkedCheckMap);
      }
      else {
        Map<String, String> firstLevelMap = (Map)paramLinkedCheckMap.get(originalKey);
        paramLinkedCheckMap.put(originalKey, firstLevelMap);
      }
    }
    
    DataTable returnDataTalbe = new CommDataTable();
    for (DataRow originalDataRow : targetDataTable) {
      originalDataRow.put("LEVEL", ((Map)paramLinkedCheckMap.get(originalDataRow.getString(_CUSTOM_KEY_))).get("LEVEL"));
      originalDataRow.put(_CUSTOM_ORDER_KEY_, ((Map)paramLinkedCheckMap.get(originalDataRow.getString(_CUSTOM_KEY_))).get(_CUSTOM_ORDER_));
      
      originalDataRow.put("ISLEAF", ((Map)paramLinkedCheckMap.get(originalDataRow.getString(_CUSTOM_KEY_))).get("ISLEAF"));
      originalDataRow.put("CHILE_CNT", ((Map)paramLinkedCheckMap.get(originalDataRow.getString(_CUSTOM_KEY_))).get("CHILE_CNT"));
      originalDataRow.put("expanded", "true");
      returnDataTalbe.addRow(originalDataRow);
    }
    
    Collections.sort(returnDataTalbe, this);
    if (_TARGET_DATATABLE_ == null) {
      _TARGET_DATATABLE_ = "dt_grid";
    }
    
    super.setDataTable(_TARGET_DATATABLE_, returnDataTalbe);
  }
  


  public void setOrderColunm(String colunm) { _CUSTOM_ORDER_ = colunm; }
  
  public void setDesc() {
    _SORT_COLUNM_ = _CUSTOM_ORDER_;
    _SORT_ASC_DESC_ = Boolean.valueOf(false);
    if (_TARGET_DATATABLE_ != null)
      sortingDataTable();
  }
  
  public void setDesc(String colunm) {
    _SORT_COLUNM_ = colunm;
    _SORT_ASC_DESC_ = Boolean.valueOf(false);
    if (_TARGET_DATATABLE_ != null)
      sortingDataTable();
  }
  
  public void setAsc(String colunm) {
    _SORT_COLUNM_ = colunm;
    _SORT_ASC_DESC_ = Boolean.valueOf(true);
    if (_TARGET_DATATABLE_ != null)
      sortingDataTable();
  }
  
  public void setAsc() {
    _SORT_COLUNM_ = _CUSTOM_ORDER_;
    _SORT_ASC_DESC_ = Boolean.valueOf(true);
    if (_TARGET_DATATABLE_ != null)
      sortingDataTable();
  }
  
  private void sortingDataTable() {
    DataTable targetDataTalbe = getDataTable(_TARGET_DATATABLE_);
    Collections.sort(targetDataTalbe, this);
    super.setDataTable(_TARGET_DATATABLE_, targetDataTalbe);
  }
  










  public int compare(DataRow first, DataRow last)
  {
    if (_SORT_COLUNM_ == null) {
      _SORT_COLUNM_ = _CUSTOM_ORDER_;
    }
    if (_SORT_COLUNM_.equals(_CUSTOM_ORDER_)) {
      _SORT_COLUNM_ = _CUSTOM_ORDER_KEY_;
    }
    int firstOrderInt = 0;
    int LastOrderInt = 0;
    boolean integerFlag = false;
    try {
      firstOrderInt = first.getInteger(_SORT_COLUNM_);
      LastOrderInt = last.getInteger(_SORT_COLUNM_);
    } catch (Exception e) {
      integerFlag = false;
    }
    if (_SORT_ASC_DESC_.booleanValue()) {
      if (integerFlag) {
        return firstOrderInt - LastOrderInt;
      }
      return first.getString(_SORT_COLUNM_).compareTo(last.getString(_SORT_COLUNM_));
    }
    if (integerFlag) {
      return LastOrderInt - firstOrderInt;
    }
    return last.getString(_SORT_COLUNM_).compareTo(first.getString(_SORT_COLUNM_));
  }
}
