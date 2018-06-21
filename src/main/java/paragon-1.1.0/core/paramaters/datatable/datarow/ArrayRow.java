package paragon.core.paramaters.datatable.datarow;

import java.io.Serializable;
import java.util.List;

public abstract interface ArrayRow
  extends List<Object>, Serializable
{
  public abstract void setVal(String paramString, Object paramObject);
  
  public abstract Object getVal(String paramString);
}
