<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<section class="login">
	<div id="loginTitle" class="loginChild">
		<h1>회원가입</h1>
	</div>
	<div id="loginContent" class="loginChild">
		<div id="loginContentBody">
			<div class="col-xs-12">
				<label class="loginLabel col-xs-2">ID
				</label>
				<input id="loginIdInput" class="loginInput col-xs-10" type="text" /> 
			</div>
			<div class="col-xs-12">
				<label class="loginLabel">PW
				</label>
				<input id="loginPwInput" class="loginInput" type="text" />
			</div>
			<div class="col-xs-12">
				<button id="loginSubmit" >로그인</button>
				<button id="loginRegist" >간단 회원가입</button>
				<button id="loginCancel">메인으로</button>
			</div>
		</div>
	</div>
</section>

<script src="/js/views/login/login.js"></script>