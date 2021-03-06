
function blogChileListToggle(count){
	var listCss = $('.blogSubject_'+count);
	if(listCss.is(":visible")){
		listCss.css('display', 'none');
	}else{
		listCss.css('display', 'block');
	}

}
var blogJs = function(){
	"use strict";
	
	var proCd = "";
	var proNm = "blog";

	var $grid = $('#blogGrid');
	
	return {
		init : function(){

			fnEvents();
			
			fnList();

		}
	}
	
	function fnEvents(){
	}

	  function fnList(){
			$grid.fnList({
				programId 	: 'blog',
				programNm 	: '블로그',
				url 		: '/ctrl/manage/blog/',
				colName		: ['IDX', 'TITLE', 'SUBJECT'],
				colOption	: [
					{id:'IDX', 		title:'순번', width:"50px"},
					{id:'TITLE', 	title:'분류',width:"150px"},
					{id:'SUBJECT', 	title:'제목',width:"500px"}
				],
				viewContents : true,
				viewContentsRe : true,
				btn			: ['add', 'update', 'save']
			});

	  }

}();

$(document).ready(function(){
	blogJs.init();
})