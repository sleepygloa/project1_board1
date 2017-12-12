$(document).ready(function(){

	$('#blogWriteBtn').click(function(){
		var comSubmit = new ComSubmit();
		comSubmit.setUrl("/board/blogWrite.do");
		comSubmit.submit();
		
	})
	
	$('#blogTotalSearchBtn').click(function(){
		var comSubmit = new ComSubmit();
		comSubmit.setUrl('/board/blog.do');
		comSubmit.submit();
	});
	
	$('#blogSearchBtn').click(function(){
		var comSubmit = new ComSubmit();
		comSubmit.setUrl('/board/blog.do');
		comSubmit.addParam('searchText', $('#blogSearchText').val());
		comSubmit.addParam('searchCate', $('#blogSearchCate').val());
		comSubmit.submit();
	})
	
	var pageNumValue = $('#paging').val();
	$('.paging'+pageNumValue+'').css('color', 'red');	
	
	fn_selectBoardList(1);
	
});

//게시판초기정보 저장 
function fn_selectBoardList(PageNo){
	var comAjax = new ComAjax();
	comAjax.setUrl("/board/blogList.do");
	comAjax.setCallback("fn_selectBoardListCallback");
	comAjax.addParam("PAGE_INDEX", $("#PAGE_INDEX").val());
	comAjax.addParam("PAGE_ROW", 15);
	if($('#blogSearchText') != undefined && $('#blogSearchText') != null){
		comAjax.addParam('searchText', $('#blogSearchText').val().trim());
		comAjax.addParam('searchCate', $('#blogSearchCate').val());
	}
	comAjax.ajax();
}

//콜백으로 게시판 정보 불러옴
function fn_selectBoardListCallback(data){
	var total = data.TOTAL;
	var body = $("table > tbody");
	
	body.empty();
	if(total == 0){
		var str = "<tr>" + 
					"<td colspan='4'>게시글이 없습니다. 작성해주세요.</td>"
				+	"</td>";
		body.append(str);
	}else{
		var params = {
				divId		:	"PAGE_NAVI",
				pageIndex	:	"PAGE_INDEX",
				totalCount	:	total,
				eventName	:	"fn_selectBoardList"
		};
		gfn_renderPaging(params); //이게뭐지
		
		var str = "";
		$.each(data.list, function(key, value){
			str += "<tr>" +
					"<td style='width:100px;'>" + value.IDX + "</td>" +
					"<td style='width:700px;'>" +
						"<div class='td_subject' style='display:inline-block;width:650px'>" +
						"<a href='#this' name='TITLE'>" + value.TITLE + "</a>" + 
						"<input type='hidden' id='IDX' name='IDX' value='" + value.IDX + "' />" + "</div>" +
					"</td>" +
					"<td style='width:200px;text-align:center;'>" + value.IN_USER_ID + "</td>" +
					"<td style='width:100px;'>" + value.READCOUNT + "</td>" +
				"</tr>";
		});
		body.append(str);
		
		$("a[name='TITLE']").on("click", function(e){
			e.preventDefault();
			fn_openBoardDetail($(this));
		});
	}
}

function fn_openBoardDetail(obj){
	var comSubmit = new ComSubmit();
	comSubmit.setUrl("/board/blogDetail.do");
	comSubmit.addParam("IDX", obj.parent().find("#IDX").val());
	comSubmit.submit();
}
