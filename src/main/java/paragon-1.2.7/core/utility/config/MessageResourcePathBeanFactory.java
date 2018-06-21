package paragon.core.utility.config;

import org.springframework.beans.factory.FactoryBean;

public class MessageResourcePathBeanFactory implements FactoryBean<String[]> { private String[] resourcePaths;
  
  public MessageResourcePathBeanFactory() {}
  
  public String[] getResourcePaths() { return resourcePaths; }
  
  public void setResourcePaths(String[] resourcePaths)
  {
    this.resourcePaths = resourcePaths;
  }
  
  public String[] getObject() {
    return resourcePaths;
  }
  
  public Class<String[]> getObjectType() {
    return [Ljava.lang.String.class;
  }
  
  public boolean isSingleton() { return true; }
}
