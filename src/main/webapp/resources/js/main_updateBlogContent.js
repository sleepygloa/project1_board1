var MainUpdateBlogContentJs = function(){
	"use strict";
	
	return {
		init : function(){
			loadingViewBlogContent();
			
			updateBlogContentEvent();
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
				$('#updateBlogContentIdx').val(list.IDX);
				$('#updateBlogContentTitle').text(list.TITLE);
				$('#updateBlogContentSubject').text(list.SUBJECT);
				$('#updateBlogContentContent').text(list.CONTENT);
			}
		})
	}
	
	function viewBlogContentEvent(){
		
		$('#updateBlogContentCancelBtn').click(function(){
			window.location.href="/";
		})
		
		$('#updateBlogContentSaveBtn').click(function(){
			
		})
		
	}
	  
}();

$(document).ready(function(){
	MainUpdateBlogContentJs.init();
})