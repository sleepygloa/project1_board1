$(document).ready(function(){
	$("#list").on("click", function(e){ //목록으로 버튼
		e.preventDefault();
		fn_openBoard();
	});
	
	$("#update").on("click", function(e){ //수정하기 버튼
		e.preventDefault();
		fn_openBoardUpdate();
	});
	
	$("a[name='file']").on("click", function(e){ //파일 이름
		e.preventDefault();
		fn_downloadFile($(this));
	});
	$("#delete").on("click", function(e){ //삭제하기 버튼
		e.preventDefault();
		fn_deleteBoard();
	});
	$("#update").on("click", function(e){ //수정하기 버튼
		e.preventDefault();
		fn_updateBoard();
	});
});

function fn_openBoard(){
	var comSubmit = new ComSubmit();
	comSubmit.setUrl("<c:url value='/board/blog.do' />");
	comSubmit.submit();
}

function fn_openBoardUpdate(){
	var idx = "${map.IDX}";
	var comSubmit = new ComSubmit();
	comSubmit.setUrl("<c:url value='/openBoardUpdate.do' />");
	comSubmit.addParam("IDX", idx);
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
		var comSubmit = new ComSubmit();
		comSubmit.setUrl("<c:url value='/deleteBoard.do' />");
		comSubmit.addParam("IDX", $('#IDX').val());
		comSubmit.addParam("PASSWD", $('#PASSWD').val());
		comSubmit.submit();
	}else{
		return false;
	} 
};
function fn_updateBoard(){
	var comSubmit = new ComSubmit();
	comSubmit.setUrl("<c:url value='/openBoardUpdate.do' />");
	comSubmit.addParam("IDX", $('#IDX').val());
	comSubmit.addParam("PASSWD", $('#PASSWD').val());
	comSubmit.submit();
};