package paragon.core.paramaters.datatable.datarow;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public abstract class BaseArrayRow
  extends ArrayList<Object>
  implements ArrayRow
{
  private static final long serialVersionUID = 560246071858737831L;
  
  public BaseArrayRow() {}
  
  public BaseArrayRow(Map<String, Object> map)
  {
    List<String> keyList = new ArrayList(map.keySet());
    String str; for (Iterator localIterator = keyList.iterator(); localIterator.hasNext(); str = (String)localIterator.next()) {}
  }
  

  public void setVal(String key, Object value) {}
  

  public Object getVal(String key)
  {
    return null;
  }
}
