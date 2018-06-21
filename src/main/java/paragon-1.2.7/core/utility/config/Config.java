package paragon.core.utility.config;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import org.apache.commons.configuration.CombinedConfiguration;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.util.SystemPropertyUtils;









public class Config
{
  private static final Log LOG = LogFactory.getLog(Config.class);
  
  private static ParagonConfigSubject configSubject;
  private static List<Object> objectList;
  private static CombinedConfiguration config = new CombinedConfiguration();
  
  private static CombinedConfiguration configOfXML = new CombinedConfiguration();
  
  private static String configLocation;
  private static long reloadDelay;
  private static long reloadPeriod;
  private static Timer configChangeCheckTimer;
  
  public Config() {}
  
  public static long getReloadDelay()
  {
    return reloadDelay;
  }
  
  public static void setConfigLocation(String configLocation) {
    configLocation = configLocation;
  }
  
  public void setReloadDelay(long reloadDelay) {
    reloadDelay = reloadDelay;
  }
  
  public static long getReloadPeriod() {
    return reloadPeriod;
  }
  



  public static void loadConfig(String type, List<Object> objList)
  {
    String[] locations = StringUtils.tokenizeToStringArray(configLocation, ",; \t\n");
    
    if (locations != null) {
      configOfXML = new CombinedConfiguration();
      
      for (int i = 0; i < locations.length; i++) {
        String path = SystemPropertyUtils.resolvePlaceholders(locations[i]).trim();
        try {
          URL url = ResourceUtils.getURL(path);
          XMLConfiguration xmlConfig = new XMLConfiguration(url);
          
          configOfXML.addConfiguration(xmlConfig);
          
          if (LOG.isInfoEnabled()) {
            LOG.info("XML Config Properties loaded.");
            Iterator<String> keys = xmlConfig.getKeys();
            while (keys.hasNext()) {
              String key = (String)keys.next();
              LOG.info("XML Config key : " + key + ", value : " + xmlConfig.getString(key));
            }
          }
        } catch (Exception e) {
          if (LOG.isErrorEnabled()) {
            LOG.error(e, e);
          }
        }
      }
      configOfXML.setForceReloadCheck(true);
    }
    
    Map<String, String> inParams = new HashMap();
    inParams.put("TYPE", type);
    inParams.put("USE_YN", "1");
    

    String[] key = { "serviceLogger", "controllerLogger", "ActionLogger" };
    String[] val = { "paragon.core.logger.ServiceLogger", "paragon.core.logger.ControllerLogger", "paragon.core.logger.ActionLogger" };
    for (int i = 0; i < key.length; i++) {
      config.addProperty(key[i], val[i]);
    }
    





    if (LOG.isInfoEnabled()) {
      LOG.info("DB Config was loaded.");
    }
    config.setForceReloadCheck(true);
    
    objectList = objList;
    configSubject = new ParagonConfigSubject(objectList);
    configSubject.notifyObserver();
  }
  










  public static String getString(String key)
  {
    return getString(key, null);
  }
  
  public static String getString(String key, String defaultValue) {
    String value = defaultValue;
    
    if ((configOfXML == null) && (config == null)) {
      if (LOG.isWarnEnabled())
        LOG.warn("Config was not loaded.");
    } else {
      value = configOfXML.getString(key, config.getString(key, defaultValue));
    }
    
    return value;
  }
  
  public static int getInteger(String key, int defaultValue) {
    int value = defaultValue;
    
    if ((configOfXML == null) && (config == null)) {
      if (LOG.isWarnEnabled())
        LOG.warn("Config was not loaded.");
    } else {
      value = configOfXML.getInteger(key, config.getInteger(key, Integer.valueOf(defaultValue))).intValue();
    }
    return value;
  }
  
  public static long getLong(String key, long defaultValue) {
    long value = defaultValue;
    
    if ((configOfXML == null) && (config == null)) {
      if (LOG.isWarnEnabled())
        LOG.warn(" Config was not loaded.");
    } else {
      value = configOfXML.getLong(key, config.getLong(key, defaultValue));
    }
    
    return value;
  }
  
  public static List<String> getStringList(String key) {
    if ((configOfXML == null) && (config == null)) {
      if (LOG.isWarnEnabled()) {
        LOG.warn("Config was not loaded.");
      }
      return null;
    }
    List<String> strList = new ArrayList();
    List<Object> list = configOfXML.getList(key);
    for (Iterator<Object> iter = list.iterator(); iter.hasNext();) {
      Object obj = iter.next();
      strList.add((String)obj);
    }
    
    if (strList.size() == 0) {
      int i = 0;
      for (;;) {
        String value = config.getString(key + "[" + i + "]");
        if (value == null) {
          break;
        }
        strList.add(value);
        i++;
      }
    }
    
    if (LOG.isDebugEnabled()) {
      LOG.debug("Config getStringList = " + strList);
    }
    
    return strList;
  }
  
  public static void cancelConfigChangeCheckTimer() {
    if (configChangeCheckTimer != null) {
      configChangeCheckTimer.cancel();
      configChangeCheckTimer.purge();
      configChangeCheckTimer = null;
      
      if (LOG.isDebugEnabled()) {
        LOG.debug("configChangeCheckTimer was destroyed");
      }
    }
  }
}
