var loginJs = function() {
	"use strict";
	
	var proCd = '';
	var proNm = 'login';
	
	return {
		init : function(){
			
			getEvents();
			
		}
	}
	
	function getEvents(){
		
		$('#loginId').focus();
		
		$('#loginPw').keydown(function(e){
			if (e.keyCode == 13){
				login();
			}
		});
		
		//로그인하기
		$('#login').click(function(){
			login();
		});
		
		
		$('#loginNew').click(function(){
			  $.ajax({
				  url		: "/login/loadingLoginInsertPg",
				  success	: function(data){
						$('#content_wrapper').empty();
						$('#content_wrapper').html(data);
				  }
			  })
		})
	}
	
	function validation(data){
		
		if(data.id == ''){
			alert('아이디를 입력해주세요');
			return false;
		}
		if(data.pw == ''){
			alert('비밀번호를 입력해주세요');
			return false;
		}
		return true;
	}
	
	function login(){
		var data = {
				id : $('#loginId').val(),
				pw : $('#loginPw').val()
		};

		if(!validation(data)){
			return false;
		};
		
		$.ajax({
			url		 : "/login/loginUser",
			data	 : data,
			dataType : 'JSON',
			success  : function(result){
				if(result.MSGCD == '100'){
					alert(result.MSGNM);
					window.location.href='/';
				}else{
					
					if(result.MSGCD == '201'){
						alert(result.MSGNM);
						$('#loginId').focus();
						return false;
					}else if(result.MSGCD == '202'){
						alert(result.MSGNM);
						$('#loginPw').focus();
						return false;
					}
				}
			}
		})
	}
	
}();

$(document).ready(function(){
	loginJs.init();
})