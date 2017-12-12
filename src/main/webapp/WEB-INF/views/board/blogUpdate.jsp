<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  

<jsp:include page="boardHeader.jsp" />

<div class="container">
<form id="frm" name="frm"  class="form-horizontal" enctype="multipart/form-data">
	<div class="contents_subject center-block" style="width:300px;text-align:center;">
		<h2> 글 정보수정 페이지  </h2>
	</div>
	
	<div class="form-group col-xs-12">
		<label class="col-xs-2 control-label">글번호</label>
		<div class="col-xs-10 info_content f">
			<p>${map.IDX}</p>
			<input type="hidden" id="IDX"  value="${map.IDX}" />
		</div>
	</div>
	<div class="form-group col-xs-12">
		<label class="col-xs-2 control-label">작성자</label>
		<div class="col-xs-10">
			<input id="WRITER" name="WRITER" class="form-control" type="text" maxlength="10" autocomplete="off" value="${map.IN_USER_ID}" 
			placeholder="2~10자로 구성된 영문, 한글을 이용한 작성자 이름을 입력해주세요" />
			<span id="writerspan" class="redText">
		</div>
	</div>	
<%-- 	<div class="form-group">
		<label class="col-xs-2 control-label">이메일</label>
		<div class="col-xs-10">
			<input id="email" name="email" class="form-control" type="text" maxlength="30" autocomplete="off" value="${boardDTO.email}" placeholder="이메일을 입력해주세요" />
		</div>
	</div>	 --%>
	<div class="form-group col-xs-12">
		<label class="col-xs-2 control-label">조회수</label>
		<div class="col-xs-4 info_content f">
			<p>${map.READCOUNT}</p>
		</div>
		<label class="col-xs-2 control-label">등록날짜</label>
		<div class="col-xs-4 info_content f">
			<p>${map.IN_DT}</p>
		</div>
	</div>
	<div class="form-group col-xs-12">
		<label class="col-xs-2 control-label">글 제목</label>
		<div class="col-xs-10">
			<input id="TITLE" name="TITLE" class="form-control" type="text" maxlength="100" autocomplete="off" value="${map.TITLE}"
			placeholder="글제목을 100자 이내로 입력해주세요" />
			<span id="subjectspan" class="redText">
		</div>
	</div>		
	<div class="form-group col-xs-12">
		<label class="col-xs-2 control-label">글내용</label>
		<div class="col-xs-10">
			<textarea id="CONTENT" name="CONTENT" class="form-control"  rows="30" cols="30"  autocomplete="off" maxlength="1000">${map.CONTENT}</textarea>
			<p>내용은 글자수 1000자까지 가능합니다.</p>
			<span id="counter" class="pull-right">1000</span>
			<span id="contentspan" class="redText">
		</div>			
	</div>
    <div class="form-group col-xs-12" style="height:150px;">
		<label class="col-xs-2 control-label">첨부파일</label>
		<div id="fileDiv" class="col-xs-10 info_content f content_height">
			<c:forEach var="row" items="${list}" varStatus="var">
				<p class="col-xs-12" style="height:50px;">
					<input type="hidden" id="IDX" name="IDX_${var.index }" value="${row.IDX }" >
					<a href="#this" id="name_${var.index }" name="name_${var.index }">${row.ORIGINAL_FILE_NAME }  (${row.FILE_SIZE }kb)</a>
				</p>
			</c:forEach>
		</div>			
	</div>
	<hr />	
		
	<div class="form-group col-xs-12">
		<label class="col-xs-2 control-label">버튼</label>
		<div class="col-xs-10">
		<a class="btn btn-default" id="blogUpdateAddFile">파일 추가</a>
		<a class="btn btn-default" id="blogUpdateSave">저장하기</a>
		<a class="btn btn-default" id="blogUpdateList">목록으로</a> 
		</div>
	</div>	
</form>
</div>
<form id="commonForm" name="commonForm"></form>
<script src="/resources/js/views/board/blogWrite.js"></script>
<script src="/resources/js/views/board/blogUpdate.js"></script>
