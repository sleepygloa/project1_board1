var mainContentJs = function(){
	"use strict";
	
	
	return {
		init : function(){
			
			loadingMainContent();
			
			mainContentEvents();
		}
	}
	
	  function loadingMainContent(){
		  var id = null;
		  $.ajax({
			  url		: "/main/loadingMainBlogContent",
			  success	: function(result){
				  var contentMain = '';
				  var title_count = 0;
				  var title_subject_count = 0;
				  if(result.list.length > 0){
					  title_count = result.list[0].TITLE_COUNT;
					  title_subject_count = result.list[0].TOTAL_SUBJECT_COUNT;
				  }
				  
				  $('#blogContents_totalSectionCounts').text(title_count);
				  $('#blogContents_totalCounts').text(title_subject_count);
				  
				  
				  if(result.list){
					  var list = result.list;
					  var title = '';
					  var count = 0;
					  var subCount = 0;
					  
					  for(var i in list){
						  
						  if(title != list[i].TITLE){
							  title = list[i].TITLE
							  subCount = 0;
							  contentMain += 					  
								  '<section class="cont-article">'
								  +'<div class="container">'
								  +'<article class="article article--html">';
							  contentMain += 					  
							  '<div class="article-menu">'
								  +'<i class="devicon-html5-plain"></i>'
								  +'<h3 id="menuName">'+ list[i].TITLE +'</h3>'
								  +'<small><span id="menuCount">'+list[i].SUBJECT_COUNT+'</span> lessons</small>'
							  +'</div>'
							  +'<ol class="article-title">'
						  }
						  count++;
						  subCount++;
						  contentMain += 					  
						   '<li class="title">'
							  +'<a id="contentsHref" href="/html5-syntax"><em id="contentsNum">'+count+'</em> '+list[i].SUBJECT+'</a>'
						  +'</li>'
						  if(subCount == list[i].SUBJECT_COUNT){
							  contentMain += 					  
					  				'</ol>'
						  			+'</article>'
						  			+'</div>'
						  			+'</section>';
						  }
					  }

				  }
				  
				  $('#main').append(contentMain);
			  }
		  })
	  }
	  
	  function mainContentEvents(){
//		  $(document).on('click', '#blogAddBtn', function(){
//			  $('#body').empty();
//			  
			  blogAddDropdown();
//			  
//			  var blogAddContent = '';
//			  
//			  blogAddContent = '<div class="container"><textarea id="blogAddSetContent" class="col-xs-12 p-0" placeholder="내용을 입력해주세요"></textarea></div>';
//			  
//			  $('#body').append(blogAddContent);
//			  
//		  })
		  
		  function blogAddDropdown(){
			  $.ajax({
				  url : "/main/getBlogAddDropdownList",
				  success : function(result){
					  var options = '';
					  if(result.list){
						  var list = result.list;
						  for(var i in list){
							  options += '<li class="blogAddDropdownLi">'+list[i].TITLE+'</li>';
						  }  
					  }
					  options += '<li class="divider"></li>'
						  +'<li class="blogAddDropdownLi">새 컨텐츠</a></li>';
					  $('#blogAddDropdown').append(options);
				  }
			  })
		  }
		  
		  $(document).on('click', '.blogAddDropdownLi', function(){
			  var text = $(this).text();
			  $('#blogAddSetTitle').val(text);
		  })
		  
		  $(document).on('click', '#blogAddSubmit', function(){
			  var menu = $('#blogAddSetTitle').val();
			  var subject = $('#blogAddSetSubject').val();
			  
			  if(menu.length < 1){
				  alert('메뉴를 선택해주세요');
				  return false;
			  }else if(subject.length < 1){
				  alert('제목을 입력해주세요');
				  return false;
			  }
			  
			  var sendData = {
					  title		: menu,
					  subject	: subject
			  }
			  
		      var jsonStr = JSON.stringify(sendData);
			  
			  $.ajax({
				  url		: "/main/insertBlogAddContent",
				  data  	: jsonStr,
				  type		: "POST",
				  contentType: 'application/json; charset=utf-8',
				  success	: function(result){
					  alert('글이 게시되었습니다.');
					  window.location.href='/';
				  }
			  })
			  
		  })
		  
		  $(document).on('click', '#blogAddCancel', function(){
			  window.location.href='/';
		  })
	  }
	  
}();

$(document).ready(function(){
	mainContentJs.init();
})