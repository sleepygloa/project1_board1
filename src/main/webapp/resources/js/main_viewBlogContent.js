var MainViewBlogContentJs = function(){
	"use strict";
	
	return {
		init : function(){
			loadingViewBlogContent();
			
			viewBlogContentEvent();
		}
	}
	
	function loadingViewBlogContent(){
		console.log(mainData);
		$.ajax({
			url	 : '/main/viewBlogContent',
			data : mainData,
			type : "POST",
			success : function(result){
				var list = result.list[0];
				$('#viewbBlogContentTitle').text(list.TITLE);
				$('#viewbBlogContentSubject').text(list.SUBJECT);
				$('#viewBlogContentContent').text(list.SUBJECT);
			}
		})
	}
	
	function viewBlogContentEvent(){
		
		$('#viewBlogContentCancel').click(function(){
			window.location.href="/";
		})
		
		$('#viewBlogContentUpdateBtn').click(function(){
			
		})
		
	}
	  
}();

$(document).ready(function(){
	MainViewBlogContentJs.init();
})