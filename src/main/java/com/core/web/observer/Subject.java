package com.core.web.observer;

import java.util.Observer;

public abstract interface Subject
{
  public abstract void registerObserver(Observer paramObserver);
  
  public abstract void removeObserver(Observer paramObserver);
  
  public abstract void notifyObserver();
}
