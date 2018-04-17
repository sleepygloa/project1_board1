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
				var idCheck = result.S_CHECK_ID;
				$('#viewBlogContentIdx').val(list.IDX);
				$('#viewBlogContentTitle').text(list.TITLE);
				$('#viewBlogContentSubject').text(list.SUBJECT);
				$('#viewBlogContentContent').text(list.CONTENT);
				
				if(idCheck){
					$('#viewBlogContentUpdateBtn').css('display', 'inline-block');
				}
			}
		})
	}
	
	function viewBlogContentEvent(){
		
		$('#viewBlogContentCancelBtn').click(function(){
			window.location.href="/";
		})
		
		$('#viewBlogContentUpdateBtn').click(function(){
			var data = {
					idx  : $('#viewBlogContentIdx').val(),
					page : "/main/updateBlogContent"
			}
			loadingPgSetting(data);
		})
	}
	  
}();

$(document).ready(function(){
	MainViewBlogContentJs.init();
})