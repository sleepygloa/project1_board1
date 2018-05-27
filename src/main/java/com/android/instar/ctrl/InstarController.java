package com.android.instar.ctrl;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.android.instar.svce.InstarService;
import com.core.parameters.Params;
import com.google.gson.Gson;

@Controller
@RequestMapping("/instar")
public class InstarController {

	@Autowired
	private InstarService instarSerivce;

	@RequestMapping("/getInstarContent")
	public void getInstarContent(Params inParams, HttpServletResponse response) {
		Gson gson = new Gson();
		JSONArray jsonArr = new JSONArray();
		try {
			List<Map<String, Object>> list = (List<Map<String, Object>>)instarSerivce.getInstarContents(inParams);

			gson.toJson(list);

			for ( int i = 0 ; i < list.size(); i++) {
				JSONObject setJson = new JSONObject();
				Map<String, Object> getMap = list.get(i);
				setJson.put("IDX", getMap.get("IDX"));
				setJson.put("TEXT", getMap.get("TEXT"));
				setJson.put("LIKES", getMap.get("LIKES"));
				setJson.put("UP_DT", getMap.get("UP_DT"));
				setJson.put("IN_USER_ID", getMap.get("IN_USER_ID"));
				setJson.put("IMG", getMap.get("IMG"));
				setJson.put("USERLIKED", getMap.get("USERLIKED"));
				setJson.put("COUNT", getMap.get("COUNT"));
				jsonArr.put(setJson);
			}

			response.setContentType("application/json, charset=utf-8");
			response.getWriter().write(jsonArr.toString());

		}catch(Exception e) {
			System.out.println("ERORR");
		}
	}

	@RequestMapping("/setInstarContent")
	public void setInstarContent(Params inParams, MultipartHttpServletRequest request) {
		System.out.println("setInstarcontent inParams : " + inParams);
		try {
			instarSerivce.setInstarContents(inParams, request);
		}catch(Exception e) {
			System.out.println("ERORR");
		}
	}

	@RequestMapping("/addLike")
	public void addLike(Params inParams, HttpServletResponse response) {
		System.out.println("addLike inParams : " + inParams);
		try {
			instarSerivce.addLike(inParams);
		}catch(Exception e) {
			System.out.println("ERORR");
		}
		//글 반환 
		Gson gson = new Gson();
		JSONArray jsonArr = new JSONArray();
		try {
			List<Map<String, Object>> list = (List<Map<String, Object>>)instarSerivce.getReturnAddLikeResult(inParams);

			gson.toJson(list);

			for ( int i = 0 ; i < list.size(); i++) {
				JSONObject setJson = new JSONObject();
				Map<String, Object> getMap = list.get(i);
				setJson.put("IDX", getMap.get("IDX"));
				setJson.put("IN_USER_ID", getMap.get("IN_USER_ID"));
				setJson.put("LIKES", getMap.get("LIKES"));
				setJson.put("RESULT", true);
				jsonArr.put(setJson);
			}

			response.setContentType("application/json, charset=utf-8");
			response.getWriter().write(jsonArr.toString());
		}catch(Exception e) {
			System.out.println("ERORR");
		}
	}


	@RequestMapping("/delLike")
	public void delLike(Params inParams, HttpServletResponse response) {
		System.out.println("delLike inParams : " + inParams);
		try {
			instarSerivce.delLike(inParams);
		}catch(Exception e) {
			System.out.println("ERORR");
		}
		
		//글 반환 
		Gson gson = new Gson();
		JSONArray jsonArr = new JSONArray();
		try {
			List<Map<String, Object>> list = (List<Map<String, Object>>)instarSerivce.getReturnAddLikeResult(inParams);

			gson.toJson(list);

			for ( int i = 0 ; i < list.size(); i++) {
				JSONObject setJson = new JSONObject();
				Map<String, Object> getMap = list.get(i);
				setJson.put("IDX", getMap.get("IDX"));
				setJson.put("IN_USER_ID", getMap.get("IN_USER_ID"));
				setJson.put("LIKES", getMap.get("LIKES"));
				setJson.put("RESULT", true);
				jsonArr.put(setJson);
			}

			response.setContentType("application/json, charset=utf-8");
			response.getWriter().write(jsonArr.toString());
		}catch(Exception e) {
			System.out.println("ERORR");
		}
	}

}
