//package com.seonhoblog.settings.svce;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.stereotype.Service;
//
//import com.core.parameters.Params;
//
//@Service
//public interface ProgramService {
//	
//	List<Map<String, Object>> getProgram() throws Exception;
//	
//	void modifyProgram(Params inParams) throws Exception;
//	
////
////    @Autowired
////    @Resource(name="sqlSession2")
////    private SqlSession query2;
//
////	private static final Log LOG = LogFactory.getLog(ParagonService.class);
////
////	/**
////	 * 프로그램 목록 가져오기
////	 *
////	 * @Author VertexId
////	 * @Date 2016. 12. 20.
////	*/
////	public Params getProgramGridList(Params inParams) {
//////	       Map map = new HashMap();
//////	        try{
//////
//////	            map = (Map)query2.selectOne("ProgramService.selectMssql");
//////
//////	        }catch(Exception e){
//////	            System.out.println("MSSQL TEST VALUE ERROR======= " + map);
//////	            e.printStackTrace();
//////	            System.out.println(e);
//////	        }
//////	        System.out.println("MSSQL TEST VALUE ======= " + map);
////
////		return getSqlManager().selectGridParams("ProgramService.getProgramList",inParams);
////	}
////
////	/**
////	 * 프로그램명 자동완성 목록 가져오기
////	 *
////	 * @Author VertexId
////	 * @Date 2016. 12. 20.
////	*/
////	public DataTable getProgramNameList(Params inParams) {
////		return getSqlManager().selectDataTable("ProgramService.getProgramNameList",inParams);
////	}
////
////    private DataTable getSessionInDt(Params inParams){
////
////        /* 데이터 중복확인 */
////        DataTable dt = inParams.getDataTable("dt_data");
////
////        String s_companyCd = inParams.getString("s_companyCd");
////        String s_userId = inParams.getString("s_userId");
////
////        for(DataRow dr: dt){
////            dr.setParam("s_companyCd", s_companyCd);
////            dr.setParam("s_userId", s_userId);
////        }
////    return dt;
////}
////
////	/**
////	 * PragonGrid 저장(등록/수정/삭제)
////	 *
////	 * @Author VertexId
////	 * @Date 2016. 12. 20.
////	*/
////	public Params saveProgram(Params inParams) {
////	    LOG.debug("saveProgram inParams : " + inParams);
////		Params outParams = ParamsFactory.createParams(inParams);
////
////	      //세션 -> DataRow 값 저장
////        DataTable dt = getSessionInDt(inParams);
////        inParams.setDataTable("dt_data", dt);
////
//////        //중복값체크
//////        Map<String, Object> map = getSqlManager().selectOne("ProgramService.getProgramDataCheck", inParams);
//////        int dupCnt = Integer.parseInt(map.get("COUNT").toString());
//////        if(dupCnt != 0) {
//////            outParams.setStsCd(400);
//////            outParams.setMsgCd("MSG_COM_ERR_072", new Object[]{map.get("COUNT")});
//////            return outParams;
//////        }
////
////
////	    int cnt = 0;
////        for(DataRow dr: inParams.getDataTable("dt_data")){
////
////            String modFlag = (String) dr.getString("modFlag");
////            dr.setParam("s_companyCd", inParams.getString("s_companyCd"));
////            dr.setParam("s_userId", inParams.getString("s_userId"));
////
////             try{
////                 if(modFlag.equals("INSERT")){
////                     cnt +=  getSqlManager().insert("ProgramService.insertProgram",dr);
////                 }else if(modFlag.equals("UPDATE")){
////                     cnt +=  getSqlManager().update("ProgramService.updateProgram",dr);
////                 }
////            }catch(Exception e){
////                outParams.setStsCd(500);
////                outParams.setMsgCd("MSG_COM_ERR_015");
////                return outParams;
////            }
////        }
////        outParams.setStsCd(100);
////        outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
////        return outParams;
////	}
////
////	   public Params deleteProgram(Params inParams){
////	        Params outParam = ParamsFactory.createOutParams(inParams);
////	        LOG.debug("inParams : "+ inParams);
////	        int cnt = 0;
////	        for(DataRow dr: inParams.getDataTable("dt_program")){
////	            String modFlag = (String) dr.getString("modFlag");
////	            dr.setParam("s_companyCd", inParams.getString("s_companyCd"));
////	            dr.setParam("s_userId", inParams.getString("s_userId"));
////	            if(modFlag.equals("DELETE")){
////	                cnt +=  getSqlManager().delete("ProgramService.deleteProgram",dr);
////	            }
////	        }
////	        outParam.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
////	        return outParam;
////	    }
//
//}
