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

}
