<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<section class="loginContainer">
	<div id="loginTitle" class="loginContents">
		<h1>회원가입</h1>
	</div>
	<div id="loginContent" class="loginContents">
		<div id="loginContentBody" class="col-sm-8 loginContentsArea" >
			<div class="col-sm-12 m-b-20">
				<input id="loginNewId" class="col-sm-12 form-control" type="email" placeholder="아이디를 입력해주세요"/>
			</div>
			<div class="col-sm-12 m-b-20">
				<input id="loginNewPw" class="col-sm-12 form-control" type="password" placeholder="비밀번호를 입력해주세요"/>
			</div>
			<div class="col-sm-12 m-b-20">
				<input id="loginNewPwConfirm" class="col-sm-12 form-control" type="text" placeholder="비밀번호 확인"/>
			</div>			
			<div class="col-sm-12 m-b-20">
				<input id="loginNewName" class="col-sm-12 form-control" type="text" placeholder="이름 입력해주세요"/>
			</div>
			
			<div class="col-sm-12 m-b-20">
				<a id="loginNew" class="btn btn-outline-success btn-sm" >가입</a>
				<a id="loginNewCancel" class="btn btn-outline-success btn-sm">돌아가기</a>
			</div>
		</div>
	</div>
</section>

<script src="/js/views/login/loginNew.js"></script>