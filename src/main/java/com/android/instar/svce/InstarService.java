package com.android.instar.svce;

import java.util.List;
import java.util.Map;

import com.core.parameters.Params;

public interface InstarService {

	List<Map<String, Object>> getInstarContents (Params inParams) throws Exception;
	
	void setInstarContents (Params inParams) throws Exception;
	
	void addLike (Params inParams) throws Exception;
	
	void delLike (Params inParams) throws Exception;
}
