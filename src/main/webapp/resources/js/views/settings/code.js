var menuJs = function(){
	
	var proNm = "code";
	
	var $grid = $('#codeGrid');
	
	return {
		init : function(){
			
			fnList();
			
			getEvents();
		}
	}
	
	function fnList(){
		$grid.fnList({
			programId 	: proNm,
			programNm 	: '메뉴', 
			editable 	: true,
			url 		: '/ctrl/settings/' + proNm + '/',
			colName		: ['CODE_CD', 'CODE_NM', 'CODE_DESC', 'CODE_ORDER', 'USE_YN'],
			colOption	: [
				{id:'CODE_CD', 			title:'코드', 			width:"50px"},
				{id:'CODE_NM', 			title:'코드명',		width:"50px"},
				{id:'CODE_DESC', 		title:'코드상세설명',	width:"100px"},
				{id:'CODE_ORDER', 		title:'코드순서', 		width:"150px"},
				{id:'USE_YN', 			title:'사용여부', 		width:"50px"},
			],
			btn			: ['addRow', 'delRow', 'saveRow']
		});
	}
	
	function getEvents(){
		$('#'+proNm+'Title').click(function(){
			console.log($grid.getGridData());
		});
	};
	
}();


$(document).ready(function(){
	menuJs.init();
})