package com.main.svce;

import java.util.List;
import java.util.Map;

import com.core.parameters.Params;

public interface MainService{

	//필수테이블과 데이터 확인
//	List<Map<String, Object>> getEssentialTable() throws Exception;
	
	List<Map<String, Object>> getProgramPath(Params inParams) throws Exception;
	
}
