package paragon.core.exception;

import paragon.core.utility.i18n.NoticeMessageUtil;

public class ParagonException extends RuntimeException
{
  private static final long serialVersionUID = -8838508461104216866L;
  private String errCd;
  private String errMsg;
  private Object[] args;
  private Object userData;
  private String displayCd;
  private String displayMsg;
  private Object[] displayArgs;
  
  public ParagonException(Throwable throwable)
  {
    super(throwable);
  }
  
  public ParagonException(String errCd) {
    super(errCd);
    this.errCd = errCd;
    errMsg = NoticeMessageUtil.getMessage(errCd);
  }
  
  public ParagonException(String errCd, Object userData) {
    super(errCd);
    this.errCd = errCd;
    this.userData = userData;
  }
  
  public ParagonException(String errCd, Object userData, Throwable throwable) {
    super(errCd, throwable);
    this.userData = userData;
    this.errCd = errCd;
    errMsg = NoticeMessageUtil.getMessage(errCd);
  }
  
  public ParagonException(String errCd, Throwable throwable) {
    super(errCd, throwable);
    this.errCd = errCd;
    errMsg = NoticeMessageUtil.getMessage(errCd);
  }
  
  public ParagonException(String errCd, Object[] args) {
    super(errCd);
    this.errCd = errCd;
    errMsg = NoticeMessageUtil.getMessage(errCd, args);
    this.args = args;
  }
  
  public ParagonException(String errCd, Object[] args, Throwable throwable) {
    super(errCd, throwable);
    this.errCd = errCd;
    errMsg = NoticeMessageUtil.getMessage(errCd, args);
    this.args = args;
  }
  
  public void setDisplayMsg(String displayCode, Object[] displayArgs) {
    displayCd = displayCode;
    displayMsg = NoticeMessageUtil.getMessage(displayCode, displayArgs);
    this.displayArgs = displayArgs;
  }
  
  public String getErrCd() {
    return errCd;
  }
  
  public void setErrCd(String errCd) {
    this.errCd = errCd;
  }
  
  public String getDisplayCd() {
    return displayCd;
  }
  
  public void setDisplayCd(String displayCode) {
    displayCd = displayCode;
    displayMsg = NoticeMessageUtil.getMessage(displayCode);
  }
  
  public String getErrMsg() {
    return errMsg;
  }
  
  public String getErrMsg(java.util.Locale locale) {
    return NoticeMessageUtil.getMessage(errCd, args, locale);
  }
  
  public void setErrorMessage(String errMsg) {
    this.errMsg = errMsg;
  }
  
  public String getDisplayMessage() {
    return displayMsg;
  }
  
  public String getDisplayMsg(java.util.Locale locale) {
    return NoticeMessageUtil.getMessage(displayCd, displayArgs, locale);
  }
  
  public Object[] getArgs() {
    return args;
  }
  
  public Object[] getDisplayArgs() {
    return displayArgs;
  }
  
  public void setArgs(Object[] args) {
    this.args = args;
  }
  
  public void setDisplayArgs(Object[] displayArgs) {
    this.displayArgs = displayArgs;
  }
  
  public Object getUserData() {
    return userData;
  }
  
  public void setUserData(Object userData) {
    this.userData = userData;
  }
}
