package paragon.core.web.navi;










public class Navi
{
  private int rowSize = 10;
  private int pageSize = 10;
  

  private int currentPage;
  

  private int totalRowCnt;
  

  private int lineNo;
  
  private String fnName;
  

  public Navi(String FnNm, int totRow, int currPg, int viewRowSize)
  {
    setFnName(FnNm);
    setTotalRowCnt(totRow);
    setCurrentPage(currPg);
    setRowSize(viewRowSize);
  }
  



  public Navi(NaviVo vo, int totRow)
  {
    setFnName(vo.getFnName());
    setTotalRowCnt(totRow);
    setCurrentPage(vo.getCurrPg());
    setRowSize(vo.getRowSize());
  }
  

  public Navi(NaviVo vo)
  {
    setFnName(vo.getFnName());
    setTotalRowCnt(vo.getTotRow());
    setCurrentPage(vo.getCurrPg());
    setRowSize(vo.getRowSize());
  }
  






  public Navi(String FnNm, int totRow, int currPg)
  {
    setFnName(FnNm);
    setTotalRowCnt(totRow);
    setCurrentPage(currPg);
  }
  





  public String getPageNavi()
  {
    int totalPageCnt = (totalRowCnt + rowSize - 1) / rowSize;
    boolean nowFirst = currentPage <= pageSize;
    boolean nowEnd = (totalPageCnt - 1) / pageSize * pageSize < currentPage;
    

    StringBuffer sbHtml = new StringBuffer();
    if (totalRowCnt > 0) {
      int iStartPage = (currentPage - 1) / pageSize * pageSize + 1;
      int iEndPage = iStartPage + pageSize - 1;
      if (iEndPage > totalPageCnt) {
        iEndPage = totalPageCnt;
      }
      
      sbHtml.append("<ul class='pagination'>\n");
      if (nowFirst) {
        sbHtml.append("  <li><a href='#'> <span><i class='fa fa-angle-double-left'></i></span> </a></li>\n");
      } else {
        sbHtml.append("  <li><a href='#'  onclick='javascript:" + fnName + "(" + (iEndPage - 10) + ")'> <span><i class='fa fa-angle-double-left'></i></span> </a></li>\n");
      }
      

      for (int i = iStartPage; i <= iEndPage; i++) {
        if (currentPage == i) {
          sbHtml.append("     <li><a  class='page_on'>" + i + "</a></li>\n");
        } else {
          sbHtml.append("     <li><a href='#' onclick='javascript:" + fnName + "(" + i + ")'> " + i + " </a></li> \n");
        }
      }
      
      if (nowEnd) {
        sbHtml.append("   <li><a href='#'> <span><i class='fa fa-angle-double-right'></i></span> </a></li>\n");
      } else {
        sbHtml.append("   <li><a href='#'  onclick='javascript:" + fnName + "(" + (iStartPage + 10) + ")'> <span><i class='fa fa-angle-double-right'></i></span> </a></li>\n");
      }
      sbHtml.append("</ul>\n");
    }
    return sbHtml.toString();
  }
  
  public String getFnName()
  {
    return fnName;
  }
  
  public void setFnName(String fnName) { this.fnName = fnName; }
  
  public int getRowSize() {
    return rowSize;
  }
  
  public void setRowSize(int rowSize) { this.rowSize = rowSize; }
  
  public int getCurrentPage() {
    return currentPage;
  }
  
  public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }
  

  public int getTotalRowCnt() { return totalRowCnt; }
  
  public int getLineNo() {
    lineNo = (totalRowCnt - rowSize * (currentPage - 1));
    return lineNo;
  }
  
  public void setTotalRowCnt(int totalRowCnt) { this.totalRowCnt = totalRowCnt; }
}
