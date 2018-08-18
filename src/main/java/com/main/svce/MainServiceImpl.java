package com.main.svce;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.common.util.FileUtils;
import com.core.parameters.Params;
import com.core.parameters.ParamsFactory;
import com.core.parameters.datatable.DataTable;
import com.core.parameters.datatable.datarow.DataRow;
import com.main.dao.MainDAO;

@Service("mainService")
public class MainServiceImpl implements MainService{
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="mainDAO")
	private MainDAO mainDAO;
	
	@Override
	public List<Map<String, Object>> getProgramPath(Params inParams) throws Exception{
		return mainDAO.getProgramPath(inParams);
	}
	
}
