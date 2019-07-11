package com.core.exception;

public class SystemException extends RuntimeException {
	private static final long serialVersionUID = 5882031904858227366L;
	private String errorCode = null;
	private String excepitonNo = null;

	public SystemException() {
	}

	public SystemException(Throwable e) {
		super(e);
	}

	public SystemException(String errorCode) {
		super(errorCode);
		this.errorCode = errorCode;
	}

	public void setExceptionNo(String exceptionNo) {
		this.excepitonNo = exceptionNo;
	}

	public String getExceptionNo() {
		return this.excepitonNo;
	}
	public String getErrorCode() {
		return this.errorCode;
	}
}