var gfv_count = '${fn:length(list)+1}';
$(document).ready(function(){
	$("#blogUpdateList").on("click", function(e){ //목록으로 버튼
		e.preventDefault();
		fn_openBoard();
	});
	
	$("#blogUpdateSave").on("click", function(e){ //저장하기 버튼
		e.preventDefault();
//		frmCheck('update');
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
});

function fn_openBoard(){
	var comSubmit = new ComSubmit();
	comSubmit.setUrl("/board/blog.do");
	comSubmit.submit();
}

function fn_updateBoard(){
	var comSubmit = new ComSubmit("frm");
	comSubmit.setUrl("/board/updateBlog.do");
	comSubmit.addParam("IDX", $("#IDX").val());
	comSubmit.submit();
}

function fn_addFile(){
	var str = "<p class='col-xs-12'  style='height:50px;'>" +
			"<input type='file' id='file_"+(gfv_count)+"' name='file_"+(gfv_count)+"' style='display:inline;'>"+
			"<a href='#this' class='btn btn-default' id='delete_"+(gfv_count)+"' name='delete_"+(gfv_count)+"'>삭제</a>" +
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