package com.core.web.listener.adapter;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.core.utility.config.Config;
import com.core.utility.scheduler.JobScheduler;

public class ParagonContextLoaderAdapter extends DefaultParagonContextLoaderAdapter{

	private static final Log LOG = LogFactory.getLog(ParagonContextLoaderAdapter.class);

	public void afterInitialize(ServletContext context) {
		LOG.debug("ParagonContextLoaderAdapter : afterInitialize");
		setWebApplicationContext(WebApplicationContextUtils.getWebApplicationContext(context));

//		ParagonAnnotationFinder finder = new ParagonAnnotationFinder(context);
//		List<Object> objList = finder.find("O", ConfigCheck.class);
//		LOG.debug("objList : "+ objList.toString());
//		Config.loadConfig("O", objList); 
//		try {
////			LicenseUtil.check();
//		} catch (Exception e) {
//			LOG.error("exception", e);
//			if (LOG.isErrorEnabled()) {
//				LOG.error("ERROR: Failed to pass the license check");
//			}
//
//		}
		JobScheduler.loadScheduler();
//		VersionUtil.loadVersion();
//		AllowedURIUtil.loadAllowedURIList();
//		DomainUtil.loadDomainList();
//		ServiceUtil.loadService();

	}

	public void beforeDestroy(ServletContext context) {
		LOG.debug("ParagonContextLoaderAdapter : beforeDestroy");
		super.beforeDestroy(context);

		Config.cancelConfigChangeCheckTimer();

//		VersionUtil.cancelVersionTimer();
//		AllowedURIUtil.shutdownAllowedURICheckTimer();
//		DomainUtil.shutdownDomainCheckTimer();
	}
}
