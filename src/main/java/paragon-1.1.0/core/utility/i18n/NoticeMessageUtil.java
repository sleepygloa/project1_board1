package paragon.core.utility.i18n;

import java.util.Locale;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.support.MessageSourceAccessor;
import paragon.core.utility.config.Config;
import paragon.core.web.listener.adapter.DefaultParagonContextLoaderAdapter;

public class NoticeMessageUtil
{
  private static final Log LOG = LogFactory.getLog(NoticeMessageUtil.class);
  private static MessageSourceAccessor messageAccessor = (MessageSourceAccessor)DefaultParagonContextLoaderAdapter.getBean("messageSourceAccessor");
  
  public NoticeMessageUtil() {}
  
  public static String getMessage(String key) {
    try { if (messageAccessor == null) {
        messageAccessor = (MessageSourceAccessor)DefaultParagonContextLoaderAdapter.getBean("messageSourceAccessor");
      }
      return messageAccessor.getMessage(key);
    } catch (NoSuchMessageException e) {
      e.printStackTrace();
      return getResultMessage(e, key);
    }
  }
  
  public static String getMessage(String key, Object[] args) {
    try {
      if (messageAccessor == null) {
        messageAccessor = (MessageSourceAccessor)DefaultParagonContextLoaderAdapter.getBean("messageSourceAccessor");
      }
      return messageAccessor.getMessage(key, args);
    } catch (NoSuchMessageException e) {
      e.printStackTrace();
      return getResultMessage(e, key);
    }
  }
  
  public static String getMessage(String key, Locale locale) {
    try {
      if (messageAccessor == null) {
        messageAccessor = (MessageSourceAccessor)DefaultParagonContextLoaderAdapter.getBean("messageSourceAccessor");
      }
      return messageAccessor.getMessage(key, locale);
    } catch (NoSuchMessageException e) {
      e.printStackTrace();
      return getResultMessage(e, key);
    }
  }
  
  public static String getMessage(String key, Object[] args, Locale locale) {
    try {
      if (messageAccessor == null) {
        messageAccessor = (MessageSourceAccessor)DefaultParagonContextLoaderAdapter.getBean("messageSourceAccessor");
      }
      return messageAccessor.getMessage(key, args, locale);
    } catch (NoSuchMessageException e) {
      e.printStackTrace();
      return getResultMessage(e, key);
    }
  }
  
  private static String getResultMessage(NoSuchMessageException e, String key) {
    if (LOG.isWarnEnabled()) {
      LOG.warn(e);
    }
    if (messageAccessor == null) {
      messageAccessor = (MessageSourceAccessor)DefaultParagonContextLoaderAdapter.getBean("messageSourceAccessor");
    }
    return messageAccessor.getMessage(
      Config.getString("customVariable.msgComErr013"), 
      new String[] { key });
  }
  
  public static String getBindMessage(Object[] bindArgs) {
    StringBuilder result = new StringBuilder();
    for (int i = 0; i < bindArgs.length; i++) {
      result.append(bindArgs[i].toString());
      if (i != bindArgs.length - 1) {
        result.append("|");
      }
    }
    return result.toString();
  }
}
