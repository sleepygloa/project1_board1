<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="boardHeader.jsp" />

<script src="/resources/js/views/board/boardInsert.js"></script>  

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

<div class="container">
<form class="form-horizontal">
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
	<div class="form-group " >
		<label class="col-xs-2 control-label">작성자</label>
		<div class="col-xs-10 info_content f">
			<p>${map.WRITER}</p>
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
			<p>${map.REG_DATE}</p>
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
	<hr />
	<div class="form-group">
		<label class="col-xs-2 control-label">버튼</label>
		<div class="col-xs-10">

		<jsp:include page="boardDetailUpdatePw.jsp" /><!-- 글수정 시 비밀번호 검사 -->
		<jsp:include page="boardDetailDeletePw.jsp" /><!-- 글삭제 시 비밀번호 검사 -->
		<a href="#this" class="btn btn-default" id="list">목록으로</a>
		<a href="#this" class="btn btn-default" id="update">수정하기</a>
		</div>
	</div>
</form>
</div>			
	
	<form id="commonForm" name="commonForm"></form>
		
<script type="text/javascript">
		$(document).ready(function(){
			$("#list").on("click", function(e){ //목록으로 버튼
				e.preventDefault();
				fn_openBoard();
			});
			
			$("#update").on("click", function(e){ //수정하기 버튼
				e.preventDefault();
				fn_openBoardUpdate();
			});
			
			$("a[name='file']").on("click", function(e){ //파일 이름
				e.preventDefault();
				fn_downloadFile($(this));
			});
			$("#delete").on("click", function(e){ //삭제하기 버튼
				e.preventDefault();
				fn_deleteBoard();
			});
			$("#update").on("click", function(e){ //수정하기 버튼
				e.preventDefault();
				fn_updateBoard();
			});
		});
		
		function fn_openBoard(){
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("<c:url value='/openBoard.do' />");
			comSubmit.submit();
		}
		
		function fn_openBoardUpdate(){
			var idx = "${map.IDX}";
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("<c:url value='/openBoardUpdate.do' />");
			comSubmit.addParam("IDX", idx);
			comSubmit.submit();
		}
		
		function fn_downloadFile(obj){
			var idx = obj.parent().find("#IDX").val();
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("<c:url value='/downloadFile.do' />");
			comSubmit.addParam("IDX", idx);
			comSubmit.submit();
		}
		function fn_deleteBoard(){
			if(confirm('정말삭제하시겠습니까?') == true){
				var comSubmit = new ComSubmit();
				comSubmit.setUrl("<c:url value='/deleteBoard.do' />");
				comSubmit.addParam("IDX", $('#IDX').val());
				comSubmit.addParam("PASSWD", $('#PASSWD').val());
				comSubmit.submit();
			}else{
				return false;
			} 
		};
		function fn_updateBoard(){
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("<c:url value='/openBoardUpdate.do' />");
			comSubmit.addParam("IDX", $('#IDX').val());
			comSubmit.addParam("PASSWD", $('#PASSWD').val());
			comSubmit.submit();
		};
	</script>

