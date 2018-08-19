var s_userId = '';
var coreJs = function(){
	"use strict";

	return {
		init : function(){

			getSession();
			
			getMenu();

			getEvents();

		}
	}

	function getSession(){
		$.ajax({
			url		: '/login/getSession',
			success : function(data){
				if(data.s_userId == null){
					s_userId = undefined;
					console.log("not login");
					$('#headerLoginCircle').css('display', 'none');
					$('#headerLogoutCircle').css('display', 'block');
				}else{
					s_userId = data.s_userId;
					console.log("logined");
					$('#headerLoginCircle').css('display', 'block');
					$('#headerLogoutCircle').css('display', 'none');
				}
			}
			
		});
	};
	
	function getEvents(){
		$(document).on('click', 'a.nav-link', function(){
			var value = $(this).children('input').val();
			$.ajax({
				url  : "/main/toProgram",
				data : {
					proCd : value
				},
				type : "POST",
				success : function(data){
					$('#content_wrapper').empty();
					$('#content_wrapper').html(data);
				}
			});
		});

		$('#headerLoginCircle').click(function(){
			alert('login');
			$.ajax({
				url 	: '/login/logout',
				async	: false,
				success : function(data){
					$('#headerLoginCircle').css('display', 'none');
					$('#headerLogoutCircle').css('display', 'block');
				}
			});
		});
		
		$('#headerLogoutCircle').click(function(){
			$.ajax({
				url 	: '/login/loadingLoginPg',
				async	: false,
				success : function(data){
					$('#container-fluid').empty();
					$('#container-fluid').html(data);
				}
			});
		});
		
	}
	
	function getMenu(){
		$.ajax({
			url		 : "/ctrl/set/menu/getMenu",			
			type	 : "POST",
			dataType : "json",
			success : function(data){
//				$('#sidebarMenu').empty();
				//session
				
				
				//leftMenu
				var menuStr = '';
				var pIdx = 0;
				var pCnt = 0;
				var menuDataList = data.list;
				$.each(menuDataList, function(i, v){
					var menuData = menuDataList[i];
					if(pIdx != menuData.MENU_PARENT_SEQ){
						
						if(menuData.COUNT != 1){
							pIdx = menuData.MENU_PARENT_SEQ;
							menuStr += '<li class="nav-item">'
								+ '<a class="nav-link" data-toggle="collapse" href="#'+menuData.PRO_CD+'" aria-expanded="false" aria-controls="'+menuData.PRO_CD+'">'
								+ '<img src="images/icons/9.png" alt="">'
								+ '<span class="menu-title">'+menuData.MENU_NM+'<i class="fa fa-sort-down"></i></span>'
								+ '</a>'
								+ '<div class="collapse" id="'+menuData.PRO_CD+'">'
								+ '<ul class="nav flex-column sub-menu">';
							pCnt++;
						}else{
							menuStr += '<li class="nav-item">'
								+ '<a class="nav-link" data-toggle="collapse" href="#'+menuData.PRO_CD+'" aria-expanded="false" aria-controls="'+menuData.PRO_CD+'">'
								+ '<input type="hidden" value="'+menuData.PRO_CD+'" />'
								+ '<img src="images/icons/1.png" alt="">'
								+ '<span class="menu-title">'+menuData.MENU_NM+'</span>'
								+ '</a></li>'
						}
					}else{
						menuStr += '<li class="nav-item">'
							+'<a class="nav-link" href="#" >'
							+'<input type="hidden" value="'+menuData.PRO_CD+'" />'
							+'<img src="'+menuData.MENU_ICO+'" alt="">'
							+'<span class="menu-title">'+menuData.MENU_NM+'</span>'
							+'</a>'
							+'</li>';
						pCnt++;
						if(pCnt == menuData.COUNT){
							menuStr += '</ul></div></li>';
							pCnt = 0;
						}
					}
					
				});

				$('#sidebarMenu').append(menuStr);
			}
		});
	}
//
//	function getAuth(){
//		$.ajax({
//			url		: "",
//			success : function(data){
//
//			}
//		});
//	}


}();

$(document).ready(function(){
	coreJs.init();
});

