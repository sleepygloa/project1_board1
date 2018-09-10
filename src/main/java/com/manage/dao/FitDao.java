package com.manage.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;
import com.core.parameters.Params;

@Repository("fitDao")
public class FitDao extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getFit(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("fitService.getFit");
	}
	
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getFitList(Params inParams) throws Exception{
		return (List<Map<String, Object>>)selectList("fitService.getFitList");
	}
}
