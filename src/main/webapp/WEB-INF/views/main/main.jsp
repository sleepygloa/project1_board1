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
		
	
		.header, .nav, .section, .article, .aside, .footer {
			float:left;
			display:block;
			width:100%;
			position:relative;
		}
		.nav {
			width:15%;
		}
		.section {
			width:85%;
		}
		.article{
			width:80%;
		}
		
		
		.nav, .section{
			height:100vh;
		}
		.header{
			height:50px;
			/* background:yellow; */
			border-bottom-style:1px solid black;
		}
		
		.header .header-container{
			text-align : center;
		}
		.header .header-container .header-contentBox-left{}
		.header .header-container .header-contentBox-middle{
		
		}
		.header .header-container .header-contentBox-right{}
		
		.nav{
			/* background:blue; */
			border-right-style:1px solid black;
		}
			
		.section{
			background:sky;
		}
		
		.article{
			/* background:red; */
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
		공통 UI
		*/
		
		
		.pull-right{ float:right; }
		.pull-left{ float:left;}
		
		.btn{ 
			height:30px;
			position:relative;
			/* float:left; */
			padding:5px;
		 }
		/* 버튼-저장 */
		.btn-save{ backgroun-color:blue; }
		/* 버튼-추가, 신규 */
		.btn-add{ backgroun-color:green; }
		/* 버튼-수정 */
		.btn-update{ backgroun-color:yellow; }
		/* 버튼-삭제 */
		.btn-delete{ backgroun-color:red; }
		/* 버튼-취소 */
		.btn-cancel{ backgroun-color:red; }
		
		.btn-sm{ height : 15px; }
		.btn-md{ height : 20px; }
		.btn-dl{ height : 25px; }
		.btn-lg{ height : 30px; }
		
		.table{
			position:relative;
			/* float:left; */
			width:100%;
		}
		/**
		메뉴
		*/
		select, input, textarea{
			padding : 5px;
		}
		
		.blogUpdateFlag{
			display:none;
		}
		
	</style>
</head>

<body>

	<header class="header">
		<div class="header-container">
			<div class="col-xs-w10"></div>
			<div class="col-xs-w80" style="font-size:2.5em;">NAMBI'S VLOG</div>
			<div class="col-xs-w10">
				<div id="mainLoginArea">
					<a href="#" id="mainLoginToggleLogin" class="btn" >LOGIN</a>
					<a href="#" id="mainLoginToggleLogout" class="btn" >LOGOUT</a>
				</div>
			</div>
		</div>
	</header>
	<nav id="nav" class="nav"></nav>
	<section class="section">
		<article id="mainArticle" class="article">본문입니다</article>
	</section>
	<aside class="aside">광고입니다</aside>
	<footer class="footer">푸터입니다</footer>
	
	<div id="mainLoginPop" style="position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:gray; opacity:0.7; display:none;">
		<div style="background-color:white;border:2px black solid; position:absolute; top:30%; left:40%; width:400px; height:300px;">
			<div class="col-xs-w100" style="border-bottom:1px gray solid; height:40px" >
				<a href="#" id="mainLoginPopBack" class="btn pull-left" >뒤로가기</a>
				<a href="#" id="mainLoginPopLogin" class="btn pull-right" >로그인</a>
			</div>
			<div class="col-xs-w100" style="padding:10px;">
				
				<div class="col-xs-w90" style="margin-bottom:10px;">
					<input id="mainLoginPopId" class="col-xs-w100" type="text" placeholder="아이디를 입력해주세요"/>
				</div>
				<div class="col-xs-w90">
					<input id="mainLoginPopPw" class="col-xs-w100" type="password" placeholder="비밀번호를 입력해주세요"/>
				</div>
			</div>
			<div class="col-xs-w100" style="border-top:1px gray solid; height:40px;">
			</div>
		</div>
	</div>



	<script type="text/javascript" src="/plugins/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="/js/main.js"></script>
	<script type="text/javascript" src="/js/table.js"></script>
</body>

</html>
 