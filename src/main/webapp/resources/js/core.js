//var s_userId = '';
//var idx = '';
//
//var mainJs = function(){
//	"use strict";
//
////////////////////////////////////
//		return {
//			init : function(){
//				
//				loadingMainContent();
//				
//				loadingSession();
//				
//				mainEvents();
//				
//			}
//		}
//		
//	  function loadingMainContent(){
//		  var id = null;
//		  $.ajax({
//			  url		: "/login/loadingMainContent",
//			  success	: function(result){
//				  $('#body').html(result);
//			  }
//		  })
//	  }
//	  //로그인 성공
//	  function loadingSession(){
//		  $.ajax({
//			  url		:	"/main/loadingSession",
//			  success	:	function(result){
//				  s_userId =  result.s_userId;
//				  
//				  //VIEW SETTING
//				  if(s_userId != null){
//					  $('#login').remove();
//					  $('#logout').css('display', 'block');
//				  }
//			  }
//		  })
//	  }
//	
//	  //CUSTOM
//	  function mainEvents(){
//		  //로고클릭
//		  $('#logo').click(function(){
//			 toMainPage();
//		  });
//
//		  //로그인클
//		  $('#login').click(function(){
//			 loadingLoginPage();
//		  });
//		  
//		  //로그아웃
//		  $('#logout').click(function(){
//			  logout();
//		  })
//		  
//	  }
//	
//	  function toMainPage(){
//		  window.location.href="/";
//	  }
//
//	  function loadingLoginPage(){
//		  $.ajax({
//			  url		: "/login/loadingLoginPg",
//			  success	: function(result){
//				  $('#body').html(result);
//			  }
//		  })
//	  }
//	  
//	  function logout(){
//		  $.ajax({
//			  url		: "/login/logout",
//			  success	: function(result){
//				  alert(result.MSG);
//				  window.location.href="/";
//			  }
//		  })
//	  }
//	  
//}();
//
//$(document).ready(function(){
//	mainJs.init();
//})

var mainJs = function(){
	"use strict";
	
	return {
		init : function(){
			
//			loadingMainContent();
			
//			loadingSession();
			
//			mainEvents();
			
		}
	}
}();

$(document).ready(function(){
	mainJs.init();
});
