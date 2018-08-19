var blogIdx = '';	
var getRef = '';
	
	//대댓글추가
	function viewBlogAddReReContent(getRef){
		var sendData = {
				idx		:	blogIdx,
				ref		:	getRef,
				writer	:	$("#viewBlogReReWriter").val(),
				content	:	$("#viewBlogReReContent").val()
		}
		
		$.ajax({
			url		: "/manage/blog/insertViewBlogReReContent",
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
				idx		:	blogIdx,
				writer	:	$("#viewBlogReWriter").val(),
				content	:	$("#viewBlogReContent").val()
		}
		
		$.ajax({
			url		: "/manage/blog/insertMainBlogReContent",
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
				idx		:	blogIdx,
				ref		:	ref,
				re_step	:	re_step
		}
		$.ajax({
			url		: "/manage/blog/deleteMainBlogReContent",
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

	}
	
var MainViewBlogContentJs = function(){
	"use strict";
	
	return {
		init : function(){
			
			loadingViewBlogContent();
			
			viewBlogContentEvent();
			
		}
	}
	
	function loadingViewBlogContent(){
		$.ajax({
			url	 : '/manage/blog/viewBlogContent',
			data : blogData,
			type : "POST",
			async:false,
			success : function(result){
				console.log(result);
				var list = result.map;
					blogIdx = list[0].IDX;
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
						$('#viewBlogContentDeleteBtn').css('display', 'inline-block');
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
					page : "/manage/blog/updateBlogContent",
					update : "Y"
			}
			fnLoadingPage(data);
		});
		
		$('#viewBlogContentDeleteBtn').click(function(){
			
			if(confirm("정말삭제하시겠습니까?")) {
				var data = {
						idx  : $('#viewBlogContentIdx').val(),
						page : "/manage/blog/deleteBlogContent"
				}
				
				$.ajax({
					url : "/manage/blog/deleteBlogContent",
					data : data,
					async : false,
					success : function(result){
						alert('삭제하였습니다.');
						window.location.href="/";
					},
					error : function(result){
						alert('삭제를 실했습니다.');
					}
				});
				
				fnLoadingPage(data);
			}
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
