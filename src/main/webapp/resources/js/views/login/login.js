(function loginJs(){
	
	var loginData = {};
	
	//로그인하기
	$('#loginSubmit').click(function(){
		loginData = {
				id : $('#loginIdInput').val(),
				pw : $('#loginPwInput').val()
		};
		
		loginValidation();
		
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
	})
	
	function loginValidation(){
		
		if(loginData.id == ''){
			alert('아이디를 입력해주세요');
			return false;
		}else if(loginData.pw == ''){
			alert('비밀번호를 입력해주세요');
			return false;
		}
	}
	
	$('#loginRegist').click(function(){
		  $.ajax({
			  url		: "/login/loadingLoginInsertPg",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	})
	
})();