<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<section class="login" >
	<div id="loginTitle" class="loginChild">
		<h1>회원가입</h1>
	</div>
	<div id="loginContent" class="loginChild">
		<div id="loginContentBody">
			<div class="col-xs-12">
				<input id="loginInsertIdInput" class="loginInputTotal" type="text" placeholder="아이디를 입력해주세요"/>
			</div>
			<div class="col-xs-12">
				<input id="loginInsertPwInput" class="loginInputTotal" type="password" placeholder="비밀번호를 입력해주세요"/>
			</div>
			<div class="col-xs-12">
				<input id="loginInsertPwConfirmInput" class="loginInputTotal" type="password" placeholder="비밀번호를 입력해주세요"/>
			</div>
			<div class="col-xs-12">
			</div>
			<div class="col-xs-12">
				<input id="loginInsertNameInput" class="loginInputTotal" type="text" placeholder="이름을 입력해주세요"/>
			</div>
			<div class="col-xs-12 m-b-20">
				<button class="col-xs-5 btn btn-default" id="loginInsertMale">남자</button>
				<button class="col-xs-5 btn btn-default" id="loginInsertFemale">여자</button>
			</div>
			<div class="col-xs-12">
				<button id="loginInsertSubmit" >가입하기</button>
				<button id="loginInsertCancel">돌아가기</button>
			</div>
		</div>
	</div>
</section>

<script src="/js/views/login/loginInsert.js"></script>