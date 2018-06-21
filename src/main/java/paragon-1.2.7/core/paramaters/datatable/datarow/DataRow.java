package paragon.core.paramaters.datatable.datarow;

import java.io.Serializable;
import java.util.Map;

public abstract interface DataRow
  extends Map<String, Object>, Serializable
{
  @Deprecated
  public abstract void setVal(String paramString, Object paramObject);
  
  @Deprecated
  public abstract Object getVal(String paramString);
  
  public abstract String getString(String paramString);
  
  @Deprecated
  public abstract int getInt(String paramString);
  
  public abstract void setParam(String paramString, Object paramObject);
  
  public abstract Object getParam(String paramString);
  
  public abstract int getInteger(String paramString);
  
  public abstract Long getLong(String paramString);
  
  public abstract float getFloat(String paramString);
  
  public abstract boolean getBoolean(String paramString);
}
