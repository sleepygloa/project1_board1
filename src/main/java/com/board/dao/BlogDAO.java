package com.board.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.common.CommandMap;
import com.common.dao.AbstractDAO;

@Repository("blogDAO")
public class BlogDAO extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectBlogList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectPagingList("blog.selectBlogList", map);
	}

	public void insertBoard(Map<String, Object> map) throws Exception{
		insert("blog.insertBoard", map);
	}

	public void updateHitCnt(Map<String, Object> map) throws Exception{
		update("blog.updateHitCnt", map);
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> selectBoardDetail(Map<String, Object> map) throws Exception{
		return (Map<String, Object>) selectOne("blog.selectBoardDetail", map);
	}

	public void updateBoard(Map<String, Object> map) throws Exception{
		update("blog.updateBoard", map);
	}

	public void deleteBoard(Map<String, Object> map) throws Exception{
		update("blog.deleteBoard", map);
	}

	public void insertFile(Map<String, Object> map) throws Exception{
		insert("blog.insertFile", map);
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectFileList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("blog.selectFileList", map);
	}

	public void deleteFileList(Map<String, Object> map) throws Exception{
		update("blog.deleteFileList", map);
	}

	public void updateFile(Map<String, Object> map) throws Exception{
		update("blog.updateFile", map);
	}

}
