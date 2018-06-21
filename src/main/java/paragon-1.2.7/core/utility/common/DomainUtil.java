package paragon.core.utility.common;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.spi.LoggerRepository;
import paragon.core.mvc.stereotype.SqlManager;
import paragon.core.mvc.stereotype.SqlManagerFactory;
import paragon.core.paramaters.CommParams;
import paragon.core.paramaters.Params;
import paragon.core.utility.config.Config;

public class DomainUtil
{
  private static final Log LOG = LogFactory.getLog(DomainUtil.class);
  
  private static long RELOAD_DELAY;
  
  private static long RELOAD_PERIOD;
  private static String RELOAD_FLAG;
  private static Map<String, Map<String, String>> domainMap = new HashMap();
  
  private static String currModifyDate = "";
  private static Timer domainCheckTimer;
  
  public DomainUtil() {}
  
  public static void loadDomainList() {
    RELOAD_DELAY = Config.getLong("timerTask.domainUtil.reloadDelay", 10000L);
    
    RELOAD_PERIOD = Config.getLong("timerTask.domainUtil.reloadPeriod", 20000L);
    
    RELOAD_FLAG = Config.getString("timerTask.domainUtil.reloadFlag", "false");
    
    SqlManager sqlManager = SqlManagerFactory.getSqlManager();
    
    currModifyDate = (String)sqlManager.selectOne("DomainService.getCheckUpdate");
    
    Params params = new CommParams();
    params.setParam(Config.getString("language.key"), Config.getString("language.code"));
    List<Map<String, String>> langList = sqlManager.selectList("CodeService.getCodeCdList", params);
    

    List<Map<String, String>> domainList = sqlManager.selectList("DomainService.getConfigDomainList");
    

    for (Map<String, String> langMap : langList) {
      domainMap.put((String)langMap.get("CODE_CD"), new HashMap());
    }
    for (Map<String, String> domMap : domainList) {
      ((Map)domainMap.get(domMap.get("LANG_CD"))).put((String)domMap.get("DOMAIN_ID"), (String)domMap.get("DOMAIN_NM"));
    }
    if (RELOAD_FLAG.equals("true")) {
      startDomainListCheckTimer();
    }
  }
  
  public static void reload() {
    Map<String, Map<String, String>> newDomainMap = new HashMap();
    
    SqlManager sqlManager = SqlManagerFactory.getSqlManager();
    

    if (LOG.isDebugEnabled()) {
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.INFO);
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.FATAL);
    }
    String lastModifyDate = (String)sqlManager.selectOne("DomainService.getCheckUpdate");
    if (LOG.isDebugEnabled()) {
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.DEBUG);
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.DEBUG);
    }
    
    if (lastModifyDate.equals(currModifyDate)) {
      LOG.debug("DomainList not changed.");
      return;
    }
    LOG.debug("DomainList reload.");
    



    Params params = new CommParams();
    params.setParam(Config.getString("language.key"), Config.getString("language.code"));
    List<Map<String, String>> langList = sqlManager.selectList("CodeService.getCodeGroupComboList", params);
    

    List<Map<String, String>> domainList = sqlManager.selectList("DomainService.getConfigDomainList");
    

    for (Map<String, String> langMap : langList) {
      newDomainMap.put((String)langMap.get("value"), new HashMap());
    }
    for (Map<String, String> domMap : domainList) {
      ((Map)newDomainMap.get(domMap.get("LANG_CD"))).put((String)domMap.get("DOMAIN_ID"), (String)domMap.get("DOMAIN_NM"));
    }
    
    currModifyDate = lastModifyDate;
    domainMap = newDomainMap;
  }
  
  private static void startDomainListCheckTimer() {
    synchronized (DomainUtil.class) {
      if (domainCheckTimer == null) {
        domainCheckTimer = new Timer("domainCheckTimer", true);
        domainCheckTimer.schedule(new DomainListCheckTimerTask(Thread.currentThread().getContextClassLoader(), null), RELOAD_DELAY, RELOAD_PERIOD);
      }
    }
  }
  
  public static Map<String, Map<String, String>> getDomainMap()
  {
    return domainMap;
  }
  
  public static void shutdownDomainCheckTimer() {
    if (domainCheckTimer != null) {
      domainCheckTimer.cancel();
      domainCheckTimer.purge();
      domainCheckTimer = null;
      if (LOG.isDebugEnabled()) {
        LOG.debug("DomainCheckTimer was destroyed");
      }
    }
  }
  
  private static class DomainListCheckTimerTask extends TimerTask {
    private ClassLoader classLoader;
    
    private DomainListCheckTimerTask() {}
    
    private DomainListCheckTimerTask(ClassLoader classLoader) {
      this.classLoader = classLoader;
    }
    
    public void run() {
      Thread.currentThread().setContextClassLoader(classLoader);
      
      synchronized (DomainUtil.class)
      {

        Map<String, Map<String, String>> newDomainMap = new HashMap();
        
        SqlManager sqlManager = SqlManagerFactory.getSqlManager();
        

        if (DomainUtil.LOG.isDebugEnabled()) {
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.INFO);
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.FATAL);
        }
        String lastModifyDate = (String)sqlManager.selectOne("DomainService.getCheckUpdate");
        if (DomainUtil.LOG.isDebugEnabled()) {
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.DEBUG);
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.DEBUG);
        }
        
        if (lastModifyDate.equals(DomainUtil.currModifyDate)) {
          return;
        }
        DomainUtil.LOG.debug("DomainList changed.");
        



        Params params = new CommParams();
        params.setParam(Config.getString("language.key"), Config.getString("language.code"));
        List<Map<String, String>> langList = sqlManager.selectList("CodeService.getCodeGroupComboList", params);
        

        List<Map<String, String>> domainList = sqlManager.selectList("DomainService.getConfigDomainList");
        

        for (Map<String, String> langMap : langList) {
          newDomainMap.put((String)langMap.get("value"), new HashMap());
        }
        for (Map<String, String> domMap : domainList) {
          ((Map)newDomainMap.get(domMap.get("LANG_CD"))).put((String)domMap.get("DOMAIN_ID"), (String)domMap.get("DOMAIN_NM"));
        }
        
        DomainUtil.currModifyDate = lastModifyDate;
        DomainUtil.domainMap = newDomainMap;
      }
    }
  }
  
  public static Map<String, String> getDomainMap(String string)
  {
    return (Map)domainMap.get(string);
  }
}
