package com.settings.svce;


import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.core.parameters.Params;
import com.core.parameters.ParamsFactory;
import com.core.parameters.datatable.DataTable;
import com.core.parameters.datatable.datarow.DataRow;

@Service
public class CodeService {

//	private static final Log LOG = LogFactory.getLog(CodeService.class);
//
//	public Params getGodeGroupGridList(Params inParams) {
//		return getSqlManager().selectGridParams("CodeService.getCodeGroupList",inParams);
//	}
//
//	public Params getGodeGridList(Params inParams) {
//		return getSqlManager().selectGridParams("CodeService.getCodeList",inParams);
//	}
//
//	private DataTable getSessionInDt(Params inParams){
//
//	    /* 데이터 중복확인 */
//        DataTable dt = inParams.getDataTable("dt_data");
//
//        String s_companyCd = inParams.getString("s_companyCd");
//        String s_userId = inParams.getString("s_userId");
//
//        for(DataRow dr: dt){
//            dr.setParam("s_companyCd", s_companyCd);
//            dr.setParam("s_userId", s_userId);
//        }
//	    return dt;
//	}
//
//	public Params saveCodeGroup(Params inParams) {
//	    LOG.debug("saveCodeGroup inParams : " + inParams);
//		Params outParams = ParamsFactory.createOutParams(inParams);
//
//		//세션 -> DataRow 값 저장
//		DataTable dt = getSessionInDt(inParams);
//		inParams.setDataTable("dt_data", dt);
//
//		//중복값체크
////        Map<String, Object> map = getSqlManager().selectOne("CodeService.getCodeGroupDataCheck", inParams);
////        int dupCnt = Integer.parseInt(map.get("COUNT").toString());
////        if(dupCnt != 0) {
////            outParams.setStsCd(400);
////            outParams.setMsgCd("MSG_COM_ERR_072", new Object[]{map.get("COUNT")});
////            return outParams;
////        }
//
//		int cnt = 0;
//		for(DataRow dr: dt){
//
//			String modFlag = (String) dr.getString("modFlag");
//
//	         try{
//	             if(modFlag.equals("INSERT")){
//	                 cnt +=  getSqlManager().insert("CodeService.insertCodeGroup", dr);
//	             }else if(modFlag.equals("UPDATE")){
//	                 cnt +=  getSqlManager().update("CodeService.updateCodeGroup", dr);
//	             }
//            }catch(Exception e){
//                outParams.setStsCd(500);
//                outParams.setMsgCd("MSG_COM_ERR_015");
//                return outParams;
//            }
//		}
//		outParams.setStsCd(100);
//		outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
//		return outParams;
//	}
//
//   public Params deleteCodeGroup(Params inParams) {
//        LOG.debug("deleteCodeGroup inParams :"+inParams);
//        Params outParams = ParamsFactory.createOutParams(inParams);
//
//        DataTable dt = getSessionInDt(inParams);
//
//        int cnt = 0;
//        for(DataRow dr: dt){
//
//            String modFlag = (String) dr.getString("modFlag");
//            try{
//                if(modFlag.equals("DELETE")){
//                    cnt +=  getSqlManager().delete("CodeService.deleteCodeGroup",dr);
//                }
//            }catch(Exception e){
//                outParams.setStsCd(500);
//                outParams.setMsgCd("MSG_COM_ERR_015");
//                return outParams;
//            }
//
//        }
//        outParams.setStsCd(100);
//        outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
//        return outParams;
//    }
//
//	public Params saveCode(Params inParams){
//	    LOG.debug("saveCode inParams : "+ inParams);
//		Params outParams = ParamsFactory.createOutParams(inParams);
//
//        //세션 -> DataRow 값 저장
//        DataTable dt = getSessionInDt(inParams);
//        inParams.setDataTable("dt_data", dt);
//
//
//		inParams.setParam("codeGroupCd", dt.get(0).getString("codeGroupCd"));
//
//		LOG.debug(dt.get(0).getString("codeGroupCd"));
//		LOG.debug(inParams);
//
//        //중복값체크
////        Map<String, Object> map = getSqlManager().selectOne("CodeService.getCodeDataCheck", inParams);
////        int dupCnt = Integer.parseInt(map.get("COUNT").toString());
////        if(dupCnt != 0) {
////            outParams.setStsCd(400);
////            outParams.setMsgCd("MSG_COM_ERR_072", new Object[]{map.get("COUNT")});
////            return outParams;
////        }
//
//		int cnt = 0;
//		for(DataRow dr: dt){
//			String modFlag = (String)dr.getString("modFlag");
//
//			try{
//			    if(modFlag.equals("INSERT")){
//			        cnt += getSqlManager().insert("CodeService.insertCode",dr);
//			    }else if(modFlag.equals("UPDATE")){
//			        cnt += getSqlManager().update("CodeService.updateCode",dr);
//			    }
//			}catch(Exception e){
//			    outParams.setStsCd(500);
//			    outParams.setMsgCd("MSG_COM_ERR_015");
//			    return outParams;
//			}
//		}
//		outParams.setStsCd(100);
//		outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
//		return outParams;
//	}
//
//   public Params deleteCode(Params inParams){
//       LOG.debug("deleteCode inParams : "+ inParams);
//        Params outParams = ParamsFactory.createOutParams(inParams);
//
//        DataTable dt = getSessionInDt(inParams);
//
//        int cnt = 0;
//        for(DataRow dr: dt){
//            String modFlag = (String) dr.getString("modFlag");
//
//            try{
//                if(modFlag.equals("DELETE")){
//                    cnt +=  getSqlManager().delete("CodeService.deleteCode",dr);
//                }
//            }catch(Exception e){
//                outParams.setStsCd(500);
//                outParams.setMsgCd("MSG_COM_ERR_015");
//                return outParams;
//            }
//
//        }
//        outParams.setStsCd(100);
//        outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
//        return outParams;
//    }
//
//   public DataTable getCodeGroupNameList(Params p) {
//       return getSqlManager().selectDataTable("CodeService.getCodeGroupNameList",p);
//   }
//
//   public DataTable getCodeNameList(Params p) {
//       return getSqlManager().selectDataTable("CodeService.getCodeNameList",p);
//   }
//
//   public DataTable getCodeGroupComboList(Params inParams) {
//       return getSqlManager().selectDataTable("CodeService.getCodeGroupComboList",inParams);
//   }
//
//   public DataTable getCodeGroupComboLoctype(Params inParams) {
//       return getSqlManager().selectDataTable("CodeService.getCodeGroupComboLoctype",inParams);
//   }
//
//   public Params getCommCodeName(Params inParams) {
//       return getSqlManager().selectGridParams("CodeService.getCommCodeName",inParams);
//   }
}
