var programJs = function(){
	
	var $grid = $('#programGrid');
	
	return {
		init : function(){
			
			fnList();
			
			getEvents();
		}
	}
	
	function fnList(){
		$grid.fnList({
			programId 	: 'program',
			programNm 	: '프로그램', 
			url 		: '/ctrl/set/program/',
			colName		: ['PRO_CD', 'PRO_NM', 'PRO_DESC', 'CALL_URL'],
			btn			: ['search', 'add', 'modify', 'delete', 'save',  'addRow', 'delRow']
		});
	}
	
	function getEvents(){
		$('#programTitle').click(function(){
			console.log($grid.getGridData());
		});
	};
	
}();


$(document).ready(function(){
	programJs.init();
})