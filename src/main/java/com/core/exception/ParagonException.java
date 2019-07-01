package com.core.exception;

import java.util.Locale;

import com.core.parameters.datatable.DataTable;
import com.core.parameters.datatable.datarow.CommDataRow;
import com.core.parameters.datatable.datarow.DataRow;
import com.core.utility.common.MessageLoadUtil;
import com.core.utility.config.Config;
import com.core.utility.i18n.NoticeMessageUtil;

public class ParagonException extends RuntimeException {
	private static final long serialVersionUID = -8838508461104216866L;
	private String errCd;
	private String errMsg;
	private Object[] args; 
	private Object userData;
	private String displayCd; 
	private String displayMsg;
	private Object[] displayArgs; 

	public ParagonException(Throwable throwable) {
		super(throwable);
	}

	public ParagonException(String errCd) {
		super(errCd);
		this.errCd = errCd;
//		this.errMsg = NoticeMessageUtil.getMessage(errCd);
		String lang = Config.getString("locale.defaultLang");
		if(lang == null || lang == "null" || lang == "") {
			lang = "en";
		}

//      WebApplicationContext context = ContextLoader.getCurrentWebApplicationContext();
//      MessageLoadUtil mlu = (MessageLoadUtil)context.getBean("MessageUtil");

      DataTable dt = MessageLoadUtil.getMessageLoadUtil();
      DataRow dr = new CommDataRow();
      for(int i = 0; i < dt.size(); i++){
      	String listMsgCd = dt.get(i).getString("MSG_CD");
      	if(errCd.equals(listMsgCd)){
      		dr = dt.get(i);
      		break;
      	}
      }

		this.errMsg = dr.getString(lang.toUpperCase());
		
	}

	public ParagonException(String lang, String errCd) {
		super(errCd);
		this.errCd = errCd;

//        WebApplicationContext context = ContextLoader.getCurrentWebApplicationContext();
//        MessageLoadUtil mlu = (MessageLoadUtil)context.getBean("MessageUtil");

        DataTable dt = MessageLoadUtil.getMessageLoadUtil();
        DataRow dr = new CommDataRow();
        for(int i = 0; i < dt.size(); i++){
        	String listMsgCd = dt.get(i).getString("MSG_CD");
        	if(errCd.equals(listMsgCd)){
        		dr = dt.get(i);
        		break;
        	}
        }

		this.errMsg = dr.getString(lang.toUpperCase());
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
		this.errMsg = NoticeMessageUtil.getMessage(errCd);
	}

	public ParagonException(String errCd, Throwable throwable) {
		super(errCd, throwable);
		this.errCd = errCd;
		this.errMsg = NoticeMessageUtil.getMessage(errCd);
	}

	public ParagonException(String errCd, Object[] args) {
		super(errCd);
		this.errCd = errCd;
		this.errMsg = NoticeMessageUtil.getMessage(errCd, args);
		this.args = args;
	}

	public ParagonException(String lang, String errCd, String[] args) {
		super(errCd);
		this.errCd = errCd;

        DataTable dt = MessageLoadUtil.getMessageLoadUtil();
        DataRow dr = new CommDataRow();
        for(int i = 0; i < dt.size(); i++){
        	String listMsgCd = dt.get(i).getString("MSG_CD");
        	if(errCd.equals(listMsgCd)){
        		dr = dt.get(i);
        		break;
        	}
        }

        int strCnt = 0;
        String MSG_TXT = dr.getString(lang.toUpperCase());
        System.out.println("MSG_TXT " + MSG_TXT );
        if(MSG_TXT == null || MSG_TXT == "null" || MSG_TXT == "") {
	    	   MSG_TXT = dr.getString(Config.getString("locale.defaultLang").toUpperCase());
	       }
        if(MSG_TXT == null || MSG_TXT == "null" || MSG_TXT == "") {
	    	   MSG_TXT = dr.getString("EN");
	       }

        for(String str : args){
        	String arr = "{" + strCnt + "}";
        	MSG_TXT = MSG_TXT.replace(arr, str.toString());

        }

		this.errMsg = MSG_TXT;
		this.args = args;
	}

	public ParagonException(String errCd, Object[] args, Throwable throwable) {
		super(errCd, throwable);
		this.errCd = errCd;
		this.errMsg = NoticeMessageUtil.getMessage(errCd, args);
		this.args = args;
	}

	public void setDisplayMsg(String displayCode, Object[] displayArgs) {
		this.displayCd = displayCode;
		this.displayMsg = NoticeMessageUtil.getMessage(displayCode, displayArgs);
		this.displayArgs = displayArgs;
	}

	public String getErrCd() { 
		return this.errCd;
	}

	public void setErrCd(String errCd) { 
		this.errCd = errCd;
	}

	public String getDisplayCd() { 
		return this.displayCd;
	}

	public void setDisplayCd(String displayCode) {
		this.displayCd = displayCode;
		this.displayMsg = NoticeMessageUtil.getMessage(displayCode);
	}

	public String getErrMsg() {
		return this.errMsg;
	}

	public String getErrMsg(Locale locale) { 
		return NoticeMessageUtil.getMessage(this.errCd, this.args, locale);
	}

	public void setErrorMessage(String errMsg) {
		this.errMsg = errMsg;
	}

	public String getDisplayMessage() {
		return this.displayMsg;
	}

	public String getDisplayMsg(Locale locale) {
		return NoticeMessageUtil.getMessage(this.displayCd, this.displayArgs, locale);
	}

	public Object[] getArgs() {
		return this.args;
	}

	public Object[] getDisplayArgs() {
		return this.displayArgs;
	}

	public void setArgs(Object[] args) {
		this.args = args;
	}

	public void setDisplayArgs(Object[] displayArgs) {
		this.displayArgs = displayArgs;
	}

	public Object getUserData() {
		return this.userData;
	}

	public void setUserData(Object userData) {
		this.userData = userData;
	}
}
