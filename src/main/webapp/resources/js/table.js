(function(window, $, undefined){
	
	var url = '';
	var programId = '';
	var uProgramId = '';
	var trCnt = -1;
	var clickCnt = -1; //클릭시 행번호 
	var colRow = null;
	var colName = null;
	var initData = '';
	
    $.fn.fnList = function(data){
    	initData = data;
    	url = data.url;
    	programId = data.programId;
    	uProgramId = programId.charAt(0).toUpperCase() + programId.slice(1);
    	var title = data.programNm + '관리';
    	var tableTitle = data.programNm + '목록';
    	var grid = '';

    	
    	colName = new Array();
    	colRow = new Array();
    	
    	var btn = data.btn;
    	
    	var $element = '';
    	var navi = '';
    	//dataSetting
//    	(data.checkBox == true ? checkBox = data.checkBox : checkBox);
    	
    	$.ajax({
    		url : data.url + "get" + uProgramId,
    		async : false,
    		success : function(result){
    			
    			var colList = result.list[0];
    			var k = Object.keys(colList);
    			if(k.length > 0){
    				var tColName = [];
    				if(data.colName == undefined){
        				for(var i = 0; i < k.length; i++){
        					tColName.push(k[i]);
        				}
        				colName = tColName;
    				}else{
    					for(var j = 0; j < data.colName.length; j++){
            				for(var i = 0; i < k.length; i++){
            					if(data.colName[j] == k[i]){
            						tColName.push(k[i]);
            						break;
            					}
            				}
    					}
    					colName = tColName;
    				}
    			}
    			colRow = result.list;
    			
    		}
    	});
    	
    	
    	grid += '<div class="col-lg-12">';
    	grid += '<div class="card">';
    	grid += '<div class="card-body">';
    	
    	grid += '<h5 class="card-title mb-4">'+tableTitle+'</h5>';
    	
    	grid += '<div class="table-responsive">';
    	
    	for(var i = btn.length - 1; i >= 0; i--){
    		var btnName = btn[i];
    		if(btnName == 'search'){
    			grid += '<a href="#" id="'+programId+'SearchBtn" class="btn btn-outline-success btn-sm pull-right" >검색</a>';
    		}else if(btnName == 'add'){
    			grid += '<a href="#" id="'+programId+'AddBtn" class="btn btn-outline-success btn-sm pull-right" >추가</a>';
    		}else if(btnName == 'modify'){
    			grid += '<a href="#" id="'+programId+'ModifyBtn" class="btn btn-outline-success btn-sm pull-right" >수정</a>';
    		}else if(btnName == 'delete'){
    			grid += '<a href="#" id="'+programId+'DeleteBtn" class="btn btn-outline-success btn-sm pull-right" >삭제</a>';
    		}else if(btnName == 'addRow'){
    			grid += '<a href="#" id="'+programId+'AddRowBtn" class="btn btn-outline-success btn-sm pull-right" >행추가</a>';
    		}else if(btnName == 'delRow'){
    			grid += '<a href="#" id="'+programId+'DelRowBtn" class="btn btn-outline-success btn-sm pull-right" >행삭제</a>';
    		}else if(btnName == 'save'){
    			grid += '<a href="#" id="'+programId+'SaveBtn" class="btn btn-outline-success btn-sm pull-right" >저장</a>';
    		}
    	}
    	grid += '<table class="table center-aligned-table table-hover">';
    	
    	grid += '<thead>';
    	grid += '<tr class="text-primary">';
		grid += '<th>';
		grid += 'FLAG';
		grid += '</th>';
    	for(var i = 0; i < colName.length; i++){
    		grid += '<th>';
    		grid += colName[i];
    		grid += '</th>';
    	}
    	
    	grid += '</tr>';
    	grid += '</thead>';
    	
    	grid += '<tbody>';
    	
    	for(var i = 0; i < colRow.length; i++){
    		trCnt++;
    		grid += '<tr class="tr_row_'+i+'" >';
    		
    		var rowData = colRow[i];
    		var keyName = Object.keys(rowData);

    		if(data.colName == undefined){
        		$.each(rowData, function(i, v){
        			grid += '<td class="td_row_'+i+'">';
        			grid += v;
        			grid += '</td>';
        		})
    		}else{
    			grid += '<td class="td_row_flag">';
    			grid += '<i class="fa" ></i>';
    			grid += '<input class="td_row_flag_input" type="hidden" value="" />';
    			grid += '</td>';
    			for(var j = 0; j < data.colName.length; j++){
            		$.each(rowData, function(i, v){
            			if(data.colName[j] == i){
                			grid += '<td class="td_row_'+i+'">';
                			grid += v;
                			grid += '</td>';
            			}

            		})
    			}

    		}
    		grid += '</tr>';
    	}
    	
    	grid += '</tbody>';
    	
    	grid += '</table>';
    	
    	
    	grid += '</div>';
    	
    	grid += '</div>';
    	grid += '</div>';
    	grid += '</div>';
    	
    	$('#'+programId+'Title').val(title);
    	$('#'+programId+'Grid').html(grid);
    	
    }
    
    var gridData = {};

    $.fn.getGridData = function(){
    	return gridData;
    }
    
    $(document).on('click blur','tr[class^=tr_row_]', function(e){
    	gridRowGridBlurEvent($(this));
    });
    
    function gridRowGridBlurEvent(thisData){
    	var thisData = thisData;
    	var rowId = thisData.attr('class').split('tr_row_')[1];
    	var tdData = thisData.children('td');
    	var tdRowData = {};
    	clickCnt = rowId;
    	var faFlag = null;
    	
    	var elI = $(tdData[0]).children('i');
    	
    	if(elI.hasClass('fa-plus')){
    		for(var i = 0; i < tdData.length; i++){
        		var el = $(tdData[i]);
    			console.log('plus');
    			var inputData = el.children('input')[0].value;
        		var inputKeyTrans = el.attr('class').split('td_row_')[1].toLowerCase();
        		
        		var inputKeyArr = inputKeyTrans.split("_");
        		var inputKey = '';

        		for(var j = 0 ; j < inputKeyArr.length;j++){
        			if(j == 0){
        				inputKey += inputKeyArr[j];
        			}else{
        				inputKey += inputKeyArr[j].charAt(0).toUpperCase() + inputKeyArr[j].slice(1);
        			}
        		}
        		tdRowData[inputKey] = inputData;
        	}
    	}else if(elI.hasClass('fa-minus') || elI.hasClass('modify')){
    		console.log('minus');
    		for(var i = 0; i < tdData.length; i++){
        		var el = $(tdData[i]);
        		console.log(el);
        		var tdKeyTrans = el.attr('class').split('td_row_')[1].toLowerCase();
        		var tdKeyArr = tdKeyTrans.split("_");
        		var tdKey = '';

        		for(var j = 0 ; j < tdKeyArr.length;j++){
        			if(j == 0){
        				tdKey += tdKeyArr[j];
        			}else{
        				tdKey += tdKeyArr[j].charAt(0).toUpperCase() + tdKeyArr[j].slice(1);
        			}
        		}
        		if(i == 0){
        			var tdFlagData = el.children('.td_row_flag_input')[0].value;
        			tdRowData[tdKey] = tdFlagData;
        		}else{
        			tdRowData[tdKey] = el.text();
        		}
        	}
    	}
    	console.log(tdRowData);
    	gridData = tdRowData;
    }
    

    $(document).on('click','a[id$=Btn]', function(e){
    	var thisId = $(this).attr('id');

    	var programId = '';
    	var flag = '';
    	var newUrl = '';
    	
    	if(thisId.indexOf('Search') != -1){
    		console.log('Search');
    		flag = 'search';
    		newUrl = 'get' + uProgramId;
    	}else if(thisId.indexOf('AddRow') != -1){
    		trCnt++;
    		var str = '<tr class="tr_row_'+trCnt+'" >';
			str += '<td class="td_row_flag">';
				str += '<i class="fa fa-plus"></i>';
				str += '<input class="input-sm td_row_flag_input" type="hidden" value="insert" />';
			str += '</td>';
    		$.each(colName, function(i, v){
    			str += '<td class="td_row_'+v+'">';
    			str += '<input class="input-sm td_row_'+v+'_input" type="text" value="" />';
    			str += '</td>';
    		});
    			str += '</tr>';
			$('tbody').append(str);
    		return false;
    	}else if(thisId.indexOf('DelRow') != -1){
    		var delI = $('.tr_row_'+clickCnt).find('i')[0];
    		var delInput = $('.tr_row_'+clickCnt).find('input.td_row_flag_input')[0];
    		if(delInput.value == ""){
    			delI.classList.add('fa-minus');
    			delInput.value = "delete";
    		}else{
    		}
    		gridRowGridBlurEvent($('.tr_row_'+clickCnt));
			return false;
    	}else if(thisId.indexOf('Add') != -1){
    		console.log('Add');
    		flag = 'add';
    		newUrl = 'modify' + uProgramId
    	}else if(thisId.indexOf('Save') != -1){
    		console.log('Save');
			newUrl = 'modify'+ uProgramId;
    		
    	}else if(thisId.indexOf('Modify') != -1){
    		console.log('Modify');
    		flag = 'modify';
    		newUrl = 'modify' + uProgramId
    	}else if(thisId.indexOf('Delete') != -1){
    		console.log('Delete');
    		flag = 'delete';
    		newUrl = 'modify' + uProgramId
    	}
    	
    	$.ajax({
    		url		: url + newUrl,
    		type	: "POST",
    		data	: JSON.stringify(gridData),
            dataType: 'json',
            async	: false,
			contentType : "application/json, charset=utf-8",
    		success : function(data){
    			$('#'+programId+'Grid').remove();
    			$('#'+programId+'Grid').fnList(initData);
    		}
    	});
    	
    });
    
    
}(window, jQuery));


