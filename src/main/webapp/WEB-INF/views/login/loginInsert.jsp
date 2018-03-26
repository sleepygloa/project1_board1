<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">


<section class="login col-xs-12" >
	<div id="loginTitle" class="loginChild">
		<h1>회원가입</h1>
	</div>
	<div id="loginContent" class="loginChild">
		<div id="loginContentBody">
			<div class="col-xs-12">
				<label class="loginLabel col-xs-2">ID
				</label>
				<input id="loginInsertIdInput" class="loginInput col-xs-10" type="text" /> 
			</div>
			<div class="col-xs-12">
				<label class="loginLabel">PW
				</label>
				<input id="loginInsertPwInput" class="loginInput" type="password" />
			</div>
			<div class="col-xs-12">
				<label class="loginLabel">NAME
				</label>
				<input id="loginInsertNameInput" class="loginInput" type="text" />
			</div>
			<div class="col-xs-12">
				<label class="loginLabel">EMAIL
				</label>
				<input id="loginInsertEmailInput" class="loginInput" type="text" />
			</div>
			<div class="col-xs-12">
				<button id="loginInsertSubmit" >가입하기</button>
				<button id="loginInsertCancel">돌아가기</button>
			</div>
		</div>
	</div>
</section>

<script src="/js/views/login/loginInsert.js"></script>