function viewBlogContentPg(idx){
	var data = {
			idx  : idx,
			page : "/main/viewBlogContent"
	}
	loadingPgSetting(data);
}

var mainContentJs = function(){
	"use strict";
	
	return {
		init : function(){
			
			loadingMainContent();
			
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
				  
				  var contentNavi = 
					  '<section class="cont-head">'
						+'<div class="container">'
							+'<p id="menu_count" class="cont-head-menu">'
							+'<strong id="blogContents_totalSectionCounts">'+title_count+'</strong> sections'
							+'</p>'
							+'<p id="content_count" class="cont-head-title">'
							+'<strong id="blogContents_totalCounts">'+title_subject_count+'</strong> lessons'
							+'</p>'
							+'<div id="blogAddBtn" class="pull-right m-t-10"><i class="fa fa-lg fa-plus"></i></div>'
						+'</div>'
						+'</section>';
				  
				  $('#main').append(contentNavi);
				  
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
							  +'<a onclick="viewBlogContentPg('+list[i].IDX+')"><em id="contentsNum">'+count+'</em> '+list[i].SUBJECT+'</a>'
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
	  
}();

$(document).ready(function(){
	mainContentJs.init();
})