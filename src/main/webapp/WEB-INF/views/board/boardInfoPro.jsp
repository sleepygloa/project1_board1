<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<input id="text" type="hidden" value="${text}" />

<!-- 글 수정 성공시 -->
<c:if test="${check == 1}">
	<script>
		var talk = document.getElementById("text").value;
		alert(talk);
	</script>
	<meta http-equiv="Refresh" content="0;url=boardInfo.do?num=${num}&update=0" >	
	
</c:if>

<!-- 글 수정 실패시 -->
<c:if test="${check == 2}">
	<script>
		var talk = document.getElementById("text").value;
		alert(talk);
		history.go(-1);
	</script>
</c:if>

<!-- 글 삭제 성공시 -->
<c:if test="${check == 3}">
	<script>
		var talk = document.getElementById("text").value;	
		alert(talk);
	</script>
	<meta http-equiv="Refresh" content="0;url=boardList.do" >	
</c:if>

<!-- 글 삭제 실패시 -->
<c:if test="${check == 4}">
	<script>
		var talk = document.getElementById("text").value;	
		alert(talk);
		history.go(-1);
	</script>
</c:if>

<!-- 글 쓰기 성공시 -->
<c:if test="${check == 5}">
	<script>
		var talk = document.getElementById("text").value;	
		alert(talk);
	</script>
	<meta http-equiv="Refresh" content="0;url=boardList.do" >	
	
</c:if>

<!-- 글 쓰기 실패시 -->
<c:if test="${check == 6}">
	<script>
		var talk = document.getElementById("text").value;	
		alert(talk);
		history.go(-1);
	</script>
</c:if>

<!-- 글 수정 비밀번호 확인 성공시 -->
<c:if test="${check == 7}">
	<script>
		var talk = document.getElementById("text").value;	
		alert(talk);
	</script>
	<meta http-equiv="Refresh" content="0;url=boardInfo.do?update=1&num=${num}" >	
	
</c:if>

<!-- 글수정 비밀번호 확인 실패시 -->
<c:if test="${check == 8}">
	<script>
		var talk = document.getElementById("text").value;	
		alert(talk);
		history.go(-1);
	</script>
</c:if>