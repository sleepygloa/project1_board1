package com.core.authority.rule;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.core.parameters.CommParams;
import com.core.parameters.Params;

public abstract interface AuthorityRule
{
  public abstract boolean isLogin(HttpServletRequest paramHttpServletRequest);
  
  public abstract boolean isLogin(ServletRequest paramServletRequest);
  
  public abstract String getUserId(HttpServletRequest paramHttpServletRequest);
  
  public abstract String getUserId(ServletRequest paramServletRequest);
  
  public abstract CommParams getUserInfo(String paramString);
  
  public abstract void processAfterLoginSuccess(HttpServletRequest paramHttpServletRequest, HttpServletResponse paramHttpServletResponse, Params paramParams, String paramString);
  
  public abstract String getUserNo(ServletRequest paramServletRequest);
}
