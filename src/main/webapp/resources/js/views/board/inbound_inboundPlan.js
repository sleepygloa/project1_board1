/** Copyright (c) 2016 VertexID RND, Inc.
 *
 * Application Name : 구역관리[MasterAreaApp]
 * Program Code     : PWMMS102E
 * Description      :
 * Revision History
 * Author          	Date           		Description
 * ------------		-------------		------------------
 * Kim Min su  		2017. 2. 20.  		First Draft.
 */
var IbPlanInsertApp = function () {
	"use strict";

	/************************************************
	 *전역 객체 선언부 (return 상위부분에 선언해야함)
	 ************************************************/

	// [El]프로그램 그리드
	var $ibPlanHGrid = $("#ibPlanHeaderGrid");

	var $ibPlanDGrid = $("#ibPlanDetailGrid");

	var ibProgStComboJson;

	var ibGbnComboJson;

	var $callBackInput;

	var firstLoad = true;

    return {
        init: function () {
            //
            fnListProgStsJson("IB_PROG_ST_CD");
            //
            fnListIbGubunJson("IB_GBN_CD");

            toDateSetEvnet();

        	fnListIbPlanH();

        	fnIbPlanEvents();

//        	$("#ibPlanYmdS").datepicker({});
//            $("#ibPlanYmdE").datepicker({});
	    },
        callBackInput: function () {
            return $callBackInput;
        }
    };

    //datepicker Set up today.
    function toDateSetEvnet() {
        $("#ibPlanYmdS").datepicker("setDate", new Date());
        $("#ibPlanYmdE").datepicker("setDate", new Date());
    }

    //[Fn] 이벤트
    function fnIbPlanEvents(id){

		//코드 입력시 명 서치
        addClientCdChangeEvent("ibPlanClient", ["ibPlanSup"]);          //고객사
        addCdChangeEvent("ibPlanClient", "ibPlanSup", "SUPPLIER");      //공급처

    	//추가버튼
    	$("#newIbPlanBtn").click(function(){
    		fnAdd();
    	});
    	//검색버튼
    	$("#searchIbPlanBtn").click(function(){
    		fnSearchList();
    	});
    	//삭제버튼
    	$("#delIbPlanBtn").click(function(){
    	    $ibPlanHGrid.paragonGridCheckedDelete();
    	    fnDelete();
    	});
    	//엑셀버튼
    	$("#excelIbPlanBtn").click(function(){
    	    var selectRow = $ibPlanDGrid.getGridParam('selrow');
    	    if(selectRow == null){
    	        $ibPlanHGrid.downloadExcel();
    	    }else{
    	        $ibPlanDGrid.downloadExcel();
    	    }
    	});

        $("#ibPlanClientPopup").click(function(){
            fnModalClientPop();
        });

        $("#ibPlanSupPopup").click(function(){
            fnSupplierPop();
        });

        $("#ibPlanClientNm").attr("disabled", true);

        $("#reportIbTradingStatementBtn").click(function(){
            if(0 != $ibPlanHGrid.getGridParam("selarrrow").length){
                fnReport("/ctrl/inbound/inboundPlan/createInboundTradingStatementReport");
            }else{
                alert("선택 된 행이 없습니다.");
            }
        });

    }

    function fnModalClientPop() {
        PopApp.paragonOpenPopup({
            ajaxUrl : '/ctrl/common/clientPopup',
            id : 'modalClientPopup',
            width : '550',
            domainId:"PWMCM105Q_P1",
//            data: {clientCd: $("#ibPlanClientCd").val()},
            visible:true,
            onload : function(modal) {
                var callBack ={
                        "CLIENT_CD" :"ibPlanClientCd",
                        "CLIENT_NM" :"ibPlanClientNm"
                };
                App.setElIds(callBack);
                modal.show();
            }
        });
    }

    function fnSupplierPop() {
        PopApp.paragonOpenPopup({
            ajaxUrl : '/ctrl/common/supplierPop',
            id : 'modalSupplierPopup',
            width : '550',
            domainId:"PWMCM106Q_P1",
//            data: { supplierCd : $("#ibPlanSupCd").val() },
            visible:true,
            onload : function(modal) {
                var callBack ={
                        "SUPPLIER_CD" :"ibPlanSupCd",
                        "SUPPLIER_NM" :"ibPlanSupNm"
                };
                App.setElIds(callBack);
                modal.show();
            }
        });
    }

    //[Fn] 입고진행상태 콤보박스 JSON 조회
    function fnListProgStsJson(groupCd){
        $.ajax({
            url : "/ctrl/settings/system/code/listCodeGroupComboJson",
            data :{codeGroupCd:groupCd},
            type : "POST",
            dataType : "json",
            cache: false,
            success : function(result) {
                ibProgStComboJson = result;
                //paragon-util.js 콤보박스 옴션 생성(타겟 Select박스, json 데이터)
                Util.MakeSelectOptions($("#inPlanProgStCd"),result);
            }
        });
    }

    //[Fn] 입고구분 콤보박스 JSON 조회
    function fnListIbGubunJson(groupCd){
        $.ajax({
            url : "/ctrl/settings/system/code/listCodeGroupComboJson",
            data :{codeGroupCd:groupCd},
            type : "POST",
            dataType : "json",
            cache: false,
            success : function(result) {
                ibGbnComboJson = result;
                //paragon-util.js 콤보박스 옴션 생성(타겟 Select박스, json 데이터)
                Util.MakeSelectOptions($("#ibPlanGbnCd"),result);
            }
        });
    }

    //[Fn] 검색 조건 매핑
    function fnSearchList(){

        //validation
        if($("#ibPlanClientCd").val().length == 0){//고객사 검사
            alert("고객사 항목은 필수 입력입니다.");
            $("#ibPlanClientCd").focus();
            return false;
        }else if($("#ibPlanClientCd").val().trim().length == 0){
            alert("고객사 항목은 공백만으로 입력할 수 없습니다.");
            console.log($("#ibPlanClientCd").val());
            $("#ibPlanClientCd").focus();
            return false;
        }
        if($("#frIbPlanYmd").val().length == 0){//입고예정일자 검사
            alert("입고예정일자 항목은 필수 입력입니다.");
            $("#frIbPlanYmd").focus();
            return false;
        }else if($("#frIbPlanYmd").val().trim().length == 0){
            alert("입고예정일자 항목은 공백만으로 입력할 수 없습니다.");
            console.log($("#frIbPlanYmd").val());
            $("#frIbPlanYmd").focus();
            return false;
        }
        if($("#toIbPlanYmd").val().length == 0){//입고예정일자 검사
            alert("입고예정일자 항목은 필수 입력입니다.");
            $("#toIbPlanYmd").focus();
            return false;
        }else if($("#toIbPlanYmd").val().trim().length == 0){
            alert("입고예정일자 항목은 공백만으로 입력할 수 없습니다.");
            console.log($("#toIbPlanYmd").val());
            $("#toIbPlanYmd").focus();
            return false;
        }

    	var data = {
    	        clientCd : $.trim($("#ibPlanClientCd").val()),
				supCd : $.trim($("#ibPlanSupCd").val()),
				frIbPlanYmd : $.trim($("#frIbPlanYmd").val()),
				toIbPlanYmd : $.trim($("#toIbPlanYmd").val()),
				ibProgStCd : $.trim($("#inPlanProgStCd").val()),
				ibGbnCd : $.trim($("#ibPlanGbnCd").val()),
				ibNo : $.trim($("#ibPlanNo").val()),
				carNo : $.trim($("#inPlanCarNo").val())
		};
    	$ibPlanHGrid.paragonGridSearch(data);
    	console.log(data);
    }

    /********************************************************************
     * 그리드 생성
     * Since   : 2017-02-20
     * 작성자  : Kim Min Su
     * 수정내역:
     ********************************************************************/
    function fnListIbPlanH(){
        $ibPlanHGrid.paragonGrid({
        	url: '/ctrl/inbound/inboundPlan/listInboundPlanH',
        	rowEditable:true,
            cellEditable:false,
			sortable: true,
			rownumbers: true,
			shrinkToFit:false,
			multiselect: true,
			//postData:{clientCd:$.trim($("#ibPlanClientCd").val())},
//			multielonly:true,
			height:'193',
			postData: {
			    clientCd : $.trim($("#ibPlanClientCd").val()),
                supCd : $.trim($("#ibPlanSupCd").val()),
                frIbPlanYmd : $.trim($("#frIbPlanYmd").val()),
                toIbPlanYmd : $.trim($("#toIbPlanYmd").val()),
                ibProgStCd : $.trim($("#inPlanProgStCd").val()),
                ibGbnCd : $.trim($("#ibPlanGbnCd").val()),
                ibNo : $.trim($("#ibPlanNo").val()),
                carNo : $.trim($("#inPlanCarNo").val())
            },
            colModel:[
                {editable: false,name:'CLIENT_CD', width:"100px", align:"left", hidden:true},
                {editable: false,name:'CLIENT', width:"150px", align:"left"},
                {editable: false,name:'IB_PLAN_YMD', width:"100px", align:"center"},
                {editable: false,name:'IB_NO', width:"100px", align:"center"},
                {editable: false,name:'PO_YMD', width:"100px", align:"center"},
                {editable: false,name:'PO_NO', width:"100px", align:"center"},
                {editable: false,name:'IB_GBN_CD', width:"100px", align:"left", hidden:true},
                {editable: false,name:'IB_GBN', width:"100px", align:"center"},
                {editable: false,name:'CAR_NO', width:"100px", align:"center"},
                {editable: false,name:'EXAM_DT', width:"100px", align:"center"},
                {editable: false,name:'SUPPLIER_CD', width:"100px", align:"center"},
                {editable: false,name:'SUPPLIER_NM', width:"200px", align:"left"},
                {editable: false,name:'IB_PROG_ST_CD', width:"100px", align:"left", hidden:true},
                {editable: false,name:'IB_PROG_ST', width:"100px", align:"center"},
                {editable: false,name:'REMARK', width:"280px", align:"left"}
            ],
            pager: "#ibPlanHeaderGridNavi",
            domainId:"IB_PLAN_LIST",
            rowClickFocus:true,
            gridComplete: function(){
                var ids = $ibPlanHGrid.jqGrid("getDataIDs");
                if(ids && ids.length > 0){
                    $ibPlanHGrid.setFocus(0);
                }
                var ibNo = $ibPlanHGrid.getRowData(ids[0]).IB_NO;
                var clientCd = $ibPlanHGrid.getRowData(ids[0]).CLIENT_CD;
                console.log(ibNo);
                if(firstLoad){
                    fnListIbPlanD(ibNo);
                    firstLoad = false;
                }else{
                    if(ibNo != null){
                        $ibPlanDGrid.paragonGridSearch({ibNo:ibNo, clientCd:clientCd});
                    }else{
                        $ibPlanDGrid.paragonGridSearch({ibNo:null});
                    }
                }
           },onSelectRowEvent: function(currRowData, prevRowData){
               $ibPlanDGrid.paragonGridSearch({ibNo:currRowData.IB_NO});
           },
//           ondblClickRow: function(id, iRow, iCol, e){
//               //var clientCd = $ibPlanHGrid.getRowData(iRow).CLIENT_CD;
//               var ibno = $ibPlanHGrid.getRowData(iRow).IB_NO;
//               var progStCd = $ibPlanHGrid.getRowData(iRow).IB_PROG_ST_CD;
//               var ibSupCdHidden = $ibPlanHGrid.getRowData(iRow).SUPPLIER_CD;
//               console.log()
//               if(progStCd == '10'){
//                   $("#ibNoHidden").val(ibno);
//                   $("#ibSupCdHidden").val(ibSupCdHidden);
//                   //$("#clientCdHidden").val(clientCd);
//                   fnModify();
//               }else{
//                   alert("입고예정상태만 수정가능합니다.");
//               }
//           },
           ondblClickCustom: function(id, iRow, iCol, e){
               //var clientCd = $ibPlanHGrid.getRowData(iRow).CLIENT_CD;
               var ibno = $ibPlanHGrid.getRowData(iRow).IB_NO;
               var progStCd = $ibPlanHGrid.getRowData(iRow).IB_PROG_ST_CD;
               var ibSupCdHidden = $ibPlanHGrid.getRowData(iRow).SUPPLIER_CD;
               console.log()
               if(progStCd == '10'){
                   $("#ibNoHidden").val(ibno);
                   $("#ibSupCdHidden").val(ibSupCdHidden);
                   //$("#clientCdHidden").val(clientCd);
                   fnModify();
               }else{
                   alert("입고예정상태만 수정가능합니다.");
                   return false;
               }
           }
        });
	}

    //function fnListIbPlanD(ibNo){
    function fnListIbPlanD(ibNo, clientCd){
        $ibPlanDGrid.paragonGrid({
            url: '/ctrl/inbound/inboundPlan/listInboundPlanD',
            rowEditable:true,
            cellEditable:false,
            sortable: true,
            rownumbers: true,
            shrinkToFit:false,
            postData:{ibNo:ibNo, clientCd:$.trim($("#ibPlanClientCd").val())},
            height:'193',
            colModel:[
                {editable: false,name:'IB_NO', width:"100px", align:"center", hidden:true},
                {editable: false,name:'IB_DETAIL_SEQ', width:"100px", align:"center"},
                {editable: false,name:'ITEM_CD', width:"100px", align:"center"},
                {editable: false,name:'ITEM_NM', width:"150px", align:"left"},
                {editable: false,name:'ITEM_SPEC', width:"100px", align:"center"},
                {editable: false,name:'ITEM_ST_CD', width:"100px", hidden:true},
                {editable: false,name:'ITEM_ST', width:"100px", align:"center"},
                {editable: false,name:'PKQTY', width:"100px", align:"center"},
                {editable: false,name:'UOM', width:"100px", align:"center"},
                {editable: false,
                    name:'PLAN_QTY',
                    width:"100px",
                    align:"right",
                    hidden: true},
                {editable: false,
                    /* 화면 컬럼 도메인명 처리 2017.08.04 */
                    //name:'PLAN_QTY',
                    name:'PLAN_TOT_QTY',
                    width:"100px",
                    align:"right"},
                {editable: false,name:'PLAN_BOX_QTY', width:"100px", align:"right"},
                {editable: false,name:'PLAN_EA_QTY', width:"100px", align:"right"},
                {editable: false,
                    name:'CONF_QTY',
                    width:"100px",
                    align:"right",
                    hidden: true},
                {editable: false,
                    /* 화면 컬럼 도메인명 처리 2017.08.04 */
                    //name:'CONF_QTY',
                    name:'CONF_TOT_QTY',
                    width:"100px",
                    align:"right"},
                {editable: false,name:'CONF_BOX_QTY', width:"100px", align:"right"},
                {editable: false,name:'CONF_EA_QTY', width:"100px", align:"right"},
                {editable: false,name:'PLAN_WEIGHT', width:"100px", align:"right"},
                {editable: false,name:'MAKE_LOT', width:"100px", align:"center"},
                {editable: false,name:'MAKE_YMD', width:"100px", align:"center"},
                {editable: false,name:'DIST_EXPIRY_YMD', width:"100px", align:"center"},
                {editable: false,name:'LOT_ATTR1', width:"100px", align:"left"},
                {editable: false,name:'LOT_ATTR2', width:"100px", align:"left"},
                {editable: false,name:'LOT_ATTR3', width:"100px", align:"left"},
                {editable: false,name:'LOT_ATTR4', width:"100px", align:"left"},
                {editable: false,name:'LOT_ATTR5', width:"100px", align:"left"},
                {editable: false,name:'IB_PROG_ST_CD', width:"100px", hidden:true},
                {editable: false,name:'IB_PROG_ST', width:"100px", align:"center"}
            ],
            pager: "#ibPlanDetailGridNavi",
            domainId:"IB_PLAN_DETAIL_LIST",
            rowClickFocus:true,
            groupHeaders:[
                          {
                              rowspan : true,
                              header:[
                                  {start: 'PLAN_TOT_QTY', length: 3 , domain:"PLAN_QTY"},
                                  {start: 'CONF_TOT_QTY', length: 3 , domain:"CONF_QTY" }
                              ]
                          }]
        });
    }


    function fnAdd() {
        $("#gbn").val("true");
        $("#inNoHidden").val("");
        PopApp.paragonOpenPopup({
            ajaxUrl: '/ctrl/inbound/inboundPlan/createInboundPlanPop',
            id: 'createIbPlanPop',
            width: '1400',
            height:'500',
            btnName:"저장",
            domainId:"PWMIB101E_P1",
            visible: true
        });
    }

    function fnModify() {

        $("#gbn").val("false");
        PopApp.paragonOpenPopup({
            ajaxUrl: '/ctrl/inbound/inboundPlan/createInboundPlanPop',
            id: 'createIbPlanPop',
            width: '1400',
            height:'500',
            domainId:"PWMIB101E_P1",
            visible:true
        });

    }

    function fnDelete() {

        // 데이터 키 : Value Key
        var rowData = {
                modFlag:"MOD_FLAG" ,
                clientCd:"CLIENT_CD" ,
                ibNo:"IB_NO",
                ibProgStCd:"IB_PROG_ST_CD"
        }

        var chkData = $ibPlanHGrid.getSelectedJsonData("dt_inboundPlanInfo",rowData);
        var data = JSON.parse(chkData).dt_inboundPlanInfo;

        for (var i = 0; i < data.length; i++) {
            var progStCd = data[i].ibProgStCd;
            if(progStCd != "10"){
                alert("MSG_IN_ERR_001 입고예정 상태만 삭제 가능합니다.");
                return true;
            }
        }

        if(!confirm("MSG_COM_CFM_001 삭제하시겠습니까?")) return false;

        $.ajax({
            url : "/ctrl/inbound/inboundPlan/deleteInboundPlanInfo",
            data :chkData,
            type : "POST",
            dataType : "json",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            success : function(data) {
                if(data.stsCd == "999"){
                    alert(data.msgTxt);
                }else{
                    alert(data.msgTxt);
                    $ibPlanHGrid.paragonGridReload();
                }
            }
        });

    }

    function fnReportCheck(){

        var alertInfoKey1 = "입고번호";
        var alertInfoKey2 = "입고예정"
        var idx = $ibPlanHGrid.getGridParam("selarrrow"); //선택한 Row 정보
        var ids = $ibPlanHGrid.jqGrid('getDataIDs'); //JQGrid INDEX값
        var dat = "";
        var count = 0;

        if(idx.length == 0){
            alert("선택 된 항목이 없습니다.");
            return false;
        }

        for (var i = 0; i < ids.length; i++) {
            var check = false;
            $.each(idx, function (index, value) {  //row의 index와 JQGrid INDEX 비교
                if (value == ids[i]){
                    check = true;
                     if( $ibPlanHGrid.getRowData(ids[i]).IB_PROG_ST_CD != 10){ //INDEX의 입고진행상태확인
                         if(count != 0){
                             dat += ", ";
                         }
                         dat += $ibPlanHGrid.getRowData(ids[i]).IB_NO;
                         count += 1;
                    }
                }
            });
        }
        if(count > 0){ //입고진행상태 아닌 String 값 alert
            alert(alertInfoKey1 + " : " + dat + " 는 " + alertInfoKey2 + "가 아닙니다.");
            return false;
        }
        return true;
    }

    function fnReport(ReportUrl){
        App.prcsStart();
        var returnCheck = fnReportCheck();
        if(!returnCheck){
            App.prcsEnd();
            return false;
        }

        var reportRowData = {
                ibNo : "IB_NO",
                clientCd : "CLIENT_CD"
        }
        var jsonData = $ibPlanHGrid .getSelectedJsonData("dt_data", reportRowData);
        var jsonObject = JSON.parse(jsonData);
        var jsonStr = JSON.stringify(jsonObject);
        var doubleClickFlag=false;
            $.ajax({
                url:ReportUrl,
                data: jsonStr,
                type:"POST",
                datatype:"JSON",
                cache: false,
                contentType: 'application/json; charset=utf-8',
                success:function(data){
                    var openNewWindowReport = window.open("about:blank");
                    openNewWindowReport.location.href=data.fileName;
                },
                complete : function(){
                    App.prcsEnd();
                }
            });
    }

}();

/********************************************************************
 * bootstrap-datepicker 달력오픈 중, 탭 이동시 달력 hide
 * Since   : 2017-08-29
 * 작성자  : Kim Seon Ho
 * 수정내역: 2017-09-08 Tab-menu 종료시 마우스 클릭 인식 안되, datepicker(hide) 가 안되던 현상 수정
 ********************************************************************/
$("li.active").siblings().click(function () {
    // trigger the datepicker
    $('.date').datepicker('hide');
});
$("li.active").live("click focusout", function (e) {
    // trigger the datepicker
    $('.date').datepicker('hide');
});

$(document).ready(function() {
    IbPlanInsertApp.init();
});
