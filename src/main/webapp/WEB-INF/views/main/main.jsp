<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<jsp:include page="header.jsp" flush="false" />
	<body class="container">
		<input type="hidden" id="pageUrl" value="" />
		<input type="hidden" id="pageData" value="" />
		<input type="hidden" id="pageJsp" value="" />
		
		<div id="header" class="container row">
			<a id="logo">SEONHO blog</a>
			<a id="login" href="#">login</a>
			<a id="logout" href="#" style="display:none">logout</a>
		</div>
		<div id="body" class="row" >
		</div>

	</body>
	<footer id="footer" class="container">
		<div class="form-control">
			<a href="https://github.com/sleepygloa" target="_blank">
				<i class="fa fa-github"></i>
			</a>
			<a href="https://blog.naver.com/sleepygloa" target="_blank">
				<img width="20px" height="20px" src="/resources/img/naverblog.png"/>
			</a>
		</div>

		<div class="form-control">
			<p class="copyright">© 2018&nbsp;&nbsp;KIM SEONHO</p>
			<p class="theme-by">Hosted on
				<a href="https://github.com/sleepygloa">GitHub Pages&nbsp;
					<i class="fa fa-github"></i>
				</a>
			</p>
		</div>
		
	</footer>
</html>
