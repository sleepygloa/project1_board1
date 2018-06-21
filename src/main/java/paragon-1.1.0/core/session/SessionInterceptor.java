package paragon.core.session;

import java.lang.reflect.Method;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class SessionInterceptor implements HandlerInterceptor
{
  private static final Log LOG = LogFactory.getLog(SessionInterceptor.class);
  @Autowired
  HttpSession session;
  
  public SessionInterceptor() {}
  
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception { return true; }
  

  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
    throws Exception
  {
    if ((handler instanceof HandlerMethod))
    {
      HandlerMethod method = (HandlerMethod)handler;
      if (!method.getMethod().getName().equals("loginAjax"))
      {
        SessionVo sessionVo = (SessionVo)session.getAttribute("sessionVo");
        if ((sessionVo == null) && (modelAndView != null)) {
          if (modelAndView.getViewName() == null) {
            LOG.debug("인터셉트 세션 종료 AJAX");
          } else {
            LOG.debug("인터셉트 세션 종료");
            modelAndView.setViewName("redirect:/");
          }
        }
        else if ((sessionVo == null) && (modelAndView == null)) {
          modelAndView = new ModelAndView();
          response.sendError(999);
          modelAndView.setViewName("redirect:/");
        }
      }
    }
  }
  
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
    throws Exception
  {}
}
