var BlogListApp = function(){
	"use strict"
	
	var $blogListGrid = $('#blogListGrid');
	
	return {
		init : function(){
			blogListGridInit();
		}
	}
	
	function blogListGridInit(){
		$blogListGrid.jqGrid({
	        url: '/blog/blogList.do',
	        datatype: "json",
	        colModel: [
	            { label: 'IDX', name: 'IDX', key: true, width: 75 },
	            { label: 'TITLE', name: 'TITLE', width: 150 },
	            { label: 'CONTENT', name: 'CONTENT', width: 150},
	        ],
			viewrecords: true,
	        width: 780,
	        height: 250,
	        rowNum: 20,
	        pager: "#blogListPager"
	    });
	}
	
	
}();

$(document).ready(function () {
	BlogListApp.init();
});