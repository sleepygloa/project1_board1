package com.settings.svce;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.core.parameters.Params;
import com.core.parameters.ParamsFactory;
import com.core.parameters.datatable.datarow.DataRow;

/**
 * [기능명을 입력하세요]
 *
 * @class AllowedURIService.java
 * @package vertexid.paragon.settings.svce
 * @author "Kim Jin Ho"
 * @version 1.0
 */
@Service
public class AllowedURIService {


	private static final Log LOG = LogFactory.getLog(AllowedURIService.class);

//	/**
//	 * @Method Name : getAllowedURIList
//	  * @작성일 : 2016. 11. 19.
//	  * @작성자 : "Kim Jin Ho"
//	  * @변경이력 :
//	  * @Method 설명 :
//	  * @param inParams
//	  * @return
//	 */
//	public Params getAllowedURIList(Params inParams) {
//		return getSqlManager().selectGridParams("AllowedURIService.getAllowedURIList", inParams);
//	}
//
//	/**
//	 *
//	 * asdfasdfasdfasdf
//	 *
//	 * @Author "Kim Jin Ho"
//	 * @Date 2016. 11. 18.
//	 */
//	public Params saveAllowedURI(Params inParams) {
//		Params outParams = ParamsFactory.createParams(inParams);
//		int cnt = 0;
//		for(DataRow dr: inParams.getDataTable("dt_alloweduri")){
//			LOG.debug(dr);
//			String modFlag = (String) dr.getVal("modFlag");
//			dr.setVal("s_companyCd", inParams.getParam("s_companyCd"));
//			dr.setVal("s_userId", inParams.getParam("s_userId"));
//			if(modFlag.equals("INSERT")){
//				cnt +=  getSqlManager().insert("AllowedURIService.insertAllowedURI",dr);
//			}else if(modFlag.equals("UPDATE")){
//				cnt +=  getSqlManager().update("AllowedURIService.updateAllowedURI",dr);
//			}
//		}
//
//        if(!outParams.getStsCd().equals("999")){
//
//            outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
//
//        }
//
//		return outParams;
//	}
//
//    /**
//     * URL접근 삭제
//     *
//     * @Author jhlee
//     * @Date 2018. 2. 06.
//     */
//    public Params deleteAllowedURI(Params inParams){
//        Params outParams = ParamsFactory.createParams(inParams);
//        int cnt = 0;
//        for(DataRow dr: inParams.getDataTable("dt_alloweduri")){
//
//            dr.setVal("s_companyCd", inParams.getParam("s_companyCd"));
//                cnt += getSqlManager().delete("AllowedURIService.deleteAllowedURI", dr);
//
//        }
//        if(!outParams.getStsCd().equals("999")){
//            outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
//        }
//        return outParams;
//    }
}
