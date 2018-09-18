var loginJs = function() {
	"use strict";
	
	var loginData = {};
	
	return {
		init : function(){
			
			getEvents();
			
		}
	}
	
	function getEvents(){
		//로그인하기
		$('#login').click(function(){
			loginData = {
					id : $('#loginId').val(),
					pw : $('#loginPw').val()
			};
			
			if(!loginValidation()){
				return false;
			};
			
			$.ajax({
				url		 : "/login/loginUser",
				data	 : loginData,
				dataType : 'JSON',
				success  : function(result){
					alert(result.MSG);
					if(result.YN == 'SUCCESS'){
						window.location.href='/';
					}
				}
			})
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
	
	function loginValidation(){
		
		if(loginData.id == ''){
			alert('아이디를 입력해주세요');
			return false;
		}else if(loginData.pw == ''){
			alert('비밀번호를 입력해주세요');
			return false;
		}
	}
	
	
}();

$(document).ready(function(){
	loginJs.init();
})