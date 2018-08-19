<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<section class="login">
	<div id="loginTitle" class="loginChild">
		<h1>회원가입</h1>
	</div>
	<div id="loginContent" class="loginChild" style="background:gray">
		<div id="loginContentBody" style="background:green">
			<div class="col-xs-12">
				<input id="loginIdInput" class="loginInputTotal" type="text" placeholder="아이디를 입력해주세요"/>
			</div>
			<div class="col-xs-12 m-b-20">
				<input id="loginPwInput" class="loginInputTotal" type="password" placeholder="비밀번호를 입력해주세요"/>
			</div>
			<div class="col-xs-12">
				<button id="loginSubmit" >로그인</button>
				<button id="loginRegist" >간단 회원가입</button>
				<button id="loginCancel">메인으로</button>
			</div>
		</div>
	</div>
</section>

<script src="/resources/js/views/login/login.js"></script>