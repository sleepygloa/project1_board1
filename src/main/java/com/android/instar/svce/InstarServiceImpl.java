package com.android.instar.svce;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.android.instar.dao.InstarDAO;
import com.common.util.FileUtils;
import com.core.parameters.Params;

@Service("instarService")
public class InstarServiceImpl implements InstarService {

	@Resource(name="instarDAO")
	private InstarDAO instarDAO;

	@Resource(name="instarDAO")
    private FileUtils fileUtils;


	@Override
	public List<Map<String, Object>> getInstarContents(Params inParams) throws Exception{
		return instarDAO.getInstarContents(inParams);
	}

	@Override
	public void setInstarContents(Params inParams, MultipartHttpServletRequest request) throws Exception{
		instarDAO.setInstarContents(inParams);

		instarDAO.delFileList(inParams);
		List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(inParams, request);
//		Map<String,Object> tempMap = null;
//		for(int i=0, size=list.size(); i<size; i++){
//			tempMap = list.get(i);
//			if(tempMap.get("IS_NEW").equals("Y")){
//				blogDAO.insertFile(tempMap);
//			}
//			else{
//				blogDAO.updateFile(tempMap);
//			}
//		}

	}

	@Override
	public void addLike(Params inParams) throws Exception{

		instarDAO.addLike(inParams);

	}

	@Override
	public void delLike(Params inParams) throws Exception{
		instarDAO.delLike(inParams);
	}
}
