package paragon.core.logger;

import org.apache.commons.lang.time.StopWatch;
import org.apache.commons.logging.Log;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;

@org.aspectj.lang.annotation.Aspect
public class ServiceLogger
{
  public ServiceLogger() {}
  
  private static final Log LOG = org.apache.commons.logging.LogFactory.getLog(ServiceLogger.class);
  
  @org.aspectj.lang.annotation.Pointcut("execution(public * *..svce.*Service.*(..))")
  public void serviceMethods() {
    LOG.debug("!!!실행");
    if (LOG.isDebugEnabled()) {
      LOG.debug("ServiceLogger serviceMethods");
    }
  }
  
  @org.aspectj.lang.annotation.Around("serviceMethods()")
  public Object serviceMethodProfile(ProceedingJoinPoint joinPoint) throws Throwable {
    LOG.debug("!!!실행2");
    StopWatch stopWatch = new StopWatch();
    String methodName = joinPoint.getSignature().toShortString();
    if (LOG.isInfoEnabled()) {
      stopWatch = new StopWatch();
      String target = joinPoint.getTarget().toString();
      methodName = joinPoint.getSignature().toShortString();
      String classPath = target.substring(0, target.lastIndexOf('@'));
      
      StringBuilder logMessage = new StringBuilder(classPath);
      logMessage.append(".").append(methodName).append("() called.");
      LOG.info(logMessage);
      
      stopWatch.start();
    }
    
    Object result = joinPoint.proceed();
    
    if (LOG.isInfoEnabled()) {
      stopWatch.stop();
      
      StringBuilder elapsedTime = new StringBuilder("Service method [");
      elapsedTime.append(methodName).append("] time : ");
      elapsedTime.append(stopWatch.getTime()).append(" ms.");
      LOG.info(elapsedTime);
    }
    return result;
  }
}
