package com.board.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.common.dao.AbstractDAO;

@Repository("blogDAO")
public class BlogDAO extends AbstractDAO{

//	@SuppressWarnings("unchecked")
//	public List<Map<String, Object>> selectBlogList(Map<String, Object> map) throws Exception{
//		return (List<Map<String, Object>>)selectPagingList("blog.selectBlogList", map);
//	}

	public void insertBlog(Map<String, Object> map) throws Exception{
		insert("blog.insertBlog", map);
	}

	public void updateHitCnt(Map<String, Object> map) throws Exception{
		update("blog.updateHitCnt", map);
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> selectBlogDetail(Map<String, Object> map) throws Exception{
		return (Map<String, Object>) selectOne("blog.selectBlogDetail", map);
	}

	public void updateBlog(Map<String, Object> map) throws Exception{
		update("blog.updateBlog", map);
	}

	public void deleteBlog(Map<String, Object> map) throws Exception{
		update("blog.deleteBlog", map);
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
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getBlogReplyContentList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("blog.getBlogReplyContentList", map);
	}
	
	public void insertReplyContent(Map<String, Object> map) throws Exception{
		insert("blog.insertReplyContent", map);
	}
	
	public void deleteReplyContent(Map<String, Object> map) throws Exception{
		update("blog.deleteReplyContent", map);
	}

	public void insertReReplyContent(Map<String, Object> map) throws Exception{
		insert("blog.insertReReplyContent", map);
	}
}
