package paragon.core.paramaters.datatable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import paragon.core.paramaters.datatable.datarow.CommDataRow;
import paragon.core.paramaters.datatable.datarow.DataRow;

public abstract class BaseDataTable
  extends ArrayList<DataRow> implements DataTable
{
  private Map<String, Object> params = new HashMap();
  
  private static final long serialVersionUID = 3433673892065250341L;
  
  public BaseDataTable() {}
  
  public BaseDataTable(List<Map<String, Object>> list)
  {
    for (Map<String, Object> map : list) {
      DataRow dr = new CommDataRow(map);
      add(dr);
    }
  }
  
  public void setDataTable(List<Map<String, Object>> list, Set<String> addedParams) { for (Map<String, Object> map : list) {
      DataRow dr = new CommDataRow(map);
      if (addedParams.size() > 0) {
        for (String key : addedParams) {
          dr.put(key, params.get(key));
        }
      }
      add(dr);
    }
  }
  
  public DataRow getRow(int idx) { return (DataRow)get(idx); }
  
  public void addRow(DataRow dr) {
    add(dr);
  }
  
  public void setRow(int idx, DataRow dr) { set(idx, dr); }
  
  public void addRow(int idx, DataRow dr) {
    add(idx, dr);
  }
  
  public int getCount() { return size(); }
  
  public void clean() {
    clear();
  }
  
  public void removeAt(int idx) { remove(idx); }
  
  public String[] getColumns() {
    if (getCount() > 0) {
      DataRow dr = (DataRow)get(0);
      Iterator<String> mapKeys = dr.keySet().iterator();
      String[] colunms = new String[dr.size()];
      int idx = 0;
      while (mapKeys.hasNext()) {
        colunms[idx] = ((String)mapKeys.next());
        idx++;
      }
      return colunms;
    }
    
    return null;
  }
  
  public String toString() {
    StringBuilder result = new StringBuilder("[");
    
    for (int i = 0; i < size(); i++) {
      DataRow dr = (DataRow)get(i);
      Iterator<String> f = dr.keySet().iterator();
      result.append("{");
      while (f.hasNext()) {
        String key = (String)f.next();
        if (!key.startsWith("s_")) {
          result.append(key).append("=").append(dr.get(key)).append(",");
        }
      }
      if (result.lastIndexOf(",") > 0) {
        result.deleteCharAt(result.lastIndexOf(","));
      }
      result.append("}").append(",");
    }
    if (result.lastIndexOf(",") > 0) {
      result.deleteCharAt(result.lastIndexOf(","));
    }
    result.append("]");
    return result.toString();
  }
  
  public String getType() { return getType().toString(); }
  


  public int getInteger(String key)
  {
    if ((params.get(key) != null) && (!params.get(key).equals(""))) {
      return Integer.parseInt(params.get(key).toString());
    }
    return 0;
  }
  
  public String getString(String key) { if ((params.get(key) != null) && (!params.get(key).equals(""))) {
      return String.valueOf(params.get(key));
    }
    return null;
  }
  
  public boolean getBoolean(String key) { if ((params.get(key) != null) && (!params.get(key).equals(""))) {
      return Boolean.parseBoolean(params.get(key).toString());
    }
    return false;
  }
  
  public Long getLong(String key) { if ((params.get(key) != null) && (!params.get(key).equals(""))) {
      return Long.valueOf(Long.parseLong(params.get(key).toString()));
    }
    return Long.valueOf(0L);
  }
  
  public float getFloat(String key) { if ((params.get(key) != null) && (!params.get(key).equals(""))) {
      return Float.parseFloat(params.get(key).toString());
    }
    return 0.0F;
  }
  

  public void setParam(String key, Object value)
  {
    params.put(key, value);
  }
  
  public Object getParam(String key) {
    return params.get(key);
  }
}
