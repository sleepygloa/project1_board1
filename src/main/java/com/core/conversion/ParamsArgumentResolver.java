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
    HttpServletRequest req = (HttpServletRequest)webRequest.getNativeRequest();
    String contentType = StringUtils.defaultString(req.getContentType());
    
    Map<String, String[]> paramMap = webRequest.getParameterMap();
    
    Iterator<String> it = paramMap.keySet().iterator();
    Object key = null;
    String[] value = null;
    Params commParams = new CommParams();
    boolean isMultipart = ServletFileUpload.isMultipartContent(req);
    
    HttpSession session = req.getSession();
    Enumeration<String> attrNames = session.getAttributeNames();
    commParams.setParam("s_userId", session.getAttribute("s_userId"));
    Set<String> addedParams = (Set)session.getAttribute("addedParams");
    



    if ((addedParams != null) && (addedParams.size() > 0)) {
      while (attrNames.hasMoreElements()) {
        String attrName = (String)attrNames.nextElement();
        if (addedParams.contains(attrName)) {
          commParams.setParam(attrName, session.getAttribute(attrName));
        }
      }
    }
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
              
              commParams.setParam(jsonKey, jsonValue);
            }
        }
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
    } else if (isMultipart)
    {
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
