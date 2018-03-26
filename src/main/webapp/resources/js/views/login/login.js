(function loginJs(){
	function clickBtnRegist(){
		var data = {
				id : $('#loginIdInput').val().trim(),
				pw : $('#loginPwInput').val().trim()
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
		var id = $('#loginIdInput').val();
		var pw = $('#loginPwInput').val();
		
		if(id == ''){
			alert('아이디를 입력해주세요');
			return false;
		}else if(pw == ''){
			alert('비밀번호를 입력해주세요');
			return false;
		}
	}
	
	$('#loginRegist').click(function(){
		  $.ajax({
			  url		: "/loadingLoginInsertPg",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	})
	
})();