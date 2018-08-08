var programJs = function(){
	
	var gridData;
	
	return {
		init : function(){
			
			gridData = {
					title : ' 프로그램관리',
					tableTitle : '프로그램 목록',
					url : '/ctrl/set/getProgram',
			};
			
			fnList(gridData);
			
			
		}
	}
	
	function fnList(data){
		var title = '프로그램관리';
		var tableTitle = '프로그램 목록';
		var grid = '';
		var url = data.url;
		var colName = [];
		var colRow = [];
		
		$.ajax({
			url : data.url,
			success : function(result){
				console.log(result);
				var k = Object.keys(result);
				for(var i = 0; i < k.length; i++){
					colName.push(k);
				}
				
				
				
			}
		})
		
		
		
		
		grid += '<div class="col-lg-12">';
		grid += '<div class="card">';
		grid += '<div class="card-body">';
		
		grid += '<h5 class="card-title mb-4">'+tableTitle+'</h5>';
		
		grid += '<div class="table-responsive">';
		
		grid += '<table class="table center-aligned-table table-hover">';
		
		grid += '<thead>';
		grid += '<tr class="text-primary">';
		
		for(var i = 0; i < colName.length; i++){
			grid += '<th>';
			grid += colName[i];
			grid += '</th>';
		}
		
		grid += '</tr>';
		grid += '</thead>';
		
		grid += '<tbody>';
		
		for(var i = 0; i < colRow.length; i++){
			grid += '<tr class="tr_row_'+i+'">';
			
			var rowData = colRow[i];
			var keyName = Object.keys(rowData);
			var keyLength = keyName.length;
			for(var j = 0; j < keyLength; j++){
				grid += '<td class="td_row_'+keyName+'">';
				grid += rowData.keyName;
				grid += '</td>';
			}
			
			grid += '</tr>';
		}
		
		grid += '</tbody>';
		
		grid += '</table>';
		
		
		grid += '</div>';
		
		grid += '</div>';
		grid += '</div>';
		grid += '</div>';
		
		
		
		$('#programTitle').val(title);
		$('#programGrid').append(grid);
		
		
	};
	
	
}();


$(document).ready(function(){
	programJs.init();
})