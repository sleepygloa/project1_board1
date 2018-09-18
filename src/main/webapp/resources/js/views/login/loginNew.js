var LoginNewJs = function(){
	"use strict";
	
	return {
		init : function (){
			
			getEvents();
			
		}
	}
	
	function getEvents(){
		
		//정규식 
		$('#loginNewId').on('keydown', function(){
			var data = $(this).val();
		});
		
		$('#loginNewPw').on('keydown', function(){
			var data = $(this).val();
		});
		
		$('#loginNewPwConfirm').on('keydown', function(){
			var data = $(this).val();
		});
		
		$('#loginNewName').on('keydown', function(){
			var data = $(this).val();
		});
		
		//가입하기
		$('#loginNew').click(function(){
			
			var sendData = {
				id 			: $('#loginNewId').val(),
				pw 			: $('#loginNewPw').val(),
				pwConfirm	: $('#loginNewPwConfirm').val(),
				name 		: $('#loginNewName').val(),
			};

			if(!validation(sendData)){
				return false;
			};
			
			$.ajax({
				url			: "/login/loginInsert",
				data 		: sendData,
				success		: function(result){
					if(result.YN == 'SUCCESS'){
						alert(result.MSG);
						window.location.href='/';
					}else if(result.YN == 'DUPLICATION'){
						alert(result.MSG);
						$('#loginNewId').focus();
					}else if(result.YN == 'FAIL'){ 
					}
				}
			})
		})
		
		$('#loginNewCancel').click(function(){
			window.location.href='/';
		})
	}
	
	function clickLoginInsertBtn(){
		
		loginData = {
				id 		: $('#loginNewId').val().trim(),
				pw 		: $('#loginNewPw').val().trim(),
				name 	: $('#loginNewName').val().trim(),
		};
		
		loginValidation();
		
		$.ajax({
			url	: "/login/loginUser",
			dataType : 'JSON',
			success : function(result){
				alert(result.name + '님! 반갑습니다');
			}
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
		if(data.pw != data.pwConfirm){
			alert('동일한 비밀번호를 입력해주세요');
			return false;
		}
		if(data.name == ''){
			alert('이름을 입력해주세요');
			return false;
		}
	}
}();

$(document).ready(function(){
	LoginNewJs.init();
});
