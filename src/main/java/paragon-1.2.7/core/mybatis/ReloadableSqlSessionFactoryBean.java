package paragon.core.mybatis;

import java.io.IOException;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.core.io.Resource;

public class ReloadableSqlSessionFactoryBean extends SqlSessionFactoryBean implements org.springframework.beans.factory.DisposableBean
{
  public ReloadableSqlSessionFactoryBean() {}
  
  private static final Log LOG = LogFactory.getLog(ReloadableSqlSessionFactoryBean.class);
  private SqlSessionFactory proxy;
  private int interval = 10000;
  private Timer timer;
  private TimerTask task;
  private Resource[] mapperLocations;
  
  private boolean running = false;
  private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
  private final Lock read = rwl.readLock();
  private final Lock write = rwl.writeLock();
  
  public void setMapperLocations(Resource[] mapperLocations) {
    super.setMapperLocations(mapperLocations);
    this.mapperLocations = mapperLocations;
  }
  
  public void setInterval(int interval) {
    this.interval = interval;
  }
  
  public void refresh() throws Exception
  {
    if (LOG.isInfoEnabled()) {
      LOG.info("Refresh sqlMapClient.");
    }
    write.lock();
    try {
      super.afterPropertiesSet();
    } finally {
      write.unlock();
    }
  }
  
  public void afterPropertiesSet() throws Exception
  {
    super.afterPropertiesSet();
    setRefreshable();
  }
  
  private void setRefreshable()
  {
    proxy = ((SqlSessionFactory)Proxy.newProxyInstance(SqlSessionFactory.class.getClassLoader(), 
      new Class[] { SqlSessionFactory.class }, new InvocationHandler() {
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
          return method.invoke(ReloadableSqlSessionFactoryBean.this.getParentObject(), args);
        }
      }));
    task = new TimerTask() {
      private Map<Resource, Long> map = new HashMap();
      
      public void run() {
        if (isModified()) {
          try {
            refresh();
          } catch (Exception e) {
            ReloadableSqlSessionFactoryBean.LOG.error("Caught Exception", e);
          }
        }
      }
      
      private boolean isModified() {
        boolean retVal = false;
        if (mapperLocations != null) {
          for (int i = 0; i < mapperLocations.length; i++)
          {
            Resource mappingLocation = mapperLocations[i];
            retVal |= findModifiedResource(mappingLocation);
          }
        }
        return retVal;
      }
      
      private boolean findModifiedResource(Resource resource)
      {
        boolean retVal = false;
        List<String> modifiedResources = new ArrayList();
        try {
          long modified = resource.lastModified();
          if (map.containsKey(resource)) {
            long lastModified = ((Long)map.get(resource)).longValue();
            if (lastModified != modified) {
              map.put(resource, new Long(modified));
              String path = resource.getDescription();
              path = path.substring(path.lastIndexOf("classes") + 8, path.length() - 1).replaceAll("\\\\", ".");
              modifiedResources.add(path);
              retVal = true;
            }
          } else {
            map.put(resource, new Long(modified));
          }
        } catch (IOException e) {
          ReloadableSqlSessionFactoryBean.LOG.error("Caught Exception", e);
        }
        if ((retVal) && 
          (ReloadableSqlSessionFactoryBean.LOG.isInfoEnabled())) {
          ReloadableSqlSessionFactoryBean.LOG.info("Modified Path : " + modifiedResources);
        }
        
        return retVal;
      }
    };
    timer = new Timer(true);
    resetInterval();
  }
  
  private Object getParentObject()
    throws Exception
  {
    read.lock();
    try {
      return super.getObject();
    }
    finally {
      read.unlock();
    }
  }
  
  public SqlSessionFactory getObject() {
    return proxy;
  }
  
  public Class<? extends SqlSessionFactory> getObjectType()
  {
    return proxy != null ? proxy.getClass() : SqlSessionFactory.class;
  }
  
  public boolean isSingleton() {
    return true;
  }
  
  public void setCheckInterval(int ms) {
    interval = ms;
    if (timer != null) {
      resetInterval();
    }
  }
  
  private void resetInterval() {
    if (running) {
      timer.cancel();
      running = false;
    }
    if (interval > 0) {
      timer.schedule(task, 0L, interval);
      running = true;
    }
  }
  
  public void destroy() throws Exception {
    timer.cancel();
  }
}
