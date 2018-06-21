package paragon.core.utility.common;

import java.util.Locale;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import paragon.core.paramaters.Params;


public class LocaleUtil
{
  public static final String DEFAULT_LANG = ;
  
  public static final Locale DEFAULT_LOCALE = new Locale(DEFAULT_LANG);
  
  public LocaleUtil() {}
  
  private static String resolveDefaultLanguage() { return "ko"; }
  
  public static String getDefaultLanguage()
  {
    return DEFAULT_LANG;
  }
  
  public static Locale getDefaultLocale() {
    return DEFAULT_LOCALE;
  }
  
  public static String getUserLanguage(Params inParams) {
    String lang = (String)inParams.getParam("g_lang");
    return StringUtils.isNotBlank(lang) ? lang : getDefaultLanguage();
  }
  
  public static String getUserLanguage(HttpSession session) {
    if (session == null) {
      return getDefaultLanguage();
    }
    Object lang = session.getAttribute("g_lang");
    return lang != null ? (String)lang : getDefaultLanguage();
  }
  
  public static String getUserLanguage(HttpServletRequest request) {
    return getUserLanguage(request.getSession(false));
  }
  
  public static Locale getUserLocale(Params inParams) {
    Object locale = inParams
      .getParam(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME);
    return !"".equals(locale) ? (Locale)locale : getDefaultLocale();
  }
  
  public static Locale getUserLocale(HttpSession session) {
    if (session == null) {
      return getDefaultLocale();
    }
    Object locale = session
      .getAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME);
    return locale != null ? (Locale)locale : getDefaultLocale();
  }
  
  public static Locale getUserLocale(HttpServletRequest request) {
    return getUserLocale(request.getSession(false));
  }
  
  public static void setUserLocale(HttpSession session, Locale locale) {
    session.setAttribute(
      SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, locale);
    session.setAttribute("g_lang", locale.getLanguage());
  }
  
  public static Locale getLocaleBy2Letter(String lang2Letter)
  {
    Locale changedLocale = null;
    
    Locale backupLocale = null;
    
    String tmpLocale2Letter = null;
    for (Locale tmpLocale : Locale.getAvailableLocales()) {
      tmpLocale2Letter = tmpLocale.getLanguage();
      if (tmpLocale2Letter.equals(lang2Letter)) {
        changedLocale = tmpLocale;
        break;
      }
      if (tmpLocale2Letter.equals(DEFAULT_LANG)) {
        backupLocale = tmpLocale;
      }
    }
    if (changedLocale == null) {
      changedLocale = backupLocale;
    }
    return changedLocale;
  }
}
