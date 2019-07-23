var url = '';
var programId = '';
var uProgramId = '';
var trCnt = -1;

var colRow = null;
var colName = null;
var initData = '';
var viewContents = false;
var viewContentsRe = false;
var blogData = '';
var s_userId = null;



//콤보박스 만들기
function fnMakeCombo(targetStr, data){
    $.ajax({
        url      : "/ctrl/settings/code/listCodeCombo",
        data     : {
        	codeGroupCd:data
    	},
        type     : "POST",
        dataType : "json",
        async	 : false,
        success  : function(result) {
        	console.log(result)
        	var targetEl = $('#'+targetStr);
        	targetEl.empty();
        	var str = '';
    		for ( var i = 0; i < result.length ; i++){
    			str += '<option value="'+result[i].NAME+'">'+result[i].VALUE+'</option>'
    		}
    		targetEl.append(str);
        }
    });
}
var clickCnt = -1; //클릭시 행번호
var rowId = -1;
var contentLength = 0;
var focusIdx = -1;
function fnSaveIdx(i){
	focusIdx = i;
}
  




(function(window, $, undefined){


	//글 컨텐츠 불러오기.
    $.fn.getLoadingPage = function(data){
    	blogData = data;
    	console.log(data);
	  	$.ajax({
//	  		url		: data.url + '/view'+data.uProgramId,
	  		url		: data.url,
	  		type	: "POST",
	  		async	: false,
	  		success	: function(result){
	  			$('#'+tableInitData.programId+'View').empty();
	  			$('#'+tableInitData.programId+'View').html(result);
	  		}
	  	});
    }

    //현재 선택된 행 데이터 리턴
    $.fn.getGridData = function(){
    	return programInitData;
    }

    var tableInitData = {
    		initData 	: null, //초기데이터
    		url			: "", //그리드 URL
    		programId	: "", //화면 프로그램 ID
    		uProgramId	: "", //화면 프로그램 ID 대문자 치환
    		title		: "", //페이지 상단에 보여줄 제목
    		tableTitle	: "", //테이블 상단에 보여줄 테이블 제목
    		grid		: "",
    		
    		colName		: [],
    		colRow		: [],
    		colOption	: [],
    		viewContents	: false,
    		viewContentsRe	: false,
    		
    		btn			: []
    }
    
    var programInitData = {
    		idx	: "",
    }
    
    //그리드 초기화
    $.fn.fnList = function(data){
    	
    	//1. 데이터 세팅
		var gridDataKey = Object.keys(tableInitData);
		var dataKey = Object.keys(data);
		
		for ( var i in gridDataKey) {
			var key = gridDataKey[i];
			
			for(var j in dataKey){
				if(key == dataKey[j]){
					//변수마다의 특별한 조건 추가
					if(key == "programId"){
						tableInitData["uProgramId"] = data["programId"].charAt(0).toUpperCase() + data["programId"].slice(1);
						tableInitData[key] = data[dataKey[j]];						
					}else{
						tableInitData[key] = data[dataKey[j]];						
					}

				}
			}

		}
    	
    	
    	initData = data;
    	url = data.url;
    	programId = data.programId; //프로그램 아이디
    	uProgramId = programId.charAt(0).toUpperCase() + programId.slice(1); //프로그램 아이디 대문자

    	var title = data.programNm + '관리'; //페이지 상단의 페이지 제목
    	var tableTitle = data.programNm + '목록'; //그리드 이름
    	var grid = '';
    	(data.viewContents != undefined? viewContents = data.viewContents : viewContents = false);
    	(data.viewContentsRe != undefined? viewContentsRe = data.viewContentsRe : viewContentsRe = false);

    	colName = new Array();
    	colRow = new Array();
    	colOption = data.colOption;
    	
    	
    	//데이터 세팅

    	

    	var btn = data.btn;

    	var $element = '';
    	var navi = '';
    	//dataSetting
//    	(data.checkBox == true ? checkBox = data.checkBox : checkBox);

    	var editable = false;
    	if(data.editable) editable = data.editable;
    	var editableFlag = false;

    	
    	//그리드 컬럼 만드는 로직
    	//gridData.colName
    	//gridData.colRow
    	$.ajax({
    		url : tableInitData.url + "list" + tableInitData.uProgramId,
    		async : false,
    		success : function(result){

    			//키를 가져와 컬럼 이름을 구성
//    			var colList = result.dt_grid[0];
    			if(result.dt_grid.length > 0){
        			var k = Object.keys(result.dt_grid[0]);
        			if(k.length > 0){
        				var tColName = [];
        				//그리드 옵션 중 컬럼 명이 없을
        				//조회된 모든 컬럼 불러옴.
        				if(tableInitData.colName == undefined){
            				for(var i = 0; i < k.length; i++){
            					tColName.push(k[i]);
            				}
            				tableInitData.colName = tColName;
            			//그리드 옵션 중에 컬럼명 지정
            			//지정한 컬럼만 불러옴.
        				}else{
        					for(var j = 0; j < tableInitData.colName.length; j++){
                				for(var i = 0; i < k.length; i++){
                					if(tableInitData.colName[j] == k[i]){
                						tColName.push(k[i]);
                						break;
                					}
                				}
        					}
        					tableInitData.colName = tColName;
        				}
        			}
    			}
    			tableInitData.colRow = result.dt_grid;
    		}
    	});


    	//그리드 상단 그룹 버튼
    	var gridDivContainer = $('<div class="col-xs-w100" style="margin-bottom:50px;"/>');
    	
    	//페이지 타이틀 
    	var divPageTitle = $('<div class="col-xs-w100" />');
    	var divPageTitleH = $('<h5 class="card-title mb-4">'+tableInitData.tableTitle+'</h5>');
    	
    	divPageTitle.append(divPageTitleH);
    	gridDivContainer.append(divPageTitle);
    	
    	//그리드 버튼 그룹
    	var divBtnGroup = $('<div class="col-xs-w100" />');

    	var gridBtnGrpStr = '<div class="col-xs-w100" >';
	    	if(tableInitData.btn != undefined){
	    		for(var i = tableInitData.btn.length - 1; i >= 0; i--){
	        		var btnName = tableInitData.btn[i];
	        		if(btnName == 'search'){
	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'SearchBtn" class="btn btn-save btn-sm pull-right" >검색</a>';
	        		}else if(btnName == 'add'){
	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'AddBtn" class="btn btn-save btn-sm pull-right" >글 추가</a>';
	        		}else if(btnName == 'update'){
	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'UpdateBtn" class="btn btn-update btn-sm pull-right" >글 수정</a>';
	        		}else if(btnName == 'delete'){
	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'DeleteBtn" class="btn btn-delete btn-sm pull-right" >글 삭제</a>';
	        		}else if(btnName == 'addRow'){
	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'AddRowBtn" class="btn btn-add btn-sm pull-right" >행추가</a>';
	        		}else if(btnName == 'delRow'){
	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'DelRowBtn" class="btn btn-delete btn-sm pull-right" >행삭제</a>';
//	        		}else if(btnName == 'save'){
//	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'SaveBtn" class="btn btn-save btn-sm pull-right" >글 저장</a>';
	        		}else if(btnName == 'saveRow'){
	        			gridBtnGrpStr += '<a href="#" id="'+tableInitData.programId+'SaveRowBtn" class="btn btn-save btn-sm pull-right" >행저장</a>';
	        		}
	        	}
	    	}
    	gridBtnGrpStr += '</div>';
    	var gridBtnGrp = $(gridBtnGrpStr);
    	divBtnGroup.append(gridBtnGrp);
//    	gridDivContainer.append(divBtnGroup);

    	//테이블
    	var table = $('<table class="table center-aligned-table table-hover tableScrollX" />');

    	//테이블 헤더
    	var thead = $('<thead />');
    	var thtr = $('<tr />');
//    		thtr.addClass('text-primary');

    	var ththData = '';
    	//FLAG
		ththData += '<th>'+'FLAG'+'</th>';
		//FLAG End
    	for(var i = 0; i < tableInitData.colName.length; i++){
			var tdTitle = '', tdWidth = '100px', tdHidden = false, tdHiddenCss = 'show';

			if(tableInitData.colOption != undefined){
				if(tableInitData.colOption[i].id == tableInitData.colName[i]){
					(tableInitData.colOption[i].title != '' ? tdTitle = tableInitData.colOption[i].title : tdTitle = tableInitData.colOption[i].id);
					(tableInitData.colOption[i].width != '' ? tdWidth = tableInitData.colOption[i].width : tdWidth = '');
					(tableInitData.colOption[i].hidden != '' ? tdHidden = tableInitData.colOption[i].hidden : tdHidden = false);
					if(tdHidden) tdHiddenCss = 'none';
				}
			}
    		ththData += '<th style="width:'+tdWidth+'; display:'+tdHiddenCss+'">'+tableInitData.colName[i]+'</th>';
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

    	for(var i = 0; i < tableInitData.colRow.length; i++){
    		trCnt++;
	    	var tbtr = $('<tr id="tr_row_'+i+'" class="tr_row_'+i+'" />');

	    	//글 상세 보기 속성 있을때 클래스 추가
	    	if(viewContents){
	    		tbtr.addClass('viewContents_'+tableInitData.colRow[i].IDX);
	    	}

			var tbthData = '';
				tbthData += '<td class="td_row_flag" ><i class="fa" ></i><input class="td_row_flag_input" type="hidden" value="" /></th>';


			var rowData = tableInitData.colRow[i];
			var keyName = Object.keys(rowData);

			for(var j = 0; j < tableInitData.colName.length; j++){
				$.each(rowData, function(k, v){
					var tdTitle = '';
					var tdWidth = '100px';
					var tdHidden = false;
					var tdHiddenCss = 'show';

					if(tableInitData.colOption != undefined){
						if(colOption[j].id == k){
							(tableInitData.colOption[j].title != '' ? tdTitle = tableInitData.colOption[j].title : tdTitle = tableInitData.colOption[j].id);
							(tableInitData.colOption[j].width != '' ? tdWidth = tableInitData.colOption[j].width : tdWidth = '');
							(tableInitData.colOption[j].hidden != '' ? tdHidden = tableInitData.colOption[j].hidden : tdHidden = false);
							if(tdHidden) tdHiddenCss = 'none';
						}
					}

					if(data.colName[j] == k){
						tbthData += '<td class="td_row_'+k+'" style="width:'+tdWidth+';display:'+tdHiddenCss+'">'
						+ '<span class="td_row_s_'+i+'" style="display:show">'+v+'</span>'
						+ '<input type="text" class="td_row_i_'+i+'" value="'+v+'" style="display:none;width:100%" />'
						+ '</td>';
						return false;
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
		
		//버튼 그룹과 테이블 그룹을 한 div로 합침.
		var tableParentDiv = $('<div class="col-xs-w100" />');
		tableParentDiv.append(table);
		divBtnGroup.append(tableParentDiv);
		gridDivContainer.append(divBtnGroup);
		
		//타이틀, 테이블 버튼, 테이블 화면에 그림.
//    	gridDivContainer.append(tableParentDiv);
    	$('#'+programId+'Grid').html(gridDivContainer);



    	//
    	if(editable){
    		$('tr[id^="tr_row_"]').dblclick(function(){
    			rowId = $(this).attr('id').split('tr_row_')[1];
    			clickCnt = rowId;

        		if(!editableFlag){
            		$('input[class^="td_row_i_'+rowId+'"').css('display', 'block');
            		$('span[class^="td_row_s_'+rowId+'"').css('display', 'none');
            		editableFlag = true;
        		}else{
            		$('input[class^="td_row_i_'+rowId+'"').css('display', 'none');
            		$('span[class^="td_row_s_'+rowId+'"').css('display', 'block');

            		rowId = -1;
            		editableFlag = false;
        		}
    		});

    	}else{

    		$('tr[id^="tr_row_"]').click(function(){
    			rowId = $(this).attr('id').split('tr_row_')[1];
    			
    			
    			
    			gridRowGridBlurEvent($(this));
    		});
    	}
    }

    
    /**
     * 공통된 프로그램 id 이용하여 블로그 형태의 글을 불러오는 소스
     * */
    $.fn.getContents = function(){
    	contentLength = 0;
    	$.ajax({
			url	 : url + '/view'+ tableInitData.uProgramId,
			data : blogData,
			type : "POST",
			async:false,
			success : function(result){
				$(this).empty();
				var list = result.map;
					blogIdx = list[0].IDX;
					var idCheck = result.S_CHECK_ID;
					$('#'+tableInitData.programId+'Title').val(list[0].TITLE);
					$('#'+tableInitData.programId+'Subject').val(list[0].SUBJECT);
					
//					$('select[id='+programId+'TitleCombo]').find("option").filter(function(index){
//						console.log(list[0].TITLE);
//						console.log($(this).text());
//						return list[0].TITLE == $(this).text();
//					}).prop("selected", "selected");

					for(var i = 0; i < list.length; i++){
						var sendContents = list[i];
						if(sendContents == undefined){
							$('#'+tableInitData.programId+'ViewContainer').val('');
						}else{
							if(list[i].TYPE == 'IMG'){
								updateImgArea(sendContents);
							}else if(list[i].TYPE == 'CODE'){
								updateTextArea(sendContents);
							}else{
								updateTextArea(sendContents);
							}
						}
					}
					contentLength = list.length;

					if(idCheck){
						$('#'+tableInitData.programId+'ModifyBtn').css('display', 'inline-block');
						$('#'+tableInitData.programId+'DeleteBtn').css('display', 'inline-block');
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
			url  	: url + "/getRe" + tableInitData.uProgramId,
			data 	: {
				idx : tableInitData.idx
			},
			type	: "POST",
//			async	: false,
			success : function(result){

				var result = result.list;
				var body = $('#'+tableInitData.programId+"Re");
				body.empty();

				/**
				 * 댓글 영역
				 * 댓글이  0 = 글쓰기 폼만 보여짐
				 * 댓글이 존재 = 댓글과 글쓰기폼이 보여짐
				 *
				 * 댓글 개수, 정렬준(인기순, 최신순, 날짜 오름차순)
				 * 유저 이미지(페이스북 이미지)
				 * */

				var reContent = $('<div class="col-lg-12" />');

				var reContentNew = $('<div class="col-lg-12 re-contents-input"/>');

				var reContentNewImg = $('<div class="" style="float:left;" />');
				var reContentNewImgA = $('<a><img class="re-cp-img" src="#"  /></a>');
				reContentNewImg.append(reContentNewImgA);

				var reContentNewInput = $('<input id="'+tableInitData.programId+'ReWriter" class="col-lg-2" type="text" value="'+(s_userId == null? '' : s_userId)+'" style="padding:0px;display:none;" />');
				var reContentNewTxt = $('<div class="" style="float:right;min-width:220px;width:90%" ><textarea id="'+tableInitData.programId+'ReContent" style="height:100%;width:100%" ></textarea></div>');
				var reContentNewAddOn = $('<div style="float:right;min-width:220px;width:90%;height:50px;" />');
				var reContentNewAddOnDiv = $('<div />').append('<label><input type="checkbox" />Facebook에도 게시</label>');

				var reContentNewAddOnDivA = (s_userId != undefined ?
						 '<a class="btn btn-default" id="'+tableInitData.programId+'ReSaveBtn" style="float:right";>댓글쓰기</a>'
						:
						 '<a style="float:right;">게시하려면 로그인을 하세요</a>');
				reContentNewAddOnDiv.append(reContentNewAddOnDivA);
				reContentNewAddOn.append(reContentNewAddOnDiv);

				reContentNew.append(reContentNewImg)
							.append(reContentNewInput)
							.append(reContentNewTxt)
							.append(reContentNewAddOn);

				reContent.append(reContentNew);

				//RE_STEP 댓글 단계
				//IN_USER_ID 사용자이름
				//IN_DT 입력시간

				$.each(result, function(key, value){

					var reContentView = $('<div class="col-lg-12 re-contents " />');
					if(value.RE_LEVEL > 1){
						reContentView.addClass('reContentDiv');
					}

					var reContentImg = $('<div style="float:left;" />');
					var reContentImgA = $('<a><img class="re-cp-img src="#" /></a>');
					reContentImg.append(reContentImgA);

					var reContentTxt = $('<div />');

					reContentTxt.addClass('reContentDiv');
					reContentTxt.append('<span>'+value.IN_USER_ID+'</span>');
					reContentTxt.append('<div>'+value.CONTENT+'</div>');

					var reContentAddOn = $('<div id="'+programId+'ReContentPlace_'+value.REF+'_'+value.RE_STEP+'" style="float:right;min-width:220px;width:90%;" />');

					var reContentDeleteBtn = '';
					var reContentAddBtn = '';

								if(s_userId == value.IN_USER_ID){
									reContentDeleteBtn = '<span>'
									+	'<a href="#this" id="'+tableInitData.programId+'ReDelBtn" >댓글삭제'
									+	'<input class="ref" type="hidden" value="'+value.REF+'" />'
									+	'<input class="reStep" type="hidden" value="'+value.RE_STEP+'" />'
									+	'</a> '
									+ '</span>';
								}
								if(value.RE_STEP == 0){
									reContentAddBtn = '<span>'
									+	'<a href="#this"  id="'+tableInitData.programId+'ReAddBtn" )">답변달기'
									+	'<input class="ref" type="hidden" value="'+value.REF+'" />'
									+	'<input class="reStep" type="hidden" value="'+value.RE_STEP+'" />'
									+	'</a>'
									+ '</span>';
								}

					var btnArray = reContentDeleteBtn + (reContentDeleteBtn != '' && reContentAddBtn != '' ? '<span> · </span>' : '')
								+ reContentAddBtn + (reContentAddBtn != '' ? '<span> · </span>' : '')
								+ value.IN_DT;

						//첫댓글이고, 마지막댓글이 아닐
						if(value.RE_LEVEL == 1 && value.RE_LEVEL != value.COUNT){
							reContentAddOn.append(btnArray);
						//첫댓글이 아니고, 마지막 댓글일
						}else if(value.RE_LEVEL == value.COUNT){
							reContentAddOn.append(btnArray);
						//첫댓글이 아니고, 마지막 댓글도 아닐
						}else{
							reContentAddOn.append(btnArray);
						}


						reContentView.append(reContentImg).append(reContentTxt).append(reContentAddOn);
						reContent.append(reContentView);
				});

				body.append(reContent);

			}
		})
    }

    //행 선택 시 데이터 세팅
    function gridDataSetting(thisData){
    	var thisData = thisData;
    	var rowId = thisData.attr('class').split('tr_row_')[1];
    	var tdData = thisData.children('td');
    	var tdRowData = {};
    	clickCnt = rowId;
    	
    	programInitData.idx = rowId;
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
    	programInitData = tdRowData;
    }

    function gridRowGridBlurEvent(thisData){
    	
    	console.log(thisData);
    	gridDataSetting(thisData);

    	if(programInitData.idx != undefined){
        	blogData = {
        		idx : programInitData.idx
        	}
    		getView();
    	}

    }

    function getView(){
		if(viewContents){
			//내용 초기화
			$('#'+tableInitData.programId+'Title').empty();
			$('#'+tableInitData.programId+'Subject').empty();
			$('#'+tableInitData.programId+'ViewArea').empty();
			
			
			//내용 생성
			var divContainer = $('<div class="col-lg-12" style="margin-bottom:100px;" />');

			//제목
			
			//$('#'+tableInitData.programId+'Subject').val();
			
			
			var divSubject = $('<div id="'+tableInitData.programId+'ContainerSubject" class="form-control" />');
				var inputSubject = $('<input id="'+tableInitData.programId+'Subject" type="text" class="col-lg-12 inputWhite viewInput" /> ');
				//수정.
				if(!blogData.update){
					inputSubject.attr('disabled', 'disabled');
				}
			divSubject.append(inputSubject);

			//부제 컨텐츠
			var divSubContent = $('<div class="form-control" />');
				var fs = $('<span id="'+tableInitData.programId+'FileUploadBtn" class="btn btn-outline-success btn-sm">파일업로드</span>');
				var fsI = $('<input id="'+tableInitData.programId+'FileUpload" type="file" value="" style="display:none;"/>');
				var fsIT = $('<input id="'+tableInitData.programId+'FileUploadText" type="text" class="inputWhite viewInput" readonly/>');
				//수정.
				if(!blogData.update){
					fsIT.attr('disabled', 'disabled');
				}else{
					fs.click(function(){
						fsI.trigger('click');
					});
					fsI.change(function(){
						var fileValue = $('#'+programId+'FileUpload').val().split("\\");
						var fileName = fileValue[fileValue.length-1]; // 파일명

						$('#'+programId+'FileUploadText').val(fileName);
					});
				}

				var divTitleCombo = $('<div />');
					var subTitleCombo = $('<select id="'+tableInitData.programId+'TitleCombo" class="form-control" />');
				divTitleCombo.append(subTitleCombo);
				viewTitleCombo();


				//글 상자버튼그룹
				var divBtnBox = $('<div class="form-control" />');
					var bbText = $('<a id="'+tableInitData.programId+'TextBoxBtn" class="btn btn-sm"/>');
					bbText.addClass('btn-outline-success');
					bbText.text('글상자');
					bbText.click(function(){
						updateTextArea({TYPE:'TEXT'});
					});

					var bbCode = $('<a id="'+tableInitData.programId+'CodeBoxBtn" class="btn btn-sm"/>');
					bbCode.addClass('btn-outline-success');
					bbCode.text('코드');
					bbCode.click(function(){
						updateTextArea({TYPE:'CODE'});
					});

					var bbImgIn = $('<input id="'+tableInitData.programId+'ImgBoxBtn_input" type="file" style="display:none;" />');
					bbImgIn.change(function(){
					    if (this.files && this.files[0]) {
							console.log($(this));
					        var reader = new FileReader();
					        reader.onload = function (e) {
					            $('#content_'+(contentLength-1)).attr('src', e.target.result);
					        }
					        reader.readAsDataURL(this.files[0]);
					    }
					});
					var bbImg = $('<a id="'+tableInitData.programId+'ImgBoxBtn" class="btn btn-sm"/>');
					bbImg.addClass('btn-outline-success');
					bbImg.text('이미지');
					bbImg.click(function(){
						updateImgArea();
						$('#'+programId+'ImgBoxBtn_input').trigger('click');
					});

					var bbDel = $('<a id="'+tableInitData.programId+'DelBoxBtn" class="btn btn-sm"/>');
					bbDel.addClass('btn-outline-success');
					bbDel.text('삭제');
					bbDel.click(function(){
						console.log(focusIdx);
						$('#row_'+focusIdx).remove();
					});

					var bbTyping = $('<a id="'+tableInitData.programId+'typingBoxBtn" class="btn btn-sm"/>');
					bbTyping.addClass('btn-outline-success');
					bbTyping.text('글보기');

					var bbView = $('<a id="'+tableInitData.programId+'ViewBoxBtn" class="btn btn-sm"/>');
					bbView.addClass('btn-outline-success');
					bbView.text('뷰');


					divBtnBox.append(bbText)
							.append(bbCode)
							.append(bbImgIn)
							.append(bbImg)
							.append(bbDel)
//							.append(bbTyping)
//							.append(bbView)

			divSubContent.append(fs)
						.append(fsI)
						.append(fsIT)
						.append(divTitleCombo);
			if(blogData.update){
				divSubContent.append(divBtnBox);
			}

			var divViewContainer = $('<div id="'+tableInitData.programId+'ViewContainer" class="form-control viewContentContainer" />');

			divContainer.append(divSubject);
			divContainer.append(divSubContent);

			divContainer.append(divViewContainer);

			if(viewContentsRe){
				var disRe = $('<div id="'+tableInitData.programId+'Re" class="re-container" />');
				divContainer.append(disRe);
			}

			$('#'+tableInitData.programId+'View').html(divContainer);


			$('#'+tableInitData.programId+'ViewContainer').getContents();
		}

		if(viewContentsRe){
			$('#'+tableInitData.programId+'Re').getBlogRe();
		}

    }


//	//글쓰기 드롭다운 리스
//	function viewTitleCombo(){
//		$.ajax({
//			url : url + "/get"+tableInitData.uProgramId+"TitleDropdown",
//			data 	: {
//				idx : gridData.idx
//			},
//			success : function(result){
//				  $('#'+programId+'TitleCombo').empty();
//				  var options = '';
//				  console.log(result.list);
//				  if(result.list){
//					  var list = result.list;
//					  var count = list.length * 10;
//					  var listValue = 0;
//					  for(var i in list){
//						  if(listValue != count){
//							  listValue += 10;
//						  }
//						  options += '<option value="'+listValue+'" >'+list[i].NAME+'</option>';
//					  }
//				  }
//				  $('#'+tableInitData.programId+'TitleCombo').append(options);
//			}
//		})
//	}

    //그리드와 관련된 버튼을 클릭 했을때 이벤트
    $(document).on('click','a[id$=Btn]', function(e){
    	var thisId = $(this).attr('id');

    	var flag = '';
    	var newUrl = '';
    	var sendData = '';
    	var gridData = {};

    	if(thisId.indexOf('TextBoxAdd') != -1){
    		fnAddTextBox();
    	//댓댓글 저장
    	}else if(thisId.indexOf('ReReSaveBtn') != -1){
    		console.log('ReReSaveBtn');
    		flag = 'insert';
    		newUrl = 'saveReRe' + tableInitData.uProgramId;
    		if($('#'+tableInitData.programId+'ReReWriter').val() == ''){
    			alert('로그인을 해주세요.');
    			return false;
    		}else if($('#'+tableInitData.programId+'ReReContent').val() == ''){
    			alert('내용을 입력해주세요');
    			return false;
    		}

    		var saveInput = $(this).children('input');

    		sendData = {
    				idx		:	blogData.idx,
    				writer	:	$('#'+tableInitData.programId+'ReReWriter').val(),
    				content	:	$('#'+tableInitData.programId+'ReReContent').val(),
    				ref		:   saveInput[0].value,
    				reStep  :   saveInput[1].value
    		}
    		console.log(sendData);
    	//댓글 저장
    	}else if(thisId.indexOf('ReSaveBtn') != -1){
    		console.log('ReSaveBtn');
    		flag = 'insert';
    		newUrl = 'saveRe' + tableInitData.uProgramId;
    		if($('#'+tableInitData.programId+'ReWriter').val() == ''){
    			alert('로그인을 해주세요.');
    			return false;
    		}else if($('#'+tableInitData.programId+'ReContent').val() == ''){
    			alert('내용을 입력해주세요');
    			return false;
    		}

    		sendData = {
    				idx		:	blogData.idx,
    				writer	:	$('#'+tableInitData.programId+'ReWriter').val(),
    				content	:	$('#'+tableInitData.programId+'ReContent').val()
    		}
    	//댓글추가
    	}else if(thisId.indexOf('ReAddBtn') != -1){
    		console.log('ReAddBtn');
    		var addInput = $(this).children('input');
    		var getRef = addInput[0].value;
    		var gerReStep = addInput[1].value;
    		var refId = '#'+tableInitData.programId+'ReContentPlace_'+getRef+'_'+gerReStep;
    		console.log(refId);
//			$('#'+programId+'Re').getBlogRe();

			var reContentNew =
				'<div class="col-lg-12 re-contents-input" style="display:inline-block">'

					+ '<div class="" style="float:left;"><a><img class="re-cp-img" src="#"  /></a></div>'
					+ '<input id="'+tableInitData.programId+'ReReWriter" class="col-lg-2" type="text" value="'+(s_userId == null? '' : s_userId)+'" style="padding:0px;display:none;" />'
					+ '<div class="" style="float:right;min-width:220px;width:90%" ><textarea id="'+tableInitData.programId+'ReReContent" style="height:100%;width:100%" ></textarea></div>'
					+ '<div style="float:right;min-width:220px;width:90%;height:50px;">'


						+ '<a class="btn btn-default" id="'+tableInitData.programId+'ReReSaveBtn">댓글쓰기'
						+ '<input class="ref" type="hidden" value="'+getRef+'" />'
						+ '<input class="reStep" type="hidden" value="'+gerReStep+'" />'
						+ '</a>'
					+ '</div>'
				+ '</div>';

    		$(refId).append(reContentNew);
    		return false;
    	//댓글삭
    	}else if(thisId.indexOf('ReDelBtn') != -1){
    		console.log('ReDelBtn');
    		flag = 'delete';
    		newUrl = 'deleteRe' + tableInitData.uProgramId;

    		var delInput = $(this).children('input');

    		if(!confirm('댓글을 삭제하시겠습니까?')){
    			return false;
    		}
    		sendData = {
    				idx		:	blogData.idx,
    				ref		:	delInput[0].value,
    				re_step	:	delInput[1].value
    		}
    	//검
    	}else if(thisId.indexOf('Search') != -1){
    		console.log('Search');
    		flag = 'search';
    		newUrl = 'get' + tableInitData.uProgramId;
    	//그리드행추가
    	}else if(thisId.indexOf('AddRow') != -1){
    		trCnt++;
    		clickCnt = trCnt;
    		
    		var str = '<tr class="tr_row_'+trCnt+'" >';
			str += '<td class="td_row_flag">';
				str += '<i class="fa fa-plus"></i>';
				str += '<input class="td_row_flag_input input-sm" type="hidden" value="INSERT" />';
			str += '</td>';
    		$.each(tableInitData.colName, function(i, v){
    			str += '<td class="td_row_'+v+'">';
    			str += '<input class="td_row_'+v+'_input input-sm" type="text" value="" />';
    			str += '</td>';
    		});
    			str += '</tr>';
			$('tbody').append(str);
    		return false;
    	//그리드행삭제
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
    	//그리드 행 저장
    	}else if(thisId.indexOf('SaveRow') != -1){
    		var saveId = $('.tr_row_'+clickCnt);
    		var saveTds = saveId.find('td');

    		var saveData = {};

    		saveData["idx"] = clickCnt;

    		for(var j = 0; j < saveTds.length; j++){
    			var rowNm = $(saveTds[j]).attr('class').split('td_row_')[1];
    			console.log(rowNm)
//    			if(rowNm == 'flag') continue;

    			var rowNmSplit = rowNm.split('_');
    			var str = '';
    			for(var k = 0; k < rowNmSplit.length; k++){
    				if(k == 0){
    					str += rowNmSplit[k].toLowerCase();
    				}else{
    					var rowNmSplitChar = rowNmSplit[k].toLowerCase();
    					str += rowNmSplitChar.charAt(0).toUpperCase() + rowNmSplitChar.slice(1);
    				}
    			}

    			var saveSpan = $(saveTds[j]).find('span').text();
    			var saveInput = $(saveTds[j]).find('input').val();

    			gridDataSetting(saveId);
    			if(saveSpan == saveInput) {
    				saveData[str] = saveSpan;
    			}else{
        			saveData[str] = saveInput;
    			};
    		}

    		if(saveData["flag"] != "INSERT"){
    			saveData["flag"] = "UPDATE";
    		}
    		
    		gridData = saveData;

    		newUrl = 'update'+ tableInitData.uProgramId;
		//글추가
    	}else if(thisId.indexOf('Add') != -1){
    		if($('#'+tableInitData.programId+'View').css('display') == "none"){
        		$('#'+tableInitData.programId+'View').css('display', 'block');
              	
        		fnMakeCombo(tableInitData.programId+'Title', 'BLOG_TITLE_CD');    			
    		}
        	return false;
        //글저장
    	}else if(thisId.indexOf('Save') != -1){
			newUrl = 'update'+ tableInitData.uProgramId;


//			var form = $('mainBlogUpdateForm')[0];
//			var formData = new FormData(form);
//
//			if($('#'+programId+'FileUploadText').val() != ''){
//				formData.append('file_0', $('#'+ tableInitData.programId+'FileUpload')[0].files[0]);
//			}
			

			
			var dataDt = [];
			var count = 0;
			for(var i = 0; i < contentLength; i++){
				console.log('row_'+i);
				//컨텐츠의 개수가 존재.
				if($('#row_'+i).val() != undefined){
					var dataList = {};
					var textareaVal = $('#text_'+i).val();
					var typeVal = $('#type_'+i).val();
					var imgWidthScale = $('#text_'+i).attr('width');

					if(typeVal == 'IMG'){
						textareaVal = $('#text_'+i).attr('src');
						if(imgWidthScale != ''){
							imgWidthScale = imgWidthScale.replace(/[^0-9]/g,"");
						}
					}
					dataList = {
							idx 			: blogData.idx,
							i   			: i-count,
							type 			: typeVal,
							content 		: textareaVal,
							imgWidthScale 	: imgWidthScale
					}
					dataDt.push(dataList);
				}else{
					count++;
				}
			}

			var sendData = {}

			if(blogData.idx != ''){
				sendData = {
						idx		: blogData.idx,
						title 	: $('#'+tableInitData.programId+'Title option:selected').text(),
						subject : $('#'+tableInitData.programId+'Subject').val(),
						dt_data  : dataDt
				}
			}else{
				sendData = {
						title : $('#'+tableInitData.programId+'Title option:selected').text(),
						subject : $('#'+tableInitData.programId+'Subject').val(),
						dt_data  : dataDt
				}
			}
			
			SeonhoblogUtil.ajax(
					JSON.stringify(sendData), 
					tableInitData.url + "save" + tableInitData.uProgramId + "Contents", 
					false, 
					function callbackFunc(data){
						
//						if($('#'+programId+'FileUploadText').val() != ''){
//						$.ajax({
//							url 	: tableInitData.url + "/save"+tableInitData.uProgramId+"FileUpload",
//							type	: 'POST',
//							data    : formData,
//							contentType : false,
//							processData : false,
//							async 	: false,
//							success	: function(){
//								if(result.SUCCESS){
//									alert(result.SUCCESS);
//
//								}
//							}
//						})
//					}
						
						window.location.href="/";
					}	
			)
			

return false;

		//글수정
    	}else if(thisId.indexOf('Update') != -1){
    		if(blogData.idx == undefined) return false;
			blogData = {
    				flag : 'modify',
					idx  : blogData.idx,
					update : true
			}
			getView();
			return false;
		//글삭제
    	}else if(thisId.indexOf('Delete') != -1){
    		console.log('Delete');
    		flag = 'delete';
    		newUrl = 'modify' + tableInitData.uProgramId
    	//글취소
    	}else if(thisId.indexOf('Cancel') != -1){
    		console.log('Cancel');
    		flag = 'cancel';
    		window.location.href="/";
    		return false;
    	}
    	if(thisId.indexOf('Box') != -1){
    		
    	}else if(thisId.indexOf('Re') != -1){
    		$.ajax({
    			url		: tableInitData.url + newUrl,
        		type	: "POST",
        		data	: JSON.stringify(sendData),
        		dataType : "json",
                async	: false,
    			contentType : "application/json, charset=utf-8",
    			success : function(result){
    				$('#'+tableInitData.programId+'Re').empty();
    				$('#'+tableInitData.programId+'Re').getBlogRe();
    			}
    		});
    	}else if(thisId.indexOf('Row') != -1){
        	$.ajax({
        		url		: tableInitData.url + newUrl,
        		type	: "POST",
        		data	: JSON.stringify(gridData),//???????????????????
                dataType: 'json',
                async	: false,
    			contentType : "application/json, charset=utf-8",
        		success : function(data){
        			console.log(initData);
        			$('#'+tableInitData.programId+'Grid').remove();
        			$('#'+tableInitData.programId+'Grid').fnList(initData);
        		}
        	});
    	}else{
        	$.ajax({
        		url		: tableInitData.url + newUrl,
        		type	: "POST",
        		data	: JSON.stringify(blogData),
                dataType: 'json',
                async	: false,
    			contentType : "application/json, charset=utf-8",
        		success : function(data){

        			$('#view'+tableInitData.uProgramId).empty();
        			$('#view'+tableInitData.uProgramId).html(data);
        		}
        	});
    	}

    	console.log(thisId);
    	console.log(newUrl);
    });


    
    
  //글쓰기버튼
    function mainBlogInsertBtn(){
    	  var data = {
    			  idx  : '',
    			  page : tableInitData.url + '/updateBlog'
    	  }
    	  loadingPgSetting(data);
    }

    function updateTextArea(sendContents){
    	var c = contentLength;
    	var str = $('<div id="row_'+c+'"/>');
    	str.click(function(){
    		focusIdx = c;
    	});
    		var strIdx = $('<input type="hidden" id="idx_'+c+'"/>');
    		var strType = $('<input type="hidden" id="type_'+c+'" value="TEXT"/>');
    		var strTextArea = $('<textarea id="content_'+c+'" class="form-control col-xs-12" style="min-height:150px;"/>');
    		if(sendContents != undefined){
    			strTextArea.text(sendContents.CONTENT);
	    		if(sendContents.TYPE == 'CODE'){
	    	   		strTextArea.css({
	        			'background-color' : 'gray',
	        			'color'			: 'white'
	        		});
	    	   		strType.attr('value', 'CODE');
	    		}
    		}
 
    		if(!blogData.update) strTextArea.attr('readonly', true);
    		strTextArea.change(function(){
    			//resize(this);
    		});
    		str.append(strIdx)
    			.append(strType)
				.append(strTextArea);
    		
		$('#'+programId+'ViewContainer').append(str);
	    contentLength++;
    }

    function updateImgArea(sendContents){
    	var c = contentLength;
    	var iaDiv = $('<div id="row_'+c+'" />');
    	iaDiv.mouseover(function(){
    		$('.imgContWidth_'+c).css('display', 'block');
    	}).mouseleave(function(){
    		$('.imgContWidth_'+c).css('display', 'none;');
    	}).click(function(){
    		focusIdx = c;
    	});
    	
    	var iaIdx = $('<input id="idx_'+c+'" type="hidden" value="'+c+'"/>');
    	var iaType = $('<input id="type_'+c+'" type="hidden" value="IMG"/>');
    	var iaImg = $('<img id="content_'+c+'"  alt="your image"  />');
		var iaImgChBtn1 = $('<span class="col-sm-1 btn btn-outline-success btn-sm imgContWidth_'+c+'" style="display:none;" />').text('10%');
			iaImgChBtn1.click(function(){ fnImgWidthChg({ contentLength : c, width  : 10 }) });
		var iaImgChBtn2 = $('<span class="col-sm-1 btn btn-outline-success btn-sm imgContWidth_'+c+'" style="display:none;" />').text('25%');
			iaImgChBtn2.click(function(){ fnImgWidthChg({ contentLength : c, width  : 25 }) });
		var iaImgChBtn3 = $('<span class="col-sm-1 btn btn-outline-success btn-sm imgContWidth_'+c+'" style="display:none;" />').text('50%');
			iaImgChBtn3.click(function(){ fnImgWidthChg({ contentLength : c, width  : 50 }) });
		var iaImgChBtn4 = $('<span class="col-sm-1 btn btn-outline-success btn-sm imgContWidth_'+c+'" style="display:none;" />').text('75%');
			iaImgChBtn4.click(function(){ fnImgWidthChg({ contentLength : c, width  : 75 }) });    	
		var iaImgChBtn5 = $('<span class="col-sm-1 btn btn-outline-success btn-sm imgContWidth_'+c+'" style="display:none;" />').text('100%');
			iaImgChBtn5.click(function(){ fnImgWidthChg({ contentLength : c, width  : 100 }) });

		if(sendContents != undefined){
			iaImg.attr('src', sendContents.CONTENT);
			iaImg.attr('width', ''+sendContents.IMG_WIDTH_SCALE+'%');
		}
    			
    	iaDiv.append(iaImg);
    	
    	if(blogData.update){
    		iaDiv.append(iaIdx)
	    		.append(iaType)
	    		.append(iaImgChBtn1)
	    		.append(iaImgChBtn2)
	    		.append(iaImgChBtn3)
	    		.append(iaImgChBtn4)
	    		.append(iaImgChBtn5);
    	}
		$('#'+programId+'ViewContainer').append(iaDiv);
    	
	    contentLength++;
    }


    
    //텍스트상자 높이 조정
    function resize(obj) {
  	  obj.currentTarget.style.height = "50px";
  	  obj.currentTarget.style.height = (12+obj.target.scrollHeight)+"px";
  	}

    function fnImgWidthChg(data){
    	var per = data.width+'%';
    	$('#content_'+data.contentLength).attr('width', per);
    }

//    function fnImgController(length){
//    	$('.imgContWidth_'+length).css('display', 'block');
//    }
//
//    function fnRvImgController(length){
//    	$('.imgContWidth_'+length).css('display', 'none');
//    }

    function fnAddTextBox(){
    	
    	var dd = $('<div id="row_'+contentLength+'" class="col-xs-w100" />');
    		dd.click(function(){
    			fnSaveIdx(contentLength);
    		});
    	
    		var childInput1 = $('<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />');
    		var childInput2 = $('<input type="hidden" id="type_'+contentLength+'" value="TEXT" />');
    		var childTextArea = $('<textarea id="text_'+contentLength+'" class="col-xs-w100" style="min-height:50px;" />');
    		childTextArea.keydown(function(el){
    			resize(el);
    		})
    		
    		
    	dd.append(childInput1).append(childInput2).append(childTextArea);
    	
    	$('#'+tableInitData.programId+'ViewArea').append(dd);
    		
    		
//    	var str = '<div id="row_'+contentLength+'" class="col-xs-w100" onclick="fnSaveIdx('+contentLength+');">';
//    	str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
//    	str += '<input type="hidden" id="type_'+contentLength+'" value="TEXT" />'
//    	str += '<textarea id="text_'+contentLength+'" class="col-xs-w100"  style="min-height:100px;" onchange="resize('+el+')" ></textarea>'
//    	str += '</div>';
//    	$('#blogViewArea').append(str);
    	contentLength++;
    }
    
    
}(window, jQuery));




var SeonhoblogUtil = function() {
	"use strict";

	return {
		ajax : function(jsonData, saveUrl, msg, callback, sucMsgFlag){


			//ajax 펑션 유효성검사
			if(saveUrl == undefined){
				alert('');
				return false;
			}

			if(msg != false){
		        //cofirm Message
		        if (!confirm((Util.confirm(msg)).msgTxt)) return;
			}

			//데이터 request 잇음. dt_grid
			if(jsonData != undefined){
		        $.ajax({
		            url      : saveUrl,
		            data     : jsonData,
		            dataType : 'json',
		            type     : 'POST',
		            cache    : false,
		            async	 : false,
		            contentType : 'application/json; charset=utf-8',
		            success  : function(data) {
		            	callback(data);
		            }
		        });
		    //데이터 request 없음.
			}else{
		        $.ajax({
		            url      : saveUrl,
//		            data     : jsonData,
		            dataType : 'json',
		            type     : 'POST',
		            cache    : false,
		            async	 : false,
		            contentType : 'application/json; charset=utf-8',
		            success  : function(data) {

		            	callback(data);
		            }
		        });
			}


		},
		
	}
}();

