(function loginInsertJs(){
	
	var loginData = {};
	var gender;
	
	$('#loginInsertMale').click(function(){
		gender = "male";
		$('#loginInsertFemale').removeClass('genderSelect');
		$(this).addClass('genderSelect');
	});
	$('#loginInsertFemale').click(function(){
		gender = "female";
		$('#loginInsertMale').removeClass('genderSelect');
		$(this).addClass('genderSelect');
	})
	
	function clickLoginInsertBtn(){
		
		loginData = {
				id 		: $('#loginInsertIdInput').val().trim(),
				pw 		: $('#loginInsertPwInput').val().trim(),
				name 	: $('#loginInsertNameInput').val().trim(),
				gender	: gender
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
	
	function loginValidation(){
		
		if(loginData.id != undefined && loginData.id == ''){
			alert('아이디를 입력해주세요');
			return false;
		}else if(loginData.pw !== undefined && loginData.pw == ''){
			alert('비밀번호를 입력해주세요');
			return false;
		}else if(loginData.pw != loginData.pwConfirm){
			alert('동일한 비밀번호를 입력해주세요');
			return false;
		}else if(loginData.name !== undefined && loginData.name == ''){
			alert('이름을 입력해주세요');
			return false;
		}else if(loginData.gender !== undefined && loginData.gender == ''){
			alert('성별을 선택해주세요');
			return false;
		}
		
		
		//유효성검사
	}
	
	//가입하기
	$('#loginInsertSubmit').click(function(){
		
		loginData = {
				id 			: $('#loginInsertIdInput').val(),
				pw 			: $('#loginInsertPwInput').val(),
				pwConfirm	: $('#loginInsertPwConfirmInput').val(),
				name 		: $('#loginInsertNameInput').val(),
				gender		: gender
		};

		loginValidation();
		
  $.ajax({
	  url		: "/login/loginInsert",
	  data 		: loginData,
	  success	: function(result){
		  if(result.YN == 'SUCCESS'){
			  alert(result.MSG);
			  returnLoginPg();
		  }else if(result.YN == 'DUPLICATION'){
			  alert(result.MSG);
			  $('#loginInsertIdInput').focus();
		  }else if(result.YN == 'FAIL'){
			  console.log("LOGININSERT ERROR");
		  }
	  }
  })
	})
	
	//돌아가기
	$('#loginInsertCancel').click(function(){
		
		  $.ajax({
			  url		: "/login/loadingLoginPg",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	})
	
	function returnLoginPg(){
		  $.ajax({
			  url		: "/login/loadingLoginPg",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	}
	
})();