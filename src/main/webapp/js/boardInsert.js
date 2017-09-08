/* 이메일 입력 정규식 */
var email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

function checkForm(){
	
	var re_id = /^[a-z0-9_-]{2,6}$/; // 아이디 검사식
	var re_pw = /^[a-z0-9_-]{4,8}$/; // 비밀번호 검사식
	var re_mail = /^([\w\.-]+)@([a-z\d\.-]+)\.([a-z\.]{2,6})$/; // 이메일 검사식
	var re_url = /^(https?:\/\/)?([a-z\d\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/; // URL 검사식
//	var re_tel = /^[0-9]{8,11}$/; // 전화번호 검사식
	
	var 
		form = $('.formjs'), 
		uid = $('#uid'), 
		upw = $('#upw'), 
		mail = $('#mail'), 
		url = $('#url'), 
		tel = $('#tel');
	
//	$.ajax(
//		if (re_id.test(uid.val()) != true) { // 아이디 검사
//			alert('[ID 입력 오류] 유효한 ID를 입력해 주세요.');
//			uid.focus();
//			return false;
//		} else if(re_pw.test(upw.val()) != true) { // 비밀번호 검사
//			alert('[PW 입력 오류] 유효한 PW를 입력해 주세요.');
//			upw.focus();
//			return false;
//		} else if(re_mail.test(mail.val()) != true) { // 이메일 검사
//			alert('[Email 입력 오류] 유효한 이메일 주소를 입력해 주세요.');
//			mail.focus();
//			return false;
//		} else if(re_url.test(url.val()) != true) { // URL 검사
//			alert('[Web 입력 오류] 유효한 웹 사이트 주소를 입력해 주세요.');
//			url.focus();
//			return false;
//		} else if(re_tel.test(tel.val()) != true) { // 전화번호 검사
//			alert('[Tel 입력 오류] 유효한 전화번호를 입력해 주세요.');
//			tel.focus();
//			return false;
//		}
//	);


	
	
	
	
function onSubmit() {
  jQuery('#form_input').jaAction({
      values : 'mod=update' // mod 인풋박스의 값을 update 변경함.
    , formAttr : 'action=./save.html' // form 속성의 action 을 ./save.html 변경함.
    , send : 'submit' // form 을 submit 으로 전송함.
    , filter : [
        // #user_id 의 값이 없거나, user_id 형식의 값이 아니고 입력길이가 2자이상 4자이하가 아닌경우 아이디 .... 메세지 alert 창을 출력함.
        { target : "#user_id", params : "&filter=notnull&filter=user_id&length=2,4&title=아이디" }
        // #name 최대길이 10자이상을 넘을 경우 성명 .... 메세지 alert 창을 출력합니다.
      , { target : "#name", params : "&filter=notnull&max_length=10&title=성명" }
      , { target : "#pwd", params : "&filter=notnull&max_length=40&title=비밀번호" }
        // #pwd2 가 #pwd 의 값과 다를 경우 비밀번호 확인 .... 메세지 alert 창을 출력합니다.
      , { target : "#pwd2", params : "&filter=notnull&max_length=40&#pwd=!#pwd2&title=비밀번호 확인" }
      , { target : "#email", params : "&filter=email&title=메일" }
      // #age 의 값이 숫자가 아니거나, 50이상으로 입력한 경우 나이 ... 메세지 alert 창을 출력합니다.
      , { target : "#age", params : "&filter=notnull&filter=number&num=50&title=나이" }
      , { target : "#job", params : "&filter=notnull&title=직업" }
      // input:radio[name=sex] 의 라디오박스 선택수가 0개인 경우 성별 ... 메세지 alert 창을 출력합니다.
      , { target : "input:radio[name=sex]", params : "&selected=1&title=성별" }
      // input:radio[name=s] 의 체크박스 선택수가 2개이상 3개이하가 아닌 경우 취미 ... 메세지 alert 창을 출력합니다.
      , { target : "input:checkbox[name=s]", params : "&selected=2,3&title=취미" }
 
    ]
    , ask : 'update' // confirm 메세지 출력
    , beforeAction : function() { // jaAction 메서드가 실행되기 전에 beforeAction 함수를 실행함. return false; 인 경우 jaAction 종료함.
      var ja = $.jaFilter._filtering(jQuery('input:radio:[name=is]'),'&selected=1&value=1');
      if (ja.error) { alert("동의를 선택하세요."); return false;}
    }
 
  });
}


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
$('#uid, #upw').after('<strong></strong>');

// #uid 인풋에서 onkeyup 이벤트가 발생하면
uid.keyup( function() {
	var s = $(this).next('strong'); // strong 요소를 변수에 할당
	if (uid.val().length == 0) { // 입력 값이 없을 때
		s.text(''); // strong 요소에 포함된 문자 지움
	} else if (uid.val().length < 3) { // 입력 값이 3보다 작을 때
		s.text('너무 짧아요.'); // strong 요소에 문자 출력
	} else if (uid.val().length > 16) { // 입력 값이 16보다 클 때
		s.text('너무 길어요.'); // strong 요소에 문자 출력
	} else if ( re_id.test(uid.val()) != true ) { // 유효하지 않은 문자 입력 시
		s.text('유효한 문자를 입력해 주세요.'); // strong 요소에 문자 출력
	} else { // 입력 값이 3 이상 16 이하일 때
		s.text('적당해요.'); // strong 요소에 문자 출력
	}
});

// #upw 인풋에서 onkeyup 이벤트가 발생하면
upw.keyup( function() {
	var s = $(this).next('strong'); // strong 요소를 변수에 할당
	if (upw.val().length == 0) { // 입력 값이 없을 때
		s.text(''); // strong 요소에 포함된 문자 지움
	} else if (upw.val().length < 6) { // 입력 값이 6보다 작을 때
		s.text('너무 짧아요.'); // strong 요소에 문자 출력
	} else if (upw.val().length > 18) { // 입력 값이 18보다 클 때
		s.text('너무 길어요.'); // strong 요소에 문자 출력
	} else { // 입력 값이 6 이상 18 이하일 때
		s.text('적당해요.'); // strong 요소에 문자 출력
	}
});

// #tel 인풋에 onkeydown 이벤트가 발생하면
// 하이픈(-) 키가 눌렸는지 확인
// 하이픈(-) 키가 눌렸다면 입력 중단
tel.keydown( function() {
	if(event.keyCode==109 || event.keyCode==189) {
		return false;
	}
});

}

/* 사용자 회원가입 모든 항목 체크 */
function checkSignAll(){
	if(document.signForm.id.value == ""){
		document.signForm.alert.value = "아이디를 입력하십시오.";
		return false;
	}
	if(document.signForm.pw.value == ""){
		document.signForm.alert.value = "비밀번호를 입력하십시오.";
		return false;
	}if(document.signForm.pw_chk.value == ""){
		document.signForm.alert.value = "비밀번호 확인을 입력하십시오.";
		return false;
	}
	if(document.signForm.pw.value != document.signForm.pw_chk.value){
		document.signForm.alert.value = "비밀번호와 비밀번호 확인이 다릅니다.";
		return false;
	}
	if(document.signForm.name.value == ""){
		document.signForm.alert.value = "이름을 입력하십시오.";
		return false;
	}
	if(document.signForm.birth.value == ""){
		document.signForm.alert.value = "생년월일을 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.birth.value)){
		document.signForm.alert.value = "생년월일은 숫자만 입력하십시오.";
		document.signForm.birth.value = "";
		return false;
	}
	if(document.signForm.address.value == ""){
		document.signForm.alert.value = "주소를 입력하십시오.";
		return false;
	}
	if(document.signForm.phone_1.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.phone_1.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.phone_1.value = "";
		return false;
	}
	if(document.signForm.phone_2.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.phone_2.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.phone_2.value = "";
		return false;
	}
	if(document.signForm.phone_3.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.phone_3.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.phone_3.value = "";
		return false;
	}
	if(document.signForm.email.value == ""){
		document.signForm.alert.value = "이메일을 입력하십시오.";
		return false;
	}
	if(!email.test(document.signForm.email.value)){
		document.signForm.alert.value = "이메일을 정확하게 입력하십시오.";
		return false;
	}
	// 사장님 js
	if(document.signForm.b_name.value == ""){
		document.signForm.alert.value = "상호명을 입력하십시오.";
		return false;
	}
	if(document.signForm.b_number_1.value == "" ){
		document.signForm.alert.value = "사업자번호를 입력하십시오.";
		return false;
	}
	if(!b_number.test(document.signForm.b_number_1.value)){
		document.signForm.alert.value = "사업자번호는 숫자만 입력하십시오.";
		document.signForm.b_number_1.value = "";
		return false;
	}
	if(document.signForm.b_number_2.value == "" ){
		document.signForm.alert.value = "사업자번호를 입력하십시오.";
		return false;
	}
	if(!b_number.test(document.signForm.b_number_2.value)){
		document.signForm.alert.value = "사업자번호는 숫자만 입력하십시오.";
		document.signForm.b_number_2.value = "";
		return false;
	}
	if(document.signForm.b_number_3.value == "" ){
		document.signForm.alert.value = "사업자번호를 입력하십시오.";
		return false;
	}
	if(!b_number.test(document.signForm.b_number_3.value)){
		document.signForm.alert.value = "사업자번호는 숫자만 입력하십시오.";
		document.signForm.b_number_3.value = "";
		return false;
	}
	if(document.signForm.b_address.value == ""){
		document.signForm.alert.value = "주소를 입력하십시오.";
		return false;
	}
	if(document.signForm.b_tel1.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!b_tel.test(document.signForm.b_tel1.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.b_tel1.value = "";
		return false;
	}
	if(document.signForm.b_tel2.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!b_tel.test(document.signForm.b_tel2.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.b_tel2.value = "";
		return false;
	}
	if(document.signForm.b_tel3.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!b_tel.test(document.signForm.b_tel3.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.b_tel3.value = "";
		return false;
	}
	if(document.signForm.b_size.value == ""){
		document.signForm.alert.value = "사업장의 규모를 입력하십시오.";
		return false;
	}
	if(document.signForm.b_pccount.value == ""){
		document.signForm.alert.value = "보유 PC 수 를 입력하십시오.";
		return false;
	}
	if(document.signForm.b_ip.value == ""){
		document.signForm.alert.value = "대표 IP를 입력하십시오.";
		return false;
	}
	// 알바 js
	if(document.signForm.e_bossid.value == ""){
		document.signForm.alert.value = "사장님 아이디를 입력하십시오.";
		return false;
	}
	
}




/* 아이디 입력 확인 */
function checkId(){
	if(document.signForm.id.value == ""){
		document.signForm.alert.value = "아이디를 입력하십시오.";
		return false;
	}
	url = "/buengbueng/userInfoSignCheckId.do?id=" + document.signForm.id.value;
	window.open(url,"checkId", "toolbar=no, location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500, height=200");
}
/* 비밀번호 입력 확인 */
function chechPw(){
	if(document.signForm.pw.value == ""){
		document.signForm.alert.value = "비밀번호를 입력하십시오.";
		return false;
	}if(document.signForm.pw_chk.value == ""){
		document.signForm.alert.value = "비밀번호 확인을 입력하십시오.";
		return false;
	}
	if(document.signForm.pw.value != document.signForm.pw_chk.value){
		document.signForm.alert.value = "비밀번호와 비밀번호 확인이 다릅니다.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}
/* 이름 입력 확인 */
function checkName(){
	if(document.signForm.name.value == ""){
		document.signForm.alert.value = "이름을 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}
/* 생년월일 입력 확인 */
function checkBirth(){
	if(document.signForm.birth.value == ""){
		document.signForm.alert.value = "생년월일을 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.birth.value)){
		document.signForm.alert.value = "생년월일은 숫자만 입력하십시오.";
		document.signForm.birth.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}
/* 주소 입력 확인 */
function checkAddress(){
	if(document.signForm.address.value == ""){
		document.signForm.alert.value = "주소를 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}
/* 전화번호 입력 확인 */
function checkPhone_1(){
	if(document.signForm.phone_1.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.phone_1.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.phone_1.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}
function checkPhone_2(){
	if(document.signForm.phone_2.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.phone_2.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.phone_2.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}
function checkPhone_3(){
	if(document.signForm.phone_3.value == "" ){
		document.signForm.alert.value = "전화번호를 입력하십시오.";
		return false;
	}
	if(!phone.test(document.signForm.phone_3.value)){
		document.signForm.alert.value = "전화번호는 숫자만 입력하십시오.";
		document.signForm.phone_3.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}
/* 이메일 입력 확인 */
function checkEmail(){
	if(document.signForm.email.value == ""){
		document.signForm.alert.value = "이메일을 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}


/* 이메일에서 직접입력 외의 것 누르면 실행 */
function emailSelect(){
	var email = document.signForm.email.value;
	var id = email.split('@');
	document.signForm.email.value = id[0] + document.signForm.email_addr_select.value;
}
/* 아이디가 중복되지 않으면 입력한 아이디로 값 변경 */
function setId(id){
	opener.document.signForm.id.value = id;
	opener.document.signForm.alert.value = "";
	setTimeout('self.close()',2000);
}
/* 취소 버튼 클릭 시 main으로 이동 */
function cancel(){
	window.location = '/buengbueng/index.do';
}
/* 회원 가입이 정상적으로 완료되지 않으면 이전 페이지로 이동 */
function historyGo(){
	alert("회원 가입에 실패했습니다.");
	history.go(-1);
}

/* 알바가 회원 가입 중에 사장님 아이디를 잘못 입력했을 경우 */
function bossNoCheck(){
	alert("사장님 아이디가 존재하지 않습니다.");
	history.go(-1);
}

/* 사장님 정보 입력 확인 */

//상호명 입력 확인.
function checkB_name(){
	if(document.signForm.b_name.value == ""){
		document.signForm.alert.value = "상호명을 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

//사업자번호 입력 확인.
function checkB_number_1(){
	if(document.signForm.b_number_1.value == "" ){
		document.signForm.alert.value = "사업자번호를 입력하십시오.";
		return false;
	}
	if(!b_number.test(document.signForm.b_number_1.value)){
		document.signForm.alert.value = "사업자번호는 숫자만 입력하십시오.";
		document.signForm.b_number_1.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

function checkB_number_2(){
	if(document.signForm.b_number_2.value == "" ){
		document.signForm.alert.value = "사업자번호를 입력하십시오.";
		return false;
	}
	if(!b_number.test(document.signForm.b_number_2.value)){
		document.signForm.alert.value = "사업자번호는 숫자만 입력하십시오.";
		document.signForm.b_number_2.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

function checkB_number_3(){
	if(document.signForm.b_number_3.value == "" ){
		document.signForm.alert.value = "사업자번호를 입력하십시오.";
		return false;
	}
	if(!b_number.test(document.signForm.b_number_3.value)){
		document.signForm.alert.value = "사업자번호는 숫자만 입력하십시오.";
		document.signForm.b_number_3.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

//사업장 주소 입력 확인.
function checkB_address(){
	if(document.signForm.b_address.value == ""){
		document.signForm.alert.value = "사업장 주소를 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

//사업장 전화번호 입력 확인.

function checkB_tel1(){
	if(document.signForm.b_tel1.value == "" ){
		document.signForm.alert.value = "사업장 전화번호를 입력하십시오.";
		return false;
	}
	if(!b_tel.test(document.signForm.b_tel1.value)){
		document.signForm.alert.value = "사업장 전화번호는 숫자만 입력하십시오.";
		document.signForm.b_tel1.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

function checkB_tel2(){
	if(document.signForm.b_tel2.value == "" ){
		document.signForm.alert.value = "사업장 전화번호를 입력하십시오.";
		return false;
	}
	if(!b_tel.test(document.signForm.b_tel2.value)){
		document.signForm.alert.value = "사업장 전화번호는 숫자만 입력하십시오.";
		document.signForm.b_tel2.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

function checkB_tel3(){
	if(document.signForm.b_tel3.value == "" ){
		document.signForm.alert.value = "사업장 전화번호를 입력하십시오.";
		return false;
	}
	if(!b_tel.test(document.signForm.b_tel3.value)){
		document.signForm.alert.value = "사업장 전화번호는 숫자만 입력하십시오.";
		document.signForm.b_tel3.value = "";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

//사업장 규모 입력 확인
function checkB_size(){
	if(document.signForm.b_size.value == ""){
		document.signForm.alert.value = "사업장 규모를 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}


//보유 컴퓨터 수 입력 확인
function checkB_pccount(){
	if(document.signForm.b_pccount.value == ""){
		document.signForm.alert.value = "보유 컴퓨터 수량을 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}

//대표 IP 입력 확인

function checkB_ip(){
	if(document.signForm.b_ip.value == ""){
		document.signForm.alert.value = "대표 IP를 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}


//등급 알바의 사장님 아이디 입력 확인.
function checkE_bossid(){
	if(document.signForm.e_bossid.value == ""){
		document.signForm.alert.value = "사장님 아이디를 입력하십시오.";
		return false;
	}
	else{
		document.signForm.alert.value = "";
	}
}







