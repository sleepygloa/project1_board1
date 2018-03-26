var BlogWriteApp = function(){
	"use strict";
	
	var gfv_count = 1;
	// 검증에 사용할 함수명들을 배열에 담아준다.
	var writerFuncArray = ["nuCheck","length210","adminCheck","trim"];
	var writerErrorArray = [
		"필수 입력란 입니다. 작성자 이름을 입력해주세요", 
		"2~10자인 영문, 한글을 포함한 작성자이름으로 작성해주세요",
		"관리자 이름을 사용하실 수 없습니다.",
		"공백만있는 이름은 사용하실 수 없습니다. 이름을 입력해주세요"];
	var passwdFuncArray = ["spaceCheck","length0616","alphabetCheck","numberCheck","gihoCheck", "trim"];
	var passErrorArray = [
		"필수 입력란 입니다. 비밀번호를 입력해주세요", 
		"6~16자 영문자, 숫자, 특수문자를 사용하세요.",
		"영문, 숫자, 특수문자는 필수사항입니다. 영문자를 입력해주세요.",
		"영문, 숫자, 특수문자는 필수사항입니다. 숫자를 입력해주세요.",
		"영문, 숫자, 특수문자는 필수사항입니다. 특수문자를 입력해주세요.", 
		"공백으로된 비밀번호는 사용하실수 없습니다. 형식에 맞게 비밀번호를 입력해주세요. ex) qwer1234!"];
	var titleFuncArray = ["nuCheck", "length1100", "trim"];
	var titleErrorArray = [
		"필수 입력란 입니다. 제목을 입력해주세요",
		"제목을 100자 이내로 작성해주세요", 
		"제목에 글이 포함되어있지 않습니다. (공백만으로는 제목을 작성하실수 없습니다.)"];
	var contentFuncArray = ["nuCheck", "length1000", "trim"];
	var contentErrorArray = [
		"필수 입력란 입니다. 내용을 입력해주세요", 
		"1000자 이상으로 작성하실수 없습니다.", 
		"내용에 글이 포함되어있지 않습니다. (공백만으로는 내용을 작성하실수 없습니다.)"];
	
	return {
		init : function(){
			
			//사용자 이벤트
			blogWriteEvent();
			
		}
	}
	
	function blogWriteEvent(){
		$("#list").on("click", function(e){ //목록으로 버튼
			e.preventDefault();
			fn_openBoard();
		});
		
		$("#write").on("click", function(e){ //작성하기 버튼
			e.preventDefault();
			frmCheck('insert');
			fn_insertBoard();
		});
		
		$("#addFile").on("click", function(e){ //파일 추가 버튼
			e.preventDefault();
			fn_addFile();
		});
		
		$("a[name='delete']").on("click", function(e){ //삭제 버튼
			e.preventDefault();
			fn_deleteFile($(this));
		});
		
		
		//내용 글자 수 카운터
		$(document).on('keyup', '#blogWriteContent', function(e){
		    var content = $(this).val();
		    $(this).empty();
		    console.log(content);
		    $('#blogWriteCount').html(content.length + '/1000');
		     if(content.length > 1000){
		    	var limitContent = content.substring(0,1000);
		    	document.getElementById('blogWriteCount').value = limitContent;
		    } 
		});
		//붙여넣기
		$('#blogWriteContent').bind('input paste', function(){
			$(this).trigger('keyup');
		})
	};
	
	function fn_openBoard(){
		var comSubmit = new ComSubmit();
		comSubmit.setUrl("/board/blog.do");
		comSubmit.submit();
	}

	function fn_insertBoard(){
		var comSubmit = new ComSubmit("frm");
		comSubmit.setUrl("/board/blogWriteInsert.do");
		comSubmit.submit();
	}

	function fn_addFile(){
		var str = "<p>" +
				"<input type='file' name='file_"+(gfv_count++)+"' style='display:inline-block'>" +
				"<a href='#this' name='delete'>삭제</a></p>";
		$("#fileDiv").append(str);
		$("a[name='delete']").on("click", function(e){ //삭제 버튼
			e.preventDefault();
			fn_deleteFile($(this));
		});
	}

	function fn_deleteFile(obj){
		obj.parent().remove();
	}
	
	//영문만 입력받도록 검증
	function adminCheck(valuedationStr){
		if(valuedationStr.indexOf('admin') != -1  ||  valuedationStr.indexOf('관리자') != -1){
			return false;
		}
		return true;
	}

	// 영문만 입력받도록 검증
	function isAlphabetForSpan(valuedationStr){
		var check = /[^A-Za-z\s]/;
		if(check.test(valuedationStr)){
			return false;
		}
		return true;
	}

	// 공백을 아예 허용하지 않도록 검증
	function spaceCheck(inputVal){
		var invalid = " ";
		
		if(inputVal.indexOf(invalid) > -1){
			return false;
		}else if(inputVal.length < 1){
			return false;
		}else{
			return true;
		}
	}	

	//숫자
	function alphabetCheck(valuedationStr){
	    var pattern1 = /[a-zA-Z]/;
	    
	    if(!pattern1.test(valuedationStr)){
	        return false;
	    }
	    return true;
	}

	// 숫자
	function numberCheck(valuedationStr){
	    var pattern2 = /[0-9]/;
	    
	    if(!pattern2.test(valuedationStr)){
	        return false;
	    }
	    return true;
	}

	//특수기호
	function gihoCheck(valuedationStr){
	    var pattern3 = /[`~!@\#$%<>^&*]/;
	    if(!pattern3.test(valuedationStr)){
	        return false;
	    }
	    return true;
	}

	//공백체크
	function nuCheck(valuedationStr){
	    if(valuedationStr.length < 1){
	        return false;
	    }
	    return true;
	}

	//길이 2~10
	function length210(valuedationStr){
	    if( valuedationStr.length < 2 || valuedationStr.length > 10 ){
	    	if(valuedationStr.length > 10){
	        	var limitContent = valuedationStr.substring(0,10);
	        	document.getElementById('blogWriteWriter').value = limitContent;
	    	}
	        return false;
	    }
	    return true;
	}

	//길이 6~8
	function length0616(valuedationStr){
	    
	    if(valuedationStr.length < 6 || valuedationStr.length > 16 ){
	    	if(valuedationStr.length > 16){
	        	var limitContent = valuedationStr.substring(0,16);
	        	document.getElementById('blogWritePasswd').value = limitContent;
	    	}
	        return false;
	    }
	    return true;
	}

	//길이 1~100
	function length1100(valuedationStr){
	    
	    if(valuedationStr.length > 100 ){
	    	var limitContent = valuedationStr.substring(0,100);
	    	document.getElementById('blogWriteTitle').value = limitContent;
	        return false;
	    }
	    return true;
	}

	//길이 1~1000
	function length1000(valuedationStr){
	    
	    if(valuedationStr.length > 1000 ){
	        return false;
	    }
	    return true;
	}

	//공백제거 후 문자열 있는지 파악
	function trim(valuedationStr){
		var valuedationStr1 = $.trim(valuedationStr);
	    if(valuedationStr1.length < 1 ){
	        return false;
	    }
	    
	    return true;
	}
	
	//submit 시 유효성 검사 항목을 한번 확인하며, true 시 전송, false 시 그 항목을 나타냄
	function frmCheck(check){
		var userWriter = document.frm.WRITER.value;
		if(check == "insert"){
			var userPasswd = document.frm.PASSWD.value;
		}
		var userTitle = document.frm.TITLE.value;
		var userContent = document.frm.CONTENT.value;
		
		for(var i=0; i<userWriter.length; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
			userWriter = userWriter.replace(" ","");
		}
		if(check == "insert"){
			for(var i=0; i<userPasswd.length; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
				userPasswd = userPasswd.replace(" ","");
			}
		}
		for(var i=0; i<100; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
			userTitle = userTitle.replace(" ","");
		}
		for(var i=0; i<100; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
			userContent = userContent.replace(" ","");
		}
		
		if(userWriter == ""){ // 내용이 작성되어 있는 경우 submit() 한다. 
			$('#blogWriteWriter').focus();
			return false;
		 }else if(userPasswd == ""){ // 작성 된 내용이 하나도 없을 경우 안내 메세지 창 출력
			$('#blogWritePasswd').focus();
			return false;
		 }else if(userTitle == ""){
			$('#blogWriteTitle').focus();
			return false;
		 }else if(userContent == ""){
			$('#blogWriteContent').focus();
			return false;
		 }else{
		 	return formsubmit(check);
		 }



		function formsubmit(check){
			//변수설정
			var writer = $('#blogWriteWriter').val();
			if(check == "insert"){
				var passwd = $('#blogWritePasswd').val();
			}
			var title = $('#blogWriteTitle').val();
			var content = $('#blogWriteContent').val();
			
			//작성자 검사
			if(!length210(writer)){
				$('#blogWriteWriter').focus();
				return false;
			}
			if(!adminCheck(writer)){
				$('#blogWriteWriter').focus();
				return false;
			}
			if(!trim(writer)){
				$('#blogWriteWriter').focus();
				return false;
			}
			
			//비밀번호 검사
			if(check == "insert"){
				if(!spaceCheck(passwd)){
					$('#blogWritePasswd').focus();
					return false;
				}
				if(!length0616(passwd)){
					$('#blogWritePasswd').focus();
					return false;
				}
				if(!alphabetCheck(passwd)){
					$('#blogWritePasswd').focus();
					return false;
				}
				if(!numberCheck(passwd)){
					$('#blogWritePasswd').focus();
					return false;
				}
				if(!gihoCheck(passwd)){
					$('#blogWritePasswd').focus();
					return false;
				}
				if(!trim(passwd)){
					$('#blogWritePasswd').focus();
					return false;
				}
			}
		
			//제목검사
			if(!nuCheck(title)){
				$('#blogWriteTitle').focus();
				return false;
			}
			if(!length1100(title)){
				$('#blogWriteTitle').focus();
				return false;
			}
			if(!trim(title)){
				$('#blogWriteTitle').focus();
				return false;
			}
			
			//내용검사
			if(!nuCheck(content)){
				$('#blogWriteContent').focus();
				return false;
			}
			if(!length1000(content)){
				$('#blogWriteContent').focus();
				return false;
			}	
			if(!trim(content)){
				$('#blogWriteContent').focus();
				return false;
			}
		}

	}
	
	// 1. span태그 obj, 2. input태그 obj, 3. 위에서 정의한 함수명 배열, 4. 검증에 걸렸을 때 나타날 텍스트, 5. 검증을 통과했을 때 나타날 텍스트, 6. span태그의 좌측 폭 위치.
	validation($("#writerspan"), $("#blogWriteWriter"), writerFuncArray, writerErrorArray, "멋진 이름입니다!", "15px");
	validation($("#passwdspan"), $("#blogWritePasswd"), passwdFuncArray, passErrorArray, "사용 가능한 비밀번호입니다. ", "15px");
	validation($("#titlespan"), $("#blogWriteTitle"), titleFuncArray, titleErrorArray, "", "15px");
	validation($("#contentspan"), $("#blogWriteContent"), contentFuncArray, contentErrorArray, "", "15px");

	//유효성검사시작
	function validation(spanObj, inputObj, validFuncArray, errorMsg, greenMsg, marginLeftPx){
	spanObj.css("margin-left", marginLeftPx); // span태그의 좌측 폭을 설정해준다.
	
	//초기화
	var confirmCheck = false; // 검증에 통과 여부에 사용할 flag
	spanObj.hide(); // span태그를 숨긴다.
	var regMsg = "";
	
	inputObj.bind('focusin keyup', function(){ // input태그에 포커스가 들어오거나 키가 눌렸을 때 실행됨
		var inputValue = inputObj.val();
		
		var funcResult = true; // 함수 실행 결과를 담을 flag
		
		for(i=0; i<validFuncArray.length; i++){ // 검증에 사용할 함수명 배열을 반복문으로 돌린다.
			var funcName = validFuncArray[i]; // 배열에서 함수명을 하나씩 뽑아낸다. 
			var funcObj = window[funcName]; // 함수명(string)을 객체(object)로 받는다.
			funcResult = funcObj(inputValue); // 해당 함수를 실행하여 결과값(true/false)을 변수에 담는다. 만약 함수 하나라도 통과를 하지 못하면 false가 된다.
			if(!funcResult){ // 검증에 통과하지 못한 함수가 있을 경우 반복문 탈출
				redMsg = errorMsg[i];
				break;
			}
		}
		
		if(!funcResult){ // 검증에 통과하지 못했을 때,
			spanObj.show(); // span태그 보여준다.
			spanObj.removeClass('greenText'); // span태그에 greenText 클래스를 삭제한다.
			spanObj.addClass('redText'); // span태그에 redText 클래스를 추가한다.
			
			spanObj.text(""); //  span태그의 텍스트를 지운다.
			spanObj.append(redMsg); // span태그에  검증에 통과하지 못했을 때 나타나는 텍스트를 넣는다.
			
			confirmCheck = false; // 검증 통과 여부 flag에 false를 대입한다.
		}else{ // 검증에 통과했을 때,
			spanObj.show();
			spanObj.removeClass('redText');
			spanObj.addClass('greenText');
			
			spanObj.text("");
			spanObj.append(greenMsg);
			
			confirmCheck = true;
		}
		
	});
	
	// 마우스 붙여넣기 시 실행
	inputObj.bind('input paste', function(){
		$(this).trigger('keyup');
	})
	// 포커스가 input태그에서 벗어났을 때 실행, 처리결과에 대한 문구 표시여부
	inputObj.focusout(function(){ 
		var inputValue = inputObj.val();
		if(confirmCheck || inputValue == ""){ // 검증에 통과를 했거나 input태그에 입력 값이 없을 경우,
			spanObj.hide(); // span태그를 숨긴다.
		}
	});
}
	
}();

$(document).ready(function(){
	BlogWriteApp.init();
})


