//
//function loadingPgSetting(data){
//  	mainData = data; //?
//  	$.ajax({
//  		url		: "/manage/blog/viewPg",
//  		data	: data,
//  		type	: "POST",
//  		success	: function(result){
//  			$('#manageBlog').empty();
//  			$('#manageBlog').html(result);
//  		}
//  	})
//}
//  
////글쓰기버튼 
//function mainBlogInsertBtn(){
//	  var data = {
//			  idx  : '',
//			  page : '/manage/blog/updateBlogContent'
//	  }
//	  loadingPgSetting(data);
//}

//function viewBlogContentPg(idx){
//	var data = {
//			idx  : idx,
//			page : "/manage/blog/viewBlogContent"
//	}
//	loadingPgSetting(data);
//}

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
	
	var $grid = $('#blogGrid');
	
	return {
		init : function(){
			
			getBlogContent();
			
			getEvents();
			
		}
	}
	
	  function getBlogContent(){
			$grid.fnList({
				programId 	: 'blog',
				programNm 	: '블로그', 
				url 		: '/manage/blog/',
				colName		: ['IDX', 'TITLE', 'SUBJECT'],
				viewContents : true,
				viewContentsRe : true
			});
		  
	  }
	  
	  
	  function getEvents(){
		//글쓰기
		  $(document).on('click', '#manageBlogAddBtn', function(){
			  mainBlogInsertBtn();
		  })
	  }
	  
}();

$(document).ready(function(){
	blogJs.init();
})