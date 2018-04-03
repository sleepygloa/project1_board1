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
				  if(result.list){
					  var list = result.list;
					  var title = '';
					  var count = 0;
					  var subCount = 0;
					  
					  var contentNavi = 
						  '<section class="cont-head">'
							+'<div class="container">'
								+'<p id="menu_count" class="cont-head-menu">'
								+'<strong id="blogContents_totalSectionCounts">'+list[0].TITLE_COUNT+'</strong> sections'
								+'</p>'
								+'<p id="content_count" class="cont-head-title">'
								+'<strong id="blogContents_totalCounts">'+list[0].TOTAL_SUBJECT_COUNT+'</strong> lessons'
								+'</p>'
							+'</div>'
							+'</section>';
					  
					  $('#main').append(contentNavi);
					  
					  for(var i in list){
						  console.log(list[i]);
						  
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
	  
}();

$(document).ready(function(){
	mainContentJs.init();
})