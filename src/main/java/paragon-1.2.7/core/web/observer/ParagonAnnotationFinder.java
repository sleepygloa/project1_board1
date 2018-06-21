package paragon.core.web.observer;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;



public class ParagonAnnotationFinder
{
  private ServletContext servletContext;
  
  public ParagonAnnotationFinder(ServletContext servletContext) { this.servletContext = servletContext; }
  
  public List<Object> find(String type, Class<? extends Annotation> annotationClass) {
    List<Object> objList = new ArrayList();
    Map<String, Object> beans = null;
    
    if ("O".equals(type)) {
      WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(servletContext);
      beans = context.getBeansWithAnnotation(annotationClass);
    } else {
      return objList;
    }
    for (String key : beans.keySet()) {
      objList.add(beans.get(key));
    }
    
    return objList;
  }
}
