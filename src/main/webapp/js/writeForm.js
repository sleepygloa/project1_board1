$(function(){
	$("#form").validate({
	 	rules:{
			writer:{
				required:true,
				minlength:2,
				maxlength:6,
				adminCheck:true,
				wcCheck:true
			},
			passwd:{
				required:true,
				minlength:6,
				maxlength:16,
				passwdCheck : true
			},
			email:{
				required:true,
				minlength:5,
				maxlength:20,
				emailCheck:true
				
			},
			subject:{
				required:true,
				maxlength:50,
			},
		},
		messages:{
			writer:{
				required:"필수정보입니다.",
				minlength:"2자~6자로 구성된 작성자이름을 작성해주세요",
				maxlength:"6자 이상으로 입력하셨습니다. 2자~6자로 구성된 작성자이름을 작성해주세요",
				adminCheck:"관리자아이디는 사용하실 수 없습니다.",
				wcCheck:"특수기호는 사용하실수 없습니다."
			},
			passwd:{
				required:"필수정보입니다.",
				minlength:"6자 ~ 16자로 구성된 비밀번호를 입력해주세요",
				maxlength:"6자 ~ 16자로 구성된 비밀번호를 입력해주세요",
				passwdCheck:"비밀번호는 특수문자, 대소문자, 숫자 포함하여 6~16자리로 입력해주세요 "
			},
			email:{
				required:"필수정보입니다.",
				minlength:"",
				maxlength:"",
				emailCheck:"5~20자의 영문 대 소문자, 숫자, 특수기호(-), (_)만 사용 가능합니다."
			},
			subject:{
				required:"필수정보입니다",
				maxlength:"50자 이내로 제목을 작성해주세요"
			}
		}
});
//writercheck 유효성검사 추가
//admin 아이디사용하는지 체크

    $('input').blur(function() {
        if( !$(this).valid() ) $(this).next('label.error').show();                
    });

jQuery.validator.addMethod('adminCheck', function(a, adminCheck){
	var writer = $('#writer').val();
    if ( writer.indexOf('admin') != -1  ||  writer.indexOf('관리자') != -1 ) {
        return false;
    }else{
    }
	return true;
},'');
jQuery.validator.addMethod('wcCheck', function(a, wcCheck){
	var writer = $('#writer').val();
	var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    if ( reg.test(writer) ) {
        return false;
    }else{
    }
	return true;
},'');
//passwd 유효성검사 추가
jQuery.validator.addMethod('passwdCheck',function(a, passwdCheck){
	var pass = $('#passwd').val();
	var reg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?])*.{6,16}$/i;
    if ( !reg.test(pass) ) {
        return false;
    }
	return true;
},''); 

//email 유효성검사 추가
jQuery.validator.addMethod('emailCheck',function(a, emailCheck){
	var email = $('#email').val();
	/* 이메일 입력 정규식 */
	var reg = /^[0-9a-zA-Z]([-_\.-_]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if ( !reg.test(email) ) {
        return false;
    }
	return true;
},''); 
//내용 글자 수 카운터
$(function() {
    $('#content').keyup(function (e){
        var content = $(this).val();
        $('#counter').html(content.length + '/1000');
         if(content.length > 1000){
        	var limitContent = content.substring(0,1000);
        	
        	document.getElementById('content').value = limitContent;
        } 
    });
     $('#content').keyup(); 
    
});
setInterval(
		function(){
		    var writer = $('#writer').val();
		    if(writer.length >= 2){
		    	var str = $('#writer').siblings('label').text();
		    	if(str.length > 0){
		    		$('#writerSucc').css('display', 'none');
		    	}else{
		    		
		    		$('#writerSucc').css('display', 'block');
		    	}
		    }
		}, 500);
    
});