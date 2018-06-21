package paragon.core.paramaters.datatable;

import java.io.Serializable;
import java.util.List;
import paragon.core.paramaters.datatable.datarow.DataRow;

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
}
