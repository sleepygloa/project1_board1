package com.core.logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ControllerLogger extends org.springframework.web.servlet.handler.HandlerInterceptorAdapter
{
  public ControllerLogger() {}
  
  private static final Log LOG = LogFactory.getLog(ControllerLogger.class);
  
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    ActionLogger.requestLogger(request);
    LOG.debug("로거 생성됨!!!!!!!!!!!!!!!!!!!!!!!");
    return true;
  }
}
