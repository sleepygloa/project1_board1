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



(function(window, $, undefined){
	
		


    $.fn.fnList = function(data){
    	initData = data;
    	url = data.url;
    	programId = data.programId; //프로그램 아이
    	uProgramId = programId.charAt(0).toUpperCase() + programId.slice(1); //프로그램 아이디 대문자

    	var title = data.programNm + '관리'; //페이지 상단의 페이지 제목
    	var tableTitle = data.programNm + '목록'; //그리드 이름
    	var grid = '';
    	(data.viewContents != undefined? viewContents = data.viewContents : viewContents = false);
    	(data.viewContentsRe != undefined? viewContentsRe = data.viewContentsRe : viewContentsRe = false);

    	colName = new Array();
    	colRow = new Array();
    	
    	
    	colOption = data.colOption;
    	console.log(colOption);

    	var btn = data.btn;

    	var $element = '';
    	var navi = '';
    	//dataSetting
//    	(data.checkBox == true ? checkBox = data.checkBox : checkBox);

    	$.ajax({
    		url : data.url + "get" + uProgramId,
    		async : false,
    		success : function(result){

    			/**
    			 * 키를 가져와 컬럼 이름을 구성
    			 * */
    			var colList = result.list[0];
    			var k = Object.keys(colList);
    			if(k.length > 0){
    				var tColName = [];
    				//그리드 옵션 중 컬럼 명이 없을
    				//조회된 모든 컬럼 불러옴.
    				if(data.colName == undefined){
        				for(var i = 0; i < k.length; i++){
        					tColName.push(k[i]);
        				}
        				colName = tColName;
        			//그리드 옵션 중에 컬럼명 지정
        			//지정한 컬럼만 불러옴.
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

    	/**
    	 * 그리드 상단 그룹 버튼
    	 * */
    	var gridDivContainer = $('<div class="col-lg-12" />');
    	var gridDivContainer2 = $('<div class="card" />');
    	var gridDivContainer3 = $('<div class="card-body" />');
    	var gridTitle = $('<h5 class="card-title mb-4">'+tableTitle+'</h5>');
    	var gridRes = $('<div class="table-responsive" /> ');

    	var gridBtnGrpStr = '';

    	if(btn != undefined){
    		for(var i = btn.length - 1; i >= 0; i--){
        		var btnName = btn[i];
        		if(btnName == 'search'){
        			gridBtnGrpStr += '<a href="#" id="'+programId+'SearchBtn" class="btn btn-outline-success btn-sm pull-right" >검색</a>';
        		}else if(btnName == 'add'){
        			gridBtnGrpStr += '<a href="#" id="'+programId+'AddBtn" class="btn btn-outline-success btn-sm pull-right" >추가</a>';
        		}else if(btnName == 'modify'){
        			gridBtnGrpStr += '<a href="#" id="'+programId+'ModifyBtn" class="btn btn-outline-success btn-sm pull-right" >수정</a>';
        		}else if(btnName == 'delete'){
        			gridBtnGrpStr += '<a href="#" id="'+programId+'DeleteBtn" class="btn btn-outline-success btn-sm pull-right" >삭제</a>';
        		}else if(btnName == 'addRow'){
        			gridBtnGrpStr += '<a href="#" id="'+programId+'AddRowBtn" class="btn btn-outline-success btn-sm pull-right" >행추가</a>';
        		}else if(btnName == 'delRow'){
        			gridBtnGrpStr += '<a href="#" id="'+programId+'DelRowBtn" class="btn btn-outline-success btn-sm pull-right" >행삭제</a>';
        		}else if(btnName == 'save'){
        			gridBtnGrpStr += '<a href="#" id="'+programId+'SaveBtn" class="btn btn-outline-success btn-sm pull-right" >저장</a>';
        		}
        	}
    	}

    	var gridBtnGrp = $(gridBtnGrpStr);


    	/**
    	 * 그리드 테이블
    	 * */
    	var table = $('<table class="table center-aligned-table table-hover tableScrollX" />');


    	var thead = $('<thead />');
    	var thtr = $('<tr />');
    		thtr.addClass('text-primary');

    	var ththData = '';
    	//FLAG
		ththData += '<th>'+'FLAG'+'</th>';
		//FLAG End
    	for(var i = 0; i < colName.length; i++){
    		ththData += '<th>'+colName[i]+'</th>';
    	}
    	var thth = $(ththData);

    	thead.append(thth);

		/**
		 * Grid Option
		 * Row 에 대한 IDX 값 세팅
		 * tr 시작
		 *
		 * ViewContents == true; --> 글보기
		 * ViewContents == false; --> 글보기 없음
		 * */
    	var tbody = $('<tbody />');

    	for(var i = 0; i < colRow.length; i++){
    		trCnt++;
	    	var tbtr = $('<tr class="tr_row_"'+i+'" />');
	    	if(viewContents){
	    		tbtr.addClass('viewContents_'+colRow[i].IDX);
	    	}

			var tbthData = '';
				tbthData += '<td class="td_row_flag" ><i class="fa" ></i><input class="td_row_flag_input" type="hidden" value="" /></th>';

			var rowData = colRow[i];
			var keyName = Object.keys(rowData);

			for(var j = 0; j < data.colName.length; j++){
	    		$.each(rowData, function(i, v){
	    			if(data.colName[j] == i){
	    				tbthData += '<td class="td_row_'+i+'">'+v+'</td>';
	    			}
	    		});
			}
			var tbth = $(tbthData);
			tbtr.append(tbth);
			tbody.append(tbtr);
    	}
		table.append(thead);
		table.append(tbody);
		//table End

		gridRes.append(gridBtnGrp).append(table);
    	gridDivContainer3.append(gridTitle).append(gridRes);
    	gridDivContainer2.append(gridDivContainer3);
    	gridDivContainer.append(gridDivContainer2);

    	$('#'+programId+'Title').val(title);
    	$('#'+programId+'Grid').html(gridDivContainer);
    }

    $.fn.getLoadingPage = function(data){
    	blogData = data;
	  	$.ajax({
	  		url		: url + '/viewPg',
	  		data	: data,
	  		type	: "POST",
	  		async	: false,
	  		success	: function(result){
	  			$('#view'+uProgramId).empty();
	  			$('#view'+uProgramId).html(result);

	  			$('#'+programId+'BlogContainer').getContents();
	  		}
	  	});
    }

    /**
     * 공통된 프로그램 id 이용하여 블로그 형태의 글을 불러오는 소스
     * */
    $.fn.getContents = function(){
    	$.ajax({
			url	 : url + '/view'+ uProgramId,
			data : blogData,
			type : "POST",
			async:false,
			success : function(result){
				console.log(result);
				var list = result.map;
					blogIdx = list[0].IDX;
					var idCheck = result.S_CHECK_ID;
					$('#'+programId+'Title').val(list[0].TITLE);
					$('#'+programId+'Subject').val(list[0].SUBJECT);

					for(var i = 0; i < list.length; i++){
						if(list[i].CONTENT == undefined){

						}else{

							var contEl = $('<div id="content_'+i+'" class="col-lg-12" />');
							var conts;
							if(list[i].TYPE == 'IMG'){
								conts = $('<img />');
								conts.attr('src', list[i].CONTENT);
								conts.attr('width', list[i].IMGWIDTHSCALE + '%');
							}else if(list[i].TYPE == 'CODE'){
								contEl.css('background-color', 'gray');
								contEl.css('color', 'white');
							}else{
							}

							contEl.append(conts);
							$('#view'+uProgramId+'Container').append(contEl);



							var content = list[i].CONTENT;

							if(list[i].TYPE != 'IMG'){
								content = content.replace(/</gi, '&lt')
												 .replace(/>/gi, '&gt')
												 .split("\n");
								var rc = '';
					           $.each(content, function(j){
					        	   rc += '<span>'+content[j]+'<br /></span>';
					            });
					           $('#content_'+i).append(rc);
							}
						}
					}

					if(idCheck){
						$('#'+programId+'ModifyBtn').css('display', 'inline-block');
						$('#'+programId+'DeleteBtn').css('display', 'inline-block');
					}

					var list = result.list;
					var str = '';
					//list[i].ORIGINAL_FILE_NAME

				}
		})
    }

    /**
     * 블로그 글의 댓글 리스트를 불러오는 소스
     * */
    $.fn.getBlogRe = function(){
		$.ajax({
			url  	: url + "/getRe" + uProgramId,
			data 	: {
				idx : gridData.idx
			},
			type	: "POST",
//			async	: false,
			success : function(result){
				
				var result = result.list;
				var body = $('#'+programId+"Re");
				body.empty();

				/**
				 * 댓글 영역
				 * 댓글이  0 = 글쓰기 폼만 보여짐
				 * 댓글이 존재 = 댓글과 글쓰기폼이 보여짐 
				 * 
				 * 댓글 개수, 정렬준(인기순, 최신순, 날짜 오름차순)
				 * 유저 이미지(페이스북 이미지)
				 * */
				
				var reContent = '<div class="col-lg-12">';
				var reContentNew =
					'<div class="col-lg-12 re-contents-input" style="display:inline-block">'
					
						+ '<div class="" style="float:left;"><a><img class="re-cp-img" src="#"  /></a></div>'
						+ '<input id="'+programId+'ReWriter" class="col-lg-2" type="text" value="'+(s_userId == null? '' : s_userId)+'" style="padding:0px;display:none;" />'
						+ '<div class="" style="float:right;min-width:220px;width:90%" ><textarea id="'+programId+'ReContent" style="height:100%;width:100%" ></textarea></div>'
						+ '<div style="float:right;min-width:220px;width:90%;height:50px;">'
							+ '<div><label><input type="checkbox" />Facebook에도 게시</label><a style="float:right;">게시하려면 로그인을 하세요</a></div>'
						+ '</div>'
					+ '</div>';
				
				
				reContent += reContentNew;
								
				//RE_STEP 댓글 단계 
				//IN_USER_ID 사용자이름
				//IN_DT 입력시간
				//
					
				$.each(result, function(key, value){
					var reContentView =
						'<div class="col-lg-12 re-contents" style="display:inline-block">'
							+ '<div class="" style="float:left;"><a><img class="re-cp-img" src="#"  /></a></div>'
						
							+ '<div class="" style="float:right;min-width:220px;width:90%" >'
								+ '<span>' + value.IN_USER_ID + '</span>'
								+ '<div>'+value.CONTENT+'</div>'
							+ '</div>'
							+ '<div style="float:right;min-width:220px;width:90%;">'
//								+ '<div><label><input type="checkbox" />Facebook에도 게시</label><a style="float:right;">게시하려면 로그인을 하세요</a></div>'
								
								if(s_userId == value.IN_USER_ID){
									+ '<span>'
									+	'<a href="#this" id="'+programId+'ReDelBtn" >댓글삭제'
									+	'<input class="ref" type="hidden" value="'+value.REF+'" />'
									+	'<input class="reStep" type="hidden" value="'+value.RE_STEP+'" />'
									+	'</a> '
									+ '</span>';
								}
								if(value.RE_STEP == 0){
									+ '<span>'
									+	'<a href="#this"  id="'+programId+'ReAddBtn" )">답변달기'
									+	'<input class="ref" type="hidden" value="'+value.REF+'" />'
									+	'<input class="reStep" type="hidden" value="'+value.RE_STEP+'" />'
									+	'</a>'
									+ '</span>';
								}
						reContentView += 
							'</div>'
						+ '</div>';
						reContent += reContentView;
				});
				
				
//				
//				
//				var reCPDivInput = ('<div class="col-lg-12 re-contents-input" />');
//				
//				var reCPDivImg = $('<div class="re-cp" />');
//				
//				var reCPDivCont = $('<div class="re-cp" />');
//				
//				var reCPDivImgA = $('<a><img src="#" class="re-cp-img" /></a> ');
//				reCPDivImg.append(reCPDivImgA);
//				
//				var reCPDivNm = $('<span class="re-cp-nm" />');
//				reCPDivNm.append(s_userId);
//				
//				var reCPDivContent = $('<div class="col-lg-12 re-cp-cont" />');
				
				

				reContent += '</div>';
				body.append(reContent);

			}
		})
    }

    //현재 선택된 행 데이터 리턴
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
        			page : url + "/view" + uProgramId
        	}
//        	fnLoadingPage(data);
        	$('#view'+uProgramId).getLoadingPage(data);

        	if(viewContentsRe){
        		$('#'+programId+'Re').getBlogRe();
        	}

    	}
    }

    //그리드와 관련된 버튼을 클릭 했을때 이벤트
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
        	var data = {
        			idx  : '',
        			page : url + "update" + uProgramId
        	}
//        	fnLoadingPage(data);
        	$('#view'+uProgramId).getLoadingPage(data);
        	return false;
    	}else if(thisId.indexOf('Save') != -1){
    		console.log('Save');
			newUrl = 'modify'+ uProgramId;

    	}else if(thisId.indexOf('Modify') != -1){
    		console.log('Modify');
    		flag = 'modify';
    		newUrl = 'viewPg';

			var data = {
    				flag : flag,
					idx  : blogData.idx,
					page : url + 'update' + uProgramId,
					update : "Y"
			}
        	$('#view'+uProgramId).getLoadingPage(data);
			return false;
    	}else if(thisId.indexOf('Delete') != -1){
    		console.log('Delete');
    		flag = 'delete';
    		newUrl = 'modify' + uProgramId
    	}else if(thisId.indexOf('Cancel') != -1){
    		console.log('Cancel');
    		flag = 'cancel';
    		window.location.href="/";
    		return false;
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
    	}else if(thisId.indexOf('Row') != -1){
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
    	}else{
        	$.ajax({
        		url		: url + newUrl,
        		type	: "POST",
        		data	: JSON.stringify(blogData),
                dataType: 'json',
                async	: false,
    			contentType : "application/json, charset=utf-8",
        		success : function(data){

        			$('#view'+uProgramId).empty();
        			$('#view'+uProgramId).html(data);
        		}
        	});
    	}

    });


  //글쓰기버튼
    function mainBlogInsertBtn(){
    	  var data = {
    			  idx  : '',
    			  page : url + '/updateBlog'
    	  }
    	  loadingPgSetting(data);
    }

}(window, jQuery));


