package com.common.logger;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

@Aspect
public class LoggerAspect {
	protected Log log = LogFactory.getLog(LoggerAspect.class);
	static String name = "";
	static String type = "";
	
	//Around 메서드 실행 전, 후 또는 예외 발생시점에 공통기능을 실행한다.
	//메서드전 어디인지, 후에 어디인지 예외 발생시점이 어디인지 파악할 수 있다.
	@Around("execution(* seonhoblog..controller.*Controller.*(..)) or execution(* seonhoblog..service.*Impl.*(..)) or execution(* seonhoblog..dao.*DAO.*(..))")
	public Object logPrint(ProceedingJoinPoint joinPoint) throws Throwable {
		type = joinPoint.getSignature().getDeclaringTypeName();
		
		if (type.indexOf("Controller") > -1) {
			name = "Controller  \t:  ";
		}
		else if (type.indexOf("Service") > -1) {
			name = "ServiceImpl  \t:  ";
		}
		else if (type.indexOf("DAO") > -1) {
			name = "DAO  \t\t:  ";
		}
		log.debug(name + type + "." + joinPoint.getSignature().getName() + "()");
		return joinPoint.proceed();
	}
}

