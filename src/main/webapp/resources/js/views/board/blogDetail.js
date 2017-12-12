$(document).ready(function(){
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
});

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