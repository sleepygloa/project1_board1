var seonhoblogData={
		s_userId : ''
}

var MainJs = function(){
	"use strict";

//	var deviceHeight = $(window).height();
//	var deviceWidth = $(window).width();
//	$('.content-wrapper').css('height', deviceHeight - 52);
//	$('.content-wrapper').css('width', deviceWidth);
	
	return {
		init : function(){

			fnSession();
			
			fnSideMenu();

			fnEvents();
			
			console.log(seonhoblogData);
			
		}
	}

	//세션 얻어오기
	function fnSession(){
		SeonhoblogUtil.ajax('', '/ctrl/login/listSession', false, function callbackfunc(data){
			seonhoblogData = data;
			console.log(seonhoblogData);
		},false);
		
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
	
	
	function fnEvents(){
		
		//로그인 팝업
		$('#mainLoginToggleLogin').click(function(){
			var css = $('#mainLoginPop').css('display');
			if(css == "none"){
				$('#mainLoginPop').css('display', 'block');
			}else{
				$('#mainLoginPop').css('display', 'none');
			}
		});
		
		//로그인 팝업 뒤로가기
		$('#mainLoginPopBack').click(function(){
			$('#mainLoginPop').css('display', 'none');
		});
		
		//로그인 팝업 로그인하기
		$('#mainLoginPopLogin').click(function(){
			fnLogin();
		});
		
		//엔터 이벤트
		$('#mainLoginPopId').keydown(function(e){
			if(e.keyCode == 13){
				$('#mainLoginPopPw').focus();
			}
		})
		$('#mainLoginPopPw').keydown(function(e){
			if(e.keyCode == 13){
				fnLogin();
			}
		});
		
		console.log(seonhoblogData.s_userId);
		//로그인 버튼 토글
		if(seonhoblogData.s_userId == null){
			$('#mainLoginToggleLogin').css('display', 'block');
			$('#mainLoginToggleLogout').css('display', 'none');
		}else{
			$('#mainLoginToggleLogin').css('display', 'none');
			$('#mainLoginToggleLogout').css('display', 'block');
		}
		
		//로그아웃 버튼
		$('#mainLoginToggleLogout').click(function(){
			SeonhoblogUtil.ajax('', '/ctrl/login/logout', false, function(data){
				alert('로그아웃 되었습니다.');
				window.location.href="/";
			})
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
	
	//로그인
	function fnLogin(){
		var loginId= $('#mainLoginPopId').val();
		var loginPw= $('#mainLoginPopPw').val();
		
		var jsonData = JSON.stringify({
			id 	: loginId,
			pw	: loginPw
		})
		var saveUrl = "/ctrl/login/mainLoginUser";
		var msg = "";
		
		SeonhoblogUtil.ajax(jsonData, saveUrl, msg, function(data){
			console.log(data);
			var dt_grid = data.dt_grid[0];
			if(data.stsCd == 200){
				seonhoblogData.userId = dt_grid.ID;
				alert('로그인에 성공하였습니다.');
				window.location.href= "/";
			}else{
				seonhoblogData.userId = '';
				
				if(data.stsCd == 101){
					alert('아이디가 존재하지 않습니다.');
				}else if(data.stsCd == 102){
					alert('비밀번호가 틀립니다.');
				}
			}
		})
	}


}();

$(document).ready(function(){
	MainJs.init();
});

