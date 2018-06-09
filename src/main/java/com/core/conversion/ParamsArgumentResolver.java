package com.core.conversion;

import java.io.BufferedReader;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;






public class ParamsArgumentResolver
  implements HandlerMethodArgumentResolver
{
  private static final Log LOG = LogFactory.getLog(ParamsArgumentResolver.class);

  public ParamsArgumentResolver() {}

  public boolean supportsParameter(MethodParameter parameter) { return Params.class.isAssignableFrom(parameter.getParameterType()); }


  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory)
    throws Exception
  {
    //NativeWebReqeust 는 기본 Request를 오버라이딩함.
    HttpServletRequest req = (HttpServletRequest)webRequest.getNativeRequest();
    String contentType = StringUtils.defaultString(req.getContentType());

    Map<String, String[]> paramMap = webRequest.getParameterMap();

    Iterator<String> it = paramMap.keySet().iterator();
    Object key = null;
    String[] value = null;
    Params commParams = new CommParams();
    boolean isMultipart = ServletFileUpload.isMultipartContent(req);//파일전송시 POST방식인지 체크

    HttpSession session = req.getSession(); //세션 정보
    Enumeration<String> attrNames = session.getAttributeNames();
    commParams.setParam("s_userId", session.getAttribute("s_userId")); //로그인아이디 Param에 저장
    Set<String> addedParams = (Set)session.getAttribute("addedParams"); //필수값들 Param에 저장

    //세션에 추가된 정보와 필수값 Param와 일치하면, 세션정보를 Param에 저장
    if ((addedParams != null) && (addedParams.size() > 0)) {
      while (attrNames.hasMoreElements()) {
        String attrName = (String)attrNames.nextElement();
        if (addedParams.contains(attrName)) {
          commParams.setParam(attrName, session.getAttribute(attrName));
        }
      }
    }

    //request의 parameter 정보를 Param에 저장
    while (it.hasNext())
    {
      key = it.next();
      value = (String[])paramMap.get(key);
      commParams.setParam(key.toString(), value[0]);
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
                if ("".equals(jsonTxt)) {
                }else {
                    Map<String, Object> jsonMap = (Map<String, Object>)mapper.readValue(jsonTxt, new TypeReference<Map<String, Object>>() {});
                    for (Iterator<Map.Entry<String, Object>> i = jsonMap.entrySet().iterator(); i.hasNext();) {
                      Map.Entry<String, Object> e = (Map.Entry)i.next();
                      String jsonKey = (String)e.getKey();
                      Object jsonValue = e.getValue();


                      //Request 중 dt_로 시작하는 데이터가 있으면 datatable로 받음
                      if (jsonKey.startsWith("dt_")) {
                          LOG.debug("dataTable make : " + jsonKey);

                          List<Map<String, Object>> list = (List)jsonValue;
                          DataTable dt = new CommDataTable();
                          if ((addedParams != null) && (addedParams.size() > 0)) {
                            LOG.debug("Add Session default Paramaters Size: " + addedParams.size());
                            for (String addParamskey : addedParams) {
                              if (addedParams.contains(addParamskey)) {
                                dt.setParam(addParamskey, commParams.getParam(addParamskey));
                              }
                            }
                          }
                          dt.setDataTable(list, addedParams);
                          commParams.setDataTable(jsonKey, dt);
                        } else {
                          commParams.setParam(jsonKey, jsonValue);
                        }
                    }
                }

          }
          catch (Exception e)
          {
            e.printStackTrace();
          }
    } else if (isMultipart) {
      MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)req;
      Iterator<String> iterator = multipartHttpServletRequest.getFileNames();

      commParams.setFileable(true);
      while (iterator.hasNext()) {
        String fileKey = (String)iterator.next();
        List<MultipartFile> listM = multipartHttpServletRequest.getFiles(fileKey);
        if (!listM.isEmpty()) {
          commParams.setParam(fileKey, listM);
        }
      }
    }

    return ParamsFactory.convertParmas(commParams);
  }
}
