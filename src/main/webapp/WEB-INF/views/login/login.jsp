<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<section class="loginContainer">
	<div id="loginTitle" class="loginContents">
		<h1>회원가입</h1>
	</div>
	<div id="loginContent" class="loginContents">
		<div id="loginContentBody" class="col-sm-8 loginContentsArea" >
			<div class="col-sm-12 m-b-20">
				<input id="loginId" class="col-sm-12 form-control" type="text" placeholder="아이디를 입력해주세요"/>
			</div>
			<div class="col-sm-12 m-b-20">
				<input id="loginPw" class="col-sm-12 form-control" type="password" placeholder="비밀번호를 입력해주세요"/>
			</div>
			<div class="col-sm-12 m-b-20">
				<a id="login" class="btn btn-outline-success btn-sm" >로그인</a>
				<a id="loginNew" class="btn btn-outline-success btn-sm">간단 회원가입</a>
				<a href="/" id="loginCancel" class="btn btn-outline-success btn-sm">메인으로</a>
			</div>
		</div>
	</div>
</section>

<script src="/resources/js/views/login/login.js"></script>