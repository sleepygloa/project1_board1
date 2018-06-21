package paragon.core.paramaters;







public class NaviParams
  extends BaseParams
  implements Params
{
  private static final long serialVersionUID = 1L;
  






  public NaviParams()
  {
    super.setPageable(true);
    super.setParam("startRow", Integer.valueOf(1));
    super.setParam("endRow", Integer.valueOf(20));
    super.setParam("pageSize", Integer.valueOf(20));
    super.setParam("page", Integer.valueOf(1));
    super.setParam("pageable", Boolean.valueOf(false));
    super.setParam("fileable", Boolean.valueOf(false));
    super.setParam("countable", Boolean.valueOf(false));
  }
  
  public NaviParams(Params p) { super.putAll(p);
    super.setPageable(p.isPageable());
    
    if ((p.getParam("page") != null) && (p.getParam("pageSize") != null))
    {
      int iPage = p.getIntParam("page");
      int iRows = p.getIntParam("pageSize");
      int startNum = (iPage - 1) * iRows;
      int endNum = iPage * iRows;
      
      super.setParam("startRow", Integer.valueOf(startNum));
      super.setParam("endRow", Integer.valueOf(endNum));
      super.setParam("pageSize", Integer.valueOf(iRows));
    }
  }
  
  public int getStartRow() { return super.getIntParam("startRow"); }
  
  public void setStartRow(int startRow) {
    super.setParam("startRow", Integer.valueOf(startRow));
  }
  
  public int getEndRow() { return super.getIntParam("endRow"); }
  
  public void setEndRow(int endRow) {
    super.setParam("startRow", Integer.valueOf(endRow));
  }
  
  public int getPage() { return super.getIntParam("page"); }
  
  public void setPage(int page) {
    super.setParam("page", Integer.valueOf(page));
  }
  
  public int getPageSize() { return super.getIntParam("pageSize"); }
  
  public void setPageSize(int pageSize) {
    super.setParam("pageSize", Integer.valueOf(pageSize));
  }
}
