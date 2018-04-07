package com.core.web.servlet;

import java.util.Map;

import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

public class JacksonView
  extends MappingJackson2JsonView
{
  public JacksonView() {}
  
  protected Object filterModel(Map<String, Object> model)
  {
    Object result = super.filterModel(model);
    if (model.size() == 1) {
      return model.values().toArray()[0];
    }
    return result;
  }
}
