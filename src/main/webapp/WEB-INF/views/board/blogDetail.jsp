<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="boardHeader.jsp" />

<div style="margin:0 auto;" class="container col-xs-8 form-horizontal">
	<div class="contents_subject center-block" style="width:300px;text-align:center;">
		<h2> 글 정보보기 페이지  </h2>
	</div>
 	<div class="form-group">
		<label class="col-xs-2 control-label">글번호</label>
		<div class="col-xs-10 info_content f">
			<p>${map.IDX}</p>
			<input type="hidden" id="IDX" value="${map.IDX}" />
		</div>
	</div>
	<div class="form-group" >
		<label class="col-xs-2 control-label">작성자</label>
		<div class="col-xs-10 info_content f">
			<p>${map.IN_USER_ID}</p>
		</div>
	</div>	
<%-- 	<div class="form-group">
		<label class="col-xs-2 control-label">이메일</label>
		<div class="col-xs-10 info_content f">
			<p>${boardDTO.email}</p>
		</div>
	</div>	 --%>
 	<div class="form-group">
		<label class="col-xs-2 control-label">조회수</label>
		<div class="col-xs-10 info_content f">
			<p>${map.READCOUNT}</p>
		</div>
	</div>	 
 	<div class="form-group">
		<label class="col-xs-2 control-label">등록날짜</label>
		<div class="col-xs-10 info_content f">
			<p>${map.IN_DT}</p>
		</div>
	</div> 
	<div class="form-group">
		<label class="col-xs-2 control-label">글 제목</label>
		<div class="col-xs-10 info_content f">
			<p>${map.TITLE}</p>
		</div>
	</div>		
	<div class="form-group ">
		<label class="col-xs-2 control-label">글내용</label>
		<div class="col-xs-10 info_content f content_height">
			<p>${map.CONTENT}</p>
		</div>			
	</div>
	<div class="form-group ">
		<label class="col-xs-2 control-label">첨부파일</label>
		<div class="col-xs-10 info_content f content_height">
			<c:forEach var="list" items="${list}">
				<p>
					<input type="hidden" id="FILE_IDX" value="${list.IDX }">
					<a href="#this" name="FILE">${list.ORIGINAL_FILE_NAME }</a> 
					(${list.FILE_SIZE }kb)
				</p>
			</c:forEach>
		</div>			
	</div>
	<div class="form-group">
		<label class="col-xs-2 control-label">버튼</label>
		<div class="col-xs-10">

		<a href="#this" class="btn btn-default" id="blogDetailList">목록으로</a>
		<a href="#this" class="btn btn-default" id="blogDetailUpdate">수정하기</a>
		<a href="#this" class="btn btn-default" id="blogDetailDelete">삭제</a>
		</div>
	</div>
<hr />
	<div class="form-group" id="blogDetailReplyContent" >
		<table class="table table-hover col-xs-8" >
			<tbody>
			
			</tbody>
		</table>
	</div>
</div>			
	
<form id="commonForm" name="commonForm"></form>
		
<script src="/resources/js/views/board/blogDetail.js"></script>  
		
