package com.android.instar.svce;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.android.instar.dao.InstarDAO;
import com.core.parameters.Params;

@Service("instarService")
public class InstarServiceImpl implements InstarService {

	@Resource(name="instarDAO")
	private InstarDAO instarDAO;
	
	@Override
	public List<Map<String, Object>> getInstarContents(Params inParams) throws Exception{
		return instarDAO.getInstarContents(inParams);
	}
	
	@Override
	public void setInstarContents(Params inParams) throws Exception{
		instarDAO.setInstarContents(inParams);
	}
}
