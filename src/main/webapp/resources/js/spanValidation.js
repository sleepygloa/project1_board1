//content 영역 글자수 세기 및 붙여넣기시 적용
$(document).ready(function(){
	//내용 글자 수 카운터
	$('#content').keyup(function (e){
	    var content = $(this).val();
	    $('#counter').html(content.length + '/1000');
	     if(content.length > 1000){
	    	var limitContent = content.substring(0,1000);
	    	document.getElementById('content').value = limitContent;
	    } 
	});
	//붙여넣기
	$('#content').bind('input paste', function(){
		$(this).trigger('keyup');
	})
});

//글쓰기 영역 유효성 검사
$(document).ready(function(){
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
	var subjectFuncArray = ["nuCheck", "length1100", "trim"];
	var subjectErrorArray = [
		"필수 입력란 입니다. 제목을 입력해주세요",
		"제목을 100자 이내로 작성해주세요", 
		"제목에 글이 포함되어있지 않습니다. (공백만으로는 제목을 작성하실수 없습니다.)"];
	var contentFuncArray = ["nuCheck", "length1000", "trim"];
	var contentErrorArray = [
		"필수 입력란 입니다. 내용을 입력해주세요", 
		"1000자 이상으로 작성하실수 없습니다.", 
		"내용에 글이 포함되어있지 않습니다. (공백만으로는 내용을 작성하실수 없습니다.)"];
	
	// 1. span태그 obj, 2. input태그 obj, 3. 위에서 정의한 함수명 배열, 4. 검증에 걸렸을 때 나타날 텍스트, 5. 검증을 통과했을 때 나타날 텍스트, 6. span태그의 좌측 폭 위치.
	validation($("#writerspan"), $("#writer"), writerFuncArray, writerErrorArray, "멋진 이름입니다!", "15px");
	validation($("#passwdspan"), $("#passwd"), passwdFuncArray, passErrorArray, "사용 가능한 비밀번호입니다. ", "15px");
	validation($("#subjectspan"), $("#subject"), subjectFuncArray, subjectErrorArray, "", "15px");
	validation($("#contentspan"), $("#content"), contentFuncArray, contentErrorArray, "", "15px");

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
	
});
/////////////////////////////////////////////////////////////////////////////////////////////
//영문만 입력받도록 검증
function adminCheck(str){
	if(str.indexOf('admin') != -1  ||  str.indexOf('관리자') != -1){
		return false;
	}
	return true;
}

