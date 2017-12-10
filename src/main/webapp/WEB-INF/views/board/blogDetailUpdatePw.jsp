<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
 

<!-- Small modal -->
<button type="button" href="#modal1" class="btn btn-primary" data-toggle="modal" data-target=".modal-update">글 수정하기</button>

<div id="#modal1" class="modal fade bs-example-modal-sm modal-update" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" style="display:none;">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
    <!-- 글수정시 비밀번호 검사 -->
    	 <h4> 글 수정하기 </h4><br />
    	 
    	 <p>수정하시려면 비밀번호를 입력해주세요</p><br />
    	 
    	 <form id="updateForm" name="updateForm">
    	 	<label>비밀번호 </label>
    	 	<input type="password" name="passwd" autocomplete="off" /><br /><br />
    	 		<a href="#this" class="btn btn-default" id="update">수정</a>
       		<button type="button" class="btn btn-default" data-dismiss="modal">닫기</button> 
    	 </form>
    	 
    	
    <!-- 글수정시 비밀번호 검사 끝 -->
    </div>
  </div>
</div> 