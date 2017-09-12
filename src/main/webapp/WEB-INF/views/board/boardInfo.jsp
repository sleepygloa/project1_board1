<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="boardHeader.jsp" />

<script src="/bowtech/js/spanValidation.js"></script>  

<style>
html{
overflow:scroll;
}
.modal-content{
	vertical-align:middle;
	text-align:center;
	padding:5 0;
}
.modal-content h4{
	display: block;
	width:100%;
	background-color:green;
	height:30px;
	color:white;
	padding:5 0;

}
.content_height{
	height:auto;
}
@media screen and (min-width:250px){
	label{font-size:12px;}
}
@media screen and (min-width:768px){
	label{font-size:12px;}
}
@media screen and (min-width:1024px){
	label{font-size:14px;}
}
.code{
	padding:0 0;
	margin: 0 4;
	background-color:#ffffff;
	border:0px solid #fff;
	border-radius: 0px;
}
div{
word-break:break-all
}
.form-group{
margin:30px 0px;
}
.redText{display: block;color: red;margin-left:10px;}
.greenText{display: block;color: green;margin-left:10px;}
</style>

<div class="container bs-example">
<c:if test="${update == 0}">
<form class="form-horizontal">
	<div class="contents_subject center-block" style="width:300px;text-align:center;">
		<h2> 글 정보보기 페이지  </h2>
	</div>
<%-- 	<div class="form-group">
		<label class="col-xs-2 control-label">글번호</label>
		<div class="col-xs-10 info_content f">
			<p>${boardDTO.num}</p>
		</div>
	</div> --%>
	<div class="form-group " >
		<label class="col-xs-2 control-label">작성자</label>
		<div class="col-xs-10 info_content f">
			<p>${boardDTO.writer}</p>
		</div>
	</div>	
<%-- 	<div class="form-group">
		<label class="col-xs-2 control-label">이메일</label>
		<div class="col-xs-10 info_content f">
			<p>${boardDTO.email}</p>
		</div>
	</div>	 --%>
<%-- 	<div class="form-group">
		<label class="col-xs-2 control-label">조회수</label>
		<div class="col-xs-10 info_content f">
			<p>${boardDTO.readCount}</p>
		</div>
	</div>	 --%>
<%-- 	<div class="form-group">
		<label class="col-xs-2 control-label">등록날짜</label>
		<div class="col-xs-10 info_content f">
			<p>${boardDTO.reg_date}</p>
		</div>
	</div> --%>
	<div class="form-group">
		<label class="col-xs-2 control-label">글 제목</label>
		<div class="col-xs-10 info_content f">
			<p>${boardDTO.subject}</p>
		</div>
	</div>		
	<div class="form-group ">
		<label class="col-xs-2 control-label">글내용</label>
		<div class="col-xs-10 info_content f content_height">
			<p>${boardDTO.content}</p>
		</div>			
	</div>
	
	<hr />
			
	<div class="form-group">
		<label class="col-xs-2 control-label">버튼</label>
		<div class="col-xs-10">
</form>
		<jsp:include page="boardInfoUpdatePw.jsp" /><!-- 글수정 시 비밀번호 검사 -->
		<jsp:include page="boardInfoDeletePw.jsp" /><!-- 글삭제 시 비밀번호 검사 -->
		<input class="btn btn-default" type="button" value="리스트로 돌아가기" 
			onclick="window.location='boardList.do?pageNum=1'" />
		</div>
	</div>	


</c:if>
<c:if test="${update == 1}">
<form id="form" name="form"  class="form-horizontal" action="boardInfoUpdatePro.do" method="post">
	<div class="contents_subject center-block" style="width:300px;text-align:center;">
		<h2> 글 정보수정 페이지  </h2>
	</div>
	<input name="num" class="form-control" type="hidden" value="${boardDTO.num}" />
	<input name="readCount" class="form-control" type="hidden" value="${boardDTO.readCount}" />
	<input name="reg_date" class="form-control" type="hidden" value="${boardDTO.reg_date}" />
	<div class="form-group">
		<label class="col-xs-2 control-label">작성자</label>
		<div class="col-xs-10">
			<input id="writer" name="writer" class="form-control" type="text" maxlength="10" autocomplete="off" value="${boardDTO.writer}" 
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
		<label class="col-xs-2 control-label">글 제목</label>
		<div class="col-xs-10">
			<input id="subject" name="subject" class="form-control" type="text" maxlength="100" autocomplete="off" value="${boardDTO.subject}"
			placeholder="글제목을 100자 이내로 입력해주세요" />
			<span id="subjectspan" class="redText">
		</div>
	</div>		
	<div class="form-group">
		<label class="col-xs-2 control-label">글내용</label>
		<div class="col-xs-10">
			<textarea id="content" name="content" class="form-control"  rows="30" cols="50"  autocomplete="off" maxlength="1000">${boardDTO.content}</textarea>
			<p>내용은 글자수 1000자까지 가능합니다.</p>
			<span id="counter" class="pull-right">1000</span>
			<span id="contentspan" class="redText">
		</div>			
	</div>
		
	<hr />	
		
	<div class="form-group">
		<label class="col-xs-2 control-label">버튼</label>
		<div class="col-xs-10">
		<input class="btn btn-default" type="button" value="수정하기" onclick="frmCheck('update')"/>
		<input class="btn btn-default" type="button" value="글정보로  돌아가기"
			 onclick="window.location='boardInfo.do?num=${boardDTO.num}&update=0'" />
		<input class="btn btn-default" type="button" value="글 리스트로   돌아가기"
			 onclick="window.location='boardList.do?pageNum=1'" />
		</div>
	</div>	
</form>
</c:if>
</div>
