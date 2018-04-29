package com.common.util;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.core.parameters.Params;

@Component("fileUtils")
public class FileUtils {
	
	Logger log = Logger.getLogger(this.getClass());
	
	private static final String filePath = "C:\\dev\\file\\";
	
	public List<Map<String,Object>> parseInsertFileInfo(Params inParams, HttpServletRequest request) throws Exception{
		MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)request;
    	Iterator<String> iterator = multipartHttpServletRequest.getFileNames();
    	
    	MultipartFile multipartFile = null;
    	String originalFileName = null;
    	String originalFileExtension = null;
    	String storedFileName = null;
    	
    	List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
        Map<String, Object> listMap = null; 
        
        String boardIdx = (String)inParams.getString("idx");
        
        //폴더생성
        File file = new File(filePath);
        if(file.exists() == false){
        	file.mkdirs();
        }
        
        while(iterator.hasNext()){
        	multipartFile = multipartHttpServletRequest.getFile(iterator.next());
        	if(multipartFile.isEmpty() == false){
        		originalFileName = multipartFile.getOriginalFilename();
        		originalFileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        		storedFileName = CommonUtils.getRandomString() + originalFileExtension;
        		
        		file = new File(filePath + storedFileName);
        		multipartFile.transferTo(file);
        		
        		listMap = new HashMap<String,Object>();
        		listMap.put("boardIdx", boardIdx);
        		listMap.put("originalFileName", originalFileName);
        		listMap.put("storedFileName", storedFileName);
        		listMap.put("fileSize", multipartFile.getSize());
        		listMap.put("s_userId", inParams.getString("s_userId"));
        		list.add(listMap);
        	}
        }
        
		return list;
	}

	public List<Map<String, Object>> parseUpdateFileInfo(Params inParams, MultipartHttpServletRequest multipartHttpServletRequest) throws Exception{
    	Iterator<String> iterator = multipartHttpServletRequest.getFileNames();
    	
    	MultipartFile multipartFile = null;
    	String originalFileName = null;
    	String originalFileExtension = null;
    	String storedFileName = null;
    	
    	List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
        Map<String, Object> listMap = null; 
        
        int j = inParams.getInteger("j");
        
        String boardIdx = (String)inParams.getString("idx");
        String requestName = null;
        String idx = null;
       
        for(int i = 0; i < j; i++) {
        	String uploadFileName = iterator.next();
        	System.out.println(uploadFileName);
        	multipartFile = multipartHttpServletRequest.getFile(uploadFileName);
        	System.out.println(multipartFile);
        	if(multipartFile.isEmpty() == false){
        		System.out.println("file ok");
        		originalFileName = multipartFile.getOriginalFilename();
        		originalFileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        		storedFileName = CommonUtils.getRandomString() + originalFileExtension;
        		
        		multipartFile.transferTo(new File(filePath + storedFileName));
        		
        		listMap = new HashMap<String,Object>();
        		listMap.put("IS_NEW", "Y");
        		listMap.put("boardIdx", boardIdx);
        		listMap.put("originalFileName", originalFileName);
        		listMap.put("storedFileName", storedFileName);
        		listMap.put("fileSize", multipartFile.getSize());
        		listMap.put("s_userId", inParams.getString("s_userId"));
        		list.add(listMap);
        	}else{
        		System.out.println("file no");
        		requestName = uploadFileName;
            	idx = "ids_"+requestName.substring(requestName.indexOf("_")+1);
            	if(inParams.containsKey(idx) == true && inParams.getString("idx") != null){
            		listMap = new HashMap<String,Object>();
            		listMap.put("IS_NEW", "N");
            		listMap.put("fileIdx", inParams.getString(idx));
            		listMap.put("s_userId", inParams.getString("s_userId"));
            		list.add(listMap);
            	}
        	}
        	
        }
		return list;
	}
}
