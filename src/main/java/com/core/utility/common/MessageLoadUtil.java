package com.core.utility.common;

import com.core.parameters.CommParams;
import com.core.parameters.Params;
import com.core.parameters.datatable.DataTable;
import com.core.utility.config.Config;

/**
 *
 * @version 1.0
 * @since 2018. 11. 28.
 *
 */
public class MessageLoadUtil{

	private static DataTable MessageDt;

	public static DataTable setMessageLoadUtil() {
		Params inParams = new CommParams();
//		SqlManager sqlManager = SqlManagerFactory.getSqlManager();

		inParams.setParam("s_companyCd", Config.getString("masterCompany"));
		//추후 자바 커넥션 등으로 변환.
//		Params outParams = sqlManager.selectGridParams("MessageService.listMessageData", inParams);
//		MessageDt = outParams.getDataTable("dt_grid");
		return MessageDt;
	}
	public static DataTable getMessageLoadUtil() {

		if(MessageDt == null){
			setMessageLoadUtil();
		}

		return MessageDt;
	}
	// extends AbstractMessageSource {

//	private static final Log LOG = LogFactory.getLog(MessageLoadUtil.class);
//
//	//시스템 기동시 메시지 정보를 로드하는 객체
//	private static Map<String, Map<String, Object>> messageLocaleMap = null;
//
//	private static List messageList = null;
//
//	// 최초 로딩과 이후 refersh를 구분하기 위해 클래스 전역변수 flag 선언
//	private static boolean isInitialized = false;
//
//	// 외부 생성 제한
//	private MessageLoadUtil() {}
//
//	public static synchronized void init() {
//
//		Map<String, Map<String, Object>> tempMessageLocaleMap = null;
//
//		if(!isInitialized) {
//			messageLocaleMap = new HashMap<String, Map<String, Object>>();
//		}
//
//		tempMessageLocaleMap = new HashMap<String, Map<String, Object>>();
//		SqlManager sqlManager = SqlManagerFactory.getSqlManager();
//		Map<String, Object> messageMap = null;
//		String msgCd = null;
//		String msgLangCl = null;
//		String message = null;
//
////		messageList = sqlManager.queryForList("messageService.getMessageAllList");
//		messageList = new ArrayList();
//		Map ma = new HashMap<String, String>();
//		ma.put("MSG_CD", "MSG_COM_SUC_001");
//		ma.put("LANG_CL", "ko");
//		ma.put("MESSAGE", "12123123123");
//		messageList.add(ma);
//		for(Map groupRow : (List<Map>)messageList) {
//			msgCd = (String)groupRow.get("MSG_CD");
//			msgLangCl = (String)groupRow.get("LANG_CL");
//			message = (String)groupRow.get("MESSAGE");
//
//			if(tempMessageLocaleMap.get(msgCd) == null) {
//				messageMap = new HashMap<String, Object>();
//				tempMessageLocaleMap.put(msgCd, messageMap);
//			} else {
//				messageMap = tempMessageLocaleMap.get(msgCd);
//			}
//			messageMap.put(msgLangCl, message);
//		}
//
//		messageLocaleMap = tempMessageLocaleMap;
//
//		if(!isInitialized) {
//			isInitialized = true;
//		}
//	}
//
//	@Override
//	protected MessageFormat resolveCode(String msgCd, Locale locale) {
//		String msg = null;
//		if(messageLocaleMap != null) {
//			Map msgLocaleMap = (HashMap<String, Object>)messageLocaleMap.get(msgCd);
//
//			if(msgLocaleMap != null) {
//				msg = (String)msgLocaleMap.get(locale.getLanguage());
//			} else {
//				LOG.debug("########################################################");
//				LOG.debug(msgCd + " is not defined in frameone_message");
//				LOG.debug("########################################################");
//				return null;
//			}
//			msg = (String)((Map<String, Object>)messageLocaleMap.get(msgCd)).get(locale.getLanguage());
//		} else {
//			LOG.debug("########################################################");
//			LOG.debug("messageLocaleMap is not loaded");
//			LOG.debug("########################################################");
//			return null;
//		}
//
//		if(msg != null) {
//			MessageFormat result = createMessageFormat(msg, locale);
//			return result;
//		} else {
//			LOG.debug("########################################################");
//			LOG.debug(msgCd + " is not defined in this locale:" + locale.getLanguage());
//			LOG.debug("########################################################");
//		}
//
//		return null;
//	}
//
//
//	/**
//	 *
//	 * 클라이언트 메시지 로드.<br>
//	 * <br>
//	 * @param inParams
//	 * @return
//	 * @ahthor
//	 * @since 2016. 1. 8.
//	 */
//	public static String getMessageCache(Params inParams) {
//		Locale userLocale = LocaleUtil.getUserLocale(inParams);
//		List<String> aliasList = Config.getStringList("clientCacheMsg.alias");
//		List<String> codeList = Config.getStringList("clientCacheMsg.code");
//		int listSize = aliasList.size();
//
//		if(LOG.isDebugEnabled()) {
//			LOG.debug("=================== cache message - start ======================");
//		}
//		String alias;
//		String code;
//		String value;
//
//		Map<String, String> msgMap = new HashMap<String, String>();
//		for(int i = 0; i < listSize; i++) {
//			alias = aliasList.get(i);
//			code = codeList.get(i);
//			value = NoticeMessageUtil.getMessage(code, userLocale);
//			msgMap.put(alias, value);
//			if(LOG.isDebugEnabled()) {
//				LOG.debug(" alias: " + alias + ", code: " + code + ", value: " + value);
//			}
//		}
//		if(LOG.isDebugEnabled()) {
//			LOG.debug("=================== cache message - end =======================");
//		}
//		return StringUtil.getJSONString(msgMap);
//	}

}
