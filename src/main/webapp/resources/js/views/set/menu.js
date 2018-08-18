var menuJs = function(){
	
	var $grid = $('#menuGrid');
	
	return {
		init : function(){
			
			fnList();
			
			getEvents();
		}
	}
	
	function fnList(){
		$grid.fnList({
			programId 	: 'menu',
			programNm 	: '메뉴', 
			url 		: '/ctrl/set/menu/',
			colName		: ['MENU_SEQ', 'MENU_PARENT_SEQ', 'PRO_CD', 'MENU_NM', 'MENU_ICO', 'MENU_ORDER'],
			btn			: ['save',  'addRow', 'delRow']
		});
	}
	
	function getEvents(){
		$('#menuTitle').click(function(){
			console.log($grid.getGridData());
		});
	};
	
}();


$(document).ready(function(){
	menuJs.init();
})