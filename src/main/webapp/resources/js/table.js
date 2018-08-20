var url = '';
var programId = '';
var uProgramId = '';
var trCnt = -1;
var clickCnt = -1; //클릭시 행번호 
var colRow = null;
var colName = null;
var initData = '';
var viewContents = false;
var viewContentsRe = false;
var blogData = '';
var gridData = {};
var s_userId = null;

function fnLoadingPage(data){
	blogData = data;
//  	mainData = data; //?
  	$.ajax({
  		url		: "/manage/blog/viewPg",
  		data	: data,
  		type	: "POST",
  		async	: false,
  		success	: function(result){
  			$('#view'+uProgramId).empty();
  			$('#view'+uProgramId).html(result);
  		}
  	})
}

(function(window, $, undefined){
	

	
    $.fn.fnList = function(data){
    	initData = data;
    	url = data.url;
    	programId = data.programId;
    	uProgramId = programId.charAt(0).toUpperCase() + programId.slice(1);
    	var title = data.programNm + '관리';
    	var tableTitle = data.programNm + '목록';
    	var grid = '';
    	(data.viewContents != undefined? viewContents = data.viewContents : viewContents = false);
    	(data.viewContentsRe != undefined? viewContentsRe = data.viewContentsRe : viewContentsRe = false);
    	
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
    	
    	if(btn != undefined){
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
    		if(viewContents){
    			if(colRow[i].IDX == undefined){
    				alert('IDX 가 없습니다.');
    				return false;
    			}else{
    				grid += '<tr class="tr_row_'+i+' viewContents_'+colRow[i].IDX+'" >';
    			}
    		}else{
    			grid += '<tr class="tr_row_'+i+'" >';
    		}
    		
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
    
    $.fn.getBlogRe = function(){
    	console.log(gridData);
		$.ajax({
			url  	: "/manage/blog/getReBlog",
			data 	: {
				idx : gridData.idx
			},
			type	: "POST",
			async:false,
			success : function(result){
				var result = result.list;
				var body = $('#'+programId+"Re");
				body.empty();
				
				var reContent = '<div class="col-lg-12">';
				if(result == undefined || result.length == 0){
					reContent = '<div class="col-lg-12">댓글이 없습니다. 작성해주세요.</div>';
				}else{
					$.each(result, function(key, value){
						console.log(value);
						reContent += 
								'<div class="col-lg-12 re-contents">'
								+	'<div class="col-lg-12">'
								+	'<span style="text-align:left;">'+(value.RE_STEP > 0 ? ' ㄴ ' : '') + value.IN_USER_ID+' '+value.IN_DT+' </span>';
							if(s_userId == value.IN_USER_ID){
								reContent +=	'<span><a href="#this" id="'+programId+'ReDelBtn" >댓글삭제'
											+	'<input class="ref" type="hidden" value="'+value.REF+'" />'
											+	'<input class="reStep" type="hidden" value="'+value.RE_STEP+'" />'
											+	'</a> ';	
							}
							reContent += (value.RE_STEP == 0 ? '<a href="#this"  id="'+programId+'ReAddBtn" )">답변달기'
									+	'<input class="ref" type="hidden" value="'+value.REF+'" />'
									+	'<input class="reStep" type="hidden" value="'+value.RE_STEP+'" />'
									+	'</a>' : '') 
								+	'</span>' 
								+	'</div>'
								+	'<div id="'+programId+'ReContentPlace_'+value.REF+'_'+value.RE_STEP+'" class="col-lg-12">'
									+	"<div style='text-align:left;'>"+(value.RE_STEP > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;" : "") + value.CONTENT+"</div>"
								+	'</div>'
							+	'</div>';

					});
				}
				reContent += 
							'<div class="col-lg-12 re-contents-input">' 
							+	'<div class="col-lg-12">'
								+	'<span class="col-lg-2">작성자</span>'
								+	'<input id="'+programId+'ReWriter" class="col-lg-2" type="text" value="'+(s_userId == null? '' : s_userId)+'" style="padding:0px;" disabled />'
								+	'<a class="btn btn-default" id="'+programId+'ReSaveBtn">댓글쓰기</a>'
							+	'</div>'
							+	'<div>'
								+	'<textarea id="'+programId+'ReContent" class="col-lg-12" style="height:50px;"></textarea>'
							+	'</div>'
						+	'</div>';

				reContent += '</div>';
				body.append(reContent);
				
			}
		})
    }
    

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
    	}else{
    		console.log('minus');
    		for(var i = 0; i < tdData.length; i++){
        		var el = $(tdData[i]);
        		
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
    	
    	if(gridData.idx != undefined){
        	var data = {
        			idx  : gridData.idx,
        			page : "/manage/blog/viewBlogContent"
        	}
        	fnLoadingPage(data);
        	
        	if(viewContentsRe){
        		$('#'+programId+'Re').getBlogRe();
        	}
        	
    	}
    }
    

    $(document).on('click','a[id$=Btn]', function(e){
    	var thisId = $(this).attr('id');

    	var flag = '';
    	var newUrl = '';
    	var sendData = '';
    	
    	if(thisId.indexOf('ReReSaveBtn') != -1){
    		console.log('ReReSaveBtn');
    		flag = 'insert';
    		newUrl = 'saveReRe' + uProgramId;
    		if($('#'+programId+'ReReWriter').val() == ''){
    			alert('로그인을 해주세요.');
    			return false;
    		}else if($('#'+programId+'ReReContent').val() == ''){
    			alert('내용을 입력해주세요');
    			return false;
    		}
    		
    		var saveInput = $(this).children('input');
    		
    		sendData = {
    				idx		:	blogData.idx,
    				writer	:	$('#'+programId+'ReReWriter').val(),
    				content	:	$('#'+programId+'ReReContent').val(),
    				ref		:   saveInput[0].value,
    				reStep  :   saveInput[1].value
    		}
    		console.log(sendData);
    	}else if(thisId.indexOf('ReSaveBtn') != -1){
    		console.log('ReSaveBtn');
    		flag = 'insert';
    		newUrl = 'saveRe' + uProgramId;
    		if($('#'+programId+'ReWriter').val() == ''){
    			alert('로그인을 해주세요.');
    			return false;
    		}else if($('#'+programId+'ReContent').val() == ''){
    			alert('내용을 입력해주세요');
    			return false;
    		}
    		
    		sendData = {
    				idx		:	blogData.idx,
    				writer	:	$('#'+programId+'ReWriter').val(),
    				content	:	$('#'+programId+'ReContent').val()
    		}
    	}else if(thisId.indexOf('ReAddBtn') != -1){
    		console.log('ReAddBtn');
    		var addInput = $(this).children('input');
    		var getRef = addInput[0].value;
    		var gerReStep = addInput[1].value;
    		var refId = '#'+programId+'ReContentPlace_'+getRef+'_'+gerReStep;
    		console.log(refId);
//			$('#'+programId+'Re').getBlogRe();
    		
			var reReStr =	'<div class="col-lg-12">' 
							+	'<span class="col-lg-2">작성자</span>'
							+	'<input id="'+programId+'ReReWriter" class="col-lg-2" type="text" value="'+(s_userId == null? '' : s_userId)+'" style="padding:0px;" disabled />'
							+	'<a class="btn btn-default" id="'+programId+'ReReSaveBtn">댓글쓰기'
							+	'<input class="ref" type="hidden" value="'+getRef+'" />'
							+	'<input class="reStep" type="hidden" value="'+gerReStep+'" />'
							+	'</a>'
						+	'</div>'
						+	'<div>'
							+	'<textarea id="'+programId+'ReReContent" class="col-lg-12" style="height:50px;"></textarea>'
						+	'</div>';
    		$(refId).after(reReStr);
    		return false;
    	}else if(thisId.indexOf('ReDelBtn') != -1){
    		console.log('ReDelBtn');
    		flag = 'delete';
    		newUrl = 'deleteRe' + uProgramId;
    		
    		var delInput = $(this).children('input');
    		
    		if(!confirm('댓글을 삭제하시겠습니까?')){
    			return false;
    		}
    		sendData = {
    				idx		:	blogData.idx,
    				ref		:	delInput[0].value,
    				re_step	:	delInput[1].value
    		}
    	}else if(thisId.indexOf('Search') != -1){
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
    		flag = 'insert';
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
    	
    	if(thisId.indexOf('Re') != -1){
    		$.ajax({
    			url		: url + newUrl,
        		type	: "POST",
        		data	: JSON.stringify(sendData),
        		dataType : "json",
                async	: false,
    			contentType : "application/json, charset=utf-8",
    			success : function(result){
    				$('#'+programId+'Re').empty();
    				$('#'+programId+'Re').getBlogRe();
    			}
    		});
    	}else{
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
    	}

    });
    
    
  //글쓰기버튼 
    function mainBlogInsertBtn(){
    	  var data = {
    			  idx  : '',
    			  page : '/manage/blog/updateBlogContent'
    	  }
    	  loadingPgSetting(data);
    }
    
}(window, jQuery));


