package com.android.instar.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;
import com.core.parameters.Params;

@Repository("instarDAO")
public class InstarDAO extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getInstarContents(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("InstarService.getInstarContents", inParams);
	}
	
	public void setInstarContents(Params inParams) throws Exception{
		insert("InstarService.setInstarContents", inParams);
	}
	
	public void addLike(Params inParams) throws Exception{
		update("InstarService.addLike", inParams);
	}
	
	public void delLike(Params inParams) throws Exception{
		update("InstarService.delLike", inParams);
	}
}
