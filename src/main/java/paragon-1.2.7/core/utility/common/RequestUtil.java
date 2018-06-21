package paragon.core.utility.common;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import paragon.core.utility.config.Config;
import paragon.core.web.observer.ConfigObserver;


public class RequestUtil
  implements ConfigObserver
{
  private static final Log LOG = LogFactory.getLog(RequestUtil.class);
  private static String sslHeaderName;
  private static String sslHeaderValue;
  
  public static Map<String, String> getParameterMap(HttpServletRequest request) {
    Map<String, String> paramMap = new HashMap();
    Enumeration<String> en = request.getParameterNames();
    while (en.hasMoreElements()) {
      String paramName = (String)en.nextElement();
      String paramValue = request.getParameter(paramName);
      paramMap.put(paramName, paramValue);
    }
    return paramMap;
  }
  
  private static void setSSLHeaderConstants() {
    sslHeaderName = Config.getString("sslCondition.name");
    sslHeaderValue = Config.getString("sslCondition.value");
  }
  
  public static boolean isSSL(HttpServletRequest request) {
    boolean ret = sslHeaderValue.equals(request.getHeader(sslHeaderName));
    
    return ret;
  }
  
  public static void addCookie(HttpServletResponse httpRes, String cookieKey, Object cookieValue) {
    Cookie cookie = new Cookie(cookieKey, String.valueOf(cookieValue));
    cookie.setPath("/");
    httpRes.addCookie(cookie);
  }
  
  public void update() {
    
    if (LOG.isDebugEnabled()) {
      LOG.debug(" sslHeaderName : " + sslHeaderName);
      LOG.debug(" sslHeaderValue : " + sslHeaderValue);
    }
  }
  
  static {
    setSSLHeaderConstants();
  }
  
  public RequestUtil() {}
}
