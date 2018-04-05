/** Copyright (c) 2016 VertexID RND, Inc.
 *
 * Application Name : AreaPopup관리
 * Program Code     : PWMMS103E
 * Description      :
 * Revision History
 * Author           Date                Description
 * ------------     -------------       ------------------
 * Kim Min su       2017. 2. 23.        First Draft.
 */
var InboundPlanCreatePopApp = function () {
    "use strict";

    /************************************************
     *전역 객체 선언부 (return 상위부분에 선언해야함)
     ************************************************/

    // [El]프로그램 그리드
    var $inboundPlanPopGrid = $("#inboundPlanPopGrid");

    var $ibPlanHGrid = $("#ibPlanHeaderGrid")

    var $callBackInput;

    var modify = $(window.document).find("#gbn").attr("value");
    var hiddenIbNo = $(window.document).find("#ibNoHidden").attr("value");
    var hiddenclientCd = $(window.document).find("#popIbPlanClientCd").attr("value");
    var hiddenSupplierCd = $(window.document).find("#ibSupCdHidden").attr("value");

    var itemGbnCombo;

    var itemStatusCombo;

    return {
        init: function () {

            fnListItemGbnJson("IB_GBN_CD");

            fnListItemStatus("ITEM_ST_CD");

            if(modify == "true"){ //신규
                fnListInboundPlanCreatePop();
                $("#popIbPlanYmdS").datepicker({});
                $("#popIbPoYmdS").datepicker({});
            }else{ //수정
                fnListInboundPlanModifyPop();
                fnInboundPlanHInfo();
                $("#popInPlanNo").val(hiddenIbNo);
                $("#popIbPlanClientCd").val(hiddenclientCd).focus();
                $("#popIbPlanSupCd").val(hiddenSupplierCd).focus();
                $("#popIbPlanYmd").attr('disabled', true);
                $("#popIbPoYmd").attr('disabled', true);

            }
            $("#popIbPlanClientCd").attr('disabled', true);
            $("#popIbPlanClientNm").attr('disabled', true);
            $("#popIbPlanSupNm").attr('disabled', true);
            $("#popInPlanNo").attr('disabled', true);

            toDateSetEvnet()

            fnInboundPlanCreateEvents();

            //공급처명 자동 검색을 위해 추가
            $("#popIbPlanSupCd").change();
        },
        callBackInput: function () {
            return $callBackInput;
        }
    };

  //[Fn] datepicker Set up today.
    function toDateSetEvnet() {
        $("#popIbPlanYmdS").datepicker("setDate", new Date());
    }

    //[Fn] 이벤트
    function fnInboundPlanCreateEvents(){

        //코드 입력시 명 서치
        addCdChangeEvent("popIbPlanClient", "popIbPlanSup", "SUPPLIER");      //공급처

        //신규 버튼 이벤트
        $("#popAddIbBtn").click(function() {
            //그리드 행 추가.
            $inboundPlanPopGrid.paragonGridAddRow();
			//행추가시 박스수량, 낱개수량 기본값 0 입력
            fnAddRowQtyDefault($inboundPlanPopGrid);

        });

        $("#popSaveIbBtn").click(function(){
            fnSave();
        });

//        $("#popDelIbBtn").click(function(){
//            $inboundPlanPopGrid.paragonGridCheckedDelete();
//        });

        //삭제버튼 이벤트
        $("#popDelIbBtn").click(function(){
            fnDel();
        });

        $("#popIbPlanSup").click(function(){
            fnSupplierPop();
        });
    }

    function fnListItemGbnJson(groupCd){
        $.ajax({
            url : "/ctrl/settings/system/code/listCodeGroupComboJson",
            data :{codeGroupCd:groupCd},
            type : "POST",
            dataType : "json",
            cache: false,
            async:false,
            success : function(result) {
                itemGbnCombo = Util.MakeGridOptions(result);
                Util.MakeSelectOptions($("#popIbGbnCd"),result);
            }
        });
    }

    function fnListItemStatus(groupCd){
        $.ajax({
            url : "/ctrl/settings/system/code/listCodeGroupComboJson",
            data :{codeGroupCd:groupCd},
            type : "POST",
            dataType : "json",
            cache: false,
            async:false,
            success : function(result) {
                itemStatusCombo = Util.MakeGridOptions(result);
            }
        });
    }

    /********************************************************************
     * AreaPopup 그리드 생성
     * Since   : 2017-02-23
     * 작성자  : Kim Min Su
     * 수정내역:
     ********************************************************************/
    //[Fn] jqgrid Area 목록
    function fnListInboundPlanCreatePop(){
        $inboundPlanPopGrid.paragonGrid({
            rowEditable:true,
            cellEditable:false,
            sortable: true,
            rownumbers: true,
            multiselect:true,
//            multielonly:true,
            loadui: 'disable',
            shrinkToFit: false,
            rowClickFocus:true,
            height:'300',
            width:'1300',

            colModel:[
                      {editable: false,name:'IB_NO', width:"100px", hidden:true},
                      {editable: true,name:'ITEM_CD', width:"100px", align:"center",
                          searchBtnClick : function(value, rowid, colid) {
                              fnInboundPlanItemPop(rowid);
                              },
                              disabled:true,
                              required:true
                      },
                      {editable: false,name:'ITEM_NM', width:"200px"},
                      {editable: false,name:'ITEM_SPEC', width:"150px"},
                      {
                          editable: true,
                          name:'ITEM_ST_CD',
                          align:"center",
                          width:"100px",
                          fixed :true,
                          edittype:'select',
                          formatter:'select',
                          hidden: true,
                          editoptions: {
                              value:itemStatusCombo
                          }
                      },
                      {
                          editable: true,
                          /* 화면 컬럼 도메인명 처리 2017.08.04 */
                          //name:'ITEM_ST_CD',
                          name:'ITEM_ST',
                          align:"center",
                          width:"100px",
                          fixed :true,
                          edittype:'select',
                          formatter:'select',
                          editoptions: {
                              value:itemStatusCombo
                          },
                          required:true
                      },
                      { editable: false, name: "PKQTY", width: "100px", align: "center"}, //입수
                      { editable: false, name: "PKQTYPLT", width: "100px", align: "center", hidden: true }, //PLT입수
                      { editable: false, name: "CONV_UOM_CD", width: "100px", align: "center", hidden: true }, //단위
                      //{editable: true, name: "CONV_UOM",    width: "100px", align: "center"},
                      { editable: false, name: "UOM", width: "100px", align: "center" }, //단위
                      {editable: false,
                          /* 화면 컬럼 도메인명 처리 2017.08.07 */
                          //name:'PLAN_QTY',
                           name:'PLAN_TOT_QTY',
                           width:"100px",
                           align : "right"},
                      {editable: true,name:'PLAN_BOX_QTY', width:"100px", align : "right", required:true,
                          editoptions : {
                              dataInit : function(el) {
                                  var rowid = $(el)[0].attributes.rowid.value;
//                                  if($inboundPlanPopGrid.getRow(rowid,"PLAN_BOX_QTY") == ''){
//                                      $inboundPlanPopGrid.setCell("PLAN_BOX_QTY",0,rowid);
//                                  }
                                  $(el).onlyNumber();
                                  $(el).keyup(function(){
                                      if($inboundPlanPopGrid.getRow(rowid,"ITEM_CD") == ''){
                                          alert("제품을 선택하십시오.");
                                          return;
                                      }
                                      if($inboundPlanPopGrid.getRow(rowid,"PLAN_BOX_QTY") == ''){
                                          $inboundPlanPopGrid.setCell("PLAN_BOX_QTY",0,rowid);
                                      }
                                      setPlanTotQty(rowid);
                                  });
                              }
                          }
                      },
                      {editable: true,name:'PLAN_EA_QTY', width:"100px", align : "right",required:true,
                          editoptions : {
                              dataInit : function(el) {
                                  var rowid = $(el)[0].attributes.rowid.value;
//                                  if($inboundPlanPopGrid.getRow(rowid,"PLAN_EA_QTY") == ''){
//                                      $inboundPlanPopGrid.setCell("PLAN_EA_QTY",0,rowid);
//                                  }
                                  $(el).onlyNumber();
                                  $(el).keyup(function(){
                                      if($inboundPlanPopGrid.getRow(rowid,"ITEM_CD") == ''){
                                          alert("제품을 선택하십시오.");
                                          return;
                                      }
                                      if($inboundPlanPopGrid.getRow(rowid,"PLAN_EA_QTY") == ''){
                                          $inboundPlanPopGrid.setCell("PLAN_EA_QTY",0,rowid);
                                      }
                                      setPlanTotQty(rowid);
                                  });
                              }
                          }
                      },
                      {editable: true,name:'WEIGHT', width:"100px", align:"center", formatter : "integer"},
                      {editable: true,name:'MAKE_LOT', width:"100px", align:"center"},
                      {editable: true,name:'MAKE_YMD', width:"100px", align:"center",
                          editoptions : {
                              dataInit : function(el) {
                                  $(el).datepicker();
                              }
                          }
                      },
                      {editable: true,name:'DIST_EXPIRY_YMD', width:"100px", align:"center",
                          editoptions : {
                              dataInit : function(el) {
                                  $(el).datepicker();
                              }
                          }
                      },
                      {editable: true,name:'LOT_ATTR1', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR2', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR3', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR4', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR5', width:"100px", align:"center"}
                  ],
            pager: "#inboundPlanPopGridNavi",
            domainId:"IB_PLAN_LIST",
            groupHeaders:[
                          {
                              rowspan : true,
                              header:[
                                  {start: 'PLAN_TOT_QTY', length: 3 , domain:"PLAN_QTY"}
                              ]
                          }]
        });
    }
    //예정 총 수량 계산 함수
    function setPlanTotQty(rowid){
//        if($inboundPlanPopGrid.getRow(rowid,"ITEM_CD") == ''){
//            alert("제품을 선택하십시오.");
//            return;
//        }
        var planTotQty = 0;

        var pkQty = Number($inboundPlanPopGrid.getRow(rowid,"PKQTY"));
        var box = Number($inboundPlanPopGrid.getRow(rowid,"PLAN_BOX_QTY"));
        var ea = Number($inboundPlanPopGrid.getRow(rowid,"PLAN_EA_QTY"));

        planTotQty =  box * pkQty + ea;
        $inboundPlanPopGrid.setCell("PLAN_TOT_QTY",planTotQty,rowid);
    }

    function fnListInboundPlanModifyPop(){
        $inboundPlanPopGrid.paragonGrid({
            url: '/ctrl/inbound/inboundPlan/inboundPlanCreate',
            rowEditable:true,
            cellEditable: true,
            sortable: true,
            rownumbers: true,
            height:'300',
            width:'1300',
            loadui: 'disable',
            postData:{clientCd:hiddenclientCd, ibNo:hiddenIbNo},
            rowClickFocus: true,
            shrinkToFit: false,
            multiselect: true,
//            multielonly: true,
            colModel:[
                      {editable: false,name:'IB_NO', width:"100px", align:"center"},
                      {editable: false,name:'IB_DETAIL_SEQ', hidden:true},
                      {editable: true,name:'ITEM_CD', width:"100px", align:"center", required: true,
                          searchType:'IB_PLAN_ITEM',
                          searchBtnClick : function(value, rowid, colid) {
                              fnInboundPlanItemPop(rowid);
                              }, disabled:true
                          },
                      {editable: false,name:'ITEM_NM', width:"100px", align:"left"},
                      {editable: false,name:'ITEM_SPEC', width:"100px", align:"center"},
                      {
                          editable: true,
                          name:'ITEM_ST_CD',
                          align:"center",
                          hidden: true,
                          width:"100px",
                          fixed :true,
                          edittype:'select',
                          formatter:'select',
                          editoptions: {
                              value:itemStatusCombo
                          }
                      },
                      {
                          editable: true,
                          /* 화면 컬럼 도메인명 처리 2017.08.04 */
                          //name:'ITEM_ST_CD',
                          name:'ITEM_ST',
                          align:"center",
                          width:"100px",
                          fixed :true,
                          edittype:'select',
                          formatter:'select',
                          editoptions: {
                              value:itemStatusCombo
                          },
                          required:true
                      },
                      { editable: false, name: "PKQTY", width: "100px", align: "center"}, //입수
                      { editable: false, name: "PKQTYPLT", width: "100px", align: "center" , hidden: true}, //PLT입수
                      { editable: false, name: "CONV_UOM_CD", width: "100px", align: "center", hidden: true }, //단위
                      //{editable: true, name: "CONV_UOM",    width: "100px", align: "center"},
                      { editable: false, name: "UOM", width: "100px", align: "center" }, //단위
                      {editable: false,
                          /* 화면 컬럼 도메인명 처리 2017.08.07 */
                          //name:'PLAN_QTY',
                          name:'PLAN_TOT_QTY',
                           width:"100px",
                           align : "right"},
                      {editable: true,name:'PLAN_BOX_QTY', width:"100px", align : "right", required:true,
                           editoptions : {
                               dataInit : function(el) {
                                   //선택 된 rowid
                                   var rowid = $(el)[0].attributes.rowid.value;
//                                   if($inboundPlanPopGrid.getRow(rowid,"PLAN_BOX_QTY") == ''){
//                                       $inboundPlanPopGrid.setCell("PLAN_BOX_QTY",0,rowid);
//                                   }
                                   $(el).onlyNumber();
                                   $(el).keyup(function(){
                                       //제품 선택 여부 validation
                                       if($inboundPlanPopGrid.getRow(rowid,"ITEM_CD") == ''){
                                           alert("제품을 선택하십시오.");
                                           return;
                                       }
                                       //모든 값이 지워진 경우 0 입력 되도록 변경
                                       if($inboundPlanPopGrid.getRow(rowid,"PLAN_BOX_QTY") == ''){
                                           $inboundPlanPopGrid.setCell("PLAN_BOX_QTY",0,rowid);
                                       }
                                       setPlanTotQty(rowid);
                                   });
                               }
                           }
                      },
                      {editable: true,name:'PLAN_EA_QTY', width:"100px", align : "right", required:true,
                          editoptions : {
                              dataInit : function(el) {
                                  //선택 된 rowid
                                  var rowid = $(el)[0].attributes.rowid.value;
                                  //td내 값이 없는 경우 0 입력
//                                  if($inboundPlanPopGrid.getRow(rowid,"PLAN_EA_QTY") == ''){
//                                      $inboundPlanPopGrid.setCell("PLAN_EA_QTY",0,rowid);
//                                  }
                                  //숫자만 입력 가능하도록 설정
                                  $(el).onlyNumber();
                                  $(el).keyup(function(){
                                      if($inboundPlanPopGrid.getRow(rowid,"ITEM_CD") == ''){
                                          alert("제품을 선택하십시오.");
                                          return;
                                      }
                                      if($inboundPlanPopGrid.getRow(rowid,"PLAN_EA_QTY") == ''){
                                          $inboundPlanPopGrid.setCell("PLAN_EA_QTY",0,rowid);
                                      }
                                      setPlanTotQty(rowid);
                                  });
                              }
                          }
                      },
                      {editable: true,name:'WEIGHT', width:"100px", align:"center", formatter : "integer"},
                      {editable: true,name:'MAKE_LOT', width:"100px", align:"center"},
                      {editable: true,name:'MAKE_YMD', width:"100px", align:"center",
                          editoptions : {
                              dataInit : function(el) {
                                  $(el).datepicker();
                              }
                          }
                      },
                      {editable: true,name:'DIST_EXPIRY_YMD', width:"100px", align:"center",
                          editoptions : {
                              dataInit : function(el) {
                                  $(el).datepicker();
                              }
                          }
                      },
                      {editable: true,name:'LOT_ATTR1', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR2', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR3', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR4', width:"100px", align:"center"},
                      {editable: true,name:'LOT_ATTR5', width:"100px", align:"center"}
                  ],
            pager: "#inboundPlanPopGridNavi",
            domainId:"IB_PLAN_LIST",
            groupHeaders:[
                          {
                              rowspan : true,
                              header:[
                                  {start: 'PLAN_TOT_QTY', length: 3 , domain:"PLAN_QTY"}
                              ]
                          }],
            gridComplete: function(){
                var ids = $inboundPlanPopGrid.jqGrid("getDataIDs");
                if(ids && ids.length > 0){
                    $inboundPlanPopGrid.setFocus(0);
                }
            }
        });
    }

    function fnInboundPlanItemPop(rowid){
        PopApp.paragonOpenPopup({
            ajaxUrl : "/ctrl/inbound/inboundPlan/inboundPlanItemPop",
            id : "inboundPlanItemPop",
            width : "700",
            btnName : "수정",
            domainId:"PWMCM111Q_P1",
            onload : function(modal) {
                modal.show();
            },
            callback : function(data){
                if(data.ITEM_CD == undefined){
                    $inboundPlanPopGrid.setCell("ITEM_CD",'',rowid);
                }else{
                    $inboundPlanPopGrid.setCell("ITEM_CD",data.ITEM_CD,rowid);
                }
//                $inboundPlanPopGrid.setCell("ITEM_CD",data.ITEM_CD,rowid);
                $inboundPlanPopGrid.setCell("ITEM_NM",data.ITEM_NM,rowid);
                $inboundPlanPopGrid.setCell("ITEM_SPEC",data.ITEM_SPEC,rowid);
                $inboundPlanPopGrid.setCell("ITEM_ST_CD",data.ITEM_ST_CD,rowid);
                $inboundPlanPopGrid.setCell("PKQTY",data.CONV_UOM_QTY,rowid);
                $inboundPlanPopGrid.setCell("PKQTYPLT",data.PKQTYPLT,rowid);
                $inboundPlanPopGrid.setCell("UOM",data.CONV_UOM_CD,rowid);
                $inboundPlanPopGrid.setCell("WEIGHT",data.WEIGHT,rowid);
                setPlanTotQty(rowid);
            }
        });
    }

    function fnSave(){

        if($("#popIbPlanYmd").val() != $("#popIbPlanYmdH").val()){
            $("#edit").val("true");
        }else if($("#popCarNo").val() != $("#popCarNoH").val()){
            $("#edit").val("true");
        }else if($("#popIbGbnCd").val() != $("#popIbGbnCdH").val()){
            $("#edit").val("true");
        }else if($("#popIbPlanSupCd").val() != $("#popIbPlanSupCdH").val()){
            $("#edit").val("true");
        }else if($("#popIbPoYmd").val() != $("#popIbPoYmdH").val()){
            $("#edit").val("true");
        }else if($("#popRemark").val() != $("#popRemarkH").val()){
            $("#edit").val("true");
        }else if($("#popPoNo").val() != $("#popPoNoH").val()){
            $("#edit").val("true");
        }

        var hData = {
            //dt_ibH:[{
                edit:$("#edit").val(),
                clientCd:$("#popIbPlanClientCd").val() ,
                ibNo:$("#popInPlanNo").val() ,
                ibPlanYmd:$("#popIbPlanYmd").val() ,
                ibPoYmd:$("#popIbPoYmd").val() ,
                supplierCd:$("#popIbPlanSupCd").val() ,
                carNo:$("#popCarNo").val() ,
                ibGbnCd:$("#popIbGbnCd").val() ,
                remark:$("#popRemark").val() ,
                poNo:$("#popPoNo").val()
            //}]
        }
        var formatData = {};
        var colModel = $inboundPlanPopGrid.getGridParam('colModel');
        for (var i = 0; i < colModel.length; i++) {
            var colId = colModel[i]['name'];
            formatData[colId.strCamel()] = colId;
            console.log("strCamel==>"+colId.strCamel()+"/colId==>"+colId)
        }

        var rowid = $inboundPlanPopGrid.jqGrid("getDataIDs");
        var sss = false;

        for (var i = 0; i < rowid.length; i++) {
            var flag = $inboundPlanPopGrid.getRowData(rowid[i]).MOD_FLAG;
            if(flag != null){
                var sss = true;
                break;
            }
        }

        console.log("formatData=|=>"+JSON.stringify(formatData));
        var jsonData = "";
        if(sss == false){
            jsonData = JSON.stringify(hData);
        }else{
            jsonData = $inboundPlanPopGrid.getJsonSelectedParamsData("dt_ibPlan",formatData, hData);
        }

        var sUrl = "";
        if(modify == "true"){
            sUrl = "insertInboundPlanInfo";
        }else{
            sUrl = "updateInboundPlanInfo";

            //수정 모드 일 경우만 변경 된 행 유무 체크
            var ids = $inboundPlanPopGrid.getGridParam("selarrrow");

            var rowFlag = "";
            for(var i = 0 ; i < ids.length ; i++){
                rowFlag = $inboundPlanPopGrid.getRowData(ids[i]).MOD_FLAG;
                if(rowFlag != "UPDATE" && rowFlag != "INSERT"){
                    alert("[ " + $inboundPlanPopGrid.getRowData(ids[i]).ITEM_CD + " ] 제품은 변경 된 값이 없습니다.");
                    return false;
                }
            }
        }

        if(!fnValidate()) return false;

        if(!confirm("MSG_COM_CFM_003 저장하시겠습니까?")) return false;

        $.ajax({
            url:"/ctrl/inbound/inboundPlan/"+sUrl,
            data:jsonData,
            dataType:"json",
            type:"POST",
            cache:false,
            contentType: 'application/json; charset=utf-8',
            success:function(data){
                console.log(data);
                alert(data.msgTxt);
                $("#createIbPlanPop").paragonClosePopup();
                $ibPlanHGrid.paragonGridReload();
            }
        });
    }

    function fnInboundPlanHInfo(){
        var clientCd = $("#popIbPlanClientCd").val();
        $.ajax({
            url:'/ctrl/inbound/inboundPlan/listInboundPlanH',
            data:{ibNo:hiddenIbNo, clientCd:clientCd},
            success:function(data){
                //팝업시 기본정보입력
                var ibData = data.dt_grid[0];
                $("#popIbPlanYmd").val(ibData.IB_PLAN_YMD);
                $("#popIbPlanYmdH").val(ibData.IB_PLAN_YMD);
                $("#popCarNo").val(ibData.CAR_NO);
                $("#popCarNoH").val(ibData.CAR_NO);
                $("#popIbGbnCd").val(ibData.IB_GBN_CD);
                $("#popIbGbnCdH").val(ibData.IB_GBN_CD);
//                $("#popIbPlanSupCd").val(ibData.SUPPLIER_CD); //
//                $("#popIbPlanSupCdH").val(ibData.SUPPLIER_CD);
                $("#popIbPlanSupNm").val(ibData.SUPPLIER);
                $("#popPoNo").val(ibData.PO_NO);
                $("#popPoNoH").val(ibData.PO_NO);
                $("#popIbPoYmd").val(ibData.PO_YMD);
                $("#popIbPoYmdH").val(ibData.PO_YMD);
                $("#popRemark").val(ibData.REMARK);
                $("#popRemarkH").val(ibData.REMARK);
            }
        });
    }

    function fnSupplierPop() {
        PopApp.paragonOpenPopup({
            ajaxUrl : '/ctrl/common/supplierPop',
            id : 'modalSupplierPopup',
            width : '550',
            domainId:"PWMCM106Q_P1",
//            data : { supplierCd : $('#popIbPlanSupCd').val() },
            visible:true,
            onload : function(modal) {
//                var callBack ={
//                        "SUPPLIER_CD" :"popIbPlanSupCd",
//                        "SUPPLIER_NM" :"popIbPlanSupNm"
//                };
//                App.setElIds(callBack);
                modal.show();
            },
            callback : function(data){
                $("#popIbPlanSupCd").val(data.SUPPLIER_CD);
                $("#popIbPlanSupNm").val(data.SUPPLIER_NM);
            }
        });
    }

    function fnValidate(){

        //validation
        if($("#popIbPlanClientNm").val().length == 0){//고객사 검사
            alert("고객사 항목은 필수 입력입니다.");
            $("#popIbPlanClientNm").focus();
            return false;
        }else if($("#popIbPlanClientNm").val().trim().length == 0){
            alert("고객사 항목은 공백만으로 입력할 수 없습니다.");
            console.log($("#popIbPlanClientNm").val());
            $("#popIbPlanClientNm").focus();
            return false;
        }
        //validation
        if($("#popIbPlanYmd").val().length == 0){//입고예정일자 검사
            alert("입고예정일자 항목은 필수 입력입니다.");
            $("#popIbPlanYmd").focus();
            return false;
        }else if($("#popIbPlanYmd").val().trim().length == 0){
            alert("입고예정일자 항목은 공백만으로 입력할 수 없습니다.");
            console.log($("#popIbPlanYmd").val());
            $("#popIbPlanYmd").focus();
            return false;
        }
        //validation
        if($("#popIbPlanSupCd").val().length == 0){//공급처 검사
            alert("공급처 항목은 필수 입력입니다.");
            $("#popIbPlanSupCd").focus();
            return false;
        }else if($("#popIbPlanSupCd").val().trim().length == 0){
            alert("공급처 항목은 공백만으로 입력할 수 없습니다.");
            console.log($("#popIbPlanSupCd").val());
            $("#popIbPlanSupCd").focus();
            return false;
        }
        //validation
        if($("#popIbGbnCd").val().length == 0){//입고구분 검사
            alert("입고구분 항목은 필수 입력입니다.");
            $("#popIbGbnCd").focus();
            return false;
        }else if($("#popIbGbnCd").val().trim().length == 0){
            alert("입고구분 항목은 공백만으로 입력할 수 없습니다.");
            console.log($("#popIbGbnCd").val());
            $("#popIbGbnCd").focus();
            return false;
        }

        var ids = $inboundPlanPopGrid.getDataIDs();
        var idArray = $inboundPlanPopGrid.getGridParam('selarrrow');

        if(idArray.length <= 0){
            alert('선택 된 항목이 없습니다.');
            return false;
        }else{
            for (var i = 0; i < ids.length; i++) {
                if($("input:checkbox[id='jqg_inboundPlanPopGrid_"+ids[i]+"']").is(":checked")){
                    var rowdata = $inboundPlanPopGrid.getRowData(ids[i]);

                    if(!(rowdata.ITEM_CD)){
                        alert("제품코드 항목은 필수 입력입니다.");
                        return false;
                    }
                    if(rowdata.ITEM_CD.trim().length == 0 ){
                        alert("제품코드 공백으로 입력할 수 없습니다.");
                        return false;
                    }
                    if(!(rowdata.ITEM_ST)){
                        alert("제품상태 항목은 필수 입력입니다.");
                        return false;
                    }
                    if(rowdata.ITEM_ST.trim().length == 0 ){
                        alert("제품상태 공백으로 입력할 수 없습니다.");
                        return false;
                    }
                    if(!(rowdata.PLAN_BOX_QTY)){
                        alert("예정박스수량 항목은 필수 입력입니다.");
                        return false;
                    }
                    if(rowdata.PLAN_BOX_QTY.trim().length == 0 ){
                        alert("예정박스수량 공백으로 입력할 수 없습니다.");
                        return false;
                    }
                    if(!(rowdata.PLAN_EA_QTY)){
                        alert("예정낱개수량 항목은 필수 입력입니다.");
                        return false;
                    }
                    if(rowdata.PLAN_EA_QTY.trim().length == 0 ){
                        alert("예정낱개수량 공백으로 입력할 수 없습니다.");
                        return false;
                    }
                    if(parseFloat(rowdata.PLAN_BOX_QTY) == 0 && parseFloat(rowdata.PLAN_EA_QTY) == 0){
                        alert("예정수량은 '0'을 초과하여 입력해야 합니다.")
                        return false;
                    }
                    if(parseFloat(rowdata.PLAN_BOX_QTY) < 0 || parseFloat(rowdata.PLAN_EA_QTY) < 0){
                        alert("예정수량은 음수를 입력할 수 없습니다.")
                        return false;
                    }

                }
            }
        }

        return true;
    }

    //[Fn] Grid Delete Data Row.
    function fnDel() {
        var addFlag = $inboundPlanPopGrid.paragonGridCheckedDeleteData();

        if (addFlag === false) {
            var dataCnt = $inboundPlanPopGrid.getGridParam("records");
            var ids = $inboundPlanPopGrid.getGridParam('selarrrow');
            $inboundPlanPopGrid.paragonGridCheckedDelete();
            console.log(dataCnt, ids.length);
            var rowData = {};
            rowData = {
                    modFlag: "MOD_FLAG",
                    ibNo: "IB_NO",
                    ibDetailSeq: "IB_DETAIL_SEQ"
            }
            var sUrl = "";
            var dataSet = "";
            if((dataCnt - ids.length) == 0){
                sUrl = "deleteInboundPlanInfo";
                dataSet = "dt_inboundPlanInfo";
            }else{
                sUrl = "deleteInboundPlanPop";
                dataSet = "dt_inboundPlanPop"
            }
            console.log(rowData);

            var chkData = $inboundPlanPopGrid.getSelectedJsonData(dataSet,rowData);

            if(!confirm("MSG_COM_CFM_001 삭제하시겠습니까?")) return false;

            $.ajax({
                url : "/ctrl/inbound/inboundPlan/"+sUrl,
                data :chkData,
                type : "POST",
                dataType : "json",
                contentType: 'application/json; charset=utf-8',
                cache: false,
                success : function(data) {
                    alert(data.msgTxt);
                    $("#createIbPlanPop").paragonClosePopup();
                    $ibPlanHGrid.paragonGridReload();
                }
            });
        }
    }

    //[Fn] Reload Grid Method
    function fnReloadGrid() {
        $("#createIbPlanPop").paragonClosePopup();
        $inboundPlanPopGrid.paragonGridReload();
    }

}();

$(document).ready(function() {
    InboundPlanCreatePopApp.init();
});
