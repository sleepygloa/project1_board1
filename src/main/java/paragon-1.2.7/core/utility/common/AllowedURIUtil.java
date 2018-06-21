package paragon.core.utility.common;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.spi.LoggerRepository;
import paragon.core.mvc.stereotype.SqlManager;
import paragon.core.mvc.stereotype.SqlManagerFactory;
import paragon.core.utility.config.Config;

public class AllowedURIUtil
{
  private static final Log LOG = LogFactory.getLog(AllowedURIUtil.class);
  
  private static long RELOAD_DELAY;
  
  private static long RELOAD_PERIOD;
  
  private static String RELOAD_FLAG;
  private static Set<String> allowedURISet = new HashSet();
  private static Set<String> loginAllowedURISet = new HashSet();
  
  private static String currModifyDate = "";
  private static Timer allowedURIListCheckTimer;
  
  public AllowedURIUtil() {}
  
  public static void loadAllowedURIList()
  {
    RELOAD_DELAY = Config.getLong("timerTask.allowedURIListUtil.reloadDelay", 10000L);
    
    RELOAD_PERIOD = Config.getLong("timerTask.allowedURIListUtil.reloadPeriod", 20000L);
    
    RELOAD_FLAG = Config.getString("timerTask.allowedURIListUtil.reloadFlag", "false");
    
    SqlManager sqlManager = SqlManagerFactory.getSqlManager();
    
    currModifyDate = (String)sqlManager.selectOne("AllowedURIService.getCheckUpdate");
    
    List<Map<String, String>> allowedURIList = sqlManager.selectList("AllowedURIService.getAllowedURIList", new HashMap());
    
    for (Map<String, String> map : allowedURIList) {
      String uri = (String)map.get("ALLOW_URI");
      if (((String)map.get("ALLOW_GBN")).equals("A")) {
        allowedURISet.add(uri);
      } else if (((String)map.get("ALLOW_GBN")).equals("L")) {
        loginAllowedURISet.add(uri);
      }
    }
    if (RELOAD_FLAG.equals("true")) {
      startAllowedURIListCheckTimer();
    }
  }
  
  public static void reload() {
    Set<String> newAllowedURISet = new HashSet();
    Set<String> newUserAllowedURISet = new HashSet();
    
    SqlManager sqlManager = SqlManagerFactory.getSqlManager();
    


    if (LOG.isDebugEnabled()) {
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.INFO);
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.FATAL);
    }
    String lastModifyDate = (String)sqlManager.selectOne("AllowedURIService.getCheckUpdate");
    if (LOG.isDebugEnabled()) {
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.DEBUG);
      Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.DEBUG);
    }
    
    if (lastModifyDate.equals(currModifyDate)) {
      LOG.debug("allowedURIList not changed.");
      return;
    }
    LOG.debug("allowedURIList reload.");
    

    List<Map<String, String>> allowedURIList = sqlManager.selectList("AllowedURIService.getAllowedURIList", new HashMap());
    
    for (Map<String, String> map : allowedURIList) {
      String uri = (String)map.get("ALLOW_URI");
      if (((String)map.get("ALLOW_GBN")).equals("A")) {
        newAllowedURISet.add(uri);
      } else if (((String)map.get("ALLOW_GBN")).equals("L")) {
        newUserAllowedURISet.add(uri);
      }
    }
    

    currModifyDate = lastModifyDate;
    allowedURISet = newAllowedURISet;
    loginAllowedURISet = newUserAllowedURISet;
  }
  
  private static void startAllowedURIListCheckTimer() {
    synchronized (AllowedURIUtil.class) {
      if (allowedURIListCheckTimer == null) {
        allowedURIListCheckTimer = new Timer("allowedURIListCheckTimer", true);
        allowedURIListCheckTimer.schedule(new AllowedURIListCheckTimerTask(Thread.currentThread().getContextClassLoader(), null), RELOAD_DELAY, RELOAD_PERIOD);
      }
    }
  }
  
  public static Set<String> getAllowedURISet()
  {
    return allowedURISet;
  }
  
  public static Set<String> getUserAllowedURISet() {
    return loginAllowedURISet;
  }
  
  public static void shutdownAllowedURICheckTimer()
  {
    if (allowedURIListCheckTimer != null) {
      allowedURIListCheckTimer.cancel();
      allowedURIListCheckTimer.purge();
      allowedURIListCheckTimer = null;
      if (LOG.isDebugEnabled()) {
        LOG.debug("AllowedURICheckTimer was destroyed");
      }
    }
  }
  
  private static class AllowedURIListCheckTimerTask extends TimerTask {
    private ClassLoader classLoader;
    
    private AllowedURIListCheckTimerTask() {}
    
    private AllowedURIListCheckTimerTask(ClassLoader classLoader) {
      this.classLoader = classLoader;
    }
    
    public void run() {
      Thread.currentThread().setContextClassLoader(classLoader);
      
      synchronized (AllowedURIUtil.class)
      {

        Set<String> newAllowedURISet = new HashSet();
        Set<String> newUserAllowedURISet = new HashSet();
        
        SqlManager sqlManager = SqlManagerFactory.getSqlManager();
        


        if (AllowedURIUtil.LOG.isDebugEnabled()) {
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.INFO);
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.FATAL);
        }
        String lastModifyDate = (String)sqlManager.selectOne("AllowedURIService.getCheckUpdate");
        if (AllowedURIUtil.LOG.isDebugEnabled()) {
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.interceptor.StatementInterceptor").setLevel(Level.DEBUG);
          Logger.getRootLogger().getLoggerRepository().getLogger("paragon.core.mvc.stereotype.SqlManager").setLevel(Level.DEBUG);
        }
        
        if (lastModifyDate.equals(AllowedURIUtil.currModifyDate)) {
          return;
        }
        AllowedURIUtil.LOG.debug("allowedURIList changed.");
        

        List<Map<String, String>> allowedURIList = sqlManager.selectList("AllowedURIService.getAllowedURIList", new HashMap());
        
        for (Map<String, String> map : allowedURIList) {
          String uri = (String)map.get("ALLOW_URI");
          if (((String)map.get("ALLOW_GBN")).equals("A")) {
            newAllowedURISet.add(uri);
          } else if (((String)map.get("ALLOW_GBN")).equals("L")) {
            newUserAllowedURISet.add(uri);
          }
        }
        

        AllowedURIUtil.currModifyDate = lastModifyDate;
        AllowedURIUtil.allowedURISet = newAllowedURISet;
        AllowedURIUtil.loginAllowedURISet = newUserAllowedURISet;
      }
    }
  }
}
