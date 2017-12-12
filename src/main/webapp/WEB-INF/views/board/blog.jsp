<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="boardHeader.jsp" />

<!-- hidden -->
<input type="hidden" id="paging" value="${pageNum}" />

<div class="container">
	<div class="col-xs-12">
		<h2> 게시판 입니다. </h2>
	</div>
	<div class="col-xs-12">
		<div id="openBoardBtn" class="col-xs-12">
			<button id="blogWriteBtn" type="button" class="btn btn-default btn-sm pull-right">글쓰기</button>
			<button id="blogTotalSearchBtn" type="button" class="btn btn-default btn-sm pull-right">전체 글보기</button>
		</div>
		<div class="col-xs-12">
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
				<a href="/board/blog.do?pageNum=1">[처음]</a>
			
			<c:if test="${startPage > 10}">
			    <a href="/board/blog.do?pageNum=${startPage - 10 }">[이전]</a>
			</c:if>
			
			<c:forEach var="i" begin="${startPage}" end="${endPage}">
					
			    <a class="paging${i}" href="/board/blog.do?pageNum=${i}">[${i}]</a>
			</c:forEach>
			
			<c:if test="${endPage < pageCount}">
			    <a href="/board/blog.do?pageNum=${startPage + 10}">[다음]</a>
			</c:if>
			
				<a href="/board/blog.do?pageNum=${pageCount}">[끝]</a>
		</c:if>
		
		<c:if test="${searchText != null}">
			<!-- 검색 Paging -->
				<a href="/board/blog.do?pageNum=1&searchText=${searchText}&select=${select}">[처음]</a>
			
			<c:if test="${startPage > 10}">
			    <a href="/board/blog.do?pageNum=${startPage - 10 }&serachText=${searchText}&select=${select}">[이전]</a>
			</c:if>
			
			<c:forEach var="i" begin="${startPage}" end="${endPage}">
					<c:out value="${pageNum}"/>
					<c:set var="pageNum" value="${pageNum - 1}"/>
			    <a class="paging${pageNum}" href="/board/blog.do?pageNum=${i}&searchText=${searchText}&select=${select}">[${i}]</a>
			</c:forEach>
			
			<c:if test="${endPage < pageCount}">
			    <a href="/board/blog.do?pageNum=${startPage + 10}&searchText=${searchText}&select=${select}">[다음]</a>
			</c:if>
			
				<a href="/board/blog.do?pageNum=${pageCount}&searchText=${searchText}&select=${select}">[끝]</a>
		</c:if>
		</div>
		
		
		<div class="col-xs-12" style="text-align:center;">
			<!-- Search -->
			<div class="col-xs-12 col-md-6">
				<input name="blogSearchText" id="blogSearchText" type="text" class="col-xs-12 col-md-6 pull-right input-sm center-block" style="height:34px;"  />
								
				<select name="blogSearchCate" class="form-control pull-right" style="width:20%;display:inline;">
					<option value="0">제목</option>
					<option value="1">내용</option>
					<option value="2">작성자</option>
					<option value="3">제목+내용</option>
				</select>
			</div>
			<div class="col-xs-12 col-md-6">
				<a id="blogSearchBtn" class="col-xs-12 col-md-6 pull-left btn btn-info">검색</a>
			</div>
			<div class="col-xs-12">
				*. 최대 4개의 단어를 조합하여 검색할 수 있습니다.
			</div>			
		</div>		
		
	</div>
	<div>
		<form id="commonForm" name="commonForm"></form>
	</div>
</div>

<script src="/resources/js/views/board/blog.js"></script>
