<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="boardHeader.jsp" />

<script src="/bowtech/resources/js/searchValidation.js"></script>

<script>
$(document).ready(function(){
	var pageNumValue = $('#paging').val();
	$('.paging'+pageNumValue+'').css('color', 'red');	
	
	fn_selectBoardList(1);
	
});
	//게시판초기정보 저장 
	function fn_selectBoardList(PageNo){
		var comAjax = new ComAjax();
		comAjax.setUrl("<c:url value='/selectBoardList.do' />");
		comAjax.setCallback("fn_selectBoardListCallback");
		comAjax.addParam("PAGE_INDEX", $("#PAGE_INDEX").val());
		comAjax.addParam("PAGE_ROW", 15);
		comAjax.ajax();
	}
	
	//콜백으로 게시판 정보 불러옴
	function fn_selectBoardListCallback(data){
		var total = data.TOTAL;
		var body = $("table > tbody");
		
		body.empty();
		if(total == 0){
			var str = "<tr>" + 
						"<td colspan='4'>게시글이 없습니다. 작성해주세요.</td>"
					+	"</td>";
			body.append(str);
		}else{
			var params = {
					divId		:	"PAGE_NAVI",
					pageIndex	:	"PAGE_INDEX",
					totalCount	:	total,
					eventName	:	"fn_selectBoardList"
			};
			gfn_renderPaging(params); //이게뭐지
			
			var str = "";
			$.each(data.list, function(key, value){
				str += "<tr>" +
						"<td style='width:100px;'>" + value.idx + "</td>" +
						"<td class='title' style='width:700px;'>" +
							"<div class='td_subject' style='display:inline-block;width:650px'>" +
							"<a href='#this' name='title'>" + value.title + "</a>" + "</div>" +
							"<input type='hidden' id='IDX' name='IDX' value=" + value.idx + "/>" +
						"</td>" +
						"<td class='td_subject' style='width:200px;text-align:center;'>" + value.writer + "</td>" +
						"<td style='width:100px;'>" + value.readCount + "</td>" +
					"</tr>";
			});
			body.append(str);
			
			$("a[name='title']").on("click", function(e){
				e.preventDefault();
				//fn_openBoardDetail($(this));
			});
		}
	}
</script>

<style>
.pull-right{
	margin-bottom:10px;
}
html{
	overflow:scroll;
}

@media screen and (min-width:250px){
	html{font-size:10px;}
}
@media screen and (min-width:768px){
	html{font-size:12px;}
}
@media screen and (min-width:1024px){
	html{font-size:14px;}
}
#paging > a{
	margin:0 2;
}
a, a:link{
	color:black;
}
a:visited{
	color:#333333;
}
a:hover{
	color:#999999;
	text-decoration:none;
}
.td_subject{
overflow: hidden; 
text-overflow: ellipsis;
white-space: nowrap; 
height:20px;

}

</style>

<input type="hidden" id="paging" value="${pageNum}" />

<div class="container">
	<div class="contents_subject center-block" style="width:300px;text-align:center;">
		<h2> 게시판 입니다. </h2>
	</div>
	<div class="col-xs-12">
		<div id="openBoardBtn" class="col-xs-12">
		<button type="button" class="btn btn-default btn-sm pull-right"
		onclick="window.location='/boardInsert.do'">글쓰기</button>
		<button type="button" class="btn btn-default btn-sm pull-right"
		onclick="window.location='/openBoard.do'">전체 글보기</button>
		<table class="table table-hover" style="width:1100px;">
			<thead>
				<tr>
					<th style="width:100px;">글번호</th>
					<th style="width:700px">글제목</th>
					<th style="width:200px;">작성자</th>
					<th style="width:100px;">조회수</th>
				</tr>
			</thead>
			
			<tbody>
			
			</tbody>
		</table>
		</div>
		
		<div id="PAGE_NAVI"></div>
		<input type="hidden" id="PAGE_INDEX" name="PAGE_INDEX"/>
		
		<div id="paging" class="col-xs-12" style="text-align:center; margin-bottom:20px;">
		
		<c:if test="${searchText == null}">
		<!-- Paging -->
				<a href="boardList.do?pageNum=1">[처음]</a>
			
			<c:if test="${startPage > 10}">
			    <a href="boardList.do?pageNum=${startPage - 10 }">[이전]</a>
			</c:if>
			
			<c:forEach var="i" begin="${startPage}" end="${endPage}">
					
			    <a class="paging${i}" href="boardList.do?pageNum=${i}">[${i}]</a>
			</c:forEach>
			
			<c:if test="${endPage < pageCount}">
			    <a href="boardList.do?pageNum=${startPage + 10}">[다음]</a>
			</c:if>
			
				<a href="boardList.do?pageNum=${pageCount}">[끝]</a>
		</c:if>
		
		<c:if test="${searchText != null}">
			<!-- 검색 Paging -->
				<a href="boardList.do?pageNum=1&searchText=${searchText}&select=${select}">[처음]</a>
			
			<c:if test="${startPage > 10}">
			    <a href="boardList.do?pageNum=${startPage - 10 }&serachText=${searchText}&select=${select}">[이전]</a>
			</c:if>
			
			<c:forEach var="i" begin="${startPage}" end="${endPage}">
					<c:out value="${pageNum}"/>
					<c:set var="pageNum" value="${pageNum - 1}"/>
			    <a class="paging${pageNum}" href="boardList.do?pageNum=${i}&searchText=${searchText}&select=${select}">[${i}]</a>
			</c:forEach>
			
			<c:if test="${endPage < pageCount}">
			    <a href="boardList.do?pageNum=${startPage + 10}&searchText=${searchText}&select=${select}">[다음]</a>
			</c:if>
			
				<a href="boardList.do?pageNum=${pageCount}&searchText=${searchText}&select=${select}">[끝]</a>
		</c:if>
		</div>
		
		
		<div class="col-xs-12" style="text-align:center;">
			<!-- Search -->
			<form name="sForm" action="boardList.do" method="post" accept-charset="UTF-8" onSubmit="return searchCheck();">
			<div class="col-xs-12 col-md-6">
				<input name="searchText" id="list_search" type="text" class="col-xs-12 col-md-6 pull-right input-sm center-block" style="height:34px;"  />
								
				<select name="select" class="form-control pull-right" style="width:20%;display:inline;">
					<option value="0">제목</option>
					<option value="1">내용</option>
					<option value="2">작성자</option>
					<option value="3">제목+내용</option>
				</select>
			</div>
			<div class="col-xs-12 col-md-6">
				<input type="submit" class="col-xs-12 col-md-6 pull-left btn btn-info"  autocomplete="off" value="검색" />
			</div>
			<div class="col-xs-12">
				*. 최대 4개의 단어를 조합하여 검색할 수 있습니다.
			</div>			
			</form>
		</div>		
		
	</div>
	<div>
		<form id="commonForm" name="commonForm"></form>
	</div>
</div>

