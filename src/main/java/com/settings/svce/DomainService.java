package com.settings.svce;


import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;


import paragon.core.mvc.stereotype.ParagonService;
import paragon.core.paramaters.Params;
import paragon.core.paramaters.ParamsFactory;
import paragon.core.paramaters.datatable.DataTable;
import paragon.core.paramaters.datatable.datarow.DataRow;

@Service
public class DomainService extends ParagonService {

	private static final Log LOG = LogFactory.getLog(DomainService.class);

	public Params getDomainGridList(Params inParams) {
		return getSqlManager().selectGridParams("DomainService.getDomainList",inParams);
	}

	public DataTable getDomainNameList(Params inParams) {
		return getSqlManager().selectDataTable("DomainService.getDomainNameList",inParams);
	}

	public Params saveDomain(Params inParams) {

		Params outParams = ParamsFactory.createParams(inParams);
		int cnt = 0;

		for(DataRow dr: inParams.getDataTable("dt_domain")){

			LOG.debug("inParams dr: " + dr.toString());
			String modFlag = (String) dr.getVal("modFlag");
			dr.setVal("s_companyCd", inParams.getParam("s_companyCd"));
			dr.setVal("s_userId", inParams.getParam("s_userId"));

			if(modFlag.equals("INSERT")){
				cnt +=  getSqlManager().insert("DomainService.insertDomain",dr);
			}else if(modFlag.equals("UPDATE")){
				cnt +=  getSqlManager().update("DomainService.updateDomain",dr);
			}

		}

	      if(!outParams.getStsCd().equals("999")){

	            outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});

	        }

	      return outParams;

	}

	public Params getColunmToDomain(Params inParams) {
		List<String> list = getSqlManager().selectList("DomainService.getColunmToDomain",inParams);
		LOG.debug("list : " + list.toString());
		inParams.setParam("colNames",list);
		return inParams;
	}

    /**
     * 도메인 삭제
     *
     * @Author jhlee
     * @Date 2018. 2. 05.
     */
    public Params deleteDomain(Params inParams){
        Params outParams = ParamsFactory.createParams(inParams);
        int cnt = 0;
        for(DataRow dr: inParams.getDataTable("dt_domain")){

            dr.setVal("s_companyCd", inParams.getParam("s_companyCd"));
                cnt += getSqlManager().delete("DomainService.deleteDomain", dr);

        }
        if(!outParams.getStsCd().equals("999")){
            outParams.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
        }
        return outParams;
    }


}
