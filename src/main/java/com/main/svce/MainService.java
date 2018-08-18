package com.main.svce;

import java.util.List;
import java.util.Map;

import com.core.parameters.Params;

public interface MainService{

	List<Map<String, Object>> getProgramPath(Params inParams) throws Exception;
	
}
