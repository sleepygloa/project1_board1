<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- Small modal -->
<button type="button" href="#modal2" class="btn btn-primary" data-toggle="modal" data-target=".modal-delete">글삭제하기</button>

<div id="#modal2" class="modal fade bs-example-modal-sm modal-delete" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" style="display:show;z-index:99;">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
    <!-- 글삭제시 비밀번호 검사 -->
    	 <h4> 글 삭제하기 </h4><br />
    	 
    	 <p>삭제하시려면 비밀번호를 입력해주세요</p><br />
    	 
    	 <form id="deleteForm" name="deleteForm">
    	 	<label>비밀번호 </label>
    	 	<input type="password" name="PASSWD" id="PASSWD" autocomplete="off" /><br /><br />
		<a href="#this" class="btn btn-default" id="delete">삭제</a>
       		<button type="button" class="btn btn-default" data-dismiss="modal">닫기</button> 
    	 </form>
    	 
    	
    <!-- 글삭제시 비밀번호 검사 끝 -->
    </div>
  </div>
</div>