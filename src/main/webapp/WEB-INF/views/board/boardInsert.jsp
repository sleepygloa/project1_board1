<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="boardHeader.jsp" />
<jsp:include page="boardFormCommon.jsp" />

<style>
.f > label{
padding-left:10px;
color:red;
}
</style>
<script src="/resources/js/views/board/boardInsert.js"></script>  
<!-- <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" /> -->

<style>

.code{
	display:none;
	padding:0 auto;
	margin: 0;
	background-color:#ffffff;
	border:0px solid #fff;
	border-radius: 0px;
}
.writerSucc{
	float:right;
	position:fixed;
	top:100px;
	right:0px;
	
}
.redText{display: block;color: red;margin-left:10px;}
.greenText{display: block;color: green;margin-left:10px;}

input[type=file]{
display:inline;
}
</style>

<div class="container">
<form id="frm" name="frm" class="form-horizontal formjs" enctype="multipart/form-data">
	<div class="contents_subject center-block" style="width:300px;text-align:center;">
		<h2> 글 쓰기 페이지  </h2>
	</div>
	<div class="form-group">
		<label class="col-xs-2 control-label">작성자</label>
		<div class="col-xs-10 f">
			<input id="writer" name="writer" class="form-control" type="text" maxlength="10" autocomplete="off" 
			placeholder="2~10자로 구성된 영문, 한글을 이용한 작성자 이름을 입력해주세요" />
			<span id="writerspan" class="redText">
		</div>
	</div>	
	<div class="form-group">
		<label class="col-xs-2 control-label">비밀번호</label>
		<div class="col-xs-10 f">
			<input id="passwd" name="passwd" class="form-control" type="password" maxlength="16" autocomplete="off" 
			placeholder="6~16자 영문자, 숫자, 특수문자를 사용하세요." />
			<span id="passwdspan" class="redText">
		</div>			
	</div>	
<!--  	<div class="form-group">
		<label class="col-xs-2 control-label">이메일</label>
		<div class="col-xs-10 f">
			<input id="email" name="email" class="form-control" type="text" maxlength="30" autocomplete="off" 
			placeholder="이메일 20자 이내로 입력해주세요" />
		</div>
	</div>  -->
	<div class="form-group">
		<label class="col-xs-2 control-label">글 제목</label>
		<div class="col-xs-10 f">
			<input id="title" name="title" class="form-control" type="text" maxlength="100" autocomplete="off" 
			placeholder="글제목을 100자 이내로 입력해주세요" />
			<span id="titlespan" class="redText">
		</div>
	</div>		
	<div class="form-group">
		<label class="col-xs-2 control-label">글 내용<br /></label>
		<div class="col-xs-10">
			<textarea id="content" name="content" class="form-control" rows="30" cols="50" maxlength="1000"></textarea>
			<p>내용은 글자수 1000자까지 가능합니다.</p>
			<span id="counter" class="pull-right">1000</span>
			<span id="contentspan" class="redText">
		</div>			
	</div>
	<hr />
	<div class="form-group col-xs-12">
		<div id="fileDiv">
			<p>
				<input type="file" id="file" name="file_0">
				<a href='#this' class='btn btn-default' name='delete'>삭제</a>
			</p>
		</div>
	</div>
	<div class="form-group col-xs-12">
		<div class="col-xs-6"> </div>
		<div class="col-xs-6">
			<a  href="#this" class="btn btn-default" id="addFile">파일 추가</a>
			<a  href="#this" class="btn btn-default" id="write">글쓰기</a>
			<a  href="#this" class="btn btn-default" id="list">목록으로</a>
		</div>
	</div>	
</form>
</div>
<script>
var gfv_count = 1;

$(document).ready(function(){
	$("#list").on("click", function(e){ //목록으로 버튼
		e.preventDefault();
		fn_openBoard();
	});
	
	$("#write").on("click", function(e){ //작성하기 버튼
		e.preventDefault();
		frmCheck('insert');
		fn_insertBoard();
	});
	
	$("#addFile").on("click", function(e){ //파일 추가 버튼
		e.preventDefault();
		fn_addFile();
	});
	
	$("a[name='delete']").on("click", function(e){ //삭제 버튼
		e.preventDefault();
		fn_deleteFile($(this));
	});
});

function fn_openBoard(){
	var comSubmit = new ComSubmit();
	comSubmit.setUrl("<c:url value='/openBoard.do' />");
	comSubmit.submit();
}

function fn_insertBoard(){
	var comSubmit = new ComSubmit("frm");
	comSubmit.setUrl("<c:url value='/insertBoard.do' />");
	comSubmit.submit();
}

function fn_addFile(){
	var str = "<p><input type='file' name='file_"+(gfv_count++)+"'><a href='#this' class='btn btn-default' name='delete'>삭제</a></p>";
	$("#fileDiv").append(str);
	$("a[name='delete']").on("click", function(e){ //삭제 버튼
		e.preventDefault();
		fn_deleteFile($(this));
	});
}

function fn_deleteFile(obj){
	obj.parent().remove();
}
</script>
