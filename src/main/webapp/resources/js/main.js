var s_userId = '';
var idx = '';

var mainData = '';

function loadingPgSetting(data){
	mainData = data; //?
	$.ajax({
		url		: "/main/viewPg",
		data	: data,
		type	: "POST",
		success	: function(result){
			$('#body').empty();
			$('#body').html(result);
		}
	})
}

var mainJs = function(){
	"use strict";

//////////////////////////////////
		return {
			init : function(){
				
				loadingMainContent();
				
				loadingSession();
				
				mainEvents();
				
			}
		}
		
	  function loadingMainContent(){
		  var id = null;
		  $.ajax({
			  url		: "/login/loadingMainContent",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	  }
	  //로그인 성공
	  function loadingSession(){
		  $.ajax({
			  url		:	"/main/loadingSession",
			  success	:	function(result){
				  s_userId =  result.s_userId;
				  
				  //VIEW SETTING
				  if(s_userId != null){
					  $('#login').remove();
					  $('#logout').css('display', 'block');
				  }
			  }
		  })
	  }
	
	  //CUSTOM
	  function mainEvents(){
		  //로고클릭
		  $('#logo').click(function(){
			 toMainPage();
		  });

		  //로그인클
		  $('#login').click(function(){
			 loadingLoginPage();
		  });
		  
		  //로그아웃
		  $('#logout').click(function(){
			  logout();
		  })
		  
		  //글쓰기
		  $(document).on('click', '#blogAddBtn', function(){
			  mainBlogInsertBtn();
		  })
	  }
	
	  function toMainPage(){
		  window.location.href="/";
	  }

	  function loadingLoginPage(){
		  $.ajax({
			  url		: "/login/loadingLoginPg",
			  success	: function(result){
				  $('#body').html(result);
			  }
		  })
	  }
	  
	  function logout(){
		  $.ajax({
			  url		: "/login/logout",
			  success	: function(result){
				  alert(result.MSG);
				  window.location.href="/";
			  }
		  })
	  }
	  //글쓰기버튼 
	  function mainBlogInsertBtn(){
		  var data = {
				  idx  : '',
				  page : '/main/updateBlogContent'
		  }
		  loadingPgSetting(data);
	  }
	  
}();

$(document).ready(function(){
	mainJs.init();
})