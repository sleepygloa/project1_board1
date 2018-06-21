package paragon.core.conversion;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.core.MethodParameter;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;
import paragon.core.paramaters.Params;
import paragon.core.paramaters.datatable.DataTable;
import paragon.core.web.servlet.JacksonView;


public class ParamsReturnValueHandler
  implements HandlerMethodReturnValueHandler
{
  private static final JacksonView JACKSON_VIEW = new JacksonView();
  
  public ParamsReturnValueHandler() {}
  
  public boolean supportsReturnType(MethodParameter returnType) { if (Params.class.isAssignableFrom(returnType.getParameterType()))
      return true;
    if (DataTable.class.isAssignableFrom(returnType.getParameterType())) {
      return true;
    }
    return false;
  }
  

  public void handleReturnValue(Object returnVal, MethodParameter returnType, ModelAndViewContainer mavContainer, NativeWebRequest webRequest)
    throws Exception
  {
    if (DataTable.class.isAssignableFrom(returnType.getParameterType())) {
      mavContainer.setView(JACKSON_VIEW);
      List<HashMap<String, Object>> list = (List)returnVal;
      mavContainer.addAttribute(list);
      return;
    }
    
    String ajaxType = webRequest.getHeader("AjaxType");
    Map<String, Object> returnValue = (Map)returnVal;
    Iterator<String> it = returnValue.keySet().iterator();
    Object key = null;
    Object value = null;
    while (it.hasNext()) {
      key = it.next();
      value = returnValue.get(key.toString());
      



      mavContainer.addAttribute((String)key, value);
    }
    
    if (!"raw".equals(ajaxType)) {
      mavContainer.setView(JACKSON_VIEW);
    } else {
      Params params = (Params)returnValue;
      mavContainer.setRequestHandled(true);
      
      if (params.containsKey("stsCd")) {
        webRequest.setAttribute("stsCd", params.getStsCd(), 0);
      }
      
      if (params.containsKey("msgCd")) {
        webRequest.setAttribute("msgCd", params.getMsgCd(), 0);
        webRequest.setAttribute("msgCd", params.getMsgTxt(), 0);
      }
      if (params.containsKey("rtnUri")) {
        webRequest.setAttribute("rtnUri", params.getRtnUri(), 0);
      }
    }
  }
}
