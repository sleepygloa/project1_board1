package com.core.conversion;


import java.io.BufferedReader;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
//import org.codehaus.jackson.type.TypeReference;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.core.parameters.CommParams;
import com.core.parameters.Params;
import com.core.parameters.ParamsFactory;
import com.core.parameters.datatable.CommDataTable;
import com.core.parameters.datatable.DataTable;
import com.core.utility.common.LocaleManager;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ParamsArgumentResolver implements HandlerMethodArgumentResolver {

	private static final Log LOG = LogFactory.getLog(ParamsArgumentResolver.class);

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return Params.class.isAssignableFrom(parameter.getParameterType());
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

		HttpServletRequest req = (HttpServletRequest) webRequest.getNativeRequest();
		String contentType = StringUtils.defaultString(req.getContentType());

		Map<String, String[]> paramMap = webRequest.getParameterMap();

		Iterator<String> it = paramMap.keySet().iterator();
		Object key = null;
		String[] value = null;
		Params commParams = new CommParams();
		boolean isMultipart = ServletFileUpload.isMultipartContent(req);

		HttpSession session = req.getSession();
		String s_proCd = StringUtils.defaultString(req.getHeader("proCd")).trim();
		commParams.setParam("s_proCd",s_proCd);
		Enumeration<String> attrNames = session.getAttributeNames();
		@SuppressWarnings("unchecked")
		Set<String> addedParams = (Set<String>) session.getAttribute("addedParams");


		if(addedParams != null && addedParams.size() > 0) {
			while (attrNames.hasMoreElements()) {
				String attrName = attrNames.nextElement();
				if(addedParams.contains(attrName)) {
					commParams.setParam(attrName, session.getAttribute(attrName));
				}
			}
		}

		while (it.hasNext()) {

			key = it.next();
			value =  paramMap.get(key);
			String param = value[0].replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "");
			param = param.replaceAll("<script", "<script");
//			코어적용 [주석제거]
//			param = param.replaceAll("<script", "<script");
			param = param.replaceAll("alert\\(", "alert\\(");
//			param = param.replaceAll("prompt(", "prompt(");
//			param = param.replaceAll("document.", "document.");
//			param = param.replaceAll(".cookie", ".cookie");
			commParams.setParam(key.toString(), param);
		}

		if (contentType.contains("application/json")) {
			webRequest.setAttribute("contentType", "application/json", 0);
			StringBuilder jsonText = new StringBuilder();
			String line = null;
			ObjectMapper mapper = new ObjectMapper();
			try {
				BufferedReader reader = req.getReader();
				while ((line = reader.readLine()) != null) {
					jsonText.append(line);
				}

				String jsonTxt = jsonText.toString();
				if (!("".equals(jsonTxt))) {
					jsonTxt = jsonTxt.replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "");
					jsonTxt = jsonTxt.replaceAll("script", "script");
					jsonTxt = jsonTxt.replaceAll("alert", "alert");
//					jsonTxt = jsonTxt.replaceAll("prompt(", "prompt(");
//					jsonTxt = jsonTxt.replaceAll("document.", "document.");
//					jsonTxt = jsonTxt.replaceAll(".cookie", ".cookie");
					Map<String, Object> jsonMap = mapper.readValue(jsonTxt, new TypeReference<HashMap<String, Object>>(){});
					for (Iterator<Entry<String, Object>> i = jsonMap.entrySet().iterator(); i.hasNext();) {
						Entry<String, Object> e = i.next();
						String jsonKey = e.getKey();
						Object jsonValue = e.getValue();


						if (jsonKey.startsWith("dt_")) {
							//WMS
							if(jsonKey != null){
								LOG.debug("dataTable make : " + jsonKey);
								@SuppressWarnings("unchecked")
								List<Map<String, Object>> list = (List<Map<String, Object>>)jsonValue;
								DataTable dt = new CommDataTable();
								LOG.debug("=====");
								if(addedParams != null && addedParams.size() > 0) {
									LOG.debug("=====");
									LOG.debug("Add Session default Paramaters Size: "+addedParams.size() );
									for (String addParamskey : addedParams) {
										if(addedParams.contains(addParamskey)) {
											dt.setParam(addParamskey, commParams.getParam(addParamskey));
										}
									}
									dt.setDataTable(list, addedParams);
								}
								commParams.setDataTable(jsonKey, dt);
							}
							//WMS END

						} else {
							commParams.setParam(jsonKey, jsonValue);
						}
					}

				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}else if (isMultipart) {

			MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)req;
		    Iterator<String> iterator = multipartHttpServletRequest.getFileNames();

		    commParams.setFileable(true);
		    while(iterator.hasNext()){
		    	String fileKey = iterator.next();
		    	List<MultipartFile> listM = multipartHttpServletRequest.getFiles(fileKey);
		        if(listM.isEmpty() == false){
		        	commParams.setParam(fileKey, listM);
		        }
		    }

		}

		return ParamsFactory.convertParmas(commParams);
	}

}
