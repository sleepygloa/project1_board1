<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<jsp:include page="header.jsp" flush="false" />
	<body class="container">
		<input type="hidden" id="pageUrl" value="" />
		<input type="hidden" id="pageData" value="" />
		<input type="hidden" id="pageJsp" value="" />
		
		<header>
			<div class="container">
			  <a id="page-logo">SEONHO blog</a>
			  <a id="login" href="#">login</a>
			  <a id="logout" href="#" style="display:none">logout</a>
			</div>
		</header>
		<div id="main_content">
			<nav>1</nav>
			<article id="body"></article>
		</div>

		
		<!-- <footer></footer> -->
	</body>
	
</html>
