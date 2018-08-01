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
			url		: "/getSidebarMenu",
			success : function(data){
				console.log(data);
				$('#sidebarMenu').empty();
				
				var menuStr = '<li class="nav-item active">'
					+'<a class="nav-link" href="index.html">'
					+'<img src="images/icons/1.png" alt="">'
					+'<span class="menu-title">Dashboard</span>'
					+'</a>'
					+'</li>'
				
	              
	                
	                
	              
	            
				
				
				$('#sidebarMenu');
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
