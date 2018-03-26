var BlogUpdateApp = function(){
	"use strict";
	var gfv_count = '${fn:length(list)+1}';
//	var gfv_count = '${fn:length(list)+1}';
	console.log(gfv_count);
	// 검증에 사용할 함수명들을 배열에 담아준다.

	return {
		init : function(){
			
			fn_blogContentInit();
			//사용자 이벤트
			blogUpdateEvent();
			
		}
	}

	function blogUpdateEvent(){
		$("#blogUpdateList").on("click", function(e){ //목록으로 버튼
			e.preventDefault();
			fn_openBoard();
		});
		
		$("#blogUpdateSave").on("click", function(e){ //저장하기 버튼
			e.preventDefault();
//			frmCheck('update');
			fn_updateBoard();
		});
		
		$("#blogUpdateDelete").on("click", function(e){ //삭제하기 버튼
			e.preventDefault();
			fn_deleteBoard();
		});
		
		$("#blogUpdateAddFile").on("click", function(e){ //파일 추가 버튼
			e.preventDefault();
			fn_addFile();
		});
		
		$("a[name^='delete']").on("click", function(e){ //삭제 버튼
			e.preventDefault();
			fn_deleteFile($(this));
		});
	}
	
	function fn_blogContentInit(){
		$.ajax({
			url:"/board/blogUpdateContent.do",
			dataType:"json",
			data:{
				IDX	:	$("#blogUpdateIdx").val()
			},
			success : function(result){
				console.log(result);
				$('#blogUpdateWriter').text(result.IN_USER_ID);
				$('#blogUpdateReadCount').text(result.READCOUNT);
				$('#blogUpdateInDt').text(result.IN_DT);
				$('#blogUpdateTitle').text(result.TITLE);
				$('#blogUpdateContent').text(result.CONTENT);
				
					
			}
		})
	}
	
	function fn_openBoard(){
		var comSubmit = new ComSubmit();
		comSubmit.setUrl("/board/blog.do");
		comSubmit.submit();
	}

	function fn_updateBoard(){
		var comSubmit = new ComSubmit("frm");
		comSubmit.setUrl("/board/updateBlog.do");
		comSubmit.addParam("IDX", $("#blogUpdateIdx").val());
		comSubmit.submit();
	}

	function fn_addFile(){
		var str = "<p>" +
				"<input type='file' id='file_"+(gfv_count)+"' name='file_"+(gfv_count)+"' style='display:inline-block;'>"+
				"<a href='#this' id='delete_"+(gfv_count)+"' name='delete_"+(gfv_count)+"' style='display:inline-block;'>삭제</a>" +
			"</p>";
		$("#fileDiv").append(str);
		$("#delete_"+(gfv_count++)).on("click", function(e){ //삭제 버튼
			e.preventDefault();
			fn_deleteFile($(this));
		});
	}

	function fn_deleteFile(obj){
		obj.parent().remove();
	}
	
}();

$(document).ready(function(){
	BlogUpdateApp.init();
})
