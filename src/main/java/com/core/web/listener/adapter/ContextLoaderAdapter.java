package com.core.web.listener.adapter;

import javax.servlet.ServletContext;

public abstract interface ContextLoaderAdapter
{
  public abstract void beforeInitialize(ServletContext paramServletContext);
  
  public abstract void afterInitialize(ServletContext paramServletContext);
  
  public abstract void beforeDestroy(ServletContext paramServletContext);
  
  public abstract void afterDestroy(ServletContext paramServletContext);
}
