package com.core.parameters.datatable;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.core.parameters.datatable.datarow.DataRow;

public abstract interface DataTable
  extends List<DataRow>, Serializable
{
  public abstract DataRow getRow(int paramInt);
  
  public abstract void addRow(DataRow paramDataRow);
  
  public abstract void addRow(int paramInt, DataRow paramDataRow);
  
  public abstract void setRow(int paramInt, DataRow paramDataRow);
  
  public abstract int getCount();
  
  public abstract void clean();
  
  public abstract void removeAt(int paramInt);
  
  public abstract String toString();
  
  public abstract String getType();
  
  public abstract String[] getColumns();
  
  public abstract void setDataTable(List<Map<String, Object>> paramList, Set<String> paramSet);
  
  public abstract void setParam(String paramString, Object paramObject);
  
  public abstract Object getParam(String paramString);
  
  public abstract String getString(String paramString);
  
  public abstract int getInteger(String paramString);
  
  public abstract boolean getBoolean(String paramString);
  
  public abstract Long getLong(String paramString);
  
  public abstract float getFloat(String paramString);
}
