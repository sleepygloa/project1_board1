package paragon.core.web.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ParagonServletFilter
  implements Filter
{
  public ParagonServletFilter() {}
  
  private static final Log LOG = LogFactory.getLog(ParagonServletFilter.class);
  
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpReq = (HttpServletRequest)request;
    
    String contextPath = httpReq.getContextPath();
    String reqURL = httpReq.getRequestURL().toString();
    
    String reqURI = httpReq.getRequestURI();
    


    LOG.isDebugEnabled();
    




    if (reqURI.startsWith(contextPath)) {
      reqURI = reqURI.substring(reqURI.indexOf(contextPath) + contextPath.length());
    }
    
    LOG.isDebugEnabled();
    


    request.setAttribute("REQ_URI", reqURI);
    request.setAttribute("REQ_URL", reqURL);
    
    String ipaddr = httpReq.getHeader("X-Forwarded-For");
    if ((ipaddr == null) || ("".equals(ipaddr))) {
      ipaddr = httpReq.getHeader("Proxy-Client-IP");
      if ((ipaddr == null) || ("".equals(ipaddr))) {
        ipaddr = httpReq.getRemoteAddr();
      }
    }
    


    request.setAttribute("RemoteAddr", ipaddr);
    
    chain.doFilter(request, response);
  }
  
  public void init(FilterConfig arg0) throws ServletException {
    if (LOG.isDebugEnabled())
      LOG.debug("## EnvironmentSetupFilter init");
  }
  
  public void destroy() {
    if (LOG.isDebugEnabled()) {
      LOG.debug("## EnvironmentSetupFilter destroy");
    }
  }
}
