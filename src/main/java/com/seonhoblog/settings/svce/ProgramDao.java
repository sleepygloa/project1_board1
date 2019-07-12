//package com.seonhoblog.settings.svce;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.stereotype.Repository;
//
//import com.common.dao.AbstractDAO;
//import com.core.parameters.Params;
//
//@Repository("programDao")
//public class ProgramDao extends AbstractDAO{
//	
//	@SuppressWarnings("unchecked")
//	public List<Map<String, Object>> getProgram() throws Exception{
//		return (List<Map<String, Object>>)selectList("ProgramService.getProgram");
//	}
//
//	public void insertProgram(Params inParams) throws Exception{
//		System.out.println("programDao : "+ inParams);
//		insert("ProgramService.insertProgram", inParams);
//	}
//
//	public void updateProgram(Params inParams) throws Exception{
//		update("ProgramService.updateProgram", inParams);
//	}
//	
//	public void deleteProgram(Params inParams) throws Exception{
//		update("ProgramService.deleteProgram", inParams);
//	}
//	
//}
