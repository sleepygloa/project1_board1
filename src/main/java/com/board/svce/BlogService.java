package com.board.svce;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.common.common.CommandMap;

public interface BlogService {

	List<Map<String, Object>> selectBlogList(Map<String, Object> map) throws Exception;

	void insertBoard(Map<String, Object> map, HttpServletRequest request) throws Exception;

	Map<String, Object> selectBoardDetail(Map<String, Object> map) throws Exception;

	void updateBoard(Map<String, Object> map, HttpServletRequest request) throws Exception;

	void deleteBoard(Map<String, Object> map) throws Exception;

}
