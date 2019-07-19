//package com.manage.svce;
//
//import java.util.List;
//import java.util.Map;
//
//import javax.annotation.Resource;
//
//import org.springframework.stereotype.Service;
//
//import com.core.parameters.Params;
//import com.manage.dao.BlogDao;
//import com.manage.dao.FitDao;
//
//@Service("fitService")
//public class FitServiceImpl implements FitService{
//
//	@Resource(name="fitDao")
//	private FitDao fitDao;
//
//	@Override
//	public List<Map<String, Object>> getFit(Params inParams) throws Exception{
//		return fitDao.getFit(inParams);
//	}
//	
//	@Override
//	public List<Map<String, Object>> getFitList(Params inParams) throws Exception{
//		return fitDao.getFitList(inParams);
//	}
//	
//}
