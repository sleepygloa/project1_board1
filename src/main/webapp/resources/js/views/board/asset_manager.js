/** Copyright (c) 2017 VertexID RND, Inc.
 * 
 * Application Name : 권역관리[StandardAreaApp]
 * Program Code     : PC0101
 * Description      :
 * Revision History
 * Author          	Date           		Description
 * ------------		-------------		------------------
 * MINE 최판석		2017. 3. 20. 		First Draft.        javascript
 */
var AssetManagerApp = function () {
	"use strict";
	
	/************************************************
	 *전역 객체 선언부 (return 상위부분에 선언해야함)
	 ************************************************/
	
	// [El]권역정보 그리드
	var $assetManagerGrid = $("#assetManagerGrid");
	var userInfo = Util.getUserInfo();
	var apsUserYn = userInfo.s_aspUserYn;

	return {
        init: function () {
        	
        	fnAuthSetting();
        	//자산정보 Grid생성
        	fnListAssetManager();
        	//자산정보 Event
        	fnAeestManagerEvents();

        	fnAeestComboSetting();
        	
	    }
    };
    
    function fnAuthSetting(){
    	if ( apsUserYn === 'N'){
    		$("#assetCompanyNameGroup").hide();
    	}
    }
    
    function fnAeestComboSetting(){
    	var codeGroupUrl = "/ctrl/settings/system/code/listCodeGroupComboJson";
    	
    	fnListComboJson(codeGroupUrl, $("#assetManagerStrType"), "SC0021","선택", false);
    	fnListComboJson("/ctrl/asset/asset/listAreaCode", $("#assetManagerAreaName"), "","선택", false);
    	
    	fnListComboJson(codeGroupUrl, $("#assetManagerPrdTypeLv1"), "SC0022","선택", false);
    	fnListComboJson(codeGroupUrl, $("#assetManagerPrdTypeLv2"), "SC0023","선택", false);
    	fnListComboJson(codeGroupUrl, $("#assetManagerPrdTypeLv3"), "SC0025","선택", false);
    	fnListComboJson(codeGroupUrl, $("#assetManagerPrdTypeLv4"), "SC0026","선택", false);
    	
//    	$('#assetManagerPrdTypeLv1').combobox({inMode:true});
//    	$('#assetManagerPrdTypeLv2').combobox({inMode:true});
//    	$('#assetManagerPrdTypeLv3').combobox({inMode:true});
//    	$('#assetManagerPrdTypeLv4').combobox({inMode:true});
    	
    	fnListComboJson(codeGroupUrl, $("#assetManagerAstType1"), "AT0001","선택", false);
    	fnListComboJson(codeGroupUrl, $("#assetManagerAstType2"), "AT0002","선택", false);
		fnListComboJson(codeGroupUrl, $("#assetManagerAstSt"), "AT0003","선택", false);
    
    }
    
    //[Fn] 이벤트 
    function fnAeestManagerEvents(){
    	//검색폼 관리코드 엔터키 이벤트
    	$("#assetManagerCode, #assetCompanyName, #assetManagerStrNameInput ,#assetManagerPrdNameInput, assetManagerSerialNoInput").enterEvent({
    		callBack:function(value){
				var data = {
					mngCd : $("#assetManagerCode").val(),
					companyNm : $("#assetCompanyName").val(),
					strNm : $("#assetManagerStrNameInput").val(),
					prdNm : $("#assetManagerPrdNameInput").val(),
					serialNo : $("#assetManagerSerialNoInput").val(),
					prdTypeLv1 : $("#assetManagerPrdTypeLv1").val(),
					prdTypeLv2 : $("#assetManagerPrdTypeLv2").val(),
					prdTypeLv3 : $("#assetManagerPrdTypeLv3").val(),
					prdTypeLv4 : $("#assetManagerPrdTypeLv4").val(),
					strType : $("#assetManagerStrType").val(),
					areaCd : $("#assetManagerAreaName").val(),
					astType1 : $("#assetManagerAstType1").val(),
					astType2 : $("#assetManagerAstType2").val(),
					astSt : $("#assetManagerAstSt").val()
						
				};
				$assetManagerGrid.paragonGridSearch(data);
			}
    	});
    	
    	//자산수정 버튼
    	$("#assetManagerModifyBtn").click(function(){
			var rowid= $assetManagerGrid.jqGrid('getGridParam','selrow');
			// 선택행 데이터
			var lastRowData = $assetManagerGrid.getRowData( rowid );
			// 선택행 데이터 AST_SEQ
			var astSeq = lastRowData.AST_SEQ;
			
			if(rowid === null) {
				alert("자산을 선택해주세요.");
				return false;
			}
    		PopApp.paragonOpenPopup({
        		ajaxUrl: '/ctrl/asset/asset/addAssetManagerPopup',
        		data:{"astSeq":astSeq},
        		id: 'AssetManagerPopup',
        		width: '700px',	    		
        		btnName:"수정",
        		title :"자산 수정",
        		onload:function(modal){
        			modal.PopAppGetData().astSeq;
        			AssetManagerModifyApp.fnAssetMod(astSeq, modal);
        		}
    		});
    	});
    	
    	//자산등록 버튼
    	$("#assetManagerNewBtn").click(function(){
    		PopApp.paragonOpenPopup({
        		ajaxUrl: '/ctrl/asset/asset/addAssetManagerPopup',
        		data:{"astSeq":""},
        		id: 'AssetManagerPopup',
        		width: '700px',	    		
        		btnName:"저장",
        		title :"자산 등록",
        		onload:function(modal){
        			modal.show();
        		}
    		});
    		
//    		fnAddAssetManager(true);
    	});
    	
    	//검색 버튼
    	$("#assetManagerSearchBtn").click(function(){
    		fnSearchAssetManager();
    	});
    
    }
    
    //[Fn] 검색 조건 매핑
    function fnSearchAssetManager(){
		var data = {
				mngCd : $("#assetManagerCode").val(),
				companyNm : $("#assetCompanyName").val(),
				strNm : $("#assetManagerStrNameInput").val(),
				prdNm : $("#assetManagerPrdNameInput").val(),
				serialNo : $("#assetManagerSerialNoInput").val(),
    			prdTypeLv1 : $("#assetManagerPrdTypeLv1").val(),
    			prdTypeLv2 : $("#assetManagerPrdTypeLv2").val(),
    			prdTypeLv3 : $("#assetManagerPrdTypeLv3").val(),
    			prdTypeLv4 : $("#assetManagerPrdTypeLv4").val(),
    			strType : $("#assetManagerStrType").val(),
    			areaCd : $("#assetManagerAreaName").val(),
    			astType1 : $("#assetManagerAstType1").val(),
    			astType2 : $("#assetManagerAstType2").val(),
				astSt : $("#assetManagerAstSt").val()
					
		};
    	$assetManagerGrid.paragonGridSearch(data);
    }
 
    function fnListComboJson(targeturl, target, groupCd, first, bootstrap){
    	$.ajax({
    		url : targeturl,
    		data :{codeGroupCd:groupCd},
    		type : "POST",
    		dataType : "json",
    		cache: false,
    		success : function(result) {
    			//타겟, 데이터, 초기화, 기본값,선택 
    			//(El,json,first,reset,select)
    			if ( bootstrap ) {
    				Util.MakeBootstrapSelectBox(target, result, first);
    			}
    			else {
    				Util.MakeSelectOptions(target, result, "", first);
    			}
    		}
    	});
    }
    

    /********************************************************************
     * 자산관리 그리드 생성
     * Since   : 2017-04-18
     * 작성자  : 최 판 석
     * 수정내역: 
     ********************************************************************/
    //[Fn] jqgrid 자산관리 목록 
    function fnListAssetManager(){
    	$assetManagerGrid.paragonGrid({
        	url: '/ctrl/asset/asset/listAssetManager',
//        	rowEditable:true,
			sortable: true,
			rownumbers : true,
			colModel : [ 
	            {name : 'AST_SEQ', hidden : true}, 
	            {name : 'STR_CD', align:"center", hidden : true},
	            {name : 'MNG_CD', align:"center", width:"90px"},
	            {name : 'COMP_NM', align:"center"},				//회사명
	            {name : 'STR_NM', align:"center"},
	            {name : 'STR_TYPE_NM', align:"center", width:"90px"},			//Site구분
	            {name : 'AREA_NM', align:"center"},				//지역구분
	            {name : 'PRD_CD', align:"center"},				//품번
	            {name : 'PRD_NM', align:"center"},				//품명
	            {name : 'PRD_TYPE_LV1_NM', align:"center"},		//품목군
	            {name : 'PRD_TYPE_LV2_NM', align:"center"},		//대분류
	            {name : 'PRD_TYPE_LV3_NM', align:"center"},		//품목군
	            {name : 'PRD_TYPE_LV4_NM', align:"center"},		//대분류
	            {name : 'AST_SERIAL', align:"center"},			//시리얼
	            {name : 'AST_TYPE1', align:"center", width:"90px"},			//구분1
	            {name : 'AST_ST_NM', align:"center", width:"120px"},		//구분2
	            {name : 'AST_MFR_DT', align:"center"},			//납품일
			],
            pager: "#assetManagerGridNavi",
            domainId : "AST_MNG",
//            onSelectRowEvent : function(currRowData, prevRowData) {
//				//로우선택시 공통코드 목록 조회
//				var strCd = currRowData.STR_CD;
//				var strNm = currRowData.STR_NM;
//
//				console.log(strCd);
//				console.log(strNm);
//				fnViewAssetManager();
//
////				$standardDepartmentGrid.paragonGridSearch({
////					"strCd" : strCd,
////					codeNm : "",
////					codeCd : ""
////				});
//			},
			ondblClickRow:function(id, iRow, iCol, e){
            	
            	var astSeq = $assetManagerGrid.getRowData( id ).AST_SEQ;
            	
            	var pop = PopApp.paragonOpenPopup({
            		ajaxUrl: '/ctrl/asset/asset/viewAssetManagerPopup',
            		data:{"astSeq":astSeq},
            		id: 'viewAssetManagerPopup',
            		width: '1200px',	    		
            		btnName:"자산 상세 보기",
//            		visible: true, //기본값 false :바로 활성화  TODO 사용설명서 명시해야함
            		title :"자산 상세정보",
            		onload:function(modal){
            			AssetManagerViewApp.fnSetAssetData(modal);
            		}
        		});
            	
            },
        });
		
		
	}
    
    //그리드 수정 여부 체크
    function fnModCheck(){
    	return $assetManagerGrid.paragonGridModConfirm("수정된 내용이 있습니다. 계속 진행하시겠습니까?");
	}
    
    
}();

$(document).ready(function() {
	AssetManagerApp.init();
});
