package com.core.utility.config;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Observer;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.core.web.observer.Subject;

public class ParagonConfigSubject implements Subject
{
  private static final Log LOG = LogFactory.getLog(ParagonConfigSubject.class);
  private List<Object> observers;
  
  public ParagonConfigSubject(List<Object> objectList) {
    observers = new ArrayList<Object>();
    
    for (Iterator<Object> i$ = objectList.iterator(); i$.hasNext();) {
      Object obj = i$.next();
      Observer o = (Observer)obj;
      if (LOG.isDebugEnabled()) {
        LOG.debug("Observer [" + o.getClass().getName() + "] class registered.");
      }
      registerObserver(o);
    }
  }
  
  public List<Object> getObservers() {
    return observers;
  }
  
  public void setObservers(List<Object> observers) {
    this.observers = observers;
  }
  
  public void registerObserver(Observer o) {
    observers.add(o);
  }
  
  public void removeObserver(Observer o) {
    int i = observers.size();
    if (i >= 0)
      observers.remove(o);
  }
  
  public void notifyObserver() {
    for (int i = 0; i < observers.size(); i++) {
      Observer observer = (Observer)observers.get(i);
//      observer.update();
    }
  }
}
