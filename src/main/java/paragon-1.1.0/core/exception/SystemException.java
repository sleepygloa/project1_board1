package paragon.core.exception;

public class SystemException extends RuntimeException {
  private static final long serialVersionUID = 5882031904858227366L;
  private String errorCode;
  private String excepitonNo = null;
  
  public SystemException() {}
  
  public SystemException(Throwable e)
  {
    super(e);
  }
  
  public SystemException(String errorCode) {
    super(errorCode);
    this.errorCode = errorCode;
  }
  
  public void setExceptionNo(String exceptionNo) {
    excepitonNo = exceptionNo;
  }
  
  public String getExceptionNo() {
    return excepitonNo;
  }
}
