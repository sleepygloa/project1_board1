var MainUpdateBlogContentJs = function(){
	"use strict";
	
	return {
		init : function(){
			loadingViewBlogContent();
			
			updateBlogContentEvent();
		}
	}
	
	function loadingViewBlogContent(){
		$.ajax({
			url	 : '/main/updateBlogContent',
			data : mainData,
			type : "POST",
			success : function(result){
				var list = result.list[0];
				idx = list.IDX;
				$('#updateBlogContentTitle').text(list.TITLE);
				$('#updateBlogContentSubject').val(list.SUBJECT);
				$('#updateBlogContentContent').text(list.CONTENT);
			}
		})
	}
	
	function updateBlogContentEvent(){
		
		$('#updateBlogContentCancelBtn').click(function(){
			window.location.href="/";
		})
		
		$('#updateBlogContentSaveBtn').click(function(){
			var data = {
					idx : idx,
					subject : $('#updateBlogContentSubject').val(),
					content : $('#updateBlogContentContent').val()
			}
			$.ajax({
				url 	: "/main/saveBlogContent",
				data	: data,
				contentType : "application/json; charset=utf-8",
				success	: function(result){
					if(result.SUCCESS){
						alert(result.SUCCESS);
						window.location.href="/";
					}
				}
			})
		})
		
	}
	  
}();

$(document).ready(function(){
	MainUpdateBlogContentJs.init();
})