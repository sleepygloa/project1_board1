package paragon.core.paramaters.datatable.datarow;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class BaseDataRow extends HashMap<String, Object> implements DataRow
{
  private static final long serialVersionUID = 560246071858737831L;
  
  public BaseDataRow() {}
  
  public BaseDataRow(Map<String, Object> map)
  {
    List<String> keyList = new ArrayList(map.keySet());
    for (String key : keyList)
      put(key, map.get(key));
  }
  
  public void setVal(String key, Object value) {
    put(key, value);
  }
  
  public void setParam(String key, Object value) { put(key, value); }
  
  public Object getVal(String key)
  {
    return get(key);
  }
  
  public Object getParam(String key) {
    return get(key);
  }
  
  public String getString(String key) {
    return String.valueOf(get(key));
  }
  
  public int getInt(String key) {
    return Integer.parseInt(getString(key));
  }
  
  public int getInteger(String key)
  {
    if ((get(key) != null) && (!get(key).equals(""))) {
      return Integer.parseInt(get(key).toString());
    }
    return 0;
  }
  
  public boolean getBoolean(String key)
  {
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
}
