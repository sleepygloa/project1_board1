package com.android.instar.svce;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.core.parameters.Params;

public interface InstarService {

	List<Map<String, Object>> getInstarContents (Params inParams) throws Exception;

	void setInstarContents (Params inParams, MultipartHttpServletRequest request) throws Exception;

	void addLike (Params inParams) throws Exception;
	List<Map<String, Object>> getReturnAddLikeResult (Params inParams) throws Exception;
	
	void delLike (Params inParams) throws Exception;
}
