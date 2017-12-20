//댓글
function fn_reContentInit(){
	var comAjax = new ComAjax();
	comAjax.setUrl("/board/replyContentList.do");
	comAjax.setCallback("fn_reContentCallback");
	comAjax.ajax();
}

var getRef = '';
var reReFlag = false;
function fn_reContentCallback(data){
	var body = $("table > tbody");
	
	body.empty();
	if(data.list == undefined || data.list.length == 0){
		var str = "<tr>" + 
					"<td colspan='2'>게시글이 없습니다. 작성해주세요.</td>"
				+	"</td>";
		body.append(str);
	}else{
		
		var str = "";
		$.each(data.list, function(key, value){
			str += 
				"<tr>" +
					"<td style='text-align:left;'>"+(value.RE_STEP > 0 ? " ㄴ " : "") + value.IN_USER_ID+" "+value.IN_DT+" </td>" +
					"<td >"+
						"<a href='#this' id='blogDetailReDelBtn' onclick='blogDetailReDelBtn("+value.REF+")'>댓글삭제</a> " +
						"<a href='#this' id='blogDetailReAddBtn' onclick='blogDetailReAddBtn("+value.REF+")'>답변달기</a>" +
					"</td>" +
				"</tr>"+
				"<tr id='blogDetailReContentPlace_"+value.REF+"'>"+
					"<td colspan='2' style='text-align:left;'>"+(value.RE_STEP > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;" : "") + value.CONTENT+"</td>" +
				"</tr>"
		});
			str += 
				"<tr>" +
					"<td class='col-xs-6' style='text-align:left;'>작성자 " +
						"<input id='blogDetailReWriter' type='text' /> " +
						"비밀번호 " +
						"<input id='blogDetailRePasswd' type='text'/>" +
					"</td>" +
					"<td class='col-xs-2'>"+
						"<a id='blogDetailReSaveBtn'>댓글쓰기</a>" +
					"</td>" +
				"</tr>"+
				"<tr>"+
					"<td colspan='2' class='col-xs-8' style='text-align:left;'>" +
						"<textarea id='blogDetailReContent' class='col-xs-12' style='height:50px;'></textarea>" +
					"</td>" +
				"</tr>"
		body.append(str);
	}
}
//댓댓글달기
function blogDetailReAddBtn(ref){
	getRef = ref;
	if(!reReFlag){
		var refId = "#blogDetailReContentPlace_"+ref;
		$.ajax({
			url		: "/board/addReReplyContent.do",
			type	: "POST",
			dataType : "json",
			success : function(){
				var str = 
						"<tr>" +
							"<td class='col-xs-6' style='text-align:left;'>작성자 " +
								"<input id='blogDetailReReWriter' type='text' /> " +
								"비밀번호 " +
								"<input id='blogDetailReRePasswd' type='text'/>" +
							"</td>" +
							"<td class='col-xs-2'>"+
								"<a id='blogDetailReReSaveBtn'>댓글쓰기</a>" +
							"</td>" +
						"</tr>"+
						"<tr>"+
							"<td colspan='2' class='col-xs-8' style='text-align:left;'>" +
								"<textarea id='blogDetailReReContent' class='col-xs-12' style='height:50px;'></textarea>" +
							"</td>" +
						"</tr>";
				$(refId).after(str);
				reReFlag = true;
			}
		});
	}
	
}

//대댓글추가
function fn_addReReContent(getRef){
	var sendData = {
			IDX		:	$("#IDX").val(),
			REF		:	getRef,
			WRITER	:	$("#blogDetailReReWriter").val(),
			PASSWD	:	$("#blogDetailReRePasswd").val(),
			CONTENT	:	$("#blogDetailReReContent").val()
	}
	
	$.ajax({
		url		: "/board/insertReReplyContent.do",
		type	: "POST",
		data	: sendData,
		dataType : "json",
		success : function(result){
			fn_reContentInit();
		}
	});
}

//댓글삭제
function blogDetailReDelBtn(ref){
	if(!confirm('댓글을 삭제하시겠습니까?')){
		return false;
	}
	
	var sendData = {
			IDX		:	$("#IDX").val(),
			REF		:	ref
	}
	
	$.ajax({
		url		: "/board/deleteReplyContent.do",
		type	: "POST",
		data	: sendData,
		dataType : "json",
		success : function(result){
			fn_reContentInit();
		}
	});
}

var BlogDetailApp = function(){
	"use strict";
	
	var reContent = "";
	
	return {
		init : function(){
			
			//사용자 이벤트
			blogDetailEvent();
			
			//댓글 초기화
			fn_reContentInit();
		}
	}
	
	function blogDetailEvent(){
		$("#blogDetailList").on("click", function(e){ //목록으로 버튼
			e.preventDefault();
			fn_openBoard();
		});
		
		$("a[name='file']").on("click", function(e){ //파일 이름
			e.preventDefault();
			fn_downloadFile($(this));
		});
		$("#blogDetailDelete").on("click", function(e){ //삭제하기 버튼
			e.preventDefault();
			fn_deleteBoard();
		});
		$("#blogDetailUpdate").on("click", function(e){ //수정하기 버튼
			e.preventDefault();
			if(confirm('수정하시겠습니까?')){
				var inputPasswd = prompt('비밀번호를 입력하세요');
				fn_updateBoard(inputPasswd);
			}
		});
		//댓글달기
		$(document).on('click', '#blogDetailReSaveBtn', function(){
			fn_addReContent();
		});
		
		//댓댓글달기
		$(document).on('click', '#blogDetailReReSaveBtn', function(){
			fn_addReReContent(getRef);
		});
	};
	
	function fn_openBoard(){
		var comSubmit = new ComSubmit();
		comSubmit.setUrl("/board/blog.do");
		comSubmit.submit();
	}


	function fn_downloadFile(obj){
		var idx = obj.parent().find("#IDX").val();
		var comSubmit = new ComSubmit();
		comSubmit.setUrl("<c:url value='/downloadFile.do' />");
		comSubmit.addParam("IDX", idx);
		comSubmit.submit();
	}
	function fn_deleteBoard(){
		if(confirm('정말삭제하시겠습니까?') == true){
			var inputPasswd = prompt('삭제하시려면 비밀번호를 입력하세요');
			
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("/board/deleteBlog.do");
			comSubmit.addParam("IDX", $('#IDX').val());
			comSubmit.addParam("PASSWD", inputPasswd);
			comSubmit.submit();
		}else{
			return false;
		} 
	};
	function fn_updateBoard(passwd){
		var comSubmit = new ComSubmit();
		comSubmit.setUrl("/board/blogUpdate.do");
		comSubmit.addParam("IDX", $('#IDX').val());
		comSubmit.addParam("PASSWD", passwd);
		comSubmit.submit();
	};
	
	function fn_addReContent(){
		
		var sendData = {
				IDX		:	$("#IDX").val(),
				WRITER	:	$("#blogDetailReWriter").val(),
				PASSWD	:	$("#blogDetailRePasswd").val(),
				CONTENT	:	$("#blogDetailReContent").val()
		}
		
		$.ajax({
			url		: "/board/insertReplyContent.do",
    		type	: "POST",
    		data	: sendData,
    		dataType : "json",
			success : function(result){
				fn_reContentInit();
			}
		});
	}
	
}();

$(document).ready(function(){
	BlogDetailApp.init();
})


