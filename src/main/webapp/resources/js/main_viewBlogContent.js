	var getRef = '';
	
	//대댓글추가
	function viewBlogAddReReContent(getRef){
		var sendData = {
				idx		:	idx,
				ref		:	getRef,
				writer	:	$("#viewBlogReReWriter").val(),
				content	:	$("#viewBlogReReContent").val()
		}
		
		$.ajax({
			url		: "/main/insertViewBlogReReContent",
			type	: "POST",
			data	: sendData,
			async	: false,
			dataType : "json",
			success : function(result){
				getMainViewReContent();
			}
		});
	}

	//댓댓글달기 HTML 밀어넣기
	function viewBlogReAddBtn(REF, RE_STEP){
		getRef = REF;
		var refId = "#viewBlogReContentPlace_"+REF+"_"+RE_STEP;
		getMainViewReContent();
		
		var str = 
				"<tr>" +
					"<td class='col-xs-6' style='text-align:left;'>작성자 " +
						"<input id='viewBlogReReWriter' type='text' /> " +
					"</td>" +
					"<td class='col-xs-2'>"+
						"<a class='btn btn-default' id='viewBlogReReSaveBtn'>댓글쓰기</a>" +
					"</td>" +
				"</tr>"+
				"<tr>"+
					"<td colspan='2' class='col-xs-8' style='text-align:left;'>" +
						"<textarea id='viewBlogReReContent' class='col-xs-12' style='height:50px;'></textarea>" +
					"</td>" +
				"</tr>";
		$(refId).after(str);
	}

	//댓글달기
	function viewBlogAddReContent(){
		
		if($("#viewBlogReWriter").val() == ''){
			alert('로그인을 해주세요.');
			return false;
		}else if($("#viewBlogReContent").val() == ''){
			alert('내용을 입력해주세요');
			return false;
		}
		
		var sendData = {
				idx		:	idx,
				writer	:	$("#viewBlogReWriter").val(),
				content	:	$("#viewBlogReContent").val()
		}
		
		$.ajax({
			url		: "/main/insertMainBlogReContent",
    		type	: "POST",
    		data	: sendData,
    		dataType : "json",
			success : function(result){
				getMainViewReContent();
			}
		});
	}
	
	//댓글삭제
	function viewBlogReDelBtn(ref, re_step){
		if(!confirm('댓글을 삭제하시겠습니까?')){
			return false;
		}
		var sendData = {
				idx		:	idx,
				ref		:	ref,
				re_step	:	re_step
		}
		$.ajax({
			url		: "/main/deleteMainBlogReContent",
			type	: "POST",
			data	: sendData,
			async 	: false,
			dataType : "json",
			success : function(result){
				getMainViewReContent();
			}
		});
	}

	//댓글불러오기
	function getMainViewReContent(){
		$.ajax({
			url  	: "/main/getMainViewReContent",
			data 	: {
				idx : idx
			},
			type	: "POST",
			async:false,
			success : function(result){
				var result = result.list;
				var body = $("table > tbody");
				body.empty();
				
				var reContent = '';
				if(result == undefined || result.length == 0){
					reContent = "<tr>" + 
								"<td colspan='2'>댓글이 없습니다. 작성해주세요.</td>"
							+	"</td>";
				}else{
					$.each(result, function(key, value){
						reContent += 
							"<tr>" +
								"<td style='text-align:left;'>"+(value.RE_STEP > 0 ? " ㄴ " : "") + value.IN_USER_ID+" "+value.IN_DT+" </td>" +
								"<td >";
						if(s_userId == value.IN_USER_ID){
							reContent +="<a href='#this' class='btn btn-default' id='viewBlogReDelBtn' onclick='viewBlogReDelBtn("+value.REF+", "+value.RE_STEP+")'>댓글삭제</a> ";	
						}
						reContent += (value.RE_STEP == 0 ? "<a href='#this' class='btn btn-default' id='viewBlogReAddBtn' onclick='viewBlogReAddBtn("+value.REF+", "+value.RE_STEP+")'>답변달기</a>" : "") +
								"</td>" +
							"</tr>"+
							"<tr id='viewBlogReContentPlace_"+value.REF+"_"+value.RE_STEP+"'>"+
								"<td colspan='2' style='text-align:left;'>"+(value.RE_STEP > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;" : "") + value.CONTENT+"</td>" +
							"</tr>"
					});
				}
				reContent += 
					"<tr>" +
						"<td class='col-xs-6' style='text-align:left;'>작성자 " +
							"<input id='viewBlogReWriter' type='text' value='"+(s_userId == null? '' : s_userId)+"' disabled /> " +
						"</td>" +
						"<td class='col-xs-2'>"+
							"<a class='btn btn-default' id='viewBlogReSaveBtn'>댓글쓰기</a>" +
						"</td>" +
					"</tr>"+
					"<tr>"+
						"<td colspan='2' class='col-xs-8' style='text-align:left;'>" +
							"<textarea id='viewBlogReContent' class='col-xs-12' style='height:50px;'></textarea>" +
						"</td>" +
					"</tr>"
				body.append(reContent);
				
			}
		})
	}
	
var MainViewBlogContentJs = function(){
	"use strict";
	
	return {
		init : function(){
			
			loadingViewBlogContent();
			
			getMainViewReContent();
			
			viewBlogContentEvent();
			
		}
	}
	
	function loadingViewBlogContent(){
		$.ajax({
			url	 : '/main/viewBlogContent',
			data : mainData,
			type : "POST",
			async:false,
			success : function(result){
				console.log(result);
				var list = result.map;
					idx = list[0].IDX;
					var idCheck = result.S_CHECK_ID;
					$('#viewBlogContentIdx').val(list[0].IDX);
					$('#viewBlogContentTitle').val(list[0].TITLE);
					$('#viewBlogContentSubject').val(list[0].SUBJECT);
					
					for(var i = 0; i < list.length; i++){
						if(list[i].CONTENT == undefined){
							
						}else{
							if(list[i].TYPE == 'IMG'){
								var str = '<div id="content_'+i+'" class="col-xs-12" >'
										+ '<img src="'+list[i].CONTENT+'" width="'+list[i].IMGWIDTHSCALE+'%" />'
										+ '</div>';
							}else if(list[i].TYPE == 'CODE'){
								var str = '<div id="content_'+i+'" class="col-xs-12" style="background:gray; color:white;"></div>';
							}else{
								var str = '<div id="content_'+i+'" class="col-xs-12"></div>';
							}
							$('#viewBlogContentContent').append(str);
							
							var content = list[i].CONTENT;
							
							if(list[i].TYPE != 'IMG'){
								content = content.replace(/</gi, '&lt')
												 .replace(/>/gi, '&gt')
												 .split("\n");
								var rc = '';
					           $.each(content, function(j){
					        	   rc += '<span>'+content[j]+'<br /></span>';
					            });
					           $('#content_'+i).append(rc);
							}
						}
					}
					
					if(idCheck){
						$('#viewBlogContentUpdateBtn').css('display', 'inline-block');
					}
					
					var list = result.list;
					var str = '';
					//list[i].ORIGINAL_FILE_NAME

				}
		})
	}
	
	//이벤트
	function viewBlogContentEvent(){
		
		$('#viewBlogContentCancelBtn').click(function(){
			window.location.href="/";
		})
		
		$('#viewBlogContentUpdateBtn').click(function(){
			var data = {
					idx  : $('#viewBlogContentIdx').val(),
					page : "/main/updateBlogContent",
					update : "Y"
			}
			loadingPgSetting(data);
		});
		
		//댓글달기
		$(document).on('click', '#viewBlogReSaveBtn', function(){
			viewBlogAddReContent();
		});
		
		//댓댓글달기
		$(document).on('click', '#viewBlogReReSaveBtn', function(){
			viewBlogAddReReContent(getRef);
		});
	}
	
}();

$(document).ready(function(){
	MainViewBlogContentJs.init();
})
