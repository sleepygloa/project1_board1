<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="boardHeader.jsp" />


<style>
.f > label{
padding-left:10px;
color:red;
}
</style>
<script src="/bowtech/js/spanValidation.js"></script>  
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


</style>

<div class="container bs-example">
<form id="form" name="form" class="form-horizontal formjs">
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
			<input id="passwd" name="passwd" class="form-control" type="text" maxlength="16" autocomplete="off" 
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
			<input id="subject" name="subject" class="form-control" type="text" maxlength="100" autocomplete="off" 
			placeholder="글제목을 100자 이내로 입력해주세요" />
			<span id="subjectspan" class="redText">
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
	
	<div class="form-group">
		<label class="col-xs-2 control-label">버튼</label>
		<div class="col-xs-10">
		<input id="write" class="btn btn-default" type="button" value="글쓰기" onclick="frmCheck('insert')" />
		<input class="btn btn-default" type="button" value="글 리스트로   돌아가기"
			 onclick="window.location='boardList.do?pageNum=1'" />
		</div>
	</div>	
</form>
</div>