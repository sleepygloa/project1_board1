var s_userId = '';


////json Parameter 사용
//(function defaultAjaxSetting() {
//	$.ajaxSetup({
////		global: false,
//		timeout: 6000000,
//		type : "POST",
//		dataType : "json",
////		contentType: 'application/json; charset=utf-8',
//		cache: false,
//		beforeSend : function(xhr){
//    	},error : function(jqXHR, textStatus, errorThrown) {
//    		console.log(jqXHR);
//    		if(jqXHR.status != ""){
//    			if(jqXHR.status === 404 ) {
//    				alert("일시적이 오류가 발생했습니다.\n담장자에게 문의하세요.");
//    			}else if(jqXHR.status === 999 ) {
//    				alert(jqXHR.responseText);
//    				//TODO 로그인 POPUP창 개발후 출력
//    			}else if(jqXHR.status === 997 ) {
//    				var jsonData = $.parseJSON(jqXHR.responseText);
//    				alert(jsonData.errMsg);
//    			}else if(jqXHR.status === 1000 ) {
//    				alert(jqXHR.responseText);
//    			}
//    		}
//        }, complete : function(){
//        }, success : function(){
//        }
//	});
//})();

var MainJs = function(){
	"use strict";

//	var deviceHeight = $(window).height();
//	var deviceWidth = $(window).width();
//	$('.content-wrapper').css('height', deviceHeight - 52);
//	$('.content-wrapper').css('width', deviceWidth);
	
	return {
		init : function(){

			
			
//			getSession();
			
			fnSideMenu();

//			getEvents();

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
	
	function fnPageMove(data){
		$.ajax({
			url			: data.MENU_URL,
			type 		: "POST",
			dataType	: "text",
			success 	: function(data){
				$('#mainArticle').empty();
				$('#mainArticle').html(data);
			},
			error : function(data){
				console.log(data);
				console.log('ee');
			}
		});
	}
	
	
	function getEvents(){

		$('#headerLoginCircle').click(function(){
			alert('login');
			$.ajax({
				url 	: '/login/logout',
				async	: false,
				success : function(data){
//					$('#headerLoginCircle').css('display', 'none');
//					$('#headerLogoutCircle').css('display', 'block');
					window.location.href='/';
				}
			});
		});
		
		$('#headerLogoutCircle').click(function(){
			$.ajax({
				url 	: '/login/loadingLoginPg',
				async	: false,
				success : function(data){
					$('#content_wrapper').empty();
					$('#content_wrapper').html(data);
				}
			});
		});
		
	}
	
	function fnSideMenu(){
        $.ajax({
            url      : "/ctrl/settings/menu/listMainSideMenu",	
//            data     : jsonData,
            dataType : 'json',
            type     : 'POST',
            contentType : 'application/json; charset=utf-8',
            success  : function(data) {
            	var dt_grid = data.dt_grid;

				//리스트를 순서대로 내보냄
				var sideMenuUi = $('<ul/>');
				
				//스타일
				sideMenuUi.css({
					'list-style' 	: 'none',
					'padding'		: '0px'
					
				});
				
				var sideMenuLi = null;
				

				var pIdx = -1; //부모의 시퀀스
				var pCnt = -1; //부모의 자식 개수
				var cnt = 0; //자식 순서
				
				//상위 관리 메뉴(그룹메뉴)이면
				var sideMenuGroup = null;
				
				$.each(dt_grid, function(i, v){
					
					//부모의 시퀀스와 현재 작업중인 메뉴의 부모 시퀀스가 다를경우만 입력.
					if(pIdx != v.MENU_PARENT_SEQ){
						pIdx = v.MENU_PARENT_SEQ;
						//루프 안에서
						sideMenuLi = $('<li>');
					}
					

					
					
					//이 메뉴가 상위 그룹메뉴인지, 하위 리스트 메뉴인지 확인
					if(v.MENU_GROUP_YN == 'Y'){
						
						//상위 관리 메뉴 초기화
						sideMenuGroup = null;
						
						//상위 관리 메뉴 초기화
						sideMenuGroup = $('<ul/>');
						
						//메뉴의 실제 컨텐츠 Text
						var sideMenuP = $('<p/>');
						sideMenuGroup.append(v.MENU_NM);
					}else{
						//자식순번 증가
						cnt++;
						
						//상위 관리 메뉴의 하위 메뉴이면
						var sideMenuGroupLi = $('<li/>');
						
						//리스트 스타일
						sideMenuGroupLi.css({
							'margin-left' : '20px'
						})
						
						//메뉴의 실제 컨텐츠 a
						var sideMenuA = $('<a/>')
						if(v.MENU_ICO != null){
							//어느 아이콘인지 확인
							//코드 생략
							sideMenuA.addClass(v.MENU_ICO);
						}
						
						//메뉴의 실제 컨텐츠 Text
						var sideMenuP = $('<p/>');
						sideMenuP.append(v.MENU_NM);
						
						//리스트 생성
						sideMenuGroupLi.append(sideMenuA).append(sideMenuP);
						sideMenuGroup.append(sideMenuGroupLi);
						
						//클릭 이벤트
						if(v.MENU_URL != null){
							sideMenuGroupLi.click(function(){
								fnPageMove(v);
							});
						}
						
						//마지막 자식일 경우 상위 관리 메뉴를 최종 부모 메뉴에 추가함.
						if(cnt == v.COUNT){
							sideMenuLi.append(sideMenuGroup);

						}
					}
					//마지막 자식일 경우 상위 관리 메뉴를 최종 부모 메뉴에 추가함.
					if(v.MENU_GROUP_YN == 'N' && cnt == v.COUNT){
						sideMenuUi.append(sideMenuLi);
						
						//자식순번 초기화
						cnt = 0;
					}			
					
				});
				
				$('#nav').append(sideMenuUi);
				
			}
		});
	}


}();

$(document).ready(function(){
	MainJs.init();
});

