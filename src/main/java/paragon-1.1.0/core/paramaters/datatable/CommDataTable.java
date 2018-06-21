package paragon.core.paramaters.datatable;

import java.util.List;
import java.util.Map;

public class CommDataTable
  extends BaseDataTable implements DataTable
{
  private static final long serialVersionUID = 1L;
  
  public CommDataTable() {}
  
  public CommDataTable(List<Map<String, Object>> list)
  {
    super(list);
  }
}
