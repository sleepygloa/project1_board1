var mainData = '';

function loadingPgSetting(data){
  	mainData = data; //?
  	$.ajax({
  		url		: "/main/viewPg",
  		data	: data,
  		type	: "POST",
  		success	: function(result){
  			$('#main').empty();
  			$('#main').html(result);
  		}
  	})
}
  
//글쓰기버튼 
function mainBlogInsertBtn(){
	  var data = {
			  idx  : '',
			  page : '/main/updateBlogContent'
	  }
	  loadingPgSetting(data);
}

function viewBlogContentPg(idx){
	var data = {
			idx  : idx,
			page : "/main/viewBlogContent"
	}
	loadingPgSetting(data);
}

function blogChileListToggle(count){
	var listCss = $('.blogSubject_'+count);
	if(listCss.is(":visible")){
		listCss.css('display', 'none');
	}else{
		listCss.css('display', 'block');
	}
	
}
var mainContentJs = function(){
	"use strict";
	
	return {
		init : function(){
			
			loadingMainContent();
			
			mainContentEvent();
			
		}
	}
	
	
	  function loadingMainContent(){
		  var id = null;
		  $.ajax({
			  url		: "/main/loadingMainBlogContent",
			  success	: function(result){
				  if(result.ADMIN_YN == 'Y') $('#blogAddBtn').css('display','block');
				  
				  var contentMain = '';
				  var title_count = 0;
				  
				  if(result.list.length > 0){
					  title_count = result.list[0].TITLE_COUNT;
				  }
				  $('#blogContents_totalSectionCounts').text(title_count);
				  
				  
				  if(result.list){
					  var list = result.list;
					  var title = '';
					  var count = 0;
					  var subCount = 0;
					  
					  for(var i in list){
						  if(title != list[i].TITLE){
							  title = list[i].TITLE;
							  contentMain += '<ul class="blogLeftList blogTitle_'+count+'" onclick="blogChileListToggle('+count+')"><h6 id="menuName">'+ list[i].TITLE +'</h6>';
						  }
						  subCount++;
						  contentMain += '<li class="blogLeftList blogSubject_'+count+'" style="display:none;"><a onclick="viewBlogContentPg('+list[i].IDX+')">'+list[i].SUBJECT+'</a></li>'
						  
						  if(subCount == list[i].SUBJECT_COUNT) {
							  contentMain += '</ul>';
							  count++;
						  }
					  }

				  }
				  
				  $('#blogLeftNavi').append(contentMain);
				  
			  }
		  })
	  }
	  
	  
	  
	  function mainContentEvent(){
		//글쓰기
		  $(document).on('click', '#blogAddBtn', function(){
			  mainBlogInsertBtn();
		  })
	  }
	  
}();

$(document).ready(function(){
	mainContentJs.init();
})