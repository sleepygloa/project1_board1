package com.core.logger;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.core.web.url.URLUtil;


public class ActionLogger
{
  private static final Log LOG = LogFactory.getLog(ActionLogger.class);
  private static final String DEFAULT_CHARACTER_SET = "UTF-8";
  
  public ActionLogger() {}
  
  public static void requestLogger(HttpServletRequest request) { 
	  if (!LOG.isInfoEnabled()) {
		  return;
	  }
    
    LOG.debug("로거 생성됨!!!!!!!!!!!!!!!!!!!!!!!");
    String requestIP = (String)request.getAttribute("RemoteAddr");
    
    String requestURL = request.getRequestURL().toString();
    String paramKeyValue = null;
    StringBuilder logMessage = new StringBuilder();
    
    if (StringUtils.isNotEmpty(getParameterKeyValue(request))) {
      paramKeyValue = getParameterKeyValue(request);
    } else {
      paramKeyValue = "none";
    }
    
    logMessage.append("[IP : ").append(requestIP).append("]");
    logMessage.append("[URL : ").append(requestURL).append("]");
    logMessage.append("[Request Param : ").append(paramKeyValue).append("]");
    
    LOG.info(logMessage.toString());
    LOG.debug(logMessage.toString());
  }
  
  private static String getParameterKeyValue(HttpServletRequest request) {
    return getParameterKeyValue(request, "UTF-8");
  }
  
  private static String getParameterKeyValue(HttpServletRequest request, String charset) {
    return URLUtil.getParameterKeyValue(request, charset);
  }
}
