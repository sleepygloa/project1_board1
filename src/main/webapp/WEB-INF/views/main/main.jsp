<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<jsp:include page="header.jsp" flush="false" />

<head>

	<style>
	
		@font-face{
			font-family:SDSwagger;
			src: url(/fonts/SDSwaggerTTF.ttf);
		}
	
		body{
			font-family : SDSwagger;
		}
		
	
		.header, .nav, .section, .aside, .footer {
			float:left;
			display:block;
			width:100%;
			position:relative;
		}
		.nav {
			width:20%;
		}
		.section {
			width:80%;
		}
		.nav, .section{
			height:100vh;
		}
		.header{
			height:50px;
			background:yellow;
		}
		
		.header .header-container{
			text-align : center;
		}
		.header .header-container .header-contentBox-left{}
		.header .header-container .header-contentBox-middle{
		
		}
		.header .header-container .header-contentBox-right{}
		
		.nav{
			background:blue;
		}
			
		.section{
		background:black;
		}
		
		.article{
		background:red;
		}
		
		.aside{
			background:purple;
		}
		
		.footer{
			background:green;
		}
		
		
		
		@media ( max-width : 1024px) {
			.nav{
				display:none;
			}
			.section{
				width:100%;
			}
		}
		
		
		
		/**
		메뉴
		*/
		
		
	</style>
</head>

<body>

	<header class="header">
		<div class="header-container">
			<div class="header-container-left"></div>
			<div class="header-container-middle" style="font-size:2.5em;">NAMBI'S VLOG</div>
			<div class="header-container-right"></div>
		</div>
	</header>
	<nav id="nav" class="nav"></nav>
	<section class="section">
		<article id="mainArticle" class="article">본문입니다</article>
	</section>
	<aside class="aside">광고입니다</aside>
	<footer class="footer">푸터입니다</footer>


	<script type="text/javascript" src="/plugins/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="/js/main.js"></script>
	<script type="text/javascript" src="/js/table.js"></script>
</body>

</html>
 