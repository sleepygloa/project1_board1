package com.core.parameters.datatable.datarow;

import java.util.Map;

public class CommDataRow
  extends BaseDataRow implements DataRow
{
  private static final long serialVersionUID = 1812704618541087937L;
  
  public CommDataRow() {}
  
  public CommDataRow(Map<String, Object> map)
  {
    super(map);
  }
}
