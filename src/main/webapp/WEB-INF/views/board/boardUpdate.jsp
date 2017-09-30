<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  

<jsp:include page="boardHeader.jsp" />

<script src="/resources/js/views/board/boardInsert.js"></script>  

<form id="frm" name="frm"  class="form-horizontal" enctype="multipart/form-data">
	<div class="contents_subject center-block" style="width:300px;text-align:center;">
		<h2> 글 정보수정 페이지  </h2>
	</div>
	
	<div class="form-group">
		<label class="col-xs-2 control-label">글번호</label>
		<div class="col-xs-10 info_content f">
			<p>${map.IDX}</p>
			<input type="hidden" id="idx" value="${map.IDX}" />
		</div>
	</div>
	<div class="form-group">
		<label class="col-xs-2 control-label">작성자</label>
		<div class="col-xs-10">
			<input id="writer" name="writer" class="form-control" type="text" maxlength="10" autocomplete="off" value="${map.WRITER}" 
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
	<div class="form-group">
		<label class="col-xs-2 control-label">조회수</label>
		<div class="col-xs-10 info_content f">
			<p>${map.READCOUNT}</p>
		</div>
	</div>
	<div class="form-group">
		<label class="col-xs-2 control-label">등록날짜</label>
		<div class="col-xs-10 info_content f">
			<p>${map.REG_DATE}</p>
		</div>
	</div>		
	<div class="form-group">
		<label class="col-xs-2 control-label">글 제목</label>
		<div class="col-xs-10">
			<input id="title" name="title" class="form-control" type="text" maxlength="100" autocomplete="off" value="${map.TITLE}"
			placeholder="글제목을 100자 이내로 입력해주세요" />
			<span id="subjectspan" class="redText">
		</div>
	</div>		
	<div class="form-group">
		<label class="col-xs-2 control-label">글내용</label>
		<div class="col-xs-10">
			<textarea id="content" name="content" class="form-control"  rows="30" cols="50"  autocomplete="off" maxlength="1000">${map.CONTENT}</textarea>
			<p>내용은 글자수 1000자까지 가능합니다.</p>
			<span id="counter" class="pull-right">1000</span>
			<span id="contentspan" class="redText">
		</div>			
	</div>
    <div class="form-group">
		<label class="col-xs-2 control-label">첨부파일</label>
		<div id="fileDiv" class="col-xs-10 info_content f content_height">
			<c:forEach var="row" items="${list}" varStatus="var">
				<p>
					<input type="hidden" id="IDX" name="IDX_${var.index }" value="${row.IDX }">
					<a href="#this" id="name_${var.index }" name="name_${var.index }">${row.ORIGINAL_FILE_NAME }</a>
					<input type="file" id="file_${var.index }" name="file_${var.index }"> 
					(${row.FILE_SIZE }kb)
					<a href="#this" class="btn" id="delete_${var.index }" name="delete_${var.index }">삭제</a>
				</p>
			</c:forEach>
		</div>			
	</div>
	<hr />	
		
	<div class="form-group">
		<label class="col-xs-2 control-label">버튼</label>
		<div class="col-xs-10">
		<a href="#this" class="btn" id="addFile">파일 추가</a>
		<a href="#this" class="btn btn-default" id="update">저장하기</a>
		<a href="#this" class="btn btn-default" id="delete">삭제하기</a>
		<a href="#this" class="btn btn-default" id="list">목록으로</a> 
		</div>
	</div>	
</form>
<form id="commonForm" name="commonForm"></form>
	
	<script type="text/javascript">
		var gfv_count = '${fn:length(list)+1}';
		$(document).ready(function(){
			$("#list").on("click", function(e){ //목록으로 버튼
				e.preventDefault();
				fn_openBoard();
			});
			
			$("#update").on("click", function(e){ //저장하기 버튼
				e.preventDefault();
				frmCheck('update');
				fn_updateBoard();
			});
			
			$("#delete").on("click", function(e){ //삭제하기 버튼
				e.preventDefault();
				fn_deleteBoard();
			});
			
			$("#addFile").on("click", function(e){ //파일 추가 버튼
				e.preventDefault();
				fn_addFile();
			});
			
			$("a[name^='delete']").on("click", function(e){ //삭제 버튼
				e.preventDefault();
				fn_deleteFile($(this));
			});
		});
		
		function fn_openBoard(){
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("<c:url value='/openBoard.do' />");
			comSubmit.submit();
		}
		
		function fn_updateBoard(){
			var comSubmit = new ComSubmit("frm");
			comSubmit.setUrl("<c:url value='/updateBoard.do' />");
			comSubmit.submit();
		}
		
		function fn_deleteBoard(){
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("<c:url value='/deleteBoard.do' />");
			comSubmit.addParam("IDX", $("#IDX").val());
			comSubmit.submit();
			
		}
		
		function fn_addFile(){
			var str = "<p>" +
					"<input type='file' id='file_"+(gfv_count)+"' name='file_"+(gfv_count)+"'>"+
					"<a href='#this' class='btn' id='delete_"+(gfv_count)+"' name='delete_"+(gfv_count)+"'>삭제</a>" +
				"</p>";
			$("#fileDiv").append(str);
			$("#delete_"+(gfv_count++)).on("click", function(e){ //삭제 버튼
				e.preventDefault();
				fn_deleteFile($(this));
			});
		}
		
		function fn_deleteFile(obj){
			obj.parent().remove();
		}
	</script>