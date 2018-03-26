(function loginJs(){
	
	var loginData = {};
	
	function clickLoginInsertBtn(){
		loginData = {
				id 		: $('#loginInsertIdInput').val().trim(),
				pw 		: $('#loginInsertPwInput').val().trim(),
				name 	: $('#loginInsertNameInput').val().trim(),
				email 	: $('#loginInsertEmailInput').val().trim()
		};
		
		loginValidation();
		
		$.ajax({
			url	: "/loginUser",
			dataType : 'JSON',
			success : function(result){
				alert(result.name + '님! 반갑습니다');
			}
		})
	}
	
	function loginValidation(){
		
		if(loginData.id != undefined && loginData.id == ''){
			alert('아이디를 입력해주세요');
			return false;
		}else if(loginData.pw !== undefined && loginData.pw == ''){
			alert('비밀번호를 입력해주세요');
			return false;
		}else if(loginData.name !== undefined && loginData.name == ''){
			alert('이름을 입력해주세요');
			return false;
		}else if(loginData.email !== undefined && loginData.email == ''){
			alert('이메일을 입력해주세요');
			return false;
		}
		
		
		//유효성검사
	}
	
	//가입하기
	$('#loginInsertSubmit').click(function(){
		  $.ajax({
			  url		: "/loginInsert",
			  data 		: loginData,
			  success	: function(result){
				  if(result.YN == "SUCCESS"){
					  alert(result.MSG);
					  returnLoginPg();
				  }else if(result.YN == "DUPLICATION"){
					  alert(result.MSG);
					  $('#loginInsertIdInput').focus();
				  }else{
					  console.log("LOGININSERT ERROR");
				  }
			  }
		  })
	})
	
	//돌아가기
	$('#loginInsertCancel').click(function(){
		  $.ajax({
			  url		: "/loadingLoginPg",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	})
	
	function returnLoginPg(){
		  $.ajax({
			  url		: "/loadingLoginPg",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	}
	
})();