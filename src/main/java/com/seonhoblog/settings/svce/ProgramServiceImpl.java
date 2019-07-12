//package com.seonhoblog.settings.svce;
//
//import java.util.List;
//import java.util.Map;
//
//import javax.annotation.Resource;
//
//import org.springframework.stereotype.Service;
//
//import com.core.parameters.Params;
//
//@Service("programService")
//public class ProgramServiceImpl implements ProgramService {
//
//	@Resource(name="programDao")
//	private ProgramDao programDao;
//	
//	@Override
//	public List<Map<String, Object>> getProgram() throws Exception{
//		System.out.println("getProgram :");
//		return programDao.getProgram();
//	};
//	
//	@Override
//	public void modifyProgram(Params inParams) throws Exception{
//		System.out.println("modifyProgram :" + inParams);
//		
//		
//		String flag = null;
//		flag = inParams.getString("flag");
//		
//		if(flag.equals("insert")) {
//			programDao.insertProgram(inParams);
//		}else if(flag.equals("modify")) {
//			programDao.updateProgram(inParams);
//		}else if(flag.equals("delete")) {
//			programDao.deleteProgram(inParams);
//		}
//	};
//	
//}
