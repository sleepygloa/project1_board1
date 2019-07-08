<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<jsp:include page="header.jsp" flush="false" />

<head>

	<style>
	
		@font-face{
			font-family:SDSwagger;
			src: url(font/SDSwaggerTTF.ttf);
		}
	
		body{
			font-family : SDSwagger;
		}
		
	
		.header, .nav, .section, .aside, .footer {
			display:block;
			width:100%;
			position:relative;
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
				width:20%;
				height:80%;
			}
		
		}
		
		
	</style>
</head>

<body>

	<header class="header">
		<div class="header-container">
			<div class="header-container-left"></div>
			<div class="header-container-middle">NAMBI'S VLOG</div>
			<div class="header-container-right"></div>
		</div>
	</header>
	<nav class="nav">메뉴입니다</nav>
	<section class="section">
		<article class="article">본문입니다</article>
	</section>
	<aside class="aside">광고입니다</aside>
	<footer class="footer">푸터입니다</footer>

  <script src="/resources/plugins/jquery/dist/jquery.min.js"></script>
<!--   <script src="/resources/plugins/popper.js/dist/umd/popper.min.js"></script>
  <script src="/resources/plugins/bootstrap/dist/js/bootstrap.min.js"></script>
  <script src="/resources/plugins/chart.js/dist/Chart.min.js"></script>
  <script src="/resources/plugins/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.min.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB5NXz9eVnyJOA81wimI8WYE08kW_JMe8g&callback=initMap" async defer></script>
  <script src="/resources/js/off-canvas.js"></script>
  <script src="/resources/js/hoverable-collapse.js"></script>
  <script src="/resources/js/misc.js"></script>
  <script src="/resources/js/chart.js"></script>
  <script src="/resources/js/maps.js"></script> -->
  <script src="/resources/js/main.js"></script>
  <script src="/resources/js/table.js"></script>
</body>

</html>
 