// 영문만 입력받도록 검증
function isAlphabetForSpan(str){
	var check = /[^A-Za-z\s]/;
	if(check.test(str)){
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
function alphabetCheck(str){
    var pattern1 = /[a-zA-Z]/;
    
    if(!pattern1.test(str)){
        return false;
    }
    return true;
}

// 숫자
function numberCheck(str){
    var pattern2 = /[0-9]/;
    
    if(!pattern2.test(str)){
        return false;
    }
    return true;
}

//특수기호
function gihoCheck(str){
    var pattern3 = /[`~!@\#$%<>^&*]/;
    if(!pattern3.test(str)){
        return false;
    }
    return true;
}

//공백체크
function nuCheck(str){
    if(str.length < 1){
        return false;
    }
    return true;
}

//길이 2~10
function length210(str){
    if( str.length < 2 || str.length > 10 ){
    	if(str.length > 10){
        	var limitContent = str.substring(0,10);
        	document.getElementById('writer').value = limitContent;
    	}
        return false;
    }
    return true;
}

//길이 6~8
function length0616(str){
    
    if(str.length < 6 || str.length > 16 ){
    	if(str.length > 16){
        	var limitContent = str.substring(0,16);
        	document.getElementById('passwd').value = limitContent;
    	}
        return false;
    }
    return true;
}

//길이 1~100
function length1100(str){
    
    if(str.length > 100 ){
    	var limitContent = str.substring(0,100);
    	document.getElementById('subject').value = limitContent;
        return false;
    }
    return true;
}

//길이 1~1000
function length1000(str){
    
    if(str.length > 1000 ){
        return false;
    }
    return true;
}

//공백제거 후 문자열 있는지 파악
function trim(str){
	var str1 = $.trim(str);
    if(str1.length < 1 ){
        return false;
    }
    
    return true;
}
   
//submit 시 유효성 검사 항목을 한번 확인하며, true 시 전송, false 시 그 항목을 나타냄
function frmCheck(check)
{
var userWriter = document.form.writer.value;
if(check == "insert"){
	var userPasswd = document.form.passwd.value;
}
var userSubject = document.form.subject.value;
var userContent = document.form.content.value;

for(var i=0; i<userWriter.length; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
	userWriter = userWriter.replace(" ","");
}
if(check == "insert"){
	for(var i=0; i<userPasswd.length; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
		userPasswd = userPasswd.replace(" ","");
	}
}
for(var i=0; i<100; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
	userSubject = userSubject.replace(" ","");
}
for(var i=0; i<100; i++){ // 값이 들어간 길이 만큼 제목과 본문의 공백을 제거
	userContent = userContent.replace(" ","");
}

if(userWriter == ""){ // 내용이 작성되어 있는 경우 submit() 한다. 
	$('#writer').focus();
	return false;
 }else if(userPasswd == ""){ // 작성 된 내용이 하나도 없을 경우 안내 메세지 창 출력
	$('#passwd').focus();
	return false;
 }else if(userSubject == ""){
	$('#subject').focus();
	return false;
 }else if(userContent == ""){
	$('#content').focus();
	return false;
 }else{
   return formsubmit(check);
 }



function formsubmit(check){
	//변수설정
	var writer = $('#writer').val();
	if(check == "insert"){
		var passwd = $('#passwd').val();
	}
	var subject = $('#subject').val();
	var content = $('#content').val();
	
	//작성자 검사
	if(!length210(writer)){
		$('#writer').focus();
		return false;
	}
	if(!adminCheck(writer)){
		$('#writer').focus();
		return false;
	}
	if(!trim(writer)){
		$('#writer').focus();
		return false;
	}
	
	//비밀번호 검사
	if(check == "insert"){
		if(!spaceCheck(passwd)){
			$('#passwd').focus();
			return false;
		}
		if(!length0616(passwd)){
			$('#passwd').focus();
			return false;
		}
		if(!alphabetCheck(passwd)){
			$('#passwd').focus();
			return false;
		}
		if(!numberCheck(passwd)){
			$('#passwd').focus();
			return false;
		}
		if(!gihoCheck(passwd)){
			$('#passwd').focus();
			return false;
		}
		if(!trim(passwd)){
			$('#passwd').focus();
			return false;
		}
	}

	//제목검사
	if(!nuCheck(subject)){
		$('#subject').focus();
		return false;
	}
	if(!length1100(subject)){
		$('#subject').focus();
		return false;
	}
	if(!trim(subject)){
		$('#subject').focus();
		return false;
	}
	
	//내용검사
	if(!nuCheck(content)){
		$('#content').focus();
		return false;
	}
	if(!length1000(content)){
		$('#content').focus();
		return false;
	}	
	if(!trim(content)){
		$('#content').focus();
		return false;
	}

	//form 텍스트 정리
		var f = document.form;
	    f.method = "POST";
		f.writer.value = $('#writer').val().trim();
		if(check == "insert"){//혹시 비밀번호에 공백이있을때 
			f.passwd.value = $('#passwd').val().trim();
		}
		f.subject.value = $('#subject').val().trim();
		f.content.value = f.content.value;
		
		if(check == "insert"){
			f.action = "boardInsertPro.do";
		}else{
			f.action = "boardInfoUpdatePro.do";
		}
		f.submit();
		
	}
}





