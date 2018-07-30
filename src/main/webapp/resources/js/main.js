var coreJs = function(){
	"use strict";
	
	return {
		init : function(){
			
			getMenu();
			
			getAuth();
			
//			loadingMainContent();
			
//			loadingSession();
			
//			mainEvents();
			
		}
	}

	function getMenu(){
		$.ajax({
			url		: "",
			success : function(data){
				
			}
		});
	}
	
	function getAuth(){
		$.ajax({
			url		: "",
			success : function(data){
				
			}
		});
	}
	
	
	
	
	
	
	
}();

$(document).ready(function(){
	coreJs.init();
});
