package paragon.core.web.navi;

import java.util.Map;









public class NaviVo
{
  private Map<String, String> params;
  private int rowSize = 10;
  private int currPg = 1;
  private int totRow;
  private String fnName;
  private int start;
  
  public NaviVo() {}
  
  public String getLogin_id()
  {
    return login_id;
  }
  
  public void setLogin_id(String login_id) { this.login_id = login_id; }
  
  public String getCg_year() {
    return cg_year;
  }
  
  public void setCg_year(String cg_year) { this.cg_year = cg_year; }
  
  public Map<String, String> getParams() {
    return params;
  }
  
  public int getTotRow() { return totRow; }
  
  public void setTotRow(int totRow) {
    this.totRow = totRow;
  }
  
  public void setParams(Map<String, String> params) { this.params = params; }
  
  public int getRowSize() {
    return rowSize;
  }
  
  public void setRowSize(int rowSize) { this.rowSize = rowSize; }
  
  public int getCurrPg() {
    return currPg;
  }
  
  public void setCurrPg(int currPg) { this.currPg = currPg; }
  
  public String getFnName() {
    return fnName;
  }
  
  public void setFnName(String fnName) { this.fnName = fnName; }
  
  public int getStart() {
    return start;
  }
  
  public void setStart(int start) { this.start = start; }
  
  public int getEnd() {
    return end;
  }
  
  public void setEnd(int end) { this.end = end; }
  
  private int end;
  public String getPagingStart() { String sQuery = "";
    return sQuery;
  }
  
  public String getPagingEnd() { int end = currPg * rowSize;
    int start = end - rowSize;
    String eQuery = "LIMIT " + start + "," + rowSize;
    return eQuery; }
  
  private String cg_year;
  private String login_id;
  public String toString() { return 
    
      "NaviVo [params=" + params + ", rowSize=" + rowSize + ", currPg=" + currPg + ", totRow=" + totRow + ", fnName=" + fnName + "]";
  }
}
