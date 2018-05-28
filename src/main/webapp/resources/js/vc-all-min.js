/********************************************************************************************************
 * IE 11 인식 안되서 추가. EventManager.js, Ext-more.js, Support.js 파일 내용 참고.
 ********************************************************************************************************/
Ext.browserCheck = function(regex){
    return regex.test(Ext.userAgent);
};
Ext.isIE = !Ext.isOpera && (Ext.browserCheck(/msie/) || Ext.browserCheck(/trident/));
Ext.isIE11 = Ext.isIE && ((Ext.browserCheck(/trident\/7\.0/) && document.documentMode != 7 && document.documentMode != 8 && document.documentMode != 9 && document.documentMode != 10) || document.documentMode == 11);
if(Ext.isIE11)
{
    Ext.isIE9 = true; //IE 11 에서 body 에 x-nlg 클래스 주기 위해서...
    Ext.isIE10 = true;
    Ext.isGecko = false;
}

/********************************************************************************************************
 * IE 8 다른 행 에디터 있는 상태에서 다른 행 에디트 컬럼 클릭시 에디터가 나타났가다가 포커스 아웃되서 사라지는 버그로
 * ext-all.js 를 ext-all-fix.js 로 복사하여 소스 수정.
 * Ext.grid.plugin.CellEditing 의 startEdit 함수에서 에디터 15ms 지연 후 생성하는 부분 오버라이드가 안되서 코어 소스 수정 함.
 ********************************************************************************************************/
Ext.EditTaskDelay = Ext.isIE8 ? 150 : 15;

/********************************************************************************************************
 * 팝업 조회창 - 조회조건에서 쓰임.
 ********************************************************************************************************/
Ext.define('VC.components.CommonSearchPop',{
    statics : {
        show : function(param){

            //조회조건 폼 생성
            var searchDS = [
                {TYPE : 'FIELD', DATATYPE : 'STRING', DBCOLUMN : Util.nvl(param.NAME_COLNAME, 'NAME'), COLUMNDESCR : Util.nvl(param.NAME_HEADER, 'CODENAME'), COLUMNDESCR_LANG : Lang.get(Util.nvl(param.NAME_HEADER, 'CODENAME')), OPERATOR : 'LIKE'},
                {TYPE : 'FIELD', DATATYPE : 'STRING', DBCOLUMN : Util.nvl(param.CODE_COLNAME, 'CODE'), COLUMNDESCR : Util.nvl(param.CODE_HEADER, 'CODE'), COLUMNDESCR_LANG : Lang.get(Util.nvl(param.CODE_HEADER, 'CODE')), OPERATOR : '='}
            ];
            var sfc = {id : 'CODE_AND_NAME_POP', columnsCnt : 1};
            var sForm = __createSearchConditionForm__(searchDS, null, sfc);
            //event
            var nameField = getSearchConditionFields(Util.nvl(param.NAME_HEADER, 'CODENAME'), 'CODE_AND_NAME_POP')[2];
            nameField.on({
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        nameField.up('[xtype=window]').searchData();
                    }
                },
                scope : this
            });
            var codeField = getSearchConditionFields(Util.nvl(param.CODE_HEADER, 'CODE'), 'CODE_AND_NAME_POP')[2];
            codeField.on({
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        codeField.up('[xtype=window]').searchData();
                    }
                },
                scope : this
            });

            //윈도우 띄우기
            return Ext.create('Ext.window.Window', {
                title: Util.nvl(param.COLUMNDESCR_LANG, Lang.get(param.TITLE)),
                constrainHeader: true,
                autoShow : true,
                modal : true,
                width : 550,
                height : 400,
                layout : 'fit',
                hasReturnVal : false,
                listeners : {
                    afterrender : function(){
                        var me = this;
                        Ext.defer(function(){
                            getSearchConditionFields(Util.nvl(param.NAME_HEADER, 'CODENAME'), 'CODE_AND_NAME_POP')[2].focus();
                            if(Util.nvl(param.AUTOSEARCH,false)) {
                                me.searchData();
                            }
                        },500);
                    },
                    close : function(){
                        var me = this;
                        if(param.CALLBY) param.CALLBY.popWinOpened = false;
                        if(!me.hasReturnVal && param.CALLBY && param.CALLBY.onPopClose)
                        {
                            param.CALLBY.onPopClose();
                        }
                    }
                },
                items : [
                    {
                        xtype : 'container',
                        name : 'windowContent',
                        layout : 'border',
                        items : [
                            sForm,
                            {
                                xtype : 'commonGrid',
                                id : '__commonSearchPopGrid__',
                                editable : false,
                                region : 'center',
                                useCheckboxModel : true,
                                selectionMode : Util.nvl(param.SELECTIONMODE, 'SINGLE'),
                                pageSize : param.PAGESIZE,
                                pageNaviDock : 'bottom',
                                paging : {
                                    onLoadPage : function(params){Ext.getCmp('__commonSearchPopGrid__').up('[xtype=window]').searchData(params);}
                                },
                                columnDefine : [
                                    {type : 'gridrownumber', width:40},
                                    {header : Util.nvl(param.NAME_HEADER, 'CODENAME'), colName:Util.nvl(param.NAME_COLNAME, 'NAME'), flex: 1},
                                    {header : Util.nvl(param.CODE_HEADER, 'CODE'), colName:Util.nvl(param.CODE_COLNAME, 'CODE'), flex: 1}
                                ],
                                listeners : {
                                    celldblclick : function(me, td, cellIdx, record, tr, rowIdx, evt, eOpts){
                                        me.up('[xtype=window]').closeAndReturn();
                                    }
                                },
                                buttonsConfig: [
                                    {text: 'SEARCH', iconCls : Util.buttonClsConfig('SEARCH',''), onClickCompleteEdit : false, handler : function(){this.up('[xtype=window]').searchData();} },
                                    {text: 'APPLY', iconCls : Util.buttonClsConfig('APPLY',''), onClickCompleteEdit : false, handler : function(){this.up('[xtype=window]').closeAndReturn();}},
                                    {text: 'CANCEL', iconCls : Util.buttonClsConfig('CANCEL',''), onClickCompleteEdit : false, handler : function(){this.up('[xtype=window]').close();}}
                                ]
                            }
                        ]
                    }
                ],
                searchData : function(paramsFromPaging){
                    var grid = Ext.getCmp('__commonSearchPopGrid__');
                    var store = grid.getStore();
                    store.removeAll();

                    //DEFAULTROW 있을 때
                    if(!Util.isNull(param.DEFAULTADDROW))
                    {
                        var defalutRow = grid.addRow();
                        defalutRow.set(Util.nvl(param.CODE_COLNAME, 'CODE'), param.DEFAULTADDROW.CODE);
                        defalutRow.set(Util.nvl(param.NAME_COLNAME, 'NAME'), param.DEFAULTADDROW.NAME);
                        store.commitChanges();
                    }

                    //조회조건 DS 셋팅
                    if( ! setSearchConditionDataSet('CODE_AND_NAME_POP') ) return;

                    var mask = new Ext.LoadMask(this.down('[name=windowContent]'), {msg:"Please wait..."});
                    mask.show();

                    var params = Util.nvl(paramsFromPaging, {
                        CURRENT_MENUCODE : Util.nvl(param.CURRENT_MENUCODE, CURRENT_MENUCODE),
                        MODULE : Util.nvl(param.MODULE),
                        SQLPROP : param.SQLPROP,
                        KEYPARAM : param.KEYPARAM,
                        PARAM1 : param.PARAM1,
                        PARAM2 : param.PARAM2,
                        PARAM3 : param.PARAM3,
                        PARAM4 : param.PARAM4,
                        PARAM5 : param.PARAM5,
                        PARAM6 : param.PARAM6,
                        PARAM7 : param.PARAM7,
                        PARAM8 : param.PARAM8,
                        PARAM9 : param.PARAM9,
                        PARAM10 : param.PARAM10
                    });

					//한글의 경우 대비하여...
					for(key in params)
					{
						if(!Util.isNull(params[key]))
						{
							params[key] = encodeURIComponent(params[key]);
						}
					}

                    //페이징 처리 할 경우
                    if(grid.pageSize)
                    {
                        if(grid.paging && !grid.paging.params) {grid.paging.params = {isPageNavi : true}; Ext.apply(grid.paging.params, params); }
                        params.PAGE_SIZE = Util.nvl(grid.paging.lastPageSize, grid.pageSize);
                        params.CURRENT_PAGE = Util.nvl(params.isPageNavi, false) ? grid.paging.currentPage : 1;
                    }

                    Ext.Ajax.request({
                        url : Util.nvl(param.URL, Util.isNull(grid.pageSize) ? '/appService/getCodeAndName' : '/appService/getCodeAndNamePage'),
                        jsonData : DS_SEARCHCONDITION,
                        params : params,
                        callback : function(options, success, response){
                            mask.hide();
                            var json = Ext.decode(response.responseText);
                            //TotalCount 사용여부
                            //2013-12-16 KHJ
                            var totalCountUse = Util.nvl(this.totalCountUse,true);
                            if(json["ErrorMsg"] === "OK")
                            {
                                var result = json["DS_OUT"];
                                if(result.length > 0)
                                {
                                    var titleText = (Util.isNull(grid.titleText) ? '' : Lang.get(grid.titleText)+' : ');
                                    if(grid.pageSize) {
                                        if(!params.isPageNavi) grid.initPageData(json["DS_TOTALCOUNT"]);
                                        if(totalCountUse){
                                            Ext.getCmp(grid.id + "DataCount").setText(titleText + grid.paging.totalCount);
                                        }
                                    }else{
                                        if(totalCountUse){
                                            Ext.getCmp(grid.id + "DataCount").setText(titleText + json["DS_OUT"].length);
                                        }
                                    }
                                    store.loadData(result, true);
                                }
                                else
                                {
                                    if(Util.isNull(param.DEFAULTADDROW)){
                                        Ext.MessageBox.show({
                                            //title: 'Search Data',
                                            msg: Lang.get('NO_DATA_FOUND'),
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                    }
                                }
                                grid.searchResult = result;
                            }
                            else
                            {
                                Ext.MessageBox.show({
                                    //title: 'Fail to Search Data',
                                    msg: json["ErrorMsg"],
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        }
                    });
                },
                closeAndReturn : function(){
                    var me = this;
                    me.hasReturnVal = true;
                    var grid = this.down('grid');
                    var selRows = grid.getSelectionModel().getSelection();
                    var ret = [];
                    for(var n=0; n<selRows.length; n++)
                    {
                        if(!Util.isNull(param.afterGetRow))
                        {
                            for(var s=0; s<grid.searchResult.length; s++){
                                var row = grid.searchResult[s];
                                if(selRows[n].data[Util.nvl(param.CODE_COLNAME, 'CODE')] == row[Util.nvl(param.CODE_COLNAME, 'CODE')]) {
                                    ret.push(row);
                                    if(Util.nvl(param.SELECTIONMODE, 'SINGLE') == 'SINGLE') break;
                                }
                            }
                        }
                        else if(Util.nvl(param.RETURNROW, false))
                        {
                            ret.push(selRows[n].data);
                        }
                        else
                        {
                            ret.push(selRows[n].data[Util.nvl(param.CODE_COLNAME, 'CODE')]);
                        }
                    }
                    if(param.CALLBY && param.CALLBY.onPopClose)
                    {
                        param.CALLBY.onPopClose(ret);
                    }
                    else if(param.afterGetRow)
                    {
                        param.afterGetRow(ret);
                    }
                    me.close();
                }
            });
        }
    }
});

/********************************************************************************************************
 * 그리드 넘버러. 페이징 처리 그리드를 위해 커스터마이징.
 ********************************************************************************************************/
Ext.define('VC.components.GridRowNumber', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.gridrownumber',

    text: "&#160",

    width: 23,

    sortable: false,

    draggable: false,

    align: 'right',

    constructor : function(config){
        this.width = this.width;

        this.callParent(arguments);
        if (this.rowspan) {
            this.renderer = Ext.Function.bind(this.renderer, this);
        }
    },

    // private
    resizable: false,
    hideable: false,
    menuDisabled: true,
    dataIndex: '',
    cls: Ext.baseCSSPrefix + 'row-numberer',
    rowspan: undefined,

    // private
    renderer: function(value, metaData, record, rowIdx, colIdx, store) {
        if (this.rowspan){
            metaData.cellAttr = 'rowspan="'+this.rowspan+'"';
        }

        metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
        return store.indexOfTotal(record) + Util.nvl(store.firstNumberOfPage, 1);
    }
});

/********************************************************************************************************
 * 그리드/폼 팝업 입력 필드. (조회 조건용 아님)
 ********************************************************************************************************/
Ext.define('VC.components.PopSearchField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.popSearchField',
    triggerCls : 'x-form-search-trigger',
    emptyText : '',
    popWinOpened : false,
    onTriggerClick: function() {
        var me = this;

        var evt = me.fireEvent('focus', this);
        if(evt === false) return;

        //이하 공통 팝업 이용시
        me.param.CURRENT_MENUCODE = CURRENT_MENUCODE;
        me.param.CALLBY = me;
        me.param.SELECTIONMODE = Util.nvl(me.param.SELECTIONMODE, 'SINGLE');

        if(me.param.DYNAMICPARAM && Ext.isArray(me.param.DYNAMICPARAM))
        {
            for(var n=0; n<me.param.DYNAMICPARAM.length; n++)
            {
                me.param[me.param.DYNAMICPARAM[n].PARAMNAME] = me.param.DYNAMICPARAM[n].getData(me.param.GRID);
            }
        }
        else if(me.param.DYNAMICPARAM && me.param.DYNAMICPARAM.getParams)
        {
            var popupParams = me.param.DYNAMICPARAM.getParams(me.param.GRID);
            if(!Util.isNull(popupParams))
            {
                Ext.apply(me.param, popupParams);
            }
        }

		if(!Util.isNull(me.param.SQLPROP) || !Util.isNull(me.param.URL))
        {
            //팝업창에 파라미터 넘기고 팝업창이 닫힐 때 onPopClose 를 호출한다.
            me.popWinOpened = true;
			if(me.customPopupFunction)
			{
				me.customPopupFunction(me.param);
			}
			else
			{
	            VC.components.CommonSearchPop.show(me.param);
			}
        }
    },
    onPopClose : function(returnObj){
        var me = this;
        me.popWinOpened = false;

        if(Util.isNull(returnObj))
        {
            //팝업창을 그냥 닫거나 취소 누를 때. 할 일 없음.
        }
        else if(me.param.RETURNROW)
        {
            var codeVal = null;
            var nameVal = null;
            var codeValArr = [];
            var nameValArr = [];
            for(var i=0; i<returnObj.length; i++)
            {
                codeValArr.push(returnObj[i][Util.nvl(me.param.CODE_COLNAME, 'CODE')]);
                nameValArr.push(returnObj[i][Util.nvl(me.param.NAME_COLNAME, 'NAME')]);
            }
            codeVal = codeValArr.toString();
            nameVal = nameValArr.toString();

            //빈 값일 때는 잠시 밸리데이터 멈춤. 포커스될 때 다시 false 로 변경함.
            if(Util.isNull(codeVal)) me.skipValidator = true;
            me.setValue(codeVal);
			me.param.setCodeNameColValue(nameVal);

            if(me.param.afterGetRow)
            {
                var paramData = Util.nvl(returnObj.length > 1 ? returnObj : returnObj[0], '');
                me.param.afterGetRow(me.param.GRID, paramData);
            }
        }
        else
        {
            var codeVal = returnObj.toString();
            //빈 값일 때는 잠시 밸리데이터 멈춤. 포커스될 때 다시 false 로 변경함.
            if(Util.isNull(codeVal)) me.skipValidator = true;
            me.setValue(codeVal);
        }

        if(!Util.isNull(me.evtParam)) {
            me.mimicBlur(me.evtParam);
        }
    },
    validateBlur: function(e) {
        this.evtParam = e;
        if(this.popWinOpened) {
            return false;
        }else{
            return true;
        }
    }
});

/********************************************************************************************************
 * 팝업 타입 조회조건.
 ********************************************************************************************************/
Ext.define('VC.components.SearchConditionPopSearchField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.searchConditionPopSearchField',
    triggerCls : 'x-form-search-trigger',
    onTriggerClick: function() {
        var me = this;
        me.param.CURRENT_MENUCODE = CURRENT_MENUCODE;
        me.param.CALLBY = me;
        me.param.SELECTIONMODE = 'MULTI';

        var paramNames = ['KEYPARAM','PARAM1','PARAM2','PARAM3','PARAM4','PARAM5','PARAM6','PARAM7','PARAM8','PARAM9','PARAM10'];
        for(var n=0; n<=paramNames.length; n++)
        {
            var sqlParam = me.param[paramNames[n]];
            var paramVal = sqlParam;

            //다른 조회조건의 값이 필요할 때. 필수는 아님.
            if(Util.nvl(sqlParam, '').indexOf('GET:') == 0)
            {
                paramVal = getSearchConditionValue(sqlParam.substr(4));
                me.param['ORG_' + paramNames[n]] = sqlParam;
            }
            //다른 조회조건의 값이 필요할 때. 필수.
            else if(Util.nvl(sqlParam, '').indexOf('REQ:') == 0)
            {
                var reqParam = getSearchConditionValue(sqlParam.substr(4));
                if(Util.isNull(reqParam))
                {
                    Ext.MessageBox.show({
                        msg: Lang.getRep('MSG_REQUIRE_OTHER_INPUT', [Lang.get(sqlParam.substr(4))]),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    return;
                }
                else
                {
                    paramVal = getSearchConditionValue(sqlParam.substr(4));
                    me.param['ORG_' + paramNames[n]] = sqlParam;
                }
            }
            me.param[paramNames[n]] = paramVal;
        }

        //팝업창에 파라미터 넘기고 팝업창이 닫힐 때 onPopClose 를 호출한다.
		if(me.customPopFunction)
		{
			eval(me.customPopFunction + '(me.param)');
		}
		else
		{
			VC.components.CommonSearchPop.show(me.param);
		}
    },
    onPopClose : function(returnObj){
        if(Util.isNull(returnObj))
        {
            //팝업창을 그냥 닫거나 취소 누를 때. 할 일 없음.
        }
        else if(Ext.isArray(returnObj))
        {
            this.setValue(returnObj.toString());
            if(returnObj.length > 1) this.previousSibling('[xtype=button]').changeOperationVal('IN', true);
        }
        else
        {
            this.setValue(returnObj);
        }
        var me = this;
        var paramNames = ['KEYPARAM','PARAM1','PARAM2','PARAM3','PARAM4','PARAM5','PARAM6','PARAM7','PARAM8','PARAM9','PARAM10'];
        for(var n=0; n<=paramNames.length; n++)
        {
            if(!Util.isNull(me.param['ORG_' + paramNames[n]]))
            {
                me.param[paramNames[n]] = me.param['ORG_' + paramNames[n]];
            }
        }
    }
});

/********************************************************************************************************
 * proxy 는 서버에서 에러코드를 던져도 request success 가 되기 때문에 서버의 예외처리가 되지 않는다. 그래서 오버라이드 함.
 ********************************************************************************************************/
Ext.define('VC.core.StoreAjaxProxy',{
    extend : 'Ext.data.proxy.Ajax',
    alias : 'proxy.ajaxStore',
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        return function(options, success, response) {
            var json = Ext.decode(response.responseText);
            if(json["ErrorMsg"] === "OK"){
                me.processResponse(success, operation, request, response, callback, scope);
            }else{
                Ext.MessageBox.show({
                    title: 'Fail to read data',
                    msg: json["ErrorMsg"],
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        };
    }
});

/********************************************************************************************************
 * BASE64 인코드/디코드
 ********************************************************************************************************/
Ext.define('VC.util.Base64',{
    statics : {
        encode : function(text) {

            if (/([^\u0000-\u00ff])/.test(text)){
                throw new Error("Can't base64 encode non-ASCII characters.");
            }

            var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            i = 0,
            cur, prev, byteNum,
            result=[];

            while(i < text.length){

                cur = text.charCodeAt(i);
                byteNum = i % 3;

                switch(byteNum){
                case 0: //first byte
                    result.push(digits.charAt(cur >> 2));
                    break;

                case 1: //second byte
                    result.push(digits.charAt((prev & 3) << 4 | (cur >> 4)));
                    break;

                case 2: //third byte
                    result.push(digits.charAt((prev & 0x0f) << 2 | (cur >> 6)));
                    result.push(digits.charAt(cur & 0x3f));
                    break;
                }

                prev = cur;
                i++;
            }

            if (byteNum == 0){
                result.push(digits.charAt((prev & 3) << 4));
                result.push("==");
            } else if (byteNum == 1){
                result.push(digits.charAt((prev & 0x0f) << 2));
                result.push("=");
            }

            return result.join("");
        },
        decode : function(text) {

            text = text.replace(/\s/g,"");

            if(!(/^[a-z0-9\+\/\s]+\={0,2}$/i.test(text)) || text.length % 4 > 0){
                throw new Error("Not a base64-encoded string.");
            }

            //local variables
            var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            cur, prev, digitNum,
            i=0,
            result = [];

            text = text.replace(/=/g, "");

            while(i < text.length){

                cur = digits.indexOf(text.charAt(i));
                digitNum = i % 4;

                switch(digitNum){

                //case 0: first digit - do nothing, not enough info to work with

                case 1: //second digit
                    result.push(String.fromCharCode(prev << 2 | cur >> 4));
                    break;

                case 2: //third digit
                    result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
                    break;

                case 3: //fourth digit
                    result.push(String.fromCharCode((prev & 3) << 6 | cur));
                    break;
                }

                prev = cur;
                i++;
            }

            return result.join("");
        }
    }
});

/********************************************************************************************************
 * 다국어 언어설정, 시스템 설정 데이터를 클라이언트 단에 가지고 옴.
 ********************************************************************************************************/
Ext.define('ClientData',{
    statics : {
        /**
         * 로그인용 LangPack, sysConfig 가져오기
         */
        getLangPackAndSysConfigForLogin : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/getLangPackAndSysConfigForLogin',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        top.LANG_PACK = json["DS_LANGPACK"][0];
                        top.SYS_CFG = json["DS_SYS_CFG"][0];
                        if(callbackFn) callbackFn();
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * LangPack, sysConfig, whConfig 가져오기
         */
        getLangPackAndSysConfig : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/getLangPackAndSysConfig',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        top.LANG_PACK = json["DS_LANGPACK"][0];
                        top.SYS_CFG = json["DS_SYS_CFG"][0];
                        top.WH_CFG = json["DS_WH_CFG"][0];
                        if(callbackFn) callbackFn();
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * LangPack, sysConfig, whConfig 리로드
         */
        reloadLangPackAndSysConfig : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/reloadLangPackAndSysConfig',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        top.LANG_PACK = json["DS_LANGPACK"][0];
                        top.SYS_CFG = json["DS_SYS_CFG"][0];
                        top.WH_CFG = json["DS_WH_CFG"][0];
                        if(callbackFn) callbackFn(json);
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * sysConfig, whConfig 로드
         */
        loadConfig : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/getConfig',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        top.SYS_CFG = json["DS_SYS_CFG"][0];
                        top.WH_CFG = json["DS_WH_CFG"][0];
                        if(callbackFn) callbackFn(json);
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * sysConfig, whConfig 리로드
         */
        reloadConfig : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/reloadConfig',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        top.SYS_CFG = json["DS_SYS_CFG"][0];
                        top.WH_CFG = json["DS_WH_CFG"][0];
                        if(callbackFn) callbackFn(json);
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * sysConfig 값 가져오기. USE_ACT_VAL 이 Y 이면 ACT_VAL, 아니면 DF_VAL
         */
        getSysConfig : function(cfgCd)
        {
            var config = top.SYS_CFG[cfgCd];
            if(Util.isNull(config)) {
                return null;
            }else if(config.USE_ACT_VAL == 'Y') {
                return config.ACT_VAL;
            }else{
                return config.DF_VAL;
            }
        },
        /**
         * whConfig 값 가져오기. USE_ACT_VAL 이 Y 이면 ACT_VAL, 아니면 DF_VAL
         */
        getWhConfig : function(cfgCd)
        {
            var whCd = (top && top.UserInfo && top.UserInfo.userWcode) ? top.UserInfo.userWcode : '';
            var config = top.WH_CFG[whCd + '_' + cfgCd];
            if(Util.isNull(whCd)){
                return null;
            }else if(Util.isNull(config)) {
                return null;
            }else if(config.USE_ACT_VAL == 'Y') {
                return config.ACT_VAL;
            }else{
                return config.DF_VAL;
            }
        },
        /**
         * 숫자/날짜 포멧팅 문자열 가져올 때 쓰기 위함.
         * 아래 코드는 sysconfig 를 사용하지만, langPack 에서 사용자 언어에 따라 가져올 경우를 위해 따로 함수를 만듬.
         */
        getFormat : function(format){
            return Util.nvl(Util.nvl(ClientData.getWhConfig(format), ClientData.getSysConfig(format)), Lang.get(format));
        }
    }
});

/********************************************************************************************************
 * 다국어 언어 설정 로드, 사용
 ********************************************************************************************************/
Ext.define('Lang',{
    statics : {
        /**
         * LangPack 에서 가져온 메시지에 argument 가 있는 경우 리플레이스
         */
        replace : function(msg, args){
            if(Util.isNull(msg))
            {
                return msg;
            }
            else if(Ext.isArray(args))
            {
                for(var n=0; n<args.length; n++)
                {
                    msg = msg.replace('{'+n+'}', args[n]);
                }
                return msg;
            }
            else
            {
                return msg.replace('{0}', args);
            }
        },
        /**
         * Top 프레임 Global 변수에서 값 가져오기
         */
        get : function(msgCd, langCd)
        {
            if(Util.isNull(msgCd))
            {
                return msgCd;
            }
            defalutLangCd = (top && top.UserInfo && top.UserInfo.userLang) ? top.UserInfo.userLang : 'KO';
            var lang = Util.isNull(langCd) ? defalutLangCd : langCd;
            var ret = top.LANG_PACK[msgCd + '_' + lang];
            return Util.isNull(ret) ? msgCd : ret;
        },
        /**
         * Top 프레임 Global 변수에서 값 가져온 후 리플레이스
         */
        getRep : function(msgCd, args, langCd)
        {
            if(Util.isNull(msgCd))
            {
                return msgCd;
            }
            else
            {
                return this.replace(this.get(msgCd, langCd), args);
            }
        },
        /**
         * sync ajax 로 사용자 선택 언어로 값 가져오기. 사용할 일 없음.
         */
        getByAjax : function(val)
        {
            var ret = '';
            Ext.Ajax.request({
                async : false,
                url : '/sessionService/getLangText',
                params : {MSGCD:val},
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        ret = json["TEXT"];
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
            return ret;
        },
        /**
         * LangPack 에서 로그인 화면에서 쓰는 것만 가져오기
         */
        getLangPackForLogin : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/getLangPackForLogin',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        if(top && !top.LANG_PACK) top.LANG_PACK = json["DS_LANGPACK"][0];
                        if(callbackFn) callbackFn();
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * LangPack 가져오기
         */
        getLangPack : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/getLangPack',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        top.LANG_PACK = json["DS_LANGPACK"][0];
                        if(callbackFn) callbackFn();
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * LangPack 리로드
         */
        reloadLangPack : function(callbackFn)
        {
            Ext.Ajax.request({
                url : '/sessionService/reloadLangPack',
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        top.LANG_PACK = json["DS_LANGPACK"][0];
                        if(callbackFn) callbackFn(json);
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            //title: 'Error Message',
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        }
    }
});

/********************************************************************************************************
 * 그리드 데이터 수정시 속도 느려서 Ext.view.Table 클래스 수정.
 * IE 에서 그리드 행 클릭시 스크롤 앞으로 이동하는 버그 수정.
 * 컬럼 오토사이즈 해도 글자 잘리는 버그 수정하기 위해 준비...
 ********************************************************************************************************/
Ext.override(Ext.view.Table, {
    onUpdate : function(store, record, operation, changedFieldNames) {
        var me = this,
        rowTpl = me.rowTpl,
        index,
        oldRow, oldRowDom,
        newRowDom,
        newAttrs, attLen, attName, attrIndex,
        overItemCls,
        focusedItemCls,
        columns;

        if (me.viewReady) {
            // Table row being updated
            oldRowDom = me.getNodeByRecord(record, false);

            // Row might not be rendered due to buffered rendering or being part of a collapsed group...
            if (oldRowDom) {
                overItemCls = me.overItemCls;
                focusedItemCls = me.focusedItemCls;

                index = me.indexInStore(record);
                oldRow = Ext.fly(oldRowDom, '_internal');
                newRowDom = me.createRowElement(record, index);
                if (oldRow.hasCls(overItemCls)) {
                    Ext.fly(newRowDom).addCls(overItemCls);
                }
                if (oldRow.hasCls(focusedItemCls)) {
                    Ext.fly(newRowDom).addCls(focusedItemCls);
                }
                columns = me.headerCt.getGridColumns();

                // Copy new row attributes across. Use IE-specific method if possible.
                if (oldRowDom.mergeAttributes) {
                    oldRowDom.mergeAttributes(newRowDom, true);
                } else {
                    newAttrs = newRowDom.attributes;
                    attLen = newAttrs.length;
                    for (attrIndex = 0; attrIndex < attLen; attrIndex++) {
                        attName = newAttrs[attrIndex].name;
                        if (attName !== 'id') {
                            oldRowDom.setAttribute(attName, newAttrs[attrIndex].value);
                        }
                    }
                }

                // If we have columns which may *need* updating (think locked side of lockable grid with all columns unlocked)
                // and the changed record is within our view, then update the view
                if (columns.length) {
                    me.updateColumns(record, me.getNode(oldRowDom, true), me.getNode(newRowDom, true), columns, changedFieldNames);
                }

                // loop thru all of rowTpls asking them to sync the content they are responsible for if any.
                while (rowTpl) {
                    if (rowTpl.syncContent) {
                        if (rowTpl.syncContent(oldRowDom, newRowDom) === false) {
                            break;
                        }
                    }
                    rowTpl = rowTpl.nextTpl;
                }

                // Since we don't actually replace the row, we need to fire the event with the old row
                // because it's the thing that is still in the DOM
                me.fireEvent('itemupdate', record, index, oldRowDom);
                //이거 때문에 느려서 주석처리
                //me.refreshSize();
            }
        }
    },
    focusRow: function(rowIdx) {
        var me = this,
            row,
            gridCollapsed = me.ownerCt && me.ownerCt.collapsed,
            record;

        // Do not attempt to focus if hidden or owning grid is collapsed
        if (me.isVisible(true) && !gridCollapsed && (row = me.getNode(rowIdx, true)) && me.el) {
            record = me.getRecord(row);
            rowIdx = me.indexInStore(row);

            // Focusing the row scrolls it into view
            me.selModel.setLastFocused(record);

            //IE 에서 제멋대로 스크롤 맨 앞으로 이동하는 것 방지
            if(!Ext.isIE)
            {
                row.focus();
            }
            me.focusedRow = row;
            me.fireEvent('rowfocus', record, row, rowIdx);
        }
    },
    getMaxContentWidth: function(header) {
        var me = this,
            cells = me.el.query(header.getCellInnerSelector()),
            originalWidth = header.getWidth(),
            i = 0,
            ln = cells.length,
            maxWidth;

        // Set column width back to the minimum header width
        me.body.select(me.getColumnSizerSelector(header)).setWidth(40);

        // Allow for padding round text of header
        maxWidth = header.textEl.dom.offsetWidth + header.titleEl.getPadding('lr');
        for (; i < ln; i++) {
            // Add 2 to avoid text-overflow:ellipsis truncation
            maxWidth = Math.max(maxWidth, cells[i].scrollWidth + 2 + (Ext.isIE ? 6 : 0));
        }
        // Set column width back to original width
        me.body.select(me.getColumnSizerSelector(header)).setWidth(originalWidth);

        return maxWidth;
    }
});

/********************************************************************************************************
 * numberfield override. beforeedit 리스너에서 false 리턴해도 스피너는 여전히 작동 가능한 문제 해결 위함.
 ********************************************************************************************************/
Ext.override(Ext.form.field.Number, {
    beforeSpinUpDown : function(){
        var me = this;
        return me.fireEvent('focus', me);
    },
    onSpinUp: function() {
        var me = this;
        if (!me.readOnly && me.beforeSpinUpDown()) {
            me.setSpinValue(Ext.Number.constrain(me.getValue() + me.step, me.minValue, me.maxValue));
        }
    },
    onSpinDown: function() {
        var me = this;
        if (!me.readOnly && me.beforeSpinUpDown()) {
            me.setSpinValue(Ext.Number.constrain(me.getValue() - me.step, me.minValue, me.maxValue));
        }
    }
});

/********************************************************************************************************
 * Ajax 요청시 외부에서 파라미터 추가 가능하도록 하기 위함.
 ********************************************************************************************************/
Ext.override(Ext.data.Connection, {
	setupParams: function(options, params) {
        var form = this.getForm(options),
            serializedForm;
        if (form && !this.isFormUpload(options)) {
            serializedForm = Ext.Element.serializeForm(form);
            params = params ? (params + '&' + serializedForm) : serializedForm;
        }

		//CJB : 임의 파라미터 추가시
		var addParams = Ext.Object.toQueryString(Util.addAjaxParams());
		params = params + ((addParams) ? ((params) ? '&' : '') + addParams : '');

        return params;
    }
});

/********************************************************************************************************
 * 조회조건 폼 생성
 ********************************************************************************************************/
/**
 * 조회조건 폼
 */
SEARCH_CONDITION_FORM = null;

/**
 * 조회조건 데이터셋
 */
DS_SEARCHCONDITION = {};

/**
 * 조회조건 폼 생성
 */
function __createSearchConditionForm__(DS_SEARCH_CONDITION, MENU_PATH, customConfig)
{
    if(DS_SEARCH_CONDITION.length < 1) return;
    var searchConditionFieldContainers = [];
    var searchConditionFieldContainersOrdered = [];
    var defaultFieldContainerWidth = 259;
    var defaultColumnsCnt = parseInt(parent.document.getElementById('main-mainContainer-body').scrollWidth/defaultFieldContainerWidth);
    var defaultRowsCnt = 0; //현재 행의 갯수.
    var defaultFieldContainerColspan = 1;
    var labelWidth = 110;
    var oprationWidth = 80;

  //기본 operation 스토어
    var defaultOperationStore = Ext.create('Ext.data.Store',{
        fields : ['CODE', 'NAME'],
        data : [
            {CODE:'=',    NAME:'='},
            {CODE:'LIKE', NAME:'LIKE'},
            {CODE:'<',    NAME:'<'},
            {CODE:'<=',   NAME:'<='},
            {CODE:'>',    NAME:'>'},
            {CODE:'>=',   NAME:'>='},
            {CODE:'<>',   NAME:'<>'},
            {CODE:'IN',   NAME:'IN'}
        ]
    });
    //기본 operation 콤보
    var defaultOperation = {
        xtype : 'combobox',
        name : 'OPERATION',
        hidden : true,
        store : defaultOperationStore,
        width : oprationWidth,
        valueField: 'CODE',
        displayField: 'NAME',
        editable : false,
        allowBlank : false
    };

    //조건 갯수
    var conditionCnt = 0;
    //필드 생성 & 필드 컨테이너에 추가
    Ext.Array.forEach(DS_SEARCH_CONDITION, function(item,index,allItems)
    {
        //줄바꿈 설정 있을 경우
        var indexOfCondition = conditionCnt%defaultColumnsCnt;
        var fieldContainerColspan = defaultFieldContainerColspan;
        conditionCnt++;
        if(item.NEXTLINE == 'Y')
        {
            fieldContainerColspan = defaultColumnsCnt - indexOfCondition;
            conditionCnt = 0;
        }

        var fieldContainerWidth = defaultFieldContainerWidth;

        var searchType = item.TYPE;
        var dataType = item.DATATYPE;
        //숨김여부 진행중
        var hideable = item.VIEWYN == 'Y' ? true : false;

        var field = [];
        var operation = {};
        Ext.apply(operation, defaultOperation);
        operation.value = item.OPERATOR;
        operation.readOnly = (item.OPERATORFIX == 'Y');

        //숫자 데이터 아닌 일반 FIELD 일 경우
        if(searchType == "FIELD" && dataType != 'NUMBER')
        {
            field = [{
                xtype: 'textfield',
                name: item.DBCOLUMN,
                value : item.DEFAULTVALUE,
                flex : 1,
                validator : function(value){
                    var ret = true;
                    if(item.REQUIREMENT=='Y' && Util.isNull(value)) ret = Lang.get('MSG_REQUIRED_FIELD');
                    return ret;
                }
            }];
        }
        //숫자 데이터인 일반 FIELD 일 경우
        if(searchType == "FIELD" && dataType == 'NUMBER')
        {
            field = [{
                xtype: 'numberfield',
                name: item.DBCOLUMN,
                value : item.DEFAULTVALUE,
                flex : 1,
                validator : function(value){
                    var ret = true;
                    if(item.REQUIREMENT=='Y' && Util.isNull(value)) ret = Lang.get('MSG_REQUIRED_FIELD');
                    return ret;
                }
            }];
        }
        //팝업 조회 입력일 경우
        else if(searchType == "POP")
        {
            field = [{
                xtype : 'searchConditionPopSearchField',
                name: item.DBCOLUMN,
                param : {
                    MODULE : Util.nvl(item.MODULE),
                    DBCOLUMN : item.DBCOLUMN,
                    SQLPROP : item.SQLPROP,
                    COLUMNDESCR_LANG : item.COLUMNDESCR_LANG,
                    COLUMNDESCR : item.COLUMNDESCR,
                    KEYPARAM : item.KEYPARAM,
                    PARAM1 : item.PARAM1,
                    PARAM2 : item.PARAM2,
                    PARAM3 : item.PARAM3,
                    PARAM4 : item.PARAM4,
                    PARAM5 : item.PARAM5,
                    PARAM6 : item.PARAM6,
                    PARAM7 : item.PARAM7,
                    PARAM8 : item.PARAM8,
                    PARAM9 : item.PARAM9,
                    PARAM10 : item.PARAM10,
                    PAGESIZE : item.PAGESIZE
                },
                customPopFunction : item.CUSTOMPOPFUNCTION, //문자열
                value : item.DEFAULTVALUE,
                flex : 1,
                validator : function(value){
                    var ret = true;
                    if(item.REQUIREMENT=='Y' && Util.isNull(value)) ret = Lang.get('MSG_REQUIRED_FIELD');
                    return ret;
                }
            }];
        }
        //콤보일 경우
        else if(searchType == "COMBO")
        {
            field = [{
                xtype: 'combobox',
                name: item.DBCOLUMN,
                store : Util.createComboStore({
                    MODULE : Util.nvl(item.MODULE),
                    SQLPROP : item.SQLPROP,
                    KEYPARAM : item.KEYPARAM,
                    PARAM1 : item.PARAM1,
                    PARAM2 : item.PARAM2,
                    PARAM3 : item.PARAM3,
                    PARAM4 : item.PARAM4,
                    PARAM5 : item.PARAM5,
                    PARAM6 : item.PARAM6,
                    PARAM7 : item.PARAM7,
                    PARAM8 : item.PARAM8,
                    PARAM9 : item.PARAM9,
                    PARAM10 : item.PARAM10
                }),
                valueField: 'CODE',
                displayField: 'NAME',
                editable : false,
                value : item.DEFAULTVALUE,
                flex : 1,
                validator : function(value){
                    var ret = true;
                    if(item.REQUIREMENT=='Y' && Util.isNull(value)) ret = Lang.get('MSG_REQUIRED_FIELD');
                    return ret;
                },
                listeners: {
                    specialkey: function(field, e){
                        if (e.getKey() == e.DELETE) {
                            field.setValue('');
                        }
                    }
                }
            }];
        }
        //년월 선택일 경우
        else if(searchType == "YM")
        {
            var ym = Ext.Date.dateFormat(Ext.Date.add(new Date(), Ext.Date.MONTH, parseInt(item.DEFAULTVALUE)), 'Ym');
            var nowYear = new Number(ym.substr(0,4));
            var nowMonth = ym.substr(4,2);
            field = [
                {
                    xtype : 'numberfield',
                    name : item.DBCOLUMN + '_YEAR',
                    flex : 2,
                    value : nowYear,
                    validator : function(value){
                        var ret = true;
                        if(Util.isNull(value) && item.REQUIREMENT=='Y') ret = Lang.get('MSG_REQUIRED_FIELD');
                        else if(value < 1000)  ret = Lang.getRep('MSG_MIN_VALUE', [1000]);
                        return ret;
                    }
                },
                {
                    xtype : 'combobox',
                    name : item.DBCOLUMN + '_MONTH',
                    store : Ext.create('Ext.data.Store',{
                        fields : ['CODE', 'NAME'],
                        data : [
                            {CODE:'01', NAME:'01'},
                            {CODE:'02', NAME:'02'},
                            {CODE:'03', NAME:'03'},
                            {CODE:'04', NAME:'04'},
                            {CODE:'05', NAME:'05'},
                            {CODE:'06', NAME:'06'},
                            {CODE:'07', NAME:'07'},
                            {CODE:'08', NAME:'08'},
                            {CODE:'09', NAME:'09'},
                            {CODE:'10', NAME:'10'},
                            {CODE:'11', NAME:'11'},
                            {CODE:'12', NAME:'12'}
                        ]
                    }),
                    flex : 1,
                    valueField: 'CODE',
                    displayField: 'NAME',
                    editable : false,
                    allowBlank : false,
                    value : nowMonth
                }
            ];
        }
        //년월일 선택인 경우
        else if(searchType == "YMD")
        {
            var ymd = Ext.Date.dateFormat(Ext.Date.add(new Date(), Ext.Date.DAY, parseInt(item.DEFAULTVALUE)), ClientData.getFormat('DF_YMD'));
            field = [
                {
                    xtype : 'datefield',
                    name : item.DBCOLUMN,
                    flex : 1,
                    //width : 180,
                    format : ClientData.getFormat('DF_YMD'),
                    value : ymd,
                    validator: function(value) {
                        var retVal = true;
                        if(Util.isNull(value) && item.REQUIREMENT=='Y') retVal = Lang.get('MSG_REQUIRED_FIELD');
                        return retVal;
                    }
                }
            ];
        }
        //년월일시분 선택인 경우
        else if(searchType == "YMDHM")
        {
            var incVal = Util.nvl(Util.nvl(item.DEFAULTVALUE,'0').split(',')[0], 0);
            var hm = Util.nvl(Util.nvl(item.DEFAULTVALUE,'0').split(',')[1], '0000');
            var ymd = Ext.Date.dateFormat(Ext.Date.add(new Date(), Ext.Date.DAY, parseInt(incVal)), ClientData.getFormat('DF_YMD'));
            var defaultH = hm.substr(0,2);
            var defaultM = hm.substr(2,2);
            field = [
                {
                    xtype : 'datefield',
                    name : item.DBCOLUMN,
                    flex:1,
                    format : ClientData.getFormat('DF_YMD'),
                    value : ymd,
                    validator: function(value) {
                        var retVal = true;
                        if(Util.isNull(value) && item.REQUIREMENT=='Y') retVal = Lang.get('MSG_REQUIRED_FIELD');
                        return retVal;
                    }
                },
                {
                    xtype : 'combobox',
                    name : item.DBCOLUMN + '_HH',
                    store : Util.createDigitCombo(0, 23, 2),
                    flex : 1,
                    valueField: 'CODE',
                    displayField: 'NAME',
                    value : defaultH,
                    editable : false,
                    allowBlank : false
                },
                {
                    xtype : 'combobox',
                    name : item.DBCOLUMN + '_MI',
                    store : Util.createDigitCombo(0, 59, 2),
                    flex : 1,
                    valueField: 'CODE',
                    displayField: 'NAME',
                    value : defaultM,
                    editable : false,
                    allowBlank : false
                }
            ];
        }

        //필드 컨테이너
        var fieldContainerItems = [];

        //필드 컨테이너 아이템에 조회조건 operation 변경 버튼 추가. 변경 후 setIconCls 호출
        fieldContainerItems.push({
            xtype : 'button',
            fieldOperator : item.OPERATOR,         //연산조건
            fieldOperatorFix : item.OPERATORFIX == 'Y',   //연산조건 고정여부
            fieldRequired : item.REQUIREMENT,      //필수입력 여부
            fieldUseYn : true,                     //사용여부
            popOpened : false,
            listeners : {
                afterrender : function(btn, opts){
                    btn.changeOperationVal(btn.fieldOperator);
                }
            },
            handler : function() {
                var me = this;
                if(me.popOpened && me.popWin) {
                    me.popWin.close();
                    return;
                }
                me.popWin = Ext.create('widget.window', {
                    title : item.COLUMNDESCR_LANG + ' ' + Lang.get('DETAIL_COND'),
                    modal : true,
                    constrainHeader: true,
                    autoShow : true,
                    x : me.getX(),
                    y : me.getY() + me.getHeight(),
                    width : 310,
                    height : 230,
                    border : 0,
                    layout : 'fit',
                    listeners : {
                        show : function(){
                            me.popOpened = true;
                            /*
                            //팝업창에서 조회조건 사용할 경우 팝업창을 닫아도 조회조건 상세설정 창이 그대로 남아있어서 아래와 같이 하려다가...걍 modal:true 로 속성 줌.
                            var pWin = me.up('window');
                            if(!Util.isNull(pWin))
                            {
                                pWin.on({
                                    close : function(){
                                        me.popWin.close();
                                    }
                                });
                            }
                            */
                        },
                        close : function(){
                            me.popOpened = false;
                        }
                    },
                    items : [
                        {
                            xtype : 'form',
                            title : '',
                            bodyCls : 'form-body',
                            bodyStyle: 'padding-left:10px; padding-top:5px; padding-right:10px;',
                            items : [
                                {
                                    xtype : 'fieldset',
                                    title : Lang.get('USE_YN'),
                                    items : [
                                        {
                                            xtype : 'checkboxfield',
                                            boxLabel : item.REQUIREMENT=='Y' ? Lang.get('USE_REQUIRED')+'*' : Lang.get('USE'),
                                            checked : me.fieldUseYn,
                                            readOnly : item.REQUIREMENT=='Y',
                                            disabled : item.REQUIREMENT=='Y',
                                            style : {
                                                //14.1.2 색상변경 red->#0000FF
                                                color : item.REQUIREMENT=='Y' ? '000000' : '#000000'
                                            },
                                            listeners : {
                                                change : function(radio, newVal) {
                                                    me.fieldUseYn = newVal;
                                                    me.changeOperationVal(newVal ? me.fieldOperator : 'NOT_USED', false);
                                                    Ext.defer(function(){radio.up('[xtype=window]').close();}, 1);
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'fieldset',
                                    title : Lang.get('DATA_MATCHING') + (me.fieldOperatorFix ? ' : ' + Lang.get('FIXED') : ''),
                                    layout : {
                                        type : 'table',
                                        columns : 2
                                    },
                                    items : [
                                        //완전일치
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix,
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-equal',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('=', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('EXACTLY_SAME'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == '=' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == '=' ? '#FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        },
                                        //포함
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix || Ext.Array.contains(['COMBO','YM','YMD','YMDHM'],searchType) || (searchType == "FIELD" && dataType == 'NUMBER'),
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-in',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('IN', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('INCLUDED'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == 'IN' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == 'IN' ? '#FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        },
                                        //일부일치
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix || Ext.Array.contains(['COMBO','YM','YMD','YMDHM'],searchType) || (searchType == "FIELD" && dataType == 'NUMBER'),
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-like',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('LIKE', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('PARTLY_SAME'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == 'LIKE' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == 'LIKE' ? 'FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        },
                                        //불일치
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix || Ext.Array.contains(['COMBO','YM','YMD','YMDHM'],searchType),
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-notequal',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('<>', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('DIFFERENT'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == '<>' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == '<>' ? '#FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        },
                                        //이상
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix,
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-moreequal',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('>=', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('SAME_OR_MORE'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == '>=' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == '>=' ? '#FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        },
                                        //초과
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix,
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-more',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('>', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('MORE'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == '>' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == '>' ? '#FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        },
                                        //이하
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix,
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-lessequal',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('<=', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('SAME_OR_LESS'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == '<=' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == '<=' ? '#FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        },
                                        //미만
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            width : 140,
                                            disabled : me.fieldOperatorFix,
                                            items : [
                                                {
                                                    xtype : 'button',
                                                    iconCls : 'icon-search-condition-less',
                                                    handler : function() {
                                                        me.fieldUseYn = true;
                                                        me.changeOperationVal('<', true);
                                                        this.up('[xtype=window]').close();
                                                    }
                                                },
                                                {
                                                    xtype : 'checkboxfield',
                                                    boxLabel : Lang.get('LESS'),
                                                    style : {
                                                        fontWeight : me.fieldOperator == '<' ? 'bold' : 'normal',
                                                        color : me.fieldOperator == '<' ? '#FF0000' : '#000000'
                                                    },
                                                    fieldStyle : {
                                                        display : 'none'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
            },
            changeOperationVal : function(val, change){
                var me = this;
                if(change) me.fieldOperator = val;
                if(val == '=') {
                    me.setIconCls('icon-search-condition-equal');
                }else if(val == 'LIKE') {
                    me.setIconCls('icon-search-condition-like');
                }else if(val == '<') {
                    me.setIconCls('icon-search-condition-less');
                }else if(val == '<=') {
                    me.setIconCls('icon-search-condition-lessequal');
                }else if(val == '>') {
                    me.setIconCls('icon-search-condition-more');
                }else if(val == '>=') {
                    me.setIconCls('icon-search-condition-moreequal');
                }else if(val == '<>') {
                    me.setIconCls('icon-search-condition-notequal');
                }else if(val == 'IN') {
                    me.setIconCls('icon-search-condition-in');
                }else if(val == 'NOT_USED') {
                    me.setIconCls('icon-search-condition-notused');
                }
            }
        });

        //필드 컨테이너 아이템에 조회조건 라벨. 앞의 버튼 이미지와 세로 위치 정렬을 위해 체크박스 필드를 쓴 것이고, 라벨 용도로만 사용.
        fieldContainerItems.push(
            {
                xtype: 'checkboxfield',
                name: item.DBCOLUMN + '_USE_YN',
                boxLabel: item.REQUIREMENT=='Y' ? item.COLUMNDESCR_LANG + ' *' : item.COLUMNDESCR_LANG,//+'&nbsp:&nbsp;',
                checked : true,
                readOnly : item.REQUIREMENT=='Y',
                width : labelWidth,
                fieldStyle : {
                    display : 'none'
                },
                style : {
                    //14.1.2 색상변경 red->#0000FF
                    color : item.REQUIREMENT=='Y' ? '#000000' : '#000000'
                },
                getColumnDescr : function(){
                    return item.COLUMNDESCR;
                },
                COLUMN_DESCR : item.COLUMNDESCR
            }
        );

        //필드 컨테이너 아이템에 operation 추가
        //fieldContainerItems.push(operation);

        //필드 컨테이너 아이템에 조회조건 필드 추가
        for(var n=0; n<field.length; n++)
        {
            fieldContainerItems.push(field[n]);
        }

        //필드 컨테이너 생성
        var fieldContainer = {
            xtype : 'fieldcontainer',
            layout: 'hbox',
            items : fieldContainerItems,
            width : fieldContainerWidth,
            hidden : hideable, //숨김여부 진행중 2013-12-30 khj
            margin : '3 10 3 10',
            colspan : fieldContainerColspan,
            getDsRowData : function(){
                var fields = this.items.items;
                var fieldsValidCheck = true;
                var allFieldsValid = true;
                var dsData = null;
                var valueFieldIdx = 2;
                for(var f=0; f<fields.length; f++)
                {
                    var field = fields[f];
                    if(f==0 && !field.fieldUseYn) {fieldsValidCheck = false;}
                    if(fieldsValidCheck)
                    {
                        //if(field.getXType() != 'text') {
                        if(field.validate) {
                            allFieldsValid = field.validate();
                        }
                        if(allFieldsValid)
                        {
                            if(dsData == null) {dsData = {};}
                            dsData.ROW_STATUS = 'normal';
                            //DBCOLUMN & OPERATOR
                            if(f == 0)
                            {
                                dsData.val0 = item.DBCOLUMN;
                                dsData.val2 = field.fieldOperator;
                            }
                            //COLUMNDESCR
                            else if(f == 1)
                            {
                                dsData.val1 = field.getColumnDescr(); //동일한 컬럼에 대해 두가지 조건이 사용될 때 구분하기 위함. 날짜 FROM-TO 같은 거.
                            }
                            //value
                            else if(f == valueFieldIdx && searchType == "YM")
                            {
                                dsData.val0 = (dataType == 'DATE' ? "TO_CHAR("+item.DBCOLUMN+",'YYYYMM')" : item.DBCOLUMN);
                                dsData.val3 = field.value + fields[valueFieldIdx+1].value;
                                dsData.val4 = '';
                                if(Util.isNull(dsData.val3)) {dsData = null; }
                            }
                            else if(f == valueFieldIdx && searchType == "YMD")
                            {
                                dsData.val0 = (dataType == 'DATE' ? "TO_CHAR("+item.DBCOLUMN+",'YYYYMMDD')" : item.DBCOLUMN);
                                dsData.val3 = Ext.Date.dateFormat(field.getValue(),'Ymd');
                                dsData.val4 = '';
                                if(Util.isNull(dsData.val3)) {dsData = null; }
                            }
                            else if(f == valueFieldIdx && searchType == "YMDHM")
                            {
                                dsData.val0 = (dataType == 'DATE' ? "TO_CHAR("+item.DBCOLUMN+",'YYYYMMDDHH24MI')" : item.DBCOLUMN);
                                dsData.val3 = Ext.Date.dateFormat(field.getValue(),'Ymd') + fields[valueFieldIdx+1].value + fields[valueFieldIdx+2].value;
                                dsData.val4 = '';
                                if(Util.isNull(dsData.val3)) {dsData = null; }
                            }
                            else if(f == valueFieldIdx)
                            {
                                dsData.val3 = field.value;
                                dsData.val4 = '';
                                if(Util.isNull(dsData.val3)) {dsData = null; }
                            }
                        }
                    }
                }
                if(allFieldsValid)
                {
                    return dsData;
                }
                else
                {
                    return false;
                }
            }
        };
        searchConditionFieldContainers.push(fieldContainer);

    }); //forEach end. 필드 생성 & 필드 컨테이너에 추가 끝


    //2014.01.20 김수겸추가 MENU_PATH = null 이면, 조회조건 팝업임.
    //조회조건 팝업에서는, iconcls와 tool을 사용하지 않도록 해 타이틀바를 제거하도록 함.
    var TOOL = null;
    var ICONCLS = null;
    if(MENU_PATH != null){
        ICONCLS = 'icon-page-title';
        TOOL = [{
               xtype : 'tool',
               type : 'gear',
               tooltip : Lang.get('SEARCH_CONDITION') + Lang.get('MENU_CONFIGURATION'),
               handler : userSearchConditionPop
        }];
    }

    //폼 생성
    var resultFormConfig = {
         xtype : 'form',
         //title : MENU_PATH,
         //id : 'resultFormConfig',
         region : 'north',
         border:0,
         autoScroll : true,
         layout : {
             type : 'column'
             /*
             type : 'table',
             columns : defaultColumnsCnt,
             tableAttrs : {
                 style : {
                     width : '100%',
                     height : '100%',
                 }
             }*/
         },
         bodyCls : 'searchCondition-body',
         bodyStyle: 'padding-top:5px;padding-bottom:5px;',
         items : searchConditionFieldContainers, //searchConditionFieldContainersOrdered,
         setSearchConditionDataSet : function(){
             var isValid = true;
             var dataSet = [];
             var fieldContainers = this.items.items;
             for(var fc=0; fc<fieldContainers.length; fc++)
             {
                 var fieldContainer = fieldContainers[fc];
                //validate 하면서 데이터셋 가져온다.
                 dataSetRowData = fieldContainer.getDsRowData();
                 if(dataSetRowData === false) {isValid = false; break;}
                 if(dataSetRowData != null){
                     dataSet.push(dataSetRowData);
                 }
             }
             if(!isValid) {
                 return false;
             }else{
                 DS_SEARCHCONDITION = {DS_SEARCHCONDITION:dataSet};
                 return true;
             }
         },
         listeners : {
			afterrender : function(me){
				me.keyEventMap = new Ext.util.KeyMap({
					target: me.getEl(),
					binding: [
						{
							key : [70], //70 == f
							ctrl : true,
							defaultEventAction : 'stopEvent',
							fn : function(){
								//메인 화면일 경우
								if(me.up('container') == viewPort)
								{
									//탭 있으면 가장 첫번째 탭의 조회 버튼
									if(viewPort.down('tabpanel'))
									{
										viewPort.down('tabpanel').getActiveTab().down('button[text='+Lang.get('SEARCH')+']').handler();
									}
									//탭 없으면 가장 첫번째 조회 버튼
									else
									{
										viewPort.down('button[text='+Lang.get('SEARCH')+']').handler();
									}
								}
								//팝업일 경우
								else if(me.up('window'))
								{
									me.up('window').searchData();
								}
							}
						}
					]
				});
				//첫번째 필드 포커스 주기
				me.items.items[0].items.items[2].focus();
			}
		 },
         iconCls : ICONCLS,
         collapseFirst:false,
         tools: TOOL
    };

    //업무화면 조회조건
    if(Util.isNull(customConfig))
    {
        resultFormConfig.title = MENU_PATH;
        resultFormConfig.id = 'SEARCH_CONDITION';
        resultFormConfig.collapsible = true;
        SEARCH_CONDITION_FORM = Ext.create('Ext.form.Panel', resultFormConfig);
    }
    //팝업 등에서 조회조건 쓸 경우
    else
    {
        if(!Util.isNull(customConfig.id)) resultFormConfig.id = customConfig.id; //필수
        resultFormConfig.layout.columns = Util.nvl(customConfig.columnsCnt, 2);
        return Ext.create('Ext.form.Panel', resultFormConfig);
    }
}

//조회조건설정 팝업
function userSearchConditionPop(popupField)
{
    userSearchConditionStore = Ext.create('Ext.data.Store',{
        fields : ['CODE', 'NAME'],
        data : [
            {CODE:'=',    NAME: Lang.get('EXACTLY_SAME')+'(=)'},
            {CODE:'LIKE', NAME: Lang.get('PARTLY_SAME')+'(LIKE)'},
            {CODE:'<',    NAME: Lang.get('LESS')+'(<)'},
            {CODE:'<=',   NAME: Lang.get('SAME_OR_LESS')+'(<=)'},
            {CODE:'>',    NAME: Lang.get('MORE')+'(>)'},
            {CODE:'>=',   NAME: Lang.get('SAME_OR_MORE')+'(>=)'},
            {CODE:'<>',   NAME: Lang.get('DIFFERENT')+'(<>)'},
            {CODE:'IN',   NAME: Lang.get('INCLUDED')+'(())'}
        ]
    });

    //그리드 생성. 팝업창을 닫을 때 그 하위 콤포넌트들이 distroy 되기 때문에 창 열 때마다 새로 만든다.
    userSearchConditionPopGrid = Ext.create('VC.grid.CommonGrid', {
        idPrefix : 'userSearchConditionPopGrid',
        region : 'center',
        flex : 1,
        fixedCols : 3,
        defaultColWidth : 150,
        updateOnly : true,
        columnDefine : [
            {type : 'gridrownumber', width:40},
            {header : 'DBCOLUMN', colName: 'COLUMNDESCR_LANG', editable:false},
            {header : 'OPERATOR', colName: 'OPERATOR', type:'combobox', comboStore:userSearchConditionStore, width:100},
            {header : 'DP_ORDERS', colName: 'LINENUMBER', type: 'int',width:65},
            {header : 'POP_PAGE', colName: 'PAGESIZE', type:'int',width:75},
            {header : 'OPERATORFIX', type:'checkbox',width:85},
            {header : 'REQUIREMENT', type:'checkbox',width:65},
            {header : 'HIDE_YN', colName: 'VIEWYN', type:'checkbox',width:65},
            {header : 'USE_YN', colName: 'USEYN', type:'checkbox',width:65},
            {header : 'DEFAULTVALUE', hidden:true, hideable:false},
            {header : 'DBCOLUMN', hidden:true, hideable:false},
            {header : 'USERID', hidden:true, hideable:false},
            {header : 'MENUCODE', hidden:true, hideable:false},
            {header : 'MODULE', hidden:true, hideable:false},
            {header : 'COLUMNDESCR', hidden:true, hideable:false},
            {header : 'ORG_REQUIREMENT', hidden:true, hideable:false},
            {header : 'ORG_LINENUMBER', hidden:true, hideable:false},
            {header : 'TYPE', hidden:true, hideable:false},
            {header : 'NEXTLINE', hidden:true, hideable:false}
        ],
        buttonsConfig: [
            {text: 'APPLY', iconCls : Util.buttonClsConfig('APPLY',''), handler : function(){
                var option = {FILTER_FUNCTION: function(){ return true; }};
                userSearchConditionPopGrid.action(viewPort, '/searchConditionService/saveUserSearchCondition', {}, function(){
                    //this.up('[xtype=window]').close(); //동작후 팝업을 닫음
                    window.location.reload();
                },true,option);
              }
            },
            {text: 'CANCEL', iconCls : Util.buttonClsConfig('CANCEL',''), handler : function(){
                this.up('[xtype=window]').close(); //팝업을 닫음
              }
            }
        ],
        editorConfig : {
            //그리드가 수정 입력등의 동작시에 editListeners 보다 먼저 수행함 T/F 반환
            beforeeditListeners : [
                function(grid, record, field, value){
                    //화주를 선택해야 물품 선택 가능
                    var orgReq = record.get('ORG_REQUIREMENT');
                    var req = record.get('REQUIREMENT');
                    var type = record.get('TYPE');
                    var useYn = record.get('USEYN');
                    if(orgReq=='true' && value == false  && field == 'REQUIREMENT') {
                        Ext.defer(function(){
                            Ext.MessageBox.show({
                                msg : Lang.getRep('MSG_REQUIRED_FIELD_REP', [Lang.get('REQUIREMENT')]),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },100);
                        return false;
                    }
                    else if(req == true  && value == false && field == 'USEYN') {
                        Ext.defer(function(){
                            Ext.MessageBox.show({
                                msg : Lang.getRep('MSG_REQUIRED_FIELD_REP', [Lang.get('USE_YN')]),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },100);
                        return false;
                    }
                    //사용여부 체크해제중 필수여부 체크 시 사용여부 체크
                    else if(useYn==false && value == true && field == 'REQUIREMENT') {
                        grid.setSelectedRowData('USEYN',true);
                        return true;
                    }
                    else if(type != 'POP' && field == 'PAGESIZE'){
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            ]
        }
    });

    userSearchConditionPopGrid.search(null, '/searchConditionService/searchUserSearchCondition', {}, null, false);
    //팝업 창 띄우기
    //실질적인 POPUP을 실행함
    Ext.create('widget.window', {
        title: Lang.get('SEARCH_CONDITION') + ' ' +Lang.get('MENU_CONFIGURATION'),
        id : 'userSearchConditionPopWin',
        constrainHeader: true,
        closable: true,
        modal : true,
        border : 0,
        draggable: false,
        resizable: false,
        iconCls : 'icon-pref',
        //팝업창 컨트럴
        fullYn: true,
        y:0,
        x:window.document.body.offsetWidth,
        height: window.document.body.offsetHeight,
        width : window.document.body.offsetWidth,
        layout: {
            type: 'fit'
        },
        items: [
            {
                layout : 'border',
                items : [
                    userSearchConditionPopGrid
                ]
            }
        ],
        tools:[
            {
               xtype : 'tool',
               id: 'userSearchConditionPopWinTool',
               type:'restore',
               handler : function(){
                   Ext.getCmp('userSearchConditionPopWin').doResize();
               }
            }
        ],
        onViewPortResize : function(){
            var win = Ext.getCmp('userSearchConditionPopWin');
            win.fullYn = false;
            win.doResize();
        },
        doResize : function(){
            var win = this;
            if(!win.fullYn){
               win.setX(0);
               win.setWidth(window.document.body.offsetWidth);
               win.setHeight(window.document.body.offsetHeight);
               win.fullYn = true;
               Ext.getCmp('userSearchConditionPopWinTool').setType('restore');
            }else{
               win.setX(window.document.body.offsetWidth/2);
               win.setWidth(window.document.body.offsetWidth/2);
               win.setHeight(window.document.body.offsetHeight);
               win.fullYn = false;
               Ext.getCmp('userSearchConditionPopWinTool').setType('maximize');
            }
        },
        //창 닫을 때 그리드 팝업 필드의 포커스 아웃해주기 위해.
        listeners : {
            beforeclose : function(win){
                viewPort.removeListener('resize', win.onViewPortResize);
            },
            afterrender : function(win){
                viewPort.addListener('resize', win.onViewPortResize);
            },
            close : function(){
                if(!Util.isNull(popupField) && !Util.isNull(popupField.onPopClose)) popupField.onPopClose();
            }
        }
    }).show();
}

/**
 * 팝업 등에서 임의 조회조건 사용시. DB 조회 후 폼 생성.
 */
function getSearchConditionForm(searchConditionCode, customConfig, callbackFunction)
{
    Ext.Ajax.request({
        url : '/appService/getSerchConditionAndUserAuth',
        params : {
            MENUCODE : searchConditionCode
        },
        callback : function(options, success, response){
            var json = Ext.decode(response.responseText);
            if(json["ErrorMsg"] === "OK")
            {
                getSearchConditionFormWithDS(json["DS_SEARCH_CONDITION"], customConfig, callbackFunction);
            }
            else
            {
                Ext.MessageBox.show({
                    //title: 'Error Message',
                    msg: json["ErrorMsg"],
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        }
    });
}

/**
 * 팝업 등에서 임의 조회조건 사용시. 데이터셋으로 폼 생성.
 */
function getSearchConditionFormWithDS(seachConditionDS, customConfig, callbackFunction)
{
    var searchForm = __createSearchConditionForm__(seachConditionDS, null, customConfig);
    callbackFunction(searchForm);
}

/**
 * 권한 적용
 * @param DS_USER_MENU_AUTH
 */
function __applyAuth__(menuAuth)
{
    DS_USER_MENU_AUTH = menuAuth;
    if(DS_USER_MENU_AUTH.length < 1) return;
    userAuths = [];
    Ext.Array.forEach(DS_USER_MENU_AUTH, function(item,index,allItems){
        userAuths.push(item.ROLECODE);
    });
    cmpToApplyAuth = Ext.ComponentQuery.query('[authType]');
    Ext.Array.forEach(cmpToApplyAuth, function(item,index,allItems){
        if(Ext.Array.contains(userAuths, item.authType)){
            item.show();
        }else{
            item.hide();
        }
    });
}

/**
 * 조회조건 데이터셋 셋팅 후 true/false 리턴
 */
function setSearchConditionDataSet(formId)
{
    if(!Util.isNull(formId))
    {
        return Ext.getCmp(formId).setSearchConditionDataSet();
    }
    else if(SEARCH_CONDITION_FORM)
    {
        return SEARCH_CONDITION_FORM.setSearchConditionDataSet();
    }
    else
    {
        return true;
    }
}

/**
 * 조회조건 데이터셋 셋팅 후 필터링, true/false 리턴
 */
function filterSearchConditionDataSet(nameArr, mode, formId)
{
    if( ! setSearchConditionDataSet(formId) ) return false;
    var finalDataSet = [];
    for(var n=0; n<DS_SEARCHCONDITION.DS_SEARCHCONDITION.length; n++)
    {
        var removeYn = false;
        if(mode == "REMOVE" && Ext.Array.contains(nameArr, DS_SEARCHCONDITION.DS_SEARCHCONDITION[n].val1)) removeYn = true;
        if(mode == "REMAIN" && !Ext.Array.contains(nameArr, DS_SEARCHCONDITION.DS_SEARCHCONDITION[n].val1)) removeYn = true;
        if(!removeYn)
        {
            finalDataSet.push(DS_SEARCHCONDITION.DS_SEARCHCONDITION[n]);
        }
    }
    DS_SEARCHCONDITION.DS_SEARCHCONDITION = finalDataSet;
    return true;
}
function filterRemainSearchConditionDataSet(nameArr, formId)
{
    return filterSearchConditionDataSet(nameArr, "REMAIN", formId);
}
function filterRemoveSearchConditionDataSet(nameArr, formId)
{
    return filterSearchConditionDataSet(nameArr, "REMOVE", formId);
}

/**
 * 조회조건의 특정 필드 컨테이너의 필드들 가져오기.
 */
function getSearchConditionFields(descrName, formId)
{
    var fc = Util.nvl(Ext.getCmp(formId), SEARCH_CONDITION_FORM).items.items;
    for(var n=0; n<fc.length; n++)
    {
        var cmp = fc[n].down('[COLUMN_DESCR='+descrName+']');
        if(cmp != null)
        {
            var fields = fc[n].items.items;
            return fields;
        }
    }
    return null;
}

/**
 * 조회조건의 특정 필드 값 가져오기.
 */
function getSearchConditionValue(descrName, formId)
{
	var value = '';
	if(null != getSearchConditionFields(descrName, formId))
	{
		value = getSearchConditionFields(descrName, formId)[2].value;
	}
	return value;
}

/**
 * 조회조건의 특정 필드 값 셋팅.
 */
function setSearchConditionValue(descrName, value, formId)
{
	if(null != getSearchConditionFields(descrName, formId))
	{
		getSearchConditionFields(descrName, formId)[2].setValue(value);
	}
}

/**
 * 조회조건의 특정 필드 값 가져오기.
 * 사용여부가 X 일 경우 가져 오지 않음
 */
function getSearchConditionValueByUseYn(descrName, formId)
{
	var useYn = false;
	var value = '';
	if(null != getSearchConditionFields(descrName, formId))
	{
		useYn = getSearchConditionFields(descrName, formId)[0].fieldUseYn;
		value = getSearchConditionFields(descrName, formId)[2].value;
	}

	if(!useYn)
	{
		value = '';
	}
	return value;
}


/********************************************************************************************************
 * Util Class
 ********************************************************************************************************/
Ext.define('Util',{
    statics : {
        /**
         * 값이 빈 문자열이거나 널인지 여부
         */
        isNull : function(val){
            var ret = false;
            if(val === '' || val === null || val === undefined)
            {
                ret = true;
            }
            return ret;
        },
        /**
         * 값이 빈 문자열이거나 널일 경우 대체 문자 반환
         */
        nvl : function(val, defaultVal)
        {
            if(Util.isNull(val))
            {
                return Util.isNull(defaultVal)?'':defaultVal;
            }
            else
            {
                return val;
            }
        },
        /**
         * 한글체크
         */
        codeCheck : function(value){
            var checkText = /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gm;
            //var vals = value.toUpperCase(); //모든 코드는 대문자화 (소문자 -> 대문자 변환)
            if(checkText.test(value)){
                return Lang.get('MSG_ENG_ONLY_REP');
            }else{
                return true;
            }
        },
        /**
         * 한글 및 데이터길이 체크
         */
        codeKrLengthCheck : function(value,length){
		    var checkText = /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gm;
		     if(checkText.test(value)){
		    	   return Lang.get('MSG_NO_HANGUL');
		     }else{
		    	 if(Util.getByte(value) > parseInt(Util.nvl(length,0))){
					return Lang.getRep('MSG_MAX_LENGTH', [parseInt(Util.nvl(length,0)), Util.getByte(value)]);
			  	 }else{
			        return true;
			    }
		    }
        },
        /**
         * 데이터길이 체크
         */
        codeLengthCheck : function(value,length){

    		if(Util.getByte(value) > parseInt(Util.nvl(length,0)))
    		{
    			return Lang.getRep('MSG_MAX_LENGTH', [parseInt(Util.nvl(length,0)), Util.getByte(value)]);
    		}else{
    			return true;
    		}
        },
        /**
         * 한글 및 데이터길이 체크
         */
        getGridValue : function(comp,value)
        {
        	var grid = comp.up('grid');
        	var rtnVal;
        	if(!Util.isNull(value))
        	{
        		rtnVal = grid[value];
        	}
        	else
        	{
        		rtnVal = grid;
        	}
        	return rtnVal;
        },
        /**
	     * Ext.Date.parse 가 첫번째 파라미터로 date 객체를 받으면 undefined 를 반환하는데, 그럴 경우 그대로 데이터 객체를 반환하도록 함.
	     */
	    toDate : function(value, format, strict)
	    {
	        if(Ext.isDate(value))
	        {
	            return value;
	        }
	        else
	        {
	            return Ext.Date.parse(value, format, strict);
	        }
	    },
        /**
         * 날짜 계산
         * ym : 계산할 년월
         * inc : 월 증가/감소량
         */
        addMonth : function(ym, inc) {
            var ymd = Util.nvl(ymd, Ext.Date.dateFormat(new Date(),'Ymd')).substr(0, 6) + '01';
            var ymdToDate = new Date(Number(ymd.substr(0, 4)), Number(ymd.substr(4, 2))-1, Number(ymd.substr(6, 2)));
            ymdToDate.setMonth(ymdToDate.getMonth() + parseInt(Util.nvl(inc,0)));
            var ret = Util.lpad(String(ymdToDate.getFullYear()), 4, '0') + Util.lpad(String(ymdToDate.getMonth() + 1), 2, '0') + Util.lpad(ymdToDate.getDate(), 2, '0');
            return ret;
        },
        /**
         * 날짜 계산
         * ymd : 계산할 날짜
         * inc : 일 증가/감소량
         * hm : 시/분
         */
        addDate : function(ymd, inc, hm) {
            var ymd = Util.nvl(ymd, Ext.Date.dateFormat(new Date(),'Ymd'));
            var ymdToDate = new Date(Number(ymd.substr(0, 4)), Number(ymd.substr(4, 2))-1, Number(ymd.substr(6, 2)));
            ymdToDate.setDate(ymdToDate.getDate() + parseInt(Util.nvl(inc,0)));
            var ret = Util.lpad(String(ymdToDate.getFullYear()), 4, '0') + Util.lpad(String(ymdToDate.getMonth() + 1), 2, '0') + Util.lpad(ymdToDate.getDate(), 2, '0');
            if(!Util.isNull(hm)) {
                ret = ret + hm;
            }
            return ret;
        },
        /**
         * 개월 수 차이 계산. 파라미터로 문자열을 받는다.
         */
        monthsBetween : function(fromYm, toYm){
            var pFromYm = fromYm.replace(/[^0-9]/g,'').substr(0,6);
            var pToYm = toYm.replace(/[^0-9]/g,'').substr(0,6);
            var fromYm = pFromYm;
            var toYm = pToYm;
            if(pFromYm > pToYm)
            {
                fromYm = pToYm;
                toYm = pFromYm;
            }
            var months = (new Number(toYm.substr(0,4)) - new Number(fromYm.substr(0,4))) * 12;
            months = months - new Number(fromYm.substr(4,2));
            months = months + new Number(toYm.substr(4,2));
            return months;
        },
        /**
         * 날짜 차이 계산. 파라미터로 문자열을 받는다.
         */
        daysBetween : function(staYmd, endYmd){
            var fromYmd = staYmd.replace(/[^0-9]/g,'').substr(0,8);
            var toYmd = endYmd.replace(/[^0-9]/g,'').substr(0,8);
            var oneDay = 1000 * 60 * 60 * 24;
            var fromDate = new Date(new Number(fromYmd.substr(0,4)), new Number(fromYmd.substr(4,2))-1, new Number(fromYmd.substr(6,2)));
            var toDate = new Date(new Number(toYmd.substr(0,4)), new Number(toYmd.substr(4,2))-1, new Number(toYmd.substr(6,2)));
            return Math.round(Math.abs(fromDate.getTime() - toDate.getTime()) / oneDay);
        },
        /**
         * 요일 반환
         * ymdDate : Date 객체
         */
        getDow : function(ymdDate)
        {
            var dow = ['DOW_MON','DOW_TUE','DOW_WED','DOW_THU','DOW_FRI','DOW_SAT','DOW_SUN'];
            var idx = Ext.Date.dateFormat(ymdDate, 'N');
            return dow[idx-1];
        },
        /**
         * 콤보 스토어 생성
         */
        createComboStore : function(config, listeners){
            return Ext.create('Ext.data.Store',{
                fields : Util.nvl(config.FIELDS, ['CODE', 'NAME']),
                autoLoad: true,
                proxy : {
                   type : 'ajaxStore',
                   url : Util.nvl(config.URL, '/appService/getCodeAndName'),
                   extraParams : {
                       CURRENT_MENUCODE : Util.nvl(config.CURRENT_MENUCODE, CURRENT_MENUCODE),
                       MODULE : Util.nvl(config.MODULE),
                       SQLPROP : config.SQLPROP,
                       KEYPARAM : config.KEYPARAM,
                       PARAM1 : config.PARAM1,
                       PARAM2 : config.PARAM2,
                       PARAM3 : config.PARAM3,
                       PARAM4 : config.PARAM4,
                       PARAM5 : config.PARAM5,
                       PARAM6 : config.PARAM6,
                       PARAM7 : config.PARAM7,
                       PARAM8 : config.PARAM8,
                       PARAM9 : config.PARAM9,
                       PARAM10 : config.PARAM10
                   },
                   reader : {
                       type : 'json',
                       root : 'DS_OUT'
                   }
                },
                listeners : listeners
            });
        },
        /**
         * lpad
         */
        lpad : function(val, length, str){
            var lpadStr = '';
            var valLen = val.toString().length;
            for(var n=0; n<length-valLen; n++) {
                lpadStr += str;
            }
            return lpadStr + val;
        },
        /**
         * 월, 시간, 분 등 두자리 수로 맞추기 위한 숫자 타입 콤보
         */
        createDigitCombo : function(sta, end, len, str) {
            var data = [];
            for(var n=sta; n<=end; n++) {
                var formatN = n;
                if(!Util.isNull(len)) {
                    formatN = Util.lpad(n, len, Util.nvl(str,'0'));
                }
                data.push({CODE:formatN, NAME:formatN});
            }
            return Ext.create('Ext.data.Store',{
                fields : ['CODE', 'NAME'],
                data : data
            });
        },
        /**
         * ubi report 파라미터 셋팅
         */
        setReportArg : function(reportSetting){
            reportSetting.key = Util.nvl(reportSetting.key, USER_SESSION_ID);
            var arg = '';
            /*
            //UDS 별 USER_SESSION_ID 셋팅
            var udsNames = Util.nvl(reportSetting.reportUdsNames,'').split(',');
            for(var n=0; n<udsNames.length; n++)
            {
                if(n!=0) arg += '#';
                arg += Ext.String.trim(udsNames[n]) + '#USER_SESSION_ID=' + USER_SESSION_ID;
            }
            */
            //다국어용 파라미터 셋팅
            var multiLangArgs = Util.nvl(reportSetting.reportMultiLangArg,'').split(',');
            for(var n=0; n<multiLangArgs.length; n++)
            {
                if(n!=0) arg += '#';
                arg += Ext.String.trim(multiLangArgs[n]) + '#' + Lang.get(Ext.String.trim(multiLangArgs[n])); //encodeURIComponent(Lang.get(multiLangArgs[n].trim()));
            }
            //기타 파라미터 셋팅
            arg += '#' + Util.nvl(reportSetting.reportOtherArg,'');
            //디버그용
            if(reportSetting.consoleViewArg === true)
            {
                console.log(arg);
            }
            //최종 arg 셋팅
            reportSetting.arg = arg;
            return reportSetting;
        },
        /**
         * 사용자 데이터 저장. Ubi 리포트가 세션을 새로 생성하기 때문에 만듬. 그래서 유저 아이디가 아니고 세션 아이디를 사용함. 엑셀다운에서도 사용.
         */
        saveUserTempData : function(params, callbackFunc){
            params = Util.nvl(params, {});
            params.USER_SESSION_ID = Util.nvl(params.USER_SESSION_ID, USER_SESSION_ID);
            params.CURRENT_MENUCODE = CURRENT_MENUCODE;
            var jsonData = Util.nvl(params.DS_JSONDATA, Util.nvl(DS_SEARCHCONDITION, {}));
            delete params.DS_JSONDATA;
            Ext.Ajax.request({
                url : '/utilService/saveUserTempData',
                jsonData : jsonData,
                params : params,
                callback : function(options, success, response){
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        if(callbackFunc) callbackFunc();
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        },
        /**
         * 사용자 데이터 제거
         */
        removeUserTempData : function(userSessionId){
            Ext.Ajax.request({
                url : '/utilService/removeUserTempData',
                params : {
                    USER_SESSION_ID : Util.nvl(userSessionId, USER_SESSION_ID)
                },
                callback : function(options, success, response){

                }
            });
        },
        /**
         * 엑셀 다운로드
         */
        excelDownLoad : function(){

            var mask = new Ext.LoadMask(viewPort, {msg:"Making File..."});
            mask.show();

            Ext.Ajax.request({
                url : '/utilService/commonExcelDownPrepare',
                callback : function(options, success, response){
                    mask.hide();
                    var json = Ext.decode(response.responseText);
                    if(json["ErrorMsg"] === "OK")
                    {
                        //window.location = '/utilService/commonExcelDown';
                        Ext.DomHelper.append(Ext.getBody(), {
                            tag: 'iframe',
                            frameBorder: 0,
                            width: 0,
                            height: 0,
                            css: 'display:none;visibility:hidden;height:0px;',
                            src: '/utilService/commonExcelDown'
                        });
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            msg: json["ErrorMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });

        },
        /*
        chart 이미지 다운로드용. svg 는 한글 지원 안해서 유니코드?로 변경
        */
        toHexString : function(text){
            var ret = '';
            var len = text.length;
            for(var n=0; n<len; n++){
                ret += '&#x' + text.charCodeAt(n).toString(16) + ';';
            }
            return ret;
        },
        /*
        ReplaceAll 구현
        */
        replaceAll : function(text,text1,text2){
             var ret = text.trim();
             ret = ret.replace(eval("/" + text1 + "/gi"), text2);
             return ret;
        },
        /**
         * 버튼 이미지 펑션
         */
        buttonClsConfig : function(textVal, clsVal){
            var ret = '';
            if(Util.isNull(clsVal)){
                if(textVal == 'SEARCH') ret = 'icon-search';
                if(textVal == 'SEARCHAPPEND') ret = 'icon-search';
                if(textVal == 'SAVE') ret = 'icon-save';
                if(textVal == 'ADD') ret = 'icon-add';
                if(textVal == 'INSERT') ret = 'icon-add';
                if(textVal == 'DELETE') ret = 'icon-del';
                if(textVal == 'DEL') ret = 'icon-del';
                if(textVal == 'CANCEL') ret = 'icon-cancel';
                if(textVal == 'ACTION') ret = 'icon-action';
                if(textVal == 'APPLY') ret = 'icon-apply';
                if(textVal == 'UPDATE') ret = 'icon-apply';
                if(textVal == 'RELOAD') ret = 'icon-reload';
                if(textVal == 'CONFIRM') ret = 'icon-confirm';
                if(textVal == 'NEW') ret = 'icon-new';
                if(textVal == 'EXPAND_ALL_TREE') ret = 'icon-add';
                if(textVal == 'COLLAPSE_ALL_TREE') ret = 'icon-del';
                if(textVal == 'REFRESH') ret = 'icon-refresh';
                if(textVal == 'EXCEL') ret = 'icon-excel';
                if(textVal == 'DOWN_EXCEL_SEARCH') ret = 'icon-excel-search';
                if(textVal == 'DOWN_EXCEL_CHECKED') ret = 'icon-excel-checked';
                if(textVal == 'DOWN_EXCEL_SEARCHED_GRID') ret = 'icon-excel-grid';
                if(textVal == 'REPORT') ret = 'icon-report';
                if(textVal == 'REPORT_SEARCH') ret = 'icon-printer-new';
                if(textVal == 'REPORT_CHECKED') ret = 'icon-printer-select';
                if(textVal == 'REPORT_SEARCHED_GRID') ret = 'icon-printer-all';
            }else{
                ret = clsVal;
            }
            return ret;
        },
		/*
		 * Ajax 요청시 추가 파라미터 셋팅
		 */
		addAjaxParams : function(){
			var addedParam = {};

			if(top && top.UserInfo && top.UserInfo.userLang)
			{
				addedParam['SES_LANG'] = top.UserInfo.userLang;
			}
			if(top && top.UserInfo && top.UserInfo.userGroupCode)
			{
				addedParam['SES_USERGROUP'] = top.UserInfo.userGroupCode;
			}
			if(top && top.UserInfo && top.UserInfo.userWcode)
			{
				addedParam['SES_WHSE'] = top.UserInfo.userWcode;
			}

			return addedParam;
		},

        /**
		 * byte수 얻기(한글:3byte)
		 * 2016.07.26 추가
		 *
				1. KO16KSC5601
				    - 한글 지원상태 : 한글 2350자
				    - 지원버전 : 7.x
				    - 한글바이트 : 2바이트
				2. KO16MSWIN949
				    - 한글 지원상태 : KO16KSC5601 + 확장 ( 총 11172자 )
				    - 지원버전 : 8.0.6 이상
				    - 한글바이트 : 2바이트
				3. UTF8
				    - 한글 지원상태 : 한글 11172자
				    - 지원버전 : 8.0 이후
				    - 한글바이트 : 3바이트
				4. AL32UTF8
				    - 한글 지원상태 : 한글 11172자
				    - 지원버전 : 9i Release 1 이상
				    - 한글바이트 : 3바이트

		 */
		getByte : function(value){
				var str_len = value.length;

				var rbyte = 0;
				var one_char = "";

				for(var i=0; i<str_len; i++){
					one_char = value.charAt(i);
					if(escape(one_char).length > 4){
					    rbyte += 3;                                         //한글3Byte
					}else{
					    rbyte++;                                            //영문 등 나머지 1Byte
					}

				}
				return rbyte;
		},
		/**
		 * String compare String
		 * Number compare Number
		 * */
		compare : function(value1, value2){

			var retrnVal = 0;

			if(isNaN(parseFloat(value1)) || isNaN(parseFloat(value2)))
			{
				returnVal = value1 > value2 ? -1 : value1 < value2 ? 1 : 0;
				//console.log('returnVal1 : '+returnVal);
			}
			else
			{
				returnVal = parseFloat(value1) > parseFloat(value2) ? -1 : parseFloat(value1) < parseFloat(value2) ? 1 : 0;
				//console.log('returnVal2 : '+returnVal);
			}
			return returnVal;
		}
    }
});

/********************************************************************************************************
 * Tree Grid
 ********************************************************************************************************/
Ext.define('VC.grid.CommonTreeGrid',{
    extend : 'Ext.tree.Panel',
    alias : 'widget.commonTreeGrid',
    rootVisible: false,
    columnLines: true,
    rowLines : true,
    cls : 'common-grid',
    initComponent: function() {

        var me = this;

        // 그리드 id
        me.id = me.idPrefix + 'Grid';

        if(me.title) me.title = Lang.get(me.title);

        //dataIndex 로 헤더명 가져오기 위함
        me.gridHeaderNames = [];
        //dataIndex 로 data 타입 컬럼 값 언포멧 위함
        me.dateColumns = [];
        //combo 타입 컬럼 렌더링 위함
        me.comboColumnStore = [];

        //모델 필드, 그리드 컬럼 속성
        var columnDefine = me.columnDefine;
        var gridColumns = [];
        var modelFields = [];

        //TotalCount 사용여부
        //2013-12-16 KHJ
        me.totalCountUse = Util.nvl(me.totalCountUse,true);
        //confirm 사용여부
        //2014-01-16 KHJ
        me.confirmUse = Util.nvl(me.confirmUse, false);

        //필수입력 컬럼
        me.requiredCols = [];
        //수정불가 컬럼
        me.updateDisableCols = [];

        for(var n=0; n<columnDefine.length; n++)
        {
            //모델 필드 속성
            var modelField = {};

            //그리드 컬럼 속성
            var gridColumn = {};

            gridColumn.cls = 'grid-header-normal';
            gridColumn.tdCls = 'grid-column-normal';


            //팝업에디트가 아닐경우, 수정가능한 필드에 대해 파란색, 아니면 검정색
            if(Util.nvl(me.editable,true) && n!=0 && Util.nvl(columnDefine[n].editable, true) || columnDefine[n].updatable){
                gridColumn.cls = 'grid-header-blue';
            }else{
                gridColumn.cls = 'grid-header-required';
            }

            //필수입력, 수정불가 컬럼 배열에 저장.
            if(Util.nvl(columnDefine[n].required, false))
            {
                me.requiredCols.push(Util.nvl(columnDefine[n].colName, columnDefine[n].header));
                gridColumn.cls = 'grid-header-blue';
            }
            if(! Util.nvl(columnDefine[n].updatable, true))
            {
                me.updateDisableCols.push(Util.nvl(columnDefine[n].colName, columnDefine[n].header));
                gridColumn.tdCls = 'grid-column-update-disabled';
            }
            if(! Util.nvl(columnDefine[n].editable, true))
            {
                gridColumn.tdCls = 'grid-column-edit-disabled';
            }

            //모델 name, 그리드 header & dataIndex & style
            if(columnDefine[n].header)
            {
                modelField.name = Util.nvl(columnDefine[n].colName, columnDefine[n].header);
                gridColumn.header = Lang.get(columnDefine[n].header);
                //14.1.8 필수인 항목은 label뒤에 * 붙임.
                if(Util.nvl(columnDefine[n].required, false) && !Util.nvl(me.popEditable, false)){
                    gridColumn.header = gridColumn.header + '*';
                }
                gridColumn.dataIndex = Util.nvl(columnDefine[n].colName, columnDefine[n].header);
                me.gridHeaderNames[gridColumn.dataIndex] = gridColumn.header;
                //me.columnDefines[Util.nvl(columnDefine[n].colName, columnDefine[n].header)] = columnDefine[n];
            }

            //기본 값
            if(columnDefine[n].defaultValue)
            {
                modelField.defaultValue = columnDefine[n].defaultValue;
            }

            if(columnDefine[n].type == 'treecolumn')
            {
                modelField.type = 'string';
                gridColumn.xtype = 'treecolumn';
                gridColumn.tdCls = gridColumn.tdCls.replace('grid-column', 'grid-treecolumn');
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {};
                }
            }
            //int 나 float 타입
            else if(columnDefine[n].type == 'int' || columnDefine[n].type == 'float')
            {
                modelField.type = columnDefine[n].type;
                gridColumn.align = 'right';
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {xtype : 'numberfield'};
                    if(!Util.isNull(columnDefine[n].minValue))
                    {
                    	gridColumn.editor.minValue = columnDefine[n].minValue;
                    }
                    if(!Util.isNull(columnDefine[n].maxValue))
                    {
                    	gridColumn.editor.maxValue = columnDefine[n].maxValue;
                    }
                }
            }
            //checkbox 타입
            else if(columnDefine[n].type == 'checkbox')
            {
                modelField.type = 'boolean';
                gridColumn.xtype = 'checkcolumn';
                gridColumn.stopSelection = false;
                if(!Util.nvl(me.editable, true) || !Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.listeners = {
                        beforecheckchange : function(checkcolumn, rowIdx, checked, opts){
                            return false;
                        }
                    };
                }
            }
            //combobox 타입
            else if(columnDefine[n].type == 'combobox')
            {
            	modelField.type = 'string';
                var comboStore = Util.isNull(columnDefine[n].comboStore) ? Util.createComboStore(columnDefine[n].comboParam) : columnDefine[n].comboStore;
                me.comboColumnStore[gridColumn.dataIndex] = comboStore;
                var valueField = Util.nvl(columnDefine[n].comboValueField, comboStore.model.getFields()[0].name);
                var displayField = Util.nvl(columnDefine[n].comboDisplayField, comboStore.model.getFields()[1].name);
                var valueEditable = Util.nvl(columnDefine[n].valueEditable, false);

                gridColumn.renderer = function(value, metadata, record, rowIndex, colIndex, store, view){
                    var comboRecord = me.comboColumnStore[view.headerCt.gridDataColumns[colIndex].dataIndex].findRecord(valueField, value, 0, false, true, true);
                    return Util.isNull(comboRecord) ? value : Util.nvl(comboRecord.get(displayField), value);
                };

                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {
                        xtype : 'combobox',
                        store : comboStore,
                        valueField : valueField,
                        displayField : displayField,
                        editable : valueEditable,
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.DELETE) {
                                    field.setValue('');
                                }
                            }
                        }
                    };
                }
            }
            //popup 타입
            else if(columnDefine[n].type == 'popup')
            {
                modelField.type = 'string';
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {
                        xtype : 'popSearchField',
                        customPopupFunction : columnDefine[n].popupParam.customPopupFunction,
                        param : {
                            DBCOLUMN : columnDefine[n].popupParam.DBCOLUMN,
                            COLUMNDESCR_LANG : Lang.get(columnDefine[n].popupParam.TITLE),
                            MODULE : Util.nvl(columnDefine[n].popupParam.MODULE),
                            SQLPROP : columnDefine[n].popupParam.SQLPROP,
                            KEYPARAM : columnDefine[n].popupParam.KEYPARAM,
                            PARAM1 : columnDefine[n].popupParam.PARAM1,
                            PARAM2 : columnDefine[n].popupParam.PARAM2,
                            PARAM3 : columnDefine[n].popupParam.PARAM3,
                            PARAM4 : columnDefine[n].popupParam.PARAM4,
                            PARAM5 : columnDefine[n].popupParam.PARAM5,
                            PARAM6 : columnDefine[n].popupParam.PARAM6,
                            PARAM7 : columnDefine[n].popupParam.PARAM7,
                            PARAM8 : columnDefine[n].popupParam.PARAM8,
                            PARAM9 : columnDefine[n].popupParam.PARAM9,
                            PARAM10 : columnDefine[n].popupParam.PARAM10,
                            TRGCOLNAME : Util.nvl(columnDefine[n].colName, columnDefine[n].header),
                            SELECTIONMODE : columnDefine[n].popupParam.SELECTIONMODE,
                            DYNAMICPARAM : columnDefine[n].popupParam.DYNAMICPARAM,
                            GRID : me,
                            setValue : function(value){
                                Ext.getCmp(me.id).currentEditingInfo.record.set(this.TRGCOLNAME, value);
                            }
                        }
                    };
                }
            }
            //날짜 타입
            else if(columnDefine[n].type == 'date')
            {
                modelField.type = 'date';
                modelField.dateFormat = columnDefine[n].dateFormat;
                me.dateColumns[gridColumn.dataIndex] = columnDefine[n].dateFormat;
                gridColumn.xtype = 'datecolumn';
                gridColumn.format = Lang.get(columnDefine[n].renderFormat);
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {
                        xtype : 'datefield',
                        format : Util.nvl(Lang.get(columnDefine[n].editFormat), gridColumn.format)
                    };
                }
            }
            //일련번호
            else if(columnDefine[n].type == 'gridrownumber')
            {
                gridColumn.xtype = 'gridrownumber';
                gridColumn.text = Util.nvl(columnDefine[n].header, 'No.');
            }
            /*
            //행 선택용 체크박스
            else if(columnDefine[n].type == 'checkboxselect')
            {
                modelField.name = '_SELECT_ROW_';
                modelField.type = 'boolean';

                gridColumn.xtype = 'checkcolumn';
                gridColumn.header = '선택';
                gridColumn.dataIndex = '_SELECT_ROW_';
                //gridColumn.menuDisabled = true;

                me.gridHeaderNames['_SELECT_ROW_'] = gridColumn.header;
            }
            */
            //기본 텍스트 필드
            else
            {
                modelField.type = 'string';
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {};
                }
            }

            //너비
            if(columnDefine[n].flex)
            {
                gridColumn.flex = columnDefine[n].flex;
            }
            else
            {
                gridColumn.width = Util.nvl(columnDefine[n].width, Util.nvl(me.defaultColWidth,100));
            }
            //데이터 정렬
            if(columnDefine[n].align)
            {
                gridColumn.align = columnDefine[n].align;
            }
            //숨김 가능 여부
            if(columnDefine[n].hideable)
            {
                gridColumn.hideable = columnDefine[n].hideable;
            }
            //숨김 여부
            if(columnDefine[n].hidden)
            {
                gridColumn.hidden = columnDefine[n].hidden;
            }
            //데이터 임의 변환
            if(columnDefine[n].convert)
            {
                modelField.convert = columnDefine[n].convert;
            }
            //리스너
            if(columnDefine[n].listeners)
            {
                gridColumn.listeners = columnDefine[n].listeners;
            }
            if(columnDefine[n].type != 'gridrownumber') {
                modelFields.push(modelField);
            }
            gridColumns.push(gridColumn);
        }

        //그리드 에디터 밸리데이션
        for(var n=0; n<gridColumns.length; n++)
        {
            if(gridColumns[n].editor && Util.nvl(columnDefine[n].required, false))
            {
                if(! me.validator)
                {
                    me.validator = {};
                }
                if(! me.validator[gridColumns[n].dataIndex])
                {
                    me.validator[gridColumns[n].dataIndex] = [];
                }
                me.validator[gridColumns[n].dataIndex].unshift(function(grid, record, headerName, value){
                    var retVal = true;
                    if(Util.isNull(value)) retVal = Lang.getRep('MSG_REQUIRED_FIELD_REP', [headerName]);
                    return retVal;
                });
            }
            if(gridColumns[n].editor && me.validator && me.validator[gridColumns[n].dataIndex])
            {
                gridColumns[n].editor.headerName = gridColumns[n].header;
                gridColumns[n].editor.validCheckFunctions = me.validator[gridColumns[n].dataIndex];
                gridColumns[n].editor.validator = function(value)
                {
                    var editInfo = Ext.getCmp(me.id).currentEditingInfo;
                    var retVal = true;
                    if(this.validCheckFunctions) {
                        for(var n=0; n<this.validCheckFunctions.length; n++)
                        {
                            retVal = this.validCheckFunctions[n](editInfo.grid, editInfo.record, this.headerName, value);
                            if(retVal !== true) break;
                        }
                    }
                    return retVal;
                };
            }
        }
        var finalGridColumns = [];

        //다중 헤더 설정시 컬럼 그룹
        if(me.columnGroup)
        {
            finalGridColumns = me.columnGroup;
            me.gridColumnNames = [];
            for(var n=0; n<gridColumns.length; n++)
            {
                if(gridColumns[n].xtype == 'gridrownumber')
                {
                    finalGridColumns.unshift(gridColumns[n]);
                }
                else
                {
                    me.gridColumnNames[gridColumns[n].dataIndex] = gridColumns[n];
                }
            }
            for(var n=0; n<finalGridColumns.length; n++)
            {
                if(!me.setColumnGroup(finalGridColumns[n]))
                {
                    finalGridColumns[n] = me.gridColumnNames[Util.nvl(finalGridColumns[n].colName, finalGridColumns[n].header)];
                }
            }
        }
        else
        {
            finalGridColumns = gridColumns;
        }

        //틀고정. treegrid 는 컬럼 속성에 locked 지원 안한다...
        for(var n=0; n<me.fixedCols; n++)
        {
            //finalGridColumns[n].locked = true;
        }

        if(Util.nvl(me.editable, true))
        {
            //모델 공통사항
            modelFields.push({name : 'ROW_DELETE',     type: 'boolean'});
            modelFields.push({name : 'ROW_STATUS_TXT', type: 'string', defaultValue:''}),
            modelFields.push({name : 'ROW_STATUS',     type: 'string', defaultValue:'R'});

            //그리드 공통사항
            finalGridColumns.push({
                xtype :'checkcolumn',
                header : Lang.get('DELETE'),
                style : 'text-align:center',
                dataIndex : 'ROW_DELETE',
                hideable : !Util.nvl(me.updateOnly,false),
                hidden : Util.nvl(me.updateOnly,false),
                width : 50,
                stopSelection: false
            });
            finalGridColumns.push({
                header : Lang.get('EDIT_STATUS'),
                style : 'text-align:center',
                align : 'center',
                dataIndex : 'ROW_STATUS_TXT',
                width : 70,
                align : 'center',
                tdCls : 'grid-column-edit-disabled'
            });
            finalGridColumns.push({
                header : Lang.get('EDIT_STATUS'),
                style : 'text-align:center',
                dataIndex : 'ROW_STATUS',
                hideable: false,
                hidden : true,
                width : 70
            });
        }

        //모델 정의
        Ext.define(me.idPrefix + 'Model', {
            extend : 'Ext.data.Model',
            fields : modelFields
        });

        //store
        me.store = Ext.create('VC.store.CommonTreeGridStore',{
            model : me.idPrefix + 'Model',
            storeId : me.idPrefix + 'Store',
            bindedGrid : me
        });
        me.store.addListener('update', me.store.onUpdate);

        //columns
        me.columns = finalGridColumns;

		//리스너
        me.listeners = Util.nvl(me.listeners, {});
        me.listeners.cellcontextmenu = function(view, td, cellIndex, model, tr, rowIndex, evt, eOpts) {
            evt.stopEvent();
            var elem = td;
            var lastElem = '';
            while(elem != null)
            {
                lastElem = elem;
                elem = elem.lastChild;
            }
            if(!Util.isNull(lastElem.nodeValue))
            {
                Ext.create('Ext.tip.ToolTip', {
                    layout : 'fit',
                    items : [
                        {
                            xtype : 'textfield',
                            value : lastElem.nodeValue,
                            readOnly : true,
                            listeners : {
                                afterrender : function(me){
                                    me.selectText();
                                }
                            }
                        }
                    ]
                }).showAt(evt.getXY());
            }
        };

        //플러그인
        if(Util.nvl(me.editable, true))
        {
            if(! me.editorConfig) me.editorConfig = {};
            if(! me.editorConfig.beforeeditListeners) me.editorConfig.beforeeditListeners = [];
            if(! me.editorConfig.editListeners) me.editorConfig.editListeners = [];

            me.editorConfig.beforeeditListeners.unshift(function(grid, record, field, value){
                //삭제 체크한 건 수정 안함.
                if(record.get("ROW_STATUS") == "D") {
                    return false;
                    //신규 행이 아닌 행의 수정불가 컬럼 체크.
                }else if(record.get("ROW_STATUS") != "I" && Ext.Array.contains(me.updateDisableCols, field)){
                    return false;
                }else{
                    return true;
                }
            });

            var cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: Util.nvl(me.editorConfig.clicksToEdit, 2),
                //그리드 컬럼에 locked 속성이 있으면 그리드의 listeners 가 안먹혀서 여기에다가 함.
                listeners: {
                    beforeedit: function(editor, editEvent, eOpts) {
                        var ret = true;
                        for(var n=0; n<me.editorConfig.beforeeditListeners.length; n++)
                        {
                            var func = me.editorConfig.beforeeditListeners[n];
                            ret = func(editEvent.grid, editEvent.record, editEvent.field, editEvent.value);
                            if(!ret) break;
                        }
                        if(ret)
                        {
                            //IE 에서 그리드 에디터 블러 안시키고 바로 저장 등의 버튼 클릭했을 때 버튼 포커스 이벤트가 먼저 먹히기 때문에 이를 처리하기 위해 글로벌 변수에 에디터 대입.
                            //이후 버튼 handler 에서 이 변수로 에디터를 가져와서 completeEdit 를 호출한다.
                            CURRENT_GRID_EDITOR = editor;
                            me.currentEditingInfo = editEvent;
                        }
                        return ret;
                    },
                    edit : function(editor, editEvent, eOpts){
                        for(var n=0; n<me.editorConfig.editListeners.length; n++)
                        {
                            var func = me.editorConfig.editListeners[n];
                            func(editEvent.grid, editEvent.record, editEvent.field, editEvent.value);
                        }
                    }
                }
            });
            if(! me.plugins) me.plugins = [];
            me.plugins.unshift(cellEditingPlugin);
        }

        //버튼
        var totalCountImages = [];
        //131224 김수겸 수정. 하단의 페이징처리를 상단으로 끌어올린 후,
        //TOTAL - 페이징 - 버튼 순으로 배치를 조절하기 위해 gridButtons를 totalCountImages과 gridButtons로 분리 후. 그 사이에 페이징처리 삽입.
        var gridButtons = [];
        if(me.totalCountUse){
            totalCountImages = [
                {
                    xtype : 'image',
                    src : '/view/img/buttons/bottompaneldots/balloonleft.png',
                    border : 0,
                    margin : '0 0 0 5',
                    width : 4,
                    height : 17
                },
                {
                    xtype : 'label',
                    id : me.id + 'DataCount',
                    style : 'text-align:center;color:#FFFFFF; background-image:url(/view/img/buttons/bottompaneldots/balloonbody.png); line-height:17px !important ;vertical-align:middle !important;)',
                    border : 0,
                    minWidth : 20,
                    margin : 0,
                    height : 17,
                    html : (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText) +' : ')+'0'
                },
                {
                    xtype : 'image',
                    src : '/view/img/buttons/bottompaneldots/balloonright2.png',
                    border : 0,
                    margin : '0 5 0 0',
                    width : 4,
                    height : 17
                }
            ];

            gridButtons = [
                           '->'
            ];
        }else{
            gridButtons = [
                           '->'
            ];
        }

        //기타 버튼
        var buttonCnt = 0;
        for(var n=0; n<Util.nvl(me.buttonsConfig,[]).length; n++)
        {
            var button = Ext.clone(me.buttonsConfig[n]);
            //2014.01.10 khj 버튼 자동이미지
            var buttonTextVal = button.text;
            var iconClsVal = button.iconCls;
            button.iconCls = Util.buttonClsConfig(buttonTextVal,iconClsVal);

            button.id = Util.nvl(button.id, me.id + 'Button' + n);
            if(button.text) button.text = Lang.get(button.text);
            if(button.authType) button.hidden = true;
            if(!Util.isNull(button.handler) && Util.nvl(button.onClickCompleteEdit, true)) {
                button.clicklistener = button.handler;
                button.handler = function(){
                    if(!Util.isNull(CURRENT_GRID_EDITOR) && !Util.isNull(CURRENT_GRID_EDITOR.completeEdit))
                    {
                        CURRENT_GRID_EDITOR.completeEdit();
                    }
                    this.clicklistener();
                };
            }
            if(button.menu) {
                for(var m=0; m<button.menu.length; m++)
                {
                    var menuButtonTextVal = button.menu[m].text;
                    var menuIconClsVal = button.menu[m].iconCls;
                    button.menu[m].iconCls = Util.buttonClsConfig(menuButtonTextVal,menuIconClsVal);
                    button.menu[m].text = Lang.get(button.menu[m].text);
                    /*
                    if(!Util.isNull(button.menu[m].handler)) {
                        button.menu[m].clicklistener = button.menu[m].handler;
                        button.menu[m].handler = function(){
                            if(!Util.isNull(CURRENT_GRID_EDITOR) && !Util.isNull(CURRENT_GRID_EDITOR.completeEdit))
                            {
                                CURRENT_GRID_EDITOR.completeEdit();
                            }
                            this.clicklistener();
                        };
                    }
                    */
                }
            }
            buttonCnt++;
            gridButtons.push(button);
        }
        if(buttonCnt > 0 || me.totalCountUse){

            var toolBar = {
                xtype : 'toolbar',
                dock : 'top',
                height : 28,
                hidden : Util.nvl(me.noDockedItems,false),
                id : me.idPrefix + 'Buttons',
                items : totalCountImages
            };
            if(me.pageSize)
            {
                var pagingItems = me.getPagingItems();
                for(var n=0; n<Util.nvl(pagingItems,[]).length; n++)
                {
                    toolBar.items.push(pagingItems[n]);
                }
            }
            for(var n=0; n<Util.nvl(gridButtons,[]).length; n++)
            {
                toolBar.items.push(gridButtons[n]);
            }

            me.dockedItems = toolBar;
        }
        buttonCnt = 0;
        this.callParent(arguments);
    },

    setColumnGroup : function(configs){
        var me = this;
        if(configs.xtype == 'gridrownumber')
        {
            return true;
        }
        if(configs.columns)
        {
            if(typeof configs.columns == 'string')
            {
                configs.columns = [me.gridColumnNames[configs.columns]];
            }
            else if(typeof configs.columns == 'number')
            {
                configs.columns = [me.gridColumnNames[Util.nvl(me.columnDefine[configs.columns].colName, me.columnDefine[configs.columns].header)]];
            }
            else if(Ext.isArray(configs.columns))
            {
                for(var cols=0; cols<configs.columns.length; cols++)
                {
                    if(typeof configs.columns[cols] == 'string')
                    {
                        configs.columns[cols] = me.gridColumnNames[configs.columns[cols]];
                    }
                    else if(typeof configs.columns[cols] == 'number')
                    {
                        configs.columns[cols] = me.gridColumnNames[Util.nvl(me.columnDefine[configs.columns[cols]].colName, me.columnDefine[configs.columns[cols]].header)];
                    }
                    else if(configs.columns[cols].header && configs.columns[cols].columns)
                    {
                        //재귀호출
                        me.setColumnGroup(configs.columns[cols]);
                    }
                }
            }
            configs.header = Lang.get(configs.header);
            if(!configs.width) configs.width = 0;
            for(n=0; n<configs.columns.length; n++)
            {
                configs.width += Util.nvl(configs.columns[n].width, 100);
            }
            return true;
        }
        else
        {
            return false;
        }
    },

    resetTitleText : function(text){
        var me = this;
        //TotalCount 사용여부
        //2013-12-16 KHJ
        me.totalCountUse = Util.nvl(me.totalCountUse,true);
        var titleText = (Util.isNull(Util.nvl(text,me.titleText)) ? '' : Lang.get(Util.nvl(text,me.titleText))+' : ') + Util.nvl(count, '0');
        if(me.totalCountUse){
            Ext.getCmp(me.id + "DataCount").setText(titleText);
        }
    },

    search : function(maskTrg, url, params, callbackFunc, onlyCallBackFunc){
        var me = this;

        me.getSelectionModel().deselectAll();

        var mask = null;
        if(!Util.isNull(maskTrg))
        {
            mask = new Ext.LoadMask(maskTrg, {msg:"Loading..."});
            mask.show();
        }

        params = Util.nvl(params, {});
        params.CURRENT_MENUCODE = CURRENT_MENUCODE;

        //TotalCount 사용여부
        //2013-12-16 KHJ
        me.totalCountUse = Util.nvl(me.totalCountUse,true);

        var jsonData = DS_SEARCHCONDITION;
        if(!Util.nvl(me.useSearchConditionDataSet, true)) jsonData = {};

        Ext.Ajax.request({
            url : url,
            jsonData : jsonData,
            params : params,
            callback : function(options, success, response){
                if(!Util.isNull(mask))
                {
                    mask.hide();
                }
                var json = Ext.decode(response.responseText);
                if(json["ErrorMsg"] === "OK")
                {
                    var titleText = (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)+' : ');
                    if(json["children"]){
                        me.store.setRootNode(json);
                    }
                    if(me.store.getRootNode().hasChildNodes())
                    {
                        if(me.totalCountUse){
                            Ext.getCmp(me.id + "DataCount").setText(titleText + (me.store.tree.flatten().length - 1));
                        }
                        if(callbackFunc) callbackFunc(json, true);
                    }
                    else
                    {
                        if(me.totalCountUse){
                            Ext.getCmp(me.id + "DataCount").setText(titleText + '0');
                        }
                        if(!Util.nvl(onlyCallBackFunc, false))
                        {
                            Ext.MessageBox.show({
                                title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                msg: Lang.get('NO_DATA_FOUND'),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn : function(){
                                    if(callbackFunc) callbackFunc(json, true);
                                }
                            });
                        }
                        else
                        {
                            if(callbackFunc) callbackFunc(json, true);
                        }
                    }
                }
                else
                {
                    Ext.MessageBox.show({
                        title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                        msg: json["ErrorMsg"],
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        fn : function(){
                            if(callbackFunc) callbackFunc(json, false);
                        }
                    });
                }
            }
        });
    },

    addRow : function(defaultSet, addToRoot){
        var me = this;

        //선택한 row 배열
        var rows = me.getSelectionModel().getSelection();

        if(rows.length > 1)
        {
            Ext.MessageBox.show({
                //title: 'Add Menu',
                msg: Lang.get('MSG_SELECT_ONLY_ONE'), //'한 개만 선택해 주십시오.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
        //선택한 row 가 없거나. 신규행 추가 후 삭제한 다음 곧바로 추가 버튼 눌렀을 때
        else if( addToRoot || rows.length < 1 || (rows[0].get('ROW_STATUS')=='I' && rows[0].get('ROW_DELETE')) )
        {
            var newRow = Ext.create(me.idPrefix + 'Model', Util.nvl(defaultSet, {}));
            if(Util.nvl(me.editable, true))
            {
                newRow.set('ROW_STATUS_TXT', Lang.get('INSERT'));
                newRow.set('ROW_STATUS', 'I');
            }
            me.getRootNode().appendChild(newRow);
            me.getSelectionModel().select(newRow);
        }
        //선택한 row 가 저장이 되지 않은 것이거나 삭제할 것이면
        else if( Ext.Array.contains(['I','D'],rows[0].get('ROW_STATUS')))
        {
            Ext.MessageBox.show({
                //title: 'Add Menu',
                msg: Lang.get('MSG_CHECK_NODE_STATUS'), //'저장되어있지 않거나 삭제할 노드에 하위 노드를 추가할 수 없습니다.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
        //선택한 row 가 leaf 노드면
        else if(rows[0].get('leaf'))
        {
            Ext.MessageBox.show({
                //title: 'Add Menu',
                msg: Lang.get('MSG_CHECK_NODE_LEAF'), //'Leaf 노드에 노드를 추가할 수 없습니다.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
        else
        {
            var newRow = Ext.create(me.idPrefix + 'Model', Util.nvl(defaultSet, {}));
            if(Util.nvl(me.editable, true))
            {
                newRow.set('ROW_STATUS_TXT', Lang.get('INSERT'));
                newRow.set('ROW_STATUS', 'I');
            }
            me.expandNode(rows[0]);
            rows[0].appendChild(newRow);
            me.getSelectionModel().select(newRow);
        }
    },

    save : function(maskTrg, url, params, callbackFunc, onlyCallBackFunc){
        var me = this;

        var insertCnt = 0;
        var updateCnt = 0;
        var deleteCnt = 0;

        var validCheck = true;
        var addYn = false;
        var dataToSend = [];

        Ext.Array.forEach(me.store.tree.flatten(), function(item,index,allItems){
            if(item.get('ROW_STATUS') == 'I') {insertCnt++; addYn = true;}
            if(item.get('ROW_STATUS') == 'U') {updateCnt++; addYn = true;}
            if(item.get('ROW_STATUS') == 'D') {deleteCnt++; addYn = true;}
            if(addYn)
            {
                //validation
                var ret = true;
                for(colName in me.validator) {
                    var functions = me.validator[colName];
                    for(var n=0; n<functions.length; n++)
                    {
                        ret = me.validator[colName][n](me, item, me.gridHeaderNames[colName], item.get(colName), true);
                        if(ret !== true)
                        {
                            me.getSelectionModel().select(item);
                            Ext.MessageBox.show({
                                title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                msg: ret,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                            validCheck = false;
                            return false; //each() break;
                        }
                    }
                }
                //date 컬럼 언포멧
                for(colName in me.dateColumns)
                {
                    item.data[colName] = Ext.Date.dateFormat(item.data[colName], me.dateColumns[colName]);
                }
                dataToSend.push(item.data);
                addYn = false;
            }
        });

        //밸리데이션 실패시 중지
        if(!validCheck) return false;

        //저장할 것이 없으면
        if(insertCnt + updateCnt + deleteCnt == 0)
        {
            Ext.MessageBox.show({
                title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                msg: Lang.get('NO_DATA_TO_SAVE'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
        else
        {
            var msg = "";
            msg += "<table>";
            msg += "  <tr>";
            msg += "    <td style='padding:2px;'>"+Lang.get('INSERT')+"</td><td>&nbsp;: "+insertCnt+"</td>";
            msg += "  </tr>";
            msg += "  <tr>";
            msg += "    <td style='padding:2px;'>"+Lang.get('UPDATE')+"</td><td>&nbsp;: "+updateCnt+"</td>";
            msg += "  </tr>";
            msg += "  <tr>";
            msg += "    <td style='padding:2px;'>"+Lang.get('DELETE')+"</td><td>&nbsp;: "+deleteCnt+"</td>";
            msg += "  </tr>";
            msg += "</table>";

            if(!me.confirmUse){
                var gridMask = new Ext.LoadMask(maskTrg, {msg:"Please wait..."});
                gridMask.show();
                params = Util.nvl(params, {});
                params.CURRENT_MENUCODE = CURRENT_MENUCODE;
                Ext.Ajax.request({
                    url : url,
                    jsonData : {
                        DS_SAVE : dataToSend
                    },
                    params : params,
                    callback : function(options, success, response){
                        gridMask.hide();
                        var json = Ext.decode(response.responseText);
                        if(json["ErrorMsg"] === "OK")
                        {
                            if(!Util.nvl(onlyCallBackFunc, false))
                            {
                                Ext.MessageBox.show({
                                    title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                    msg: json["SuccessMsg"],
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    fn : function(){
                                        if(callbackFunc) callbackFunc(json, true);
                                    }
                                });
                            }
                            else
                            {
                                if(callbackFunc) callbackFunc(json, true);
                            }
                        }
                        else
                        {
                            Ext.MessageBox.show({
                                title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                msg: json["ErrorMsg"],
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR,
                                fn : function(){
                                    //if(callbackFunc) callbackFunc(json, false);
                                }
                            });
                        }
                    }
                });
            }else{
                Ext.MessageBox.confirm((Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)), msg, function(btn){
                    if(btn == "yes")
                    {
                        var gridMask = new Ext.LoadMask(maskTrg, {msg:"Please wait..."});
                        gridMask.show();
                        params = Util.nvl(params, {});
                        params.CURRENT_MENUCODE = CURRENT_MENUCODE;
                        Ext.Ajax.request({
                            url : url,
                            jsonData : {
                                DS_SAVE : dataToSend
                            },
                            params : params,
                            callback : function(options, success, response){
                                gridMask.hide();
                                var json = Ext.decode(response.responseText);
                                if(json["ErrorMsg"] === "OK")
                                {
                                    if(!Util.nvl(onlyCallBackFunc, false))
                                    {
                                        Ext.MessageBox.show({
                                            title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                            msg: json["SuccessMsg"],
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO,
                                            fn : function(){
                                                if(callbackFunc) callbackFunc(json, true);
                                            }
                                        });
                                    }
                                    else
                                    {
                                        if(callbackFunc) callbackFunc(json, true);
                                    }
                                }
                                else
                                {
                                    Ext.MessageBox.show({
                                        title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                        msg: json["ErrorMsg"],
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        fn : function(){
                                            //if(callbackFunc) callbackFunc(json, false);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    },

	/**
	 * 선택 행 값 가져오기
	 */
    getSelectedRowData : function(colName){
		var me = this;
		var records = me.getSelectionModel().getSelection();
		if(records.length > 0)
		{
			return records[0].get(colName);
		}
		else
		{
			return '';
		}
	},

	/**
	 * 선택 행 값 셋팅
	 */
    setSelectedRowData : function(colName, value){
		var me = this;
		var records = me.getSelectionModel().getSelection();
		if(records.length > 0)
		{
			for(var n=0; n<records.length; n++)
			{
				records[n].set(colName, value);
			}
		}
	},

	/**
	 * 선택 컬럼 보이기, 숨기기
	 */
    setColumnVisible : function(colName, visible)
	{
		var gridColumns = menuTreeGrid.headerCt.getGridColumns();
		for(var n=0; n<gridColumns.length; n++) {
			var column = gridColumns[n];
			if(column.dataIndex == colName)
			{
				column.setVisible(visible);
				break;
			}
		}
	},

    /**
     * treestore 는 commitChanges 함수가 없다...그래서 재조회 여부는 물어보지 않는다.
     */
    saveAndSearch : function(maskTrg, url, params, callFunc){
        var me = this;
        me.save(maskTrg, url, params, function(result, successYn){
            if(successYn) {
                callFunc();
            }
        }, false);
    },

	/**
	 *
	 */
	expandAndSelect : function(param,value){
		var me = this;
		var rn    = me.getRootNode();
		var regex = new RegExp(value);
		rn.findChildBy(searchValue);

		function searchValue(child)
		{
			var text = child.data[param];
			if(regex.test(text) === true)
			{
				if(child.parentNode != null)
				{
					//child.expand();
					eapandValue(child.parentNode);
				}
				me.getSelectionModel().select(child, true);
			}
			else
			{
				if(child.childNodes.length == 0)
				{
					return;
				}
				else
				{
					child.findChildBy(searchValue);
				}
			}
		}

		function eapandValue(parent)
		{
			if(parent.parentNode != null && parent.parentNode.internalId != 'root')
			{
				parent.expand();
				eapandValue(parent.parentNode);
			}
			else
			{
				parent.expand();
			}
		}
	}
});

/********************************************************************************************************
 * Tree Grid Store
 ********************************************************************************************************/
Ext.define('VC.store.CommonTreeGridStore', {
    extend : 'Ext.data.TreeStore',
    root: {
        children : []
    },
    onUpdate : function(store, record, operation, modifiedFieldNames, eOpts)
    {
        if(modifiedFieldNames)
        {
            if(modifiedFieldNames[0] == 'expanded') return;   //트리 펼치고 접을 때 쓰는 값.
            if(Ext.Array.contains(['ROW_STATUS','ROW_STATUS_TXT'], modifiedFieldNames[0])) return; //이건 사용자가 변경하는 값이 아니므로.

            //삭제 클릭시 신규 추가행이면 없앰. 서버에서 로드했던 데이터는 상태 D 로 변경.
            if(record.get('ROW_DELETE'))
            {
                //자식 노드 있으면 삭제 못하게
                if(record.hasChildNodes())
                {
                    Ext.MessageBox.show({
                        //title: 'Delete Menu',
                        msg: Lang.get('MSG_CHECK_CHILD_NODE'),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    record.set("ROW_DELETE", false);
                    return;
                }
                else if(record.get('ROW_STATUS') == 'I')
                {
                    store.bindedGrid.focus(); //해당 행에 수정 중인 필드가 있을 경우 삭제해도 에디터가 그대로 남아있다. 포커스 아웃해주어야 없어진다.
                    record.remove();
                }
                else
                {
                    record.set('ROW_STATUS','D');
                    record.set('ROW_STATUS_TXT', Lang.get('DELETE'));
                }
            }
            //신규 추가한 행이 아닐 경우 변경된 값이 있으면 U
            else if(record.get('ROW_STATUS') != 'I')
            {
                var isDirty = false;
                for(elem in record.getChanges())
                {
                    if(elem != 'ROW_STATUS' && elem != 'ROW_STATUS_TXT')
                    {
                        isDirty = true;
                        break;
                    }
                }
                if(isDirty)
                {
                    record.set('ROW_STATUS','U');
                    record.set('ROW_STATUS_TXT', Lang.get('UPDATE'));
                }
                else
                {
                    record.set('ROW_STATUS','R');
                    record.set('ROW_STATUS_TXT', '');
                }
            }
        }
    }
});

/********************************************************************************************************
 * Common Grid
 ********************************************************************************************************/
Ext.define('VC.grid.CommonGrid',{
    extend : 'Ext.grid.Panel',
    alias : 'widget.commonGrid',
    columnLines: true,
    border:0,
    rowLines : true,
    cls : 'common-grid',
    /**
     * 초기화
     */
    initComponent: function() {
        var me = this;

        //그리드 id
        me.id = Util.isNull(me.idPrefix) ? me.id : me.idPrefix;

        //그리드 타이틀
        if(me.title) me.title = Lang.get(me.title);

        //viewConfig
		me.viewConfig = me.viewConfig || {};
		me.viewConfig.stripeRows = me.viewConfig.stripeRows || false;
		//me.viewConfig.enableTextSelection = true;
		me.viewConfig.listeners = me.viewConfig.listeners || {};
        if(Util.isNull(me.viewConfig.listeners.refresh)) {
            me.viewConfig.listeners.refresh = function(dataview) {
				Ext.each(dataview.panel.columns, function(column) {
					if(column.autoFit === true)
						column.autoSize();
				});
			}
        }

        // border
        if(me.borders)
        {
        	me.style = Util.nvl(me.style,'');
        	for(var n=0; n<me.borders.length; n++)
        	{
        		if(me.borders[n] == 'top')
        		{
        			me.style += 'border-top:1px solid #99bce8;';
        		}
        		else if(me.borders[n] == 'bottom')
        		{
        			me.style += 'border-bottom:1px solid #99bce8;';
        		}
        		else if(me.borders[n] == 'left')
        		{
        			me.style += 'border-left:1px solid #99bce8;';
        		}
        		else if(me.borders[n] == 'right')
        		{
        			me.style += 'border-right:1px solid #99bce8;';
        		}
        	}
        }

        //selection model
        if(Util.isNull(me.selModel) && Util.nvl(me.useCheckboxModel, false)) {
            me.selModel = Ext.create('Ext.selection.CheckboxModel', {
                checkOnly: false,
                injectCheckbox:'first',
                ignoreRightMouseSelection : true,
                mode:Util.nvl(me.selectionMode, 'MULTI')
            });
        }else if(Util.isNull(me.selModel)){
            me.selModel = {
                ignoreRightMouseSelection : true
            };
        }

        //dataIndex 로 컬럼 설정 가져오기 위함.
        me.columnDefines = [];
        //dataIndex 로 헤더명 가져오기 위함
        me.gridHeaderNames = [];
		//날짜 컬럼
		me.dateColumns = [];
        //dataIndex 로 data 타입 컬럼 값 언포멧 위함
        me.dateColumnsDateFormat = [];
        //dataIndex 로 data 타입 컬럼 값 렌더포멧
        me.dateColumnsRenderFormat = [];
        //체크박스 YN 으로 변경 위함
        me.checkboxColumns = [];
        //콤보 컬럼
        me.comboColumns = [];
        //combo 타입 컬럼 렌더링 위함
        me.comboColumnStore = [];
        //combo 타입 컬럼 텍스트 필드 값 가져오기위함.
        me.comboboxValueFields = [];
        me.comboboxDisplayFields = [];

        //모델 필드, 그리드 컬럼 속성
        var columnDefine = me.columnDefine;

        //TotalCount 사용 여부
        //2013-12-16 KHJ
        me.totalCountUse = Util.nvl(me.totalCountUse,true);

        //confirm 사용 여부
        //2014-01-16 KHJ
        me.confirmUse = Util.nvl(me.confirmUse,false);

        var gridColumns = [];
        var modelFields = [];

        //필수입력 컬럼
        me.requiredCols = [];
        //수정불가 컬럼
        me.updateDisableCols = [];

        //팝업 에디트일 경우 editable 값 false 로 강제 조정
        if(Util.nvl(me.popEditable, false)) {
            me.editable = false;
            if(Util.isNull(me.popEditWhenDbClick)) me.popEditWhenDbClick = true;
            me.popEditWinConfig = Util.nvl(me.popEditWinConfig, {});
        }

        for(var n=0; n<columnDefine.length; n++)
        {
            //모델 필드 속성
            var modelField = {};

            //그리드 컬럼 속성
            var gridColumn = {};

            gridColumn.cls = 'grid-header-normal';
            gridColumn.tdCls = 'grid-column-normal';

            //필수입력, 수정불가 컬럼 배열에 저장.
            /*if(Util.nvl(columnDefine[n].required, false))
            {
                me.requiredCols.push(Util.nvl(columnDefine[n].colName, columnDefine[n].header));
                gridColumn.cls = 'grid-header-required';
            }
            */
            if(Util.nvl(me.popEditable, false)){//14.1.2 추가. 팝업에디트일 경우, required 상관없이 모두 검정색.
                gridColumn.cls = 'grid-header-black';
            }else{
                //팝업에디트가 아닐경우, 수정가능한 필드에 대해 파란색, 아니면 검정색
                if(Util.nvl(me.editable,true) && n!=0 && Util.nvl(columnDefine[n].editable, true) || columnDefine[n].updatable){
                    gridColumn.cls = 'grid-header-blue';
                }else{
                    gridColumn.cls = 'grid-header-required';
                }
            }
            if(! Util.nvl(columnDefine[n].updatable, true))
            {
                me.updateDisableCols.push(Util.nvl(columnDefine[n].colName, columnDefine[n].header));
                gridColumn.tdCls = 'grid-column-update-disabled';
            }
            if(! Util.nvl(columnDefine[n].editable, true))
            {
                gridColumn.tdCls = 'grid-column-edit-disabled';
            }
            if(columnDefine[n].tdCls)
            {
                gridColumn.tdCls = columnDefine[n].tdCls;
            }

            //모델 name, 그리드 header & dataIndex & style
            if(columnDefine[n].header)
            {
                modelField.name = Util.nvl(columnDefine[n].colName, columnDefine[n].header);
                gridColumn.header = Lang.get(columnDefine[n].header);
                //14.1.8 필수인 항목은 label뒤에 * 붙임.
                if(Util.nvl(columnDefine[n].required, false) && !Util.nvl(me.popEditable, false)){
                    gridColumn.header = gridColumn.header + '*';
                }
                gridColumn.dataIndex = Util.nvl(columnDefine[n].colName, columnDefine[n].header);
                me.gridHeaderNames[gridColumn.dataIndex] = gridColumn.header;
                me.columnDefines[Util.nvl(columnDefine[n].colName, columnDefine[n].header)] = columnDefine[n];
            }

            //기본 값
            if(columnDefine[n].defaultValue)
            {
                modelField.defaultValue = columnDefine[n].defaultValue;
            }

            //int 나 float 타입
            if(columnDefine[n].type == 'int' || columnDefine[n].type == 'float' || columnDefine[n].type == 'number')
            {
                modelField.type = columnDefine[n].type;
                columnDefine[n].align = 'right';
                gridColumn.align = 'right';
                gridColumn.xtype = 'numbercolumn';
                if(columnDefine[n].format) {
                    gridColumn.format = columnDefine[n].format;
                }else{
                    gridColumn.format = columnDefine[n].type == 'int' ? ClientData.getFormat('INT_FORMAT') : ClientData.getFormat('FLOAT_FORMAT');
                }
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {
                        xtype : 'numberfield'
                    };
                    if(!Util.isNull(columnDefine[n].minValue))
                    {
                    	gridColumn.editor.minValue = columnDefine[n].minValue;
                    }
                    if(!Util.isNull(columnDefine[n].maxValue))
                    {
                    	gridColumn.editor.maxValue = columnDefine[n].maxValue;
                    }
                }
            }
            //checkbox 타입
            else if(columnDefine[n].type == 'checkbox')
            {
                columnDefine[n].align = 'center';
                modelField.type = 'boolean';
                gridColumn.xtype = 'checkcolumn';
                gridColumn.stopSelection = false;
                if(!Util.nvl(me.editable, true) || !Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.listeners = {
                        beforecheckchange : function(checkcolumn, rowIdx, checked, opts){
                            return false;
                        }
                    };
                }
                else
                {
                    gridColumn.listeners = {
                        //그리드 체크컬럼은 beforeedit, edit 리스너가 안먹힌다!!! 그래서 이렇게 함...
                        //삭제 체크 컬럼도 동일하게 해주어야 한다...
                        beforecheckchange : function(checkcolumn, rowIdx, checked, opts){
                            if(me.editorConfig && me.editorConfig.beforeeditListeners)
                            {
                                var ret = true;
                                for(var n=0; n<me.editorConfig.beforeeditListeners.length; n++)
                                {
                                    var func = me.editorConfig.beforeeditListeners[n];
                                    ret = func(me, me.store.getAt(rowIdx), checkcolumn.dataIndex, checked);
                                    if(!ret) break;
                                }
                                return ret;
                            }
                            return true;
                        },
                        checkchange : function(checkcolumn, rowIdx, checked, opts){
                            me.lastSelectedRow = me.store.getAt(rowIdx);
                            if(me.editorConfig && me.editorConfig.editListeners)
                            {
                                for(var n=0; n<me.editorConfig.editListeners.length; n++)
                                {
                                    var func = me.editorConfig.editListeners[n];
                                    func(me, me.store.getAt(rowIdx), checkcolumn.dataIndex, checked);
                                }
                            }
                        }
                    };
                }
                me.checkboxColumns.push(gridColumn.dataIndex);
            }
            //combobox 타입
            else if(columnDefine[n].type == 'combobox')
            {
                modelField.type = 'string';
                var comboStore = Util.isNull(columnDefine[n].comboStore) ? Util.createComboStore(columnDefine[n].comboParam) : columnDefine[n].comboStore;
                me.comboColumnStore[gridColumn.dataIndex] = comboStore;
                var valueField = Util.nvl(columnDefine[n].comboValueField, comboStore.model.getFields()[0].name);
                var displayField = Util.nvl(columnDefine[n].comboDisplayField, comboStore.model.getFields()[1].name);
                var valueEditable = Util.nvl(columnDefine[n].valueEditable, false);

                gridColumn.renderer = function(value, metadata, record, rowIndex, colIndex, store, view){
                    var comboRecord = me.comboColumnStore[view.headerCt.gridDataColumns[colIndex].dataIndex].findRecord(valueField, value, 0, false, true, true);
                    /*
                    if(Util.isNull(comboRecord))
                    {
                        comboRecord = me.comboColumnStore[view.headerCt.gridDataColumns[colIndex].dataIndex].findRecord(displayField, value);
                        if(!Util.isNull(comboRecord))
                        {
                            record.set(gridColumn.dataIndex, comboRecord.get(valueField));
                        }
                    }
                    */
                    return Util.isNull(comboRecord) ? value : Util.nvl(comboRecord.get(displayField), value);
                };

                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {
                        xtype : 'combobox',
                        store : comboStore,
                        valueField : valueField,
                        displayField : displayField,
                        editable : valueEditable,
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.DELETE) {
                                    field.setValue('');
                                }
                            }
                        }
                    };
                }

                me.comboColumns.push(gridColumn.dataIndex);
                me.comboboxValueFields[gridColumn.dataIndex] = valueField;
                me.comboboxDisplayFields[gridColumn.dataIndex] = displayField;
            }
            //popup 타입
            else if(columnDefine[n].type == 'popup')
            {
                modelField.type = 'string';

                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {
                        xtype : 'popSearchField',
                        editable : Util.nvl(columnDefine[n].valueEditable, false),
                        listeners: {
                            focus : function(me, evt, opts) {
                                me.skipValidator = false;
                            }
                        },
                        customPopupFunction : columnDefine[n].popupParam.customPopupFunction,
                        param : {
                            URL : columnDefine[n].popupParam.URL,
                            DBCOLUMN : columnDefine[n].popupParam.DBCOLUMN,
                            COLUMNDESCR_LANG : Lang.get(columnDefine[n].popupParam.TITLE),
                            MODULE : Util.nvl(columnDefine[n].popupParam.MODULE),
                            SQLPROP : columnDefine[n].popupParam.SQLPROP,
                            KEYPARAM : columnDefine[n].popupParam.KEYPARAM,
                            PARAM1 : columnDefine[n].popupParam.PARAM1,
                            PARAM2 : columnDefine[n].popupParam.PARAM2,
                            PARAM3 : columnDefine[n].popupParam.PARAM3,
                            PARAM4 : columnDefine[n].popupParam.PARAM4,
                            PARAM5 : columnDefine[n].popupParam.PARAM5,
                            PARAM6 : columnDefine[n].popupParam.PARAM6,
                            PARAM7 : columnDefine[n].popupParam.PARAM7,
                            PARAM8 : columnDefine[n].popupParam.PARAM8,
                            PARAM9 : columnDefine[n].popupParam.PARAM9,
                            PARAM10 : columnDefine[n].popupParam.PARAM10,
                            CODE_HEADER : columnDefine[n].popupParam.CODE_HEADER,
                            CODE_COLNAME : columnDefine[n].popupParam.CODE_COLNAME,
                            NAME_HEADER : columnDefine[n].popupParam.NAME_HEADER,
                            NAME_COLNAME : columnDefine[n].popupParam.NAME_COLNAME,
                            SELECTIONMODE : columnDefine[n].popupParam.SELECTIONMODE,
                            DYNAMICPARAM : columnDefine[n].popupParam.DYNAMICPARAM,
                            PAGESIZE : columnDefine[n].popupParam.PAGESIZE,
                            GRID : me,
                            RETURNROW : !Util.isNull(columnDefine[n].popupParam.CODENAMECOLUMN) || !Util.isNull(columnDefine[n].popupParam.afterGetRow),
                            DEFAULTADDROW : columnDefine[n].popupParam.DEFAULTADDROW,
                            CODENAMECOLUMN : columnDefine[n].popupParam.CODENAMECOLUMN,
                            AUTOSEARCH : columnDefine[n].popupParam.AUTOSEARCH,
                            afterGetRow : columnDefine[n].popupParam.afterGetRow,
                            setCodeNameColValue : function(nameVal) {
                                if(!Util.isNull(this.CODENAMECOLUMN)) Ext.getCmp(me.id).currentEditingInfo.record.set(this.CODENAMECOLUMN, nameVal);
                            }
                        }
                    };
                }
            }
            //날짜 타입
            else if(columnDefine[n].type == 'date')
            {
                if(Util.isNull(columnDefine[n].align)) columnDefine[n].align = 'center';
                modelField.type = 'date';
                modelField.dateFormat = columnDefine[n].dateFormat;
				me.dateColumns.push(gridColumn.dataIndex);
                me.dateColumnsDateFormat[gridColumn.dataIndex] = columnDefine[n].dateFormat;
                me.dateColumnsRenderFormat[gridColumn.dataIndex] = ClientData.getFormat(columnDefine[n].renderFormat);
                gridColumn.xtype = 'datecolumn';
                columnDefine[n].width = Util.nvl(columnDefine[n].width, 120);
                gridColumn.format = ClientData.getFormat(Util.nvl(columnDefine[n].dateRenderFormat, columnDefine[n].renderFormat));
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {
                        xtype : 'datefield',
                        format : Util.nvl(ClientData.getFormat(columnDefine[n].editFormat), gridColumn.format)
                    };
                }
            }
            //일련번호
            else if(columnDefine[n].type == 'gridrownumber')
            {
                gridColumn.xtype = 'gridrownumber';
                columnDefine[n].header = Util.nvl(columnDefine[n].header, 'No.');
                gridColumn.text = columnDefine[n].header;
            }
            //액션컬럼
            else if(columnDefine[n].type == 'action')
            {
                gridColumn.xtype = 'actioncolumn';
                gridColumn.text = Lang.get(columnDefine[n].header);
                Ext.apply(gridColumn, columnDefine[n]);
            }
            //기본 텍스트 필드
            else
            {
                modelField.type = 'string';
                if(Util.nvl(me.editable, true) && Util.nvl(columnDefine[n].editable, true))
                {
                    gridColumn.editor = {};
                }
            }

            //너비
            if(!Util.isNull(columnDefine[n].flex))
            {
                gridColumn.flex = columnDefine[n].flex;
            }
            else
            {
                gridColumn.width = Util.nvl(columnDefine[n].width, Util.nvl(me.defaultColWidth,100));
            }
            //자동 너비
            if(!Util.isNull(columnDefine[n].autoFit))
            {
                gridColumn.autoFit = columnDefine[n].autoFit;
                gridColumn.minWidth = Util.nvl(columnDefine[n].width, Util.nvl(me.defaultColWidth,100));
            }
            //데이터 정렬
            if(!Util.isNull(columnDefine[n].align))
            {
                gridColumn.align = columnDefine[n].align;
            }
            //숨김 가능 여부
            if(!Util.isNull(columnDefine[n].hideable))
            {
                gridColumn.hideable = columnDefine[n].hideable;
            }
            //숨김 여부
            if(!Util.isNull(columnDefine[n].hidden))
            {
                gridColumn.hidden = columnDefine[n].hidden;
            }
            //int, float, number 타입 필드 null 사용여부
            if(!Util.isNull(columnDefine[n].useNull))
            {
                modelField.useNull = columnDefine[n].useNull;
            }
            //데이터 임의 변환
            if(!Util.isNull(columnDefine[n].convert))
            {
                modelField.convert = columnDefine[n].convert;
            }
            //renderer
            if(!Util.isNull(columnDefine[n].renderer))
            {
                gridColumn.renderer = columnDefine[n].renderer;
            }
            //summary type
            if(!Util.isNull(columnDefine[n].summaryType))
            {
                gridColumn.summaryType = columnDefine[n].summaryType;
            }
            //summary renderer
            if(!Util.isNull(columnDefine[n].summaryRenderer))
            {
                gridColumn.summaryRenderer = columnDefine[n].summaryRenderer;
            }
			//툴팁. 대상 컬럼 혹은 툴팁 렌더러.
			if(!Util.isNull(columnDefine[n].toolTipColumn))
			{
				columnDefine[n].toolTipRenderer = (function(toolTipColumn){
					return function(record)
					{
						return record.get(toolTipColumn);
					}
				})(columnDefine[n].toolTipColumn);
			}
			if(!Util.isNull(columnDefine[n].toolTipRenderer))
			{
				gridColumn.listeners = gridColumn.listeners || {};
				gridColumn.listeners.beforerender = (function(toolTipRenderer){
					return function(column){
						column.orgrenderer = column.renderer;
						column.renderer = function(value, metadata, record, rowIndex, colIndex, store, view)
						{
							metadata.tdAttr = 'data-qtip="' + Util.replaceAll(toolTipRenderer(record),'"','&quot') + '"';
							var ret = column.orgrenderer ? column.orgrenderer(value, metadata, record, rowIndex, colIndex, store, view) : value;
							return ret;
						};
					};
				})(columnDefine[n].toolTipRenderer);
			}

            if(columnDefine[n].type != 'gridrownumber' && columnDefine[n].type != 'action') {
                modelFields.push(modelField);
            }
            gridColumns.push(gridColumn);
        }

        //그리드 에디터 밸리데이션
        for(var n=0; n<gridColumns.length; n++)
        {
            if(gridColumns[n].editor && Util.nvl(columnDefine[n].required, false))
            {
                if(! me.validator)
                {
                    me.validator = {};
                }
                if(! me.validator[gridColumns[n].dataIndex])
                {
                    me.validator[gridColumns[n].dataIndex] = [];
                }
                me.validator[gridColumns[n].dataIndex].unshift(function(grid, record, headerName, value){
                    var retVal = true;
                    if(Util.isNull(value)) retVal = Lang.getRep('MSG_REQUIRED_FIELD_REP', [headerName]);
                    return retVal;
                });
            }
            if(gridColumns[n].editor && me.validator && me.validator[gridColumns[n].dataIndex])
            {
                gridColumns[n].editor.headerName = gridColumns[n].header;
                gridColumns[n].editor.validCheckFunctions = me.validator[gridColumns[n].dataIndex];
                gridColumns[n].editor.skipValidator = false;
                gridColumns[n].editor.validator = function(value)
                {
                    var editInfo = Ext.getCmp(me.id).currentEditingInfo;
                    var retVal = true;
                    if(this.validCheckFunctions && !this.skipValidator) {
                        for(var n=0; n<this.validCheckFunctions.length; n++)
                        {
                            retVal = this.validCheckFunctions[n](editInfo.grid, editInfo.record, this.headerName, value);
                            if(retVal !== true) break;
                        }
                    }
                    return retVal;
                };
            }
        }

        var finalGridColumns = [];

        //다중 헤더 설정시 컬럼 그룹
        if(me.columnGroup)
        {
            finalGridColumns = Ext.clone(me.columnGroup);
            me.gridColumnNames = [];
            for(var n=0; n<gridColumns.length; n++)
            {
                if(gridColumns[n].xtype == 'gridrownumber')
                {
                    finalGridColumns.unshift(gridColumns[n]);
                }
                else
                {
                    me.gridColumnNames[gridColumns[n].dataIndex] = gridColumns[n];
                }
            }
            for(var n=0; n<finalGridColumns.length; n++)
            {
                if(!me.setColumnGroup(finalGridColumns[n]))
                {
                    finalGridColumns[n] = me.gridColumnNames[Util.nvl(finalGridColumns[n].colName, finalGridColumns[n].header)];
                }
            }
        }
        else
        {
            finalGridColumns = gridColumns;
        }

        //틀고정
        for(var n=0; n<me.fixedCols; n++)
        {
            finalGridColumns[n].locked = true;
        }

        //그리드 컬럼 직접 수정 가능, 혹은 팝업 에디트 가능일 경우. 삭제 컬럼과 상태 컬럼 추가.
        //미리 안하고 뒤에 하는 이유는 컬럼 그룹 때문. 이 컬럼들은 컬럼 그룹과 별개로 추가되는 거니까.
        if(Util.nvl(me.editable, true) || Util.nvl(me.popEditable, false))
        {
            //모델 공통사항
            modelFields.push({name : 'ROW_DELETE',     type: 'boolean'});
            modelFields.push({name : 'ROW_STATUS_TXT', type: 'string', defaultValue:''}),
            modelFields.push({name : 'ROW_STATUS',     type: 'string', defaultValue:'R'});

            //그리드 공통사항
            finalGridColumns.push({
                xtype :'checkcolumn',
                header : Lang.get('DELETE'),
                style : 'text-align:center',
                dataIndex : 'ROW_DELETE',
                //menuDisabled : true,
                hideable : !Util.nvl(me.updateOnly,false),
                hidden : Util.nvl(me.updateOnly,false),
                width : 50,
                stopSelection: false,
                tdCls : 'grid-column-normal',
                listeners : {
                    //그리드 체크컬럼은 beforeedit, edit 리스너가 안먹힌다!!! 그래서 이렇게 함...
                    //그리드의 다른 체크컬럼도 이와 동일하게 함.
                    beforecheckchange : function(checkcolumn, rowIdx, checked, opts){
                        if(me.editorConfig && me.editorConfig.beforeeditListeners)
                        {
                            var ret = true;
                            for(var n=0; n<me.editorConfig.beforeeditListeners.length; n++)
                            {
                                var func = me.editorConfig.beforeeditListeners[n];
                                ret = func(me, me.store.getAt(rowIdx), checkcolumn.dataIndex, checked);
                                if(!ret) break;
                            }
                            return ret;
                        }
                        return true;
                    },
                    checkchange : function(checkcolumn, rowIdx, checked, opts){
                        me.lastSelectedRow = me.store.getAt(rowIdx);
                        if(me.editorConfig && me.editorConfig.editListeners)
                        {
                            for(var n=0; n<me.editorConfig.editListeners.length; n++)
                            {
                                var func = me.editorConfig.editListeners[n];
                                func(me, me.store.getAt(rowIdx), checkcolumn.dataIndex, checked);
                            }
                        }
                    }
                }
            });
            finalGridColumns.push({
                header : Lang.get('EDIT_STATUS'),
                style : 'text-align:center',
                dataIndex : 'ROW_STATUS_TXT',
                //menuDisabled : true,
                hideable : !Util.nvl(me.hideStatusCol,false),
                hidden : Util.nvl(me.hideStatusCol,false),
                width : 70,
                align : 'center',
                tdCls : 'grid-column-edit-disabled'
            });
            finalGridColumns.push({
                header : Lang.get('EDIT_STATUS'),
                style : 'text-align:center',
                dataIndex : 'ROW_STATUS',
                //menuDisabled : true,
                hideable: false,
                hidden : true,
                width : 70
            });
			me.checkboxColumns.push('ROW_DELETE');
        }

        //모델 정의
        Ext.define(me.idPrefix + 'Model', {
            extend : 'Ext.data.Model',
            fields : modelFields
        });

        //store
        var storeConfig = {
            model : me.idPrefix + 'Model',
            storeId : me.idPrefix + 'Store',
            bindedGrid : me
        };
        me.store = Util.nvl(me.store, Ext.create('VC.store.CommonGridStore', storeConfig));

        //columns
        me.columns = finalGridColumns;

        //플러그인. 그리드 컬럼 직접 수정 가능할 때만.
        if(Util.nvl(me.editable, true))
        {
            if(! me.editorConfig) me.editorConfig = {};
            if(! me.editorConfig.beforeeditListeners) me.editorConfig.beforeeditListeners = [];
            if(! me.editorConfig.editListeners) me.editorConfig.editListeners = [];

            me.editorConfig.beforeeditListeners.unshift(function(grid, record, field, value){
                //삭제 체크한 건 수정 안함.
                if(field != "ROW_DELETE" && record.get("ROW_STATUS") == "D") {
                    return false;
                    //신규 행이 아닌 행의 수정불가 컬럼 체크.
                }else if(record.get("ROW_STATUS") != "I" && Ext.Array.contains(me.updateDisableCols, field)){
                    return false;
                }else{
                    return true;
                }
            });

            var cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: Util.nvl(me.editorConfig.clicksToEdit, 1),
                //그리드 컬럼에 locked 속성이 있으면 그리드의 listeners 가 안먹혀서 여기에다가 함.
                listeners: {
                    beforeedit: function(editor, editEvent, eOpts) {
                        var ret = true;
                        for(var n=0; n<me.editorConfig.beforeeditListeners.length; n++)
                        {
                            var func = me.editorConfig.beforeeditListeners[n];
                            ret = func(me, editEvent.record, editEvent.field, editEvent.value);
                            if(!ret) break;
                        }
                        if(ret)
                        {
                            //IE 에서 그리드 에디터 블러 안시키고 바로 저장 등의 버튼 클릭했을 때 버튼 포커스 이벤트가 먼저 먹히기 때문에 이를 처리하기 위해 글로벌 변수에 에디터 대입.
                            //이후 버튼 handler 에서 이 변수로 에디터를 가져와서 completeEdit 를 호출한다.
                            CURRENT_GRID_EDITOR = editor;
                            me.currentEditingInfo = editEvent;
							Ext.defer(function(){
								if(CURRENT_GRID_EDITOR.getActiveEditor())
								{
									CURRENT_GRID_EDITOR.getActiveEditor().items.items[0].inputEl.dom.select();
								}
							}, 100);
                        }
                        return ret;
                    },
                    edit : function(editor, editEvent, eOpts){
                        //console.log('edit listener call...');
                        for(var n=0; n<me.editorConfig.editListeners.length; n++)
                        {
                            var func = me.editorConfig.editListeners[n];
                            func(me, editEvent.record, editEvent.field, editEvent.value);
                        }
                    }
                }
            });
            if(! me.plugins) me.plugins = [];
            me.plugins.unshift(cellEditingPlugin);
        }

        //리스너
        me.listeners = Util.nvl(me.listeners, {});
		//마우스 클릭시
        me.cellclicklistener = me.listeners.cellclick;
        me.listeners.cellclick = function(view, td, cellIndex, model, tr, rowIndex, evt, eOpts){
			//엑셀 데이터 붙여넣기 할 때 씀...
			me.lastClickCellIndex = cellIndex;
            //헤더-디테일 관계 그리드일 경우 헤더의 값을 가져올 때 씀.
            me.lastSelectedRow = model;
            //각 화면단에서 정의한 셀클릭 이벤트
            if(me.cellclicklistener) me.cellclicklistener(view, td, cellIndex, model, tr, rowIndex, evt, eOpts);
        };
		//마우스 오른쪽 클릭시
        me.listeners.cellcontextmenu = function(view, td, cellIndex, model, tr, rowIndex, evt, eOpts) {
            evt.stopEvent();
            var elem = td;
            var lastElem = '';
            while(elem != null)
            {
                lastElem = elem;
                elem = elem.lastChild;
            }
            if(!Util.isNull(lastElem.nodeValue))
            {
                me.cellToolTip = Ext.create('Ext.tip.ToolTip', {
                    layout : 'fit',
                    items : [
                        {
                            xtype : 'textfield',
                            value : lastElem.nodeValue,
                            readOnly : true,
                            listeners : {
                                afterrender : function(me){
                                    me.selectText();
                                }
                            }
                        }
                    ]
                });
				me.cellToolTip.showAt(evt.getXY());
            }
        };
        //더블클릭시 에디트 팝업 띄우기
        if(Util.nvl(me.popEditable, false) && Util.nvl(me.popEditWhenDbClick, false))
        {
            me.listeners.celldblclick = function(view, td, cellIndex, record, tr, rowIndex, eventObj, eOpts){
                if(record.get("ROW_STATUS") != "D") {
                    if(me.checkBeforePopEditWin) {
                        if(me.checkBeforePopEditWin()) {
                            me.popEditWin(record);
                        }
                    }else{
                        me.popEditWin(record);
                    }
                }
            };
        }
		//키 이벤트 바인딩
		me.afterrenderlistener = me.listeners.afterrender;
		me.listeners.afterrender = function(thiz, opts)
		{
			if(me.afterrenderlistener) me.afterrenderlistener(thiz, opts);
			if(me.useKeyMap !== false) me.setKeyEventMap();
		}

		//그리드 정렬 시 2016.01.18 김종오
        me.sortchangelistener = me.listeners.sortchange;
        me.listeners.sortchange = function(ct, column, direction, eOpts){
        	//그리드 재정렬 시 이전 선택 셀의 위치가 변경되기 때문에 초기화.
			me.lastSelectedRowIdx = -1;
            //각 화면단에서 정의한 셀클릭 이벤트
            if(me.sortchangelistener) me.sortchangelistener(view, td, cellIndex, model, tr, rowIndex, evt, eOpts);
        };

        //버튼 총 조회갯수
        var totalCountImages = [];
        //131224 김수겸 수정. 하단의 페이징처리를 상단으로 끌어올린 후,
        //TOTAL - 페이징 - 버튼 순으로 배치를 조절하기 위해 gridButtons를 totalCountImages과 gridButtons로 분리 후. 그 사이에 페이징처리 삽입.
        var gridButtons = [];
        if(me.totalCountUse){
            totalCountImages = [
                {
                    xtype : 'image',
                    src : '/view/img/buttons/bottompaneldots/balloonleft.png',
                    border : 0,
                    margin : '0 0 0 9',
                    width : 4,
                    height : 17
                },
                {
                    xtype : 'label',
                    id : me.id + 'DataCount',
                    style : 'text-align:center;color:#FFFFFF; background-image:url(/view/img/buttons/bottompaneldots/balloonbody.png); line-height:17px !important ;vertical-align:middle !important;)',
                    border : 0,
                    minWidth : 20,
                    margin : 0,
                    height : 17,
                    html : (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText) +' : ')+'0'
                },
                {
                    xtype : 'image',
                    src : '/view/img/buttons/bottompaneldots/balloonright2.png',
                    border : 0,
                    margin : '0 5 0 0',
                    width : 4,
                    height : 17
                }
            ];

            gridButtons = [
                           '->'
            ];
        }else{
            gridButtons = [
                           '->'
            ];
        }

        //기타 버튼
        var buttonCnt = 0;
        for(var n=0; n<Util.nvl(me.buttonsConfig,[]).length; n++)
        {
            var button = Ext.clone(me.buttonsConfig[n]);
            //2014.01.10 khj 버튼 자동이미지
            var buttonTextVal = button.text;
            var iconClsVal = button.iconCls;
            button.iconCls = Util.buttonClsConfig(buttonTextVal,iconClsVal);

            button.id = Util.nvl(button.id, me.id + 'Button' + n);
            if(button.text) button.text = Lang.get(button.text);
            if(button.authType) button.hidden = true;
            if(!Util.isNull(button.handler) && Util.nvl(button.onClickCompleteEdit, true)) {
                button.clicklistener = button.handler;
                button.handler = function(){
                    if(!Util.isNull(CURRENT_GRID_EDITOR) && !Util.isNull(CURRENT_GRID_EDITOR.completeEdit))
                    {
                        CURRENT_GRID_EDITOR.completeEdit();
                    }
                    this.clicklistener();
                };
            }
            if(button.menu) {
                for(var m=0; m<button.menu.length; m++)
                {
                    var menuButtonTextVal = button.menu[m].text;
                    var menuIconClsVal = button.menu[m].iconCls;
                    button.menu[m].iconCls = Util.buttonClsConfig(menuButtonTextVal,menuIconClsVal);
                    button.menu[m].text = Lang.get(button.menu[m].text);
                    /*
                    if(!Util.isNull(button.menu[m].handler)) {
                        button.menu[m].clicklistener = button.menu[m].handler;
                        button.menu[m].handler = function(){
                            if(!Util.isNull(CURRENT_GRID_EDITOR) && !Util.isNull(CURRENT_GRID_EDITOR.completeEdit))
                            {
                                CURRENT_GRID_EDITOR.completeEdit();
                            }
                            this.clicklistener();
                        };
                    }
                    */
                }
            }
            buttonCnt++;
            gridButtons.push(button);
        }
        if(buttonCnt > 0 || me.totalCountUse)
        {
            me.dockedItems = [];
            var topToolBar = {
                xtype : 'toolbar',
                dock : 'top',
                height : 28,
                hidden : Util.nvl(me.noDockedItems,false),
                id : me.idPrefix + 'TopToolBar',
                items : totalCountImages
            };
            me.dockedItems.push(topToolBar);

            var bottomToolBar = {
                xtype : 'toolbar',
                dock : 'bottom',
                height : 28,
                hidden : Util.nvl(me.noDockedItems,false),
                id : me.idPrefix + 'BottomToolBar',
                items : []
            };

            if(me.pageSize)
            {
                var pagingItems = me.getPagingItems();
                for(var n=0; n<Util.nvl(pagingItems,[]).length; n++)
                {
                    if(Util.nvl(me.pageNaviDock,'top') == 'top')
                    {
                        topToolBar.items.push(pagingItems[n]);
                    }
                    else
                    {
                        bottomToolBar.items.push(pagingItems[n]);
                        me.dockedItems.push(bottomToolBar);
                    }
                }
            }

            for(var n=0; n<Util.nvl(gridButtons,[]).length; n++)
            {
                topToolBar.items.push(gridButtons[n]);
            }
        }
        buttonCnt = 0;
        this.callParent(arguments);

        if(me.debug) top[me.idPrefix] = me;
    },

    /**
     * 헤더 그룹 생성. private
     */
    setColumnGroup : function(configs){
        var me = this;
        if(configs.xtype == 'gridrownumber')
        {
            return true;
        }
        if(configs.columns)
        {
            if(typeof configs.columns == 'string')
            {
            	if(Util.isNull(me.gridColumnNames[configs.columns[cols]]))
            	{
            		console.log('Error!!! Wrong column group config of grid ' + me.idPrefix + ' : ' + configs.columns[cols] + ' is unknown colName...');
            	}
                configs.columns = [me.gridColumnNames[configs.columns]];
            }
            else if(typeof configs.columns == 'number')
            {
            	if(Util.isNull(Util.nvl(me.gridColumnNames[configs.columns[cols]].colName, me.columnDefine[configs.columns[cols]].header)))
            	{
            		console.log('Error!!! Wrong column group config of grid ' + me.idPrefix + ' : ' + configs.columns[cols] + ' is unknown index...');
            	}
                configs.columns = [me.gridColumnNames[Util.nvl(me.columnDefine[configs.columns].colName, me.columnDefine[configs.columns].header)]];
            }
            else if(Ext.isArray(configs.columns))
            {
                for(var cols=0; cols<configs.columns.length; cols++)
                {
                    if(typeof configs.columns[cols] == 'string')
                    {
                    	if(Util.isNull(me.gridColumnNames[configs.columns[cols]]))
                    	{
                    		console.log('Error!!! Wrong column group config of grid ' + me.idPrefix + ' : ' + configs.columns[cols] + ' is unknown colName...');
                    	}
                        configs.columns[cols] = me.gridColumnNames[configs.columns[cols]];
                    }
                    else if(typeof configs.columns[cols] == 'number')
                    {
                    	if(Util.isNull(Util.nvl(me.gridColumnNames[configs.columns[cols]].colName, me.columnDefine[configs.columns[cols]].header)))
                    	{
                    		console.log('Error!!! Wrong column group config of grid ' + me.idPrefix + ' : ' + configs.columns[cols] + ' is unknown index...');
                    	}
                        configs.columns[cols] = me.gridColumnNames[Util.nvl(me.columnDefine[configs.columns[cols]].colName, me.columnDefine[configs.columns[cols]].header)];
                    }
                    else if(configs.columns[cols].header && configs.columns[cols].columns)
                    {
                        //재귀호출
                        me.setColumnGroup(configs.columns[cols]);
                    }
                }
            }
            configs.header = Lang.get(configs.header);
            if(!configs.width) configs.width = 0;
            for(n=0; n<configs.columns.length; n++)
            {
                configs.width += Util.nvl(configs.columns[n].width, 100);
            }
            return true;
        }
        else
        {
        	if(Util.isNull(Util.nvl(me.gridColumnNames[configs.header], me.gridColumnNames[configs.colName])))
        	{
        		console.log('Error!!! Wrong column group config of grid ' + me.idPrefix + ' : ' + Util.nvl(configs.header, configs.colName) + ' is unknown colName...');
        	}
            return false;
        }
    },

	/**
	 * 키 이벤트 바인딩. 헤더-디테일 구조에서 디테일 조회되면 헤더 그리드 포커스 아웃되기 때문에 이벤트 안탄다.
	 */
	setKeyEventMap : function(){
		var me = this;
		me.keyEventMap = new Ext.util.KeyMap({
			target: me.getEl(),
			binding: [
				//선택 해제
				{
					key: [Ext.EventObject.ESC], //67 == Esc
					fn: function(){
						me.getSelectionModel().deselectAll();
					}
				},
				//전체 행 복사
				{
					key: [67], //67 == c
					ctrl:true,
					fn: function(){
						//셀 오른쪽 클릭해서 생성된 툴팁 떠있을 때는 안함.
						if(me.cellToolTip && me.cellToolTip.isHidden() === false) return;
						//그리드 셀 에디터 있을 때 안함.
						if(CURRENT_GRID_EDITOR && CURRENT_GRID_EDITOR.activeColumn) return;
						//작업 시작
						var clipText = me.getGridDataForExcel();
						if(clipText != '')
						{
							//빠른 속도 위해 Ext 콤포넌트 안씀.
							ta = document.getElementById('cliparea') || document.createElement('textarea');
							ta.id = 'cliparea';
							ta.style.position = 'absolute';
							ta.style.left = '-1000px';
							ta.style.top = '-1000px';
							ta.value = clipText;
							document.body.appendChild(ta);
							document.designMode = 'off';
							ta.focus();
							ta.select();
							setTimeout(function(){
								me.getEl().focus();
							}, 100);
						}
					}
				},
				//엑셀 복사한 행 데이터 붙어넣기. ctrl + v
				//그리드에 선택된 행이 없으면 추가 모드, 있으면 선택된 첫 행부터 아래 방향으로 수정.
				{
					key : [86], //86 == v
					ctrl : true,
					fn : function(){
						//빠른 속도 위해 Ext 콤포넌트 안씀.
						ta = document.getElementById('cliparea') || document.createElement('textarea');
						ta.id = 'cliparea';
						ta.style.position = 'absolute';
						ta.style.left = '-1000px';
						ta.style.top = '-1000px';
						document.body.appendChild(ta);
						document.designMode = 'off';
						setTimeout(function(){
							me.setGridDataFromExcel(); //그리드에 데이터 붙여넣기 실행
							if(CURRENT_GRID_EDITOR != null)
							{
								CURRENT_GRID_EDITOR.completeEdit();
							}
							me.getEl().focus();
						}, 100);
						ta.focus();
						ta.select();
					}
				},
				//엑셀 복사한 데이터 새 행 만들어서 붙어넣기. ctrl + a
				{
					key : [65], //65 == a
					ctrl : true,
					shift : true,
					defaultEventAction : 'stopEvent',
					fn : function(){
						//선택 해제
						me.getSelectionModel().deselectAll();
						//빠른 속도 위해 Ext 콤포넌트 안씀.
						ta = document.getElementById('cliparea') || document.createElement('textarea');
						ta.id = 'cliparea';
						ta.style.position = 'absolute';
						ta.style.left = '-1000px';
						ta.style.top = '-1000px';
						document.body.appendChild(ta);
						document.designMode = 'off';
						setTimeout(function(){
							me.setGridDataFromExcel(); //그리드에 데이터 붙여넣기 실행
							if(CURRENT_GRID_EDITOR != null)
							{
								CURRENT_GRID_EDITOR.completeEdit();
							}
							me.getEl().focus();
						}, 100);
						ta.focus();
						ta.select();
					}
				},
				//조회. 디테일 그리드여서 조회 버튼 없으면 화면 첫번째 조회 버튼.
				{
					key : [70], //70 == f
					ctrl : true,
					defaultEventAction : 'stopEvent',
					fn : function(){
						if(me.down('button[text='+Lang.get('SEARCH')+']'))
						{
							me.down('button[text='+Lang.get('SEARCH')+']').handler();
						}
						else
						{
							viewPort.down('button[text='+Lang.get('SEARCH')+']').handler();
						}
					}
				},
				//저장. 버튼 한 개만 적용. 우선 순위 : 저장 > 실행 > 확정 > 취소
				{
					key : [83], //83 == s
					ctrl : true,
					defaultEventAction : 'stopEvent',
					fn : function(){
						var saveBtn = viewPort.down('button[text='+Lang.get('SAVE')+']');
						var actionBtn = viewPort.down('button[text='+Lang.get('ACTION')+']');
						var confBtn = viewPort.down('button[text='+Lang.get('CONFIRM')+']');
						var cancelBtn = viewPort.down('button[text='+Lang.get('CANCEL')+']');
						if(saveBtn)
						{
							saveBtn.handler();
						}
						else if(actionBtn)
						{
							actionBtn.handler();
						}
						else if(confBtn)
						{
							confBtn.handler();
						}
						else if(cancelBtn)
						{
							cancelBtn.handler();
						}
					}
				}
			]
		});
	},

    /**
     * 엑셀 붙여넣기를 위한 그리드 데이터 가져오기
     */
	getGridDataForExcel : function(){
		var me = this;
		var ret = '';
		//선택된 행 데이터 가져오기
		var records = me.getFilteredRows(function(record){
			return me.getSelectionModel().isSelected(record);
		}, false, false, true);
		//엑셀 붙여넣기를 위해 탭, 줄바꿈 넣어 문자열로 변환
		if(records !== false && records !== null && records.length > 0)
		{
			var cols = me.headerCt.getVisibleGridColumns();
			for(var n=0; n<records.length; n++)
			{
				for(var f=0; f<cols.length; f++)
				{
					if(cols[f].dataIndex)
					{
						ret += (records[n][cols[f].dataIndex] + '\t');
					}
				}
				ret += '\n';
			}
		}
		return ret;
	},

    /**
     * 엑셀에서 복사한 데이터 그리드에 붙이기
	 * 그리드 선택 후 ESC 누르면 선택 전체 해제. 이 때 붇이기 하면 추가 모드.
	 * 붙여넣기할 행을 클릭하여 선택 후 붙이기 하면 수정 모드. 클릭한 셀부터 오른쪽 방향으로 값을 넣는다. 엑셀에서 복사할 때는 사각형 모양으로만 복사해야 함.
	 * 행 전체를 붙여넣기 하려면 왼쪽에 넘버러 컬럼을 클릭해야 한다. 여러 행 복사 붙여넣기도 가능.
	 * 하나의 셀에만 값을 붙여넣기 할 때는 복사한 값으로 기존 값을 덮어쓰기한다. 예를 들어 값이 1234 인데 23만 선택 후 56 을 붙여넣기 하면 값이 그냥 56이 됨.
	 * (마우스 오른 클릭으로 붙여넣기하면 선택한 부분만 덮어쓰기 됨.)
	 * 해당 그리드에 beforeedit, edit 리스너가 있으면 값을 넣이 전, 후에 각각의 이벤트를 탄다. 각각의 이벤트에서 alert 창을 띄우는 것은 막지 못한다.
     */
	setGridDataFromExcel : function(){
		var me = this;
		var ta = document.getElementById('cliparea');
		var taValue = ta.value.replace(/^\s+/,"").replace(/\s+$/,"");
		var rows = taValue.split('\n');

		var finalRecords = [];
		var vcols = me.headerCt.getVisibleGridColumns();
		var records = me.getSelectionModel().getSelection();
		var isCheckboxModel = me.useCheckboxModel ? 1 : 0;
		var isFirstColNumberer = vcols[isCheckboxModel].xtype == 'gridrownumber' ? 1 : 0;
		var startIdx = isFirstColNumberer + isCheckboxModel;
		var editMode = records.length > 0 ? 'update' : 'insert';
		var startIdx = editMode == 'update' ? Util.nvl(me.lastClickCellIndex, startIdx) : startIdx;
		var columnDefine = {};

		for(var n=0; n<rows.length; n++)
		{
			var values = rows[n].split('\t');
			var record = {};
			for(var v=0; v<values.length; v++)
			{
				var idx = startIdx + v;
				if(vcols.length >= idx)
				{
					var dataIndex = vcols[idx].dataIndex;
					var value = Util.nvl(values[v] || '').trim();

					if(me.checkboxColumns.toString().indexOf(dataIndex) > -1)
					{
						value = (value=='Y' ? true : false);
					}
					else if(me.comboColumns.toString().indexOf(dataIndex) > -1)
					{
						var comboStore = me.comboColumnStore[dataIndex];
						if(comboStore) {
							comboStore.each(function(cmbRecord){
								if(cmbRecord.data.NAME == value)
								{
									value = cmbRecord.data.CODE;
									return;
								}
							});
						}
					}
					else if(me.dateColumns.indexOf(dataIndex) > -1)
					{
						value = Ext.Date.parse(value, me.dateColumnsRenderFormat[dataIndex] || '') || Ext.Date.parse(value, me.dateColumnsDateFormat[dataIndex] || '');
					}

					record[dataIndex] = value;
				}
			}
			finalRecords.push(record);
		}

//console.log(finalRecords);

		//컬럼 정의에 수정 가능 여부를 아래에서 사용하기 위해...
		if(finalRecords.length > 0)
		{
			for(key in finalRecords[0])
			{
				for(var c=0; c<me.columnDefine.length; c++)
				{
					if(Util.nvl(me.columnDefine[c].colName, me.columnDefine[c].header) == key)
					{
						columnDefine[key] = me.columnDefine[c];
					}
				}
			}
		}

//console.log(columnDefine);

		//선택된 행 있으면 선택된 행들만 수정.
		if(records.length > 0)
		{
			var recordIdx = me.store.indexOf(records[0]);

			for(var n=0; n<finalRecords.length; n++)
			{
				var record = records[n];
				if(Util.isNull(record))
				{
					record = me.store.getAt(++recordIdx);
				}
				if(Util.isNull(record))
				{
					break;
				}

				for(key in finalRecords[n])
				{
					if(Util.isNull(columnDefine[key])) continue;

					//대상 행의 컬럼이 수정 불가 컬럼인지 확인
					var editableCol = Util.nvl(me.editable, true) || Util.nvl(me.popEditable, false);
					var validData = true;
					if(editableCol)
					{
						var IU = record.get('ROW_STATUS');
						if(IU == 'I')
						{
							editableCol = Util.nvl(columnDefine[key].editable, true);
						}
						else if(IU == 'U' || IU == 'R')
						{
							editableCol = Util.nvl(columnDefine[key].editable, true) && Util.nvl(columnDefine[key].updatable, true);
						}

						if(editableCol)
						{
							//수정할 데이터 beforeeditlistener 태워서 확인. (alert 메시지 뜨는 건 못막는다..)
							var beforeEditCheckers = me.editorConfig.beforeeditListeners;
							for(var b=0; b<beforeEditCheckers.length; b++)
							{
								validData = beforeEditCheckers[b](me, record, key, record[key]);
								if(!validData)
								{
									break;
								}
							}
						}
					}

//console.log(editableCol);
//console.log(validData);

					//대상 행 데이터 수정
					if(editableCol && validData)
					{
						record.set(key, finalRecords[n][key]);
						//수정 후 edit listener 실행
						var editListeners = me.editorConfig.editListeners;
						for(var e=0; e<editListeners.length; e++)
						{
							editListeners[e](me, record, key, record[key]);
						}
					}
				}
			}
		}
		//선택된 행 없으면 추가.
		else
		{
			for(var n=0; n<finalRecords.length; n++)
			{
				var newRow = me.addRow();
				for(key in finalRecords[n])
				{
					if(Util.isNull(columnDefine[key])) continue;

					//대상 행의 컬럼이 수정 불가 컬럼인지 확인
					var editableCol = Util.nvl(me.editable, true) || Util.nvl(me.popEditable, false);
					if(editableCol)
					{
						editableCol = Util.nvl(columnDefine[key].editable, true);
						if(editableCol)
						{
							//수정할 데이터 beforeeditlistener 태워서 확인. (alert 메시지 뜨는 건 못막는다..)
							var validData = true;
							var beforeEditCheckers = me.editorConfig.beforeeditListeners;
							for(var b=0; b<beforeEditCheckers.length; b++)
							{
								validData = beforeEditCheckers[b](me, newRow, key, newRow[key]);
								if(!validData)
								{
									break;
								}
							}
						}
					}

					//대상 행 데이터 수정
					if(editableCol && validData)
					{
						newRow.set(key, finalRecords[n][key]);

						//수정 후 edit listener 실행
						var editListeners = me.editorConfig.editListeners;
						for(var e=0; e<editListeners.length; e++)
						{
							editListeners[e](me, newRow, key, newRow[key]);
						}
					}
				}
			}
			me.getSelectionModel().deselectAll();
		}
	},

    /**
     * 그리드 타이틀 초기화
     */
    resetTitleText : function(text, count){
        var me = this;
        //TotalCount 사용여부
        //2013-12-16 KHJ
        me.totalCountUse = Util.nvl(me.totalCountUse,true);
        var titleText = (Util.isNull(Util.nvl(text,me.titleText)) ? '' : Lang.get(Util.nvl(text,me.titleText))+' : ') + Util.nvl(count, '0');
        if(me.totalCountUse){
            Ext.getCmp(me.id + "DataCount").setText(titleText);
        }
    },

    /**
     * 그리드 조회
     * @param maskTrg 마스킹 대상
     * @param url 요청 url
     * @param params 추가 파라미터
     * @param appendYn 기존 조회 결과에 추가 여부
     * @param callbackFunc 조회 성공 후 콜백 함수
     * @param onlyCallBackFunc 조회 성공 후 조회 결과 0 건일 경우 메시지 표시 여부. true 면 안함.
     */
    search : function(maskTrg, url, params, appendYn, callbackFunc, onlyCallBackFunc){
        var me = this;

        if(!Util.nvl(appendYn, false)) me.store.removeAll();

        var mask = null;
        if(!Util.isNull(maskTrg))
        {
            mask = new Ext.LoadMask(maskTrg, {msg:"Loading..."});
            mask.show();
        }

        params = Util.nvl(params, {});
        params.CURRENT_MENUCODE = CURRENT_MENUCODE;

        //TotalCount 사용여부
        //2013-12-16 KHJ
        me.totalCountUse = Util.nvl(me.totalCountUse,true);

        //조회조건
        var jsonData = DS_SEARCHCONDITION;

        //페이징 처리 할 경우
        if(me.pageSize)
        {
            if(me.paging) {me.paging.params = {isPageNavi : true}; Ext.apply(me.paging.params, params); }
            if(me.paging && !me.paging.searchUrl) me.paging.searchUrl = url;
            if(me.paging && !me.paging.maskTrg) me.paging.maskTrg = maskTrg;
            if(me.paging && !me.paging.callbackFunc) me.paging.callbackFunc = callbackFunc;
            params.PAGE_SIZE = Util.nvl(me.paging.lastPageSize, me.pageSize);
            params.CURRENT_PAGE = Util.nvl(params.isPageNavi, false) ? me.paging.currentPage : 1;

            //헤더-디테일 그리드일 경우 디테일에서 조회조건 초기화 하기 때문에 헤더 그리드 페이징 조회시 조회조건을 가지고 있어야 함.
            if(!Util.isNull(DS_SEARCHCONDITION.DS_SEARCHCONDITION)) me.paging.DS_SEARCHCONDITION = DS_SEARCHCONDITION;
            if(me.paging && me.paging.DS_SEARCHCONDITION && me.paging.DS_SEARCHCONDITION.DS_SEARCHCONDITION) jsonData = me.paging.DS_SEARCHCONDITION;
        }

        if(!Util.nvl(me.useSearchConditionDataSet, true)) jsonData = {};

        Ext.Ajax.request({
            url : url,
            jsonData : jsonData,
            params : params,
            callback : function(options, success, response){
                if(!Util.isNull(mask))
                {
                    mask.hide();
                }
                var json = Ext.decode(response.responseText);
                if(json["ErrorMsg"] === "OK")
                {
                    var titleText = (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)+' : ');
                    if(json["DS_OUT"].length > 0){
                        //페이징 처리 할 경우
                        if(me.pageSize) {
                            if(!params.isPageNavi) me.initPageData(json["DS_TOTALCOUNT"]);
                            if(me.totalCountUse){
                                Ext.getCmp(me.id + "DataCount").setText(titleText + me.paging.totalCount);
                            }
                        }else{
                            if(me.totalCountUse){
                                Ext.getCmp(me.id + "DataCount").setText(titleText + json["DS_OUT"].length);
                            }
                        }
                        me.store.loadData(json["DS_OUT"], Util.nvl(appendYn, false));
                        me.getSelectionModel().select(me.store.first());
                        me.lastSelectedRow = me.store.first();
                        me.lastSelectedRowIdx = 0;
                        //그리드 조회 후 관련있는 다른 그리드 조회해야 할 경우(헤더 조회 후 디테일 조회 같은 경우) 등.
                        if(callbackFunc) callbackFunc(json, true);
                    }
                    else
                    {
                        if(me.totalCountUse){
                            Ext.getCmp(me.id + "DataCount").setText(titleText + '0');
                        }
                        if(me.pageSize) me.resetPageData();
                        if(!Util.nvl(onlyCallBackFunc, false))
                        {
                            Ext.MessageBox.show({
                                title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                msg: Lang.get('NO_DATA_FOUND'),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn : function(){
                                    if(callbackFunc) callbackFunc(json, true);
                                }
                            });
                        }
                        else
                        {
                            if(callbackFunc) callbackFunc(json, true);
                        }
                    }
                }
                else
                {
                    Ext.MessageBox.show({
                        title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                        msg: Lang.get(json["ErrorMsg"]),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        fn : function(){
                            if(callbackFunc) callbackFunc(json, false);
                        }
                    });
                }
            }
        });
    },

    /**
     * 현재 페이지 재조회
     */
    searchCurrentPage : function(){
        var me = this;
        me.loadPage(me.paging.currentPage);
    },

    /**
     * 이미 조회해온 데이터 등을 그리드에 로드
     * @param data
     */
    loadData : function(maskTrg, data, appendYn, callbackFunc){
        var me = this;

        if(!Util.nvl(appendYn, false)) me.store.removeAll();

        var mask = null;
        if(!Util.isNull(maskTrg))
        {
            mask = new Ext.LoadMask(maskTrg, {msg:"Loading..."});
            mask.show();
        }

        var titleText = (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)+' : ' );

        data = Util.nvl(data, []);
        //TotalCount 사용여부
        //2013-12-16 KHJ
        me.totalCountUse = Util.nvl(me.totalCountUse,true);
        if(data.length > 0)
        {
            if(me.totalCountUse){
                Ext.getCmp(me.id + "DataCount").setText(titleText + data.length);
            }
            me.store.loadData(data, Util.nvl(appendYn, false));
            me.getSelectionModel().select(me.store.first());
            me.lastSelectedRow = me.store.first();
            me.lastSelectedRowIdx = 0;
            //그리드 조회 후 관련있는 다른 그리드 조회해야 할 경우(헤더 조회 후 디테일 조회 같은 경우) 등.
            if(callbackFunc) callbackFunc(json, true);
        }
        else
        {
            if(me.totalCountUse){
                Ext.getCmp(me.id + "DataCount").setText(titleText + '0');
            }
            if(callbackFunc) callbackFunc(json, true);
        }

        if(!Util.isNull(mask))
        {
            mask.hide();
        }
    },

    /**
     * 신규 행 추가.
     * @param defaultSet 초기 값
     * @returns
     */
    addRow : function(defaultSet){
        var me = this;
        var newRow = Ext.create(me.idPrefix + 'Model', Util.nvl(defaultSet, {}));
        if(Util.nvl(me.editable, true) || Util.nvl(me.popEditable, false))
        {
            newRow.set('ROW_STATUS_TXT', Lang.get('INSERT'));
            newRow.set('ROW_STATUS', 'I');
        }
        me.store.insert(me.store.count(), newRow);
        me.getSelectionModel().select(newRow);
        me.lastSelectedRow = newRow;
        me.lastSelectedRowIdx = me.store.count() - 1;
        me.resetTitleText(null, me.store.count());
        return newRow;
    },

    /**
     * 신규 복제행 추가.
     * @param defaultSet 변경할 초기 값
     * @returns
     */
    dupRow : function(defaultSet){
        var me = this;

        var selectedRows = me.getSelectionModel().getSelection();
        var dupRows = [];
        if(selectedRows.length == 0) return false;
        //복제시 마지막 row or 복제된 row 선택 true : 복제된 ROW선택  false : 마지막 ROW선택 Default true
        var selectDupRows = Util.nvl(me.selectDupRows,true);
        var copy;
        var copyRow;
        var newRow = Ext.create(me.idPrefix + 'Model', Util.nvl(defaultSet, {}));
        for(var i=0; i < selectedRows.length; i++){
            copy = me.getSelectionModel().getSelection()[i].copy();
            copyRow = Ext.create(me.idPrefix + 'Model', Util.nvl(copy.data,{}));
            if(Util.nvl(me.editable, true) || Util.nvl(me.popEditable, false))
            {
                copyRow.set('ROW_STATUS_TXT', Lang.get('INSERT'));
                copyRow.set('ROW_STATUS', 'I');

                if(!Util.isNull(defaultSet)){
                    var dataCnt = 0;
                    for(var data in defaultSet){
                        copyRow.set(data,defaultSet[data]);
                    }
                }else{
                    copyRow.set('UPD_PERSON_ID', '');
                    copyRow.set('UPD_DATETIME', '');
                }
            }
            copyRow.modified = newRow.data;
            me.store.insert(me.store.count(), copyRow);
            if(selectDupRows) dupRows.push(copyRow);
        }
        if(selectDupRows){
            me.getSelectionModel().select(dupRows);
        }else{
            me.getSelectionModel().select(copyRow);
        }
        me.lastSelectedRow = copyRow;
        me.lastSelectedRowIdx = me.store.count() - 1;
        me.resetTitleText(null, me.store.count());
        return copyRow;
    },

    /**
     * 그리드 데이터 저장.
     * @param maskTrg 마스킹 대상
     * @param url 요청 url
     * @param params 추가 파라미터
     * @param callbackFunc 저장 성공 후 콜백 함수
     * @param onlyCallBackFunc 저장 성공 후 메시지 표시 여부
     * @returns {Boolean}
     */
    save : function(maskTrg, url, params, callbackFunc, onlyCallBackFunc){
        var me = this;

        var insertCnt = 0;
        var updateCnt = 0;
        var deleteCnt = 0;

        var validCheck = true;
        var addYn = false;
        var dataToSend = [];

        me.store.each(function(record){
            if(record.get('ROW_STATUS') == 'I') {insertCnt++; addYn = true;}
            if(record.get('ROW_STATUS') == 'U') {updateCnt++; addYn = true;}
            if(record.get('ROW_STATUS') == 'D') {deleteCnt++; addYn = true;}
            if(addYn)
            {
                var copyRecord = record.copy();
                //validation
                if(record.get('ROW_STATUS') != 'D')
                {
                    var ret = true;
                    for(colName in me.validator) {
                        var functions = me.validator[colName];
                        for(var n=0; n<functions.length; n++)
                        {
                            ret = me.validator[colName][n](me, record, me.gridHeaderNames[colName], record.get(colName), true);
                            if(ret !== true)
                            {
                                me.getSelectionModel().select(record);
                                me.lastSelectedRow = record;
                                Ext.MessageBox.show({
                                    title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                    msg: ret,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                                validCheck = false;
                                return false; //each() break;
                            }
                        }
                    }
                }
                //date 컬럼 언포멧
                for(colName in me.dateColumnsDateFormat)
                {
                    copyRecord.data[colName] = Ext.Date.dateFormat(record.data[colName], me.dateColumnsDateFormat[colName]);
                }
                dataToSend.push(copyRecord.data);
                addYn = false;
            }
        });

        //밸리데이션 실패시 중지
        if(!validCheck) return false;

        //저장할 것이 없으면
        if(insertCnt + updateCnt + deleteCnt == 0)
        {
            Ext.MessageBox.show({
                title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                msg: Lang.get('NO_DATA_TO_SAVE'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
        else
        {
            var msg = "";
            msg += "<table>";
            msg += "  <tr>";
            msg += "    <td>"+Lang.get('INSERT')+"</td><td>&nbsp;: "+insertCnt+"</td>";
            msg += "  </tr>";
            msg += "  <tr>";
            msg += "    <td>"+Lang.get('UPDATE')+"</td><td>&nbsp;: "+updateCnt+"</td>";
            msg += "  </tr>";
            msg += "  <tr>";
            msg += "    <td>"+Lang.get('DELETE')+"</td><td>&nbsp;: "+deleteCnt+"</td>";
            msg += "  </tr>";
            msg += "</table>";

            if(!me.confirmUse){


                //팝업 추가/수정 입력일 경우
                var popEditWin = Ext.getCmp(me.id + 'PopEditWin');
                if(!Util.isNull(popEditWin) && !popEditWin.isHidden()) popEditWin.close();

                var gridMask = new Ext.LoadMask(maskTrg, {msg:"Please wait..."});
                gridMask.show();
                params = Util.nvl(params, {});
                params.CURRENT_MENUCODE = CURRENT_MENUCODE;
                Ext.Ajax.request({
                    url : url,
                    jsonData : {
                        DS_SAVE : dataToSend
                    },
                    params : params,
                    callback : function(options, success, response){
                        gridMask.hide();
                        var json = Ext.decode(response.responseText);
                        if(json["ErrorMsg"] === "OK")
                        {
                            if(!Util.nvl(onlyCallBackFunc, false))
                            {
                                Ext.MessageBox.show({
                                    title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                    msg: json["SuccessMsg"],
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    fn : function(){
                                        if(callbackFunc) callbackFunc(json, true);
                                    }
                                });
                            }
                            else
                            {
                                if(callbackFunc) callbackFunc(json, true);
                            }
                        }
                        else
                        {
                            Ext.MessageBox.show({
                                title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                msg: Lang.get(json["ErrorMsg"]),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR,
                                fn : function(){
                                    //if(callbackFunc) callbackFunc(json, false);
                                }
                            });
                        }
                    }
                });

//              //팝업 추가/수정 입력일 경우
//              var popEditWin = Ext.getCmp(me.id + 'PopEditWin');
//              if(!Util.isNull(popEditWin) && !popEditWin.isHidden()) {
//                  //추가일 경우
//                  if(Util.isNull(me.currentFormEditingTrgRecord))
//                  {
//                      me.store.remove(me.currentFormEditingRecord);
//                  }
//                  //수정일 경우
//                  else
//                  {
//                      //me.currentFormEditingOrgRecord.reject(); //이렇게 하면 date 타입 데이터 이상하게 된다.
//                      for(var n=0; n<me.fieldsToBindGrid.length; n++)
//                      {
//                          me.currentFormEditingTrgRecord.set(me.fieldsToBindGrid[n], me.currentFormEditingOrgRecord.get(me.fieldsToBindGrid[n]));
//                      }
//                      me.currentFormEditingTrgRecord.set('ROW_DELETE', me.currentFormEditingOrgRecord.get('ROW_DELETE'));
//                      me.currentFormEditingTrgRecord.set('ROW_STATUS', me.currentFormEditingOrgRecord.get('ROW_STATUS'));
//                      me.currentFormEditingTrgRecord.set('ROW_STATUS_TXT', me.currentFormEditingOrgRecord.get('ROW_STATUS_TXT'));
//                  }
//              }

            }else{
                Ext.MessageBox.confirm((Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)), msg, function(btn){
                    if(btn == "yes")
                    {
                        //팝업 추가/수정 입력일 경우
                        var popEditWin = Ext.getCmp(me.id + 'PopEditWin');
                        if(!Util.isNull(popEditWin) && !popEditWin.isHidden()) popEditWin.close();

                        var gridMask = new Ext.LoadMask(maskTrg, {msg:"Please wait..."});
                        gridMask.show();
                        params = Util.nvl(params, {});
                        params.CURRENT_MENUCODE = CURRENT_MENUCODE;
                        Ext.Ajax.request({
                            url : url,
                            jsonData : {
                                DS_SAVE : dataToSend
                            },
                            params : params,
                            callback : function(options, success, response){
                                gridMask.hide();
                                var json = Ext.decode(response.responseText);
                                if(json["ErrorMsg"] === "OK")
                                {
                                    if(!Util.nvl(onlyCallBackFunc, false))
                                    {
                                        Ext.MessageBox.show({
                                            title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                            msg: json["SuccessMsg"],
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO,
                                            fn : function(){
                                                if(callbackFunc) callbackFunc(json, true);
                                            }
                                        });
                                    }
                                    else
                                    {
                                        if(callbackFunc) callbackFunc(json, true);
                                    }
                                }
                                else
                                {
                                    Ext.MessageBox.show({
                                        title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                        msg: Lang.get(json["ErrorMsg"]),
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        fn : function(){
                                            //if(callbackFunc) callbackFunc(json, false);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    else
                    {
                        //팝업 추가/수정 입력일 경우
                        var popEditWin = Ext.getCmp(me.id + 'PopEditWin');
                        if(!Util.isNull(popEditWin) && !popEditWin.isHidden()) {
                            //추가일 경우
                            if(Util.isNull(me.currentFormEditingTrgRecord))
                            {
                                me.store.remove(me.currentFormEditingRecord);
                            }
                            //수정일 경우
                            else
                            {
                                //me.currentFormEditingOrgRecord.reject(); //이렇게 하면 date 타입 데이터 이상하게 된다.
                                for(var n=0; n<me.fieldsToBindGrid.length; n++)
                                {
                                    me.currentFormEditingTrgRecord.set(me.fieldsToBindGrid[n], me.currentFormEditingOrgRecord.get(me.fieldsToBindGrid[n]));
                                }
                                me.currentFormEditingTrgRecord.set('ROW_DELETE', me.currentFormEditingOrgRecord.get('ROW_DELETE'));
                                me.currentFormEditingTrgRecord.set('ROW_STATUS', me.currentFormEditingOrgRecord.get('ROW_STATUS'));
                                me.currentFormEditingTrgRecord.set('ROW_STATUS_TXT', me.currentFormEditingOrgRecord.get('ROW_STATUS_TXT'));
                            }
                        }
                    }
                });
            }
        }
    },

    /**
     * 저장 후 콜백함수 호출(조회 함수를 콜백함수로 넣도록 이름을 이렇게 지었음)
     * @param maskTrg 마스킹 대상
     * @param url 요청 url
     * @param params 추가 파라미터
     * @param callFunc 저장 후
     * @param confirmYn 재조회할지 묻기 여부
     */
    saveAndSearch : function(maskTrg, url, params, callFunc, confirmYn){
        var me = this;
        me.save(maskTrg, url, params, function(result, successYn){
            if(successYn) {
                if(confirmYn)
                {
                    Ext.MessageBox.confirm((Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)), Lang.get('CONFIRM_RESEARCH'), function(btn){
                        if(btn == "yes") {
                            callFunc(result, successYn);
                        }
                        else {
                            me.commit();
                        }
                    });
                }
                else
                {
                    callFunc(result, successYn);
                }
            }
        }, false);
    },

    /**
     * 조건으로 행 반환
     */
    getFilteredRows : function(filterCondition, validCheckYn, infoNoDataYn, forExcelAndReport){
        var me = this;
        var cancelWork = false;
        var validCheck = true;
        var dataToSend = [];
        me.store.each(function(record){
            var filterResult = filterCondition(record);
            if(filterResult === 'BREAK') {
                cancelWork = true;
                return false;
            }
            else if(filterResult === true)
            {
                var copyRecord = record.copy();
                //validation
                var ret = true;
                if(Util.nvl(validCheckYn, true)) {
                    for(colName in me.validator) {
                        var functions = me.validator[colName];
                        for(var n=0; n<functions.length; n++)
                        {
                            ret = me.validator[colName][n](me, record, me.gridHeaderNames[colName], record.get(colName), true);
                            if(ret !== true)
                            {
                                me.getSelectionModel().select(record);
                                me.lastSelectedRow = record;
                                Ext.MessageBox.show({
                                    title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                                    msg: ret,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                                validCheck = false;
                                return false; //each() break;
                            }
                        }
                    }
                }
                //엑셀 다운이나 리포트 출력일 경우
                if(Util.nvl(forExcelAndReport, false))
                {
                    //date 컬럼 렌더 포멧 그대로
                    for(colName in me.dateColumnsRenderFormat)
                    {
                        copyRecord.data[colName] = Ext.Date.dateFormat(record.data[colName], me.dateColumnsRenderFormat[colName]);
                    }
                    //체크박스 컬럼 YN 으로 변환
                    for(var n=0; n<me.checkboxColumns.length; n++){
                        copyRecord.data[me.checkboxColumns[n]] = record.data[me.checkboxColumns[n]] == true ? 'Y' : 'N';
                    }
                    //콤보박스 컬럼 displayField 값으로 변환
                    for(colName in me.comboboxDisplayFields)
                    {
                        var comboStore = me.comboColumnStore[colName];
                        var comboDisplayField = me.comboboxDisplayFields[colName];
                        var comboValueField = me.comboboxValueFields[colName];
                        var value =  record.data[colName];

                        var comboRecord = comboStore.findRecord(comboValueField, value, 0, false, true, true);
                        copyRecord.data[colName] = Util.isNull(comboRecord) ? value : Util.nvl(comboRecord.get(comboDisplayField), value);
                    }
                }
                else
                {
                    //date 컬럼 언포멧
                    for(colName in me.dateColumnsDateFormat)
                    {
                        copyRecord.data[colName] = Ext.Date.dateFormat(record.data[colName], me.dateColumnsDateFormat[colName]);
                    }
                }
                dataToSend.push(copyRecord.data);
            }
        });

        //특정한 조건에 의해 취소될 경우.
        if(cancelWork)
        {
            return false;
        }
        //밸리데이션 실패면
        else if(Util.nvl(validCheckYn, true) && !validCheck)
        {
            return false;
        }
        //저장할 것이 없으면
        else if(dataToSend.length == 0)
        {
            if(Util.nvl(infoNoDataYn, false))
            {
                Ext.MessageBox.show({
                    title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                    msg: Lang.get('NO_ROW_SELECTED'),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
            return false;
        }
        //필터링된 데이터 반환.
        else
        {
            return dataToSend;
        }
    },

    /**
     * 선택 행 데이터를 서버에 보내 작업 수행
     * @param maskTrg 마스킹 대상
     * @param url 요청 url
     * @param params 추가 파라미터
     * @param callbackFunc 작업 수행 완료 후 콜백 함수
     * @param onlyCallBackFunc 작업 수행 성공 메시지 표시 여부
     * @param options
     *        FILTER_FUNCTION - 대상 행 선택 방법 정의 함수
     *        APPLY_VALIDATOR - 대상 행 선택시 validator 적용 여부
     *        INFO_NOTRGDATA  - 대상 행 없을 경우 알림 여부
     *        FORCE_CALLBACK  - 대상 행 없을 경우 콜백 함수 강제 호출 여부
     *        FORCE_REQUEST   - 대상 행 갯수 알림 없이 실행 여부 묻지 않고 강제로 실행 여부
     */
    action : function(maskTrg, url, params, callbackFunc, onlyCallBackFunc, options){
        var me = this;

        var filterCondition = Util.isNull(options) ? null : options.FILTER_FUNCTION;
        var validCheckYn    = Util.isNull(options) ? true : Util.nvl(options.APPLY_VALIDATOR, true);
        var infoNoDataYn    = Util.isNull(options) ? true : Util.nvl(options.INFO_NOTRGDATA, true);
        var forceCallFunc   = Util.isNull(options) ? false : Util.nvl(options.FORCE_CALLBACK, false);
        var forceRequest    = Util.isNull(options) ? false : Util.nvl(options.FORCE_REQUEST, false);

        var dataToSend = false;
        if(!Util.isNull(filterCondition)) {
            dataToSend = me.getFilteredRows(filterCondition, Util.nvl(validCheckYn,true), Util.nvl(infoNoDataYn, false));
        }else{
            dataToSend = me.getFilteredRows(function(record){
                return me.getSelectionModel().isSelected(record);
            }, Util.nvl(validCheckYn,true), Util.nvl(infoNoDataYn, false));
        }

        //저장할 것이 없으면
        if(dataToSend === false)
        {
            //강제로 콜백함수 호출할 경우. (예를 들어 작업 대상이 없지만 다시 조회하고자 할 경우)
            if(callbackFunc && forceCallFunc) callbackFunc();
        }
        else
        {
            var msg = "";
            msg += "<table>";
            msg += "  <tr>";
            msg += "    <td style='padding:2px;'>"+Lang.get('ACT_TRG_LIST_CNT')+"</td><td>&nbsp;: "+dataToSend.length+"</td>";
            msg += "  </tr>";
            msg += "</table>";

            if(!Util.nvl(forceRequest, false)) {
                Ext.MessageBox.confirm((Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)), msg, function(btn){
                    if(btn == "yes")
                    {
                        me.actionRequest(maskTrg, url, params, dataToSend, callbackFunc, onlyCallBackFunc);
                    }
                });
            }
            else
            {
                me.actionRequest(maskTrg, url, params, dataToSend, callbackFunc, onlyCallBackFunc);
            }
        }
    },

    /**
     * action 에서 호출.
     */
    actionRequest : function(maskTrg, url, params, dataToSend, callbackFunc, onlyCallBackFunc){
        var me = this;
        var gridMask = new Ext.LoadMask(maskTrg, {msg:"Please wait..."});
        gridMask.show();
        params = Util.nvl(params, {});
        params.CURRENT_MENUCODE = CURRENT_MENUCODE;
        Ext.Ajax.request({
            url : url,
            jsonData : {
                DS_SAVE : dataToSend
            },
            params : params,
            callback : function(options, success, response){
                gridMask.hide();
                var json = Ext.decode(response.responseText);
                if(json["ErrorMsg"] === "OK")
                {
                    if(!Util.nvl(onlyCallBackFunc, false))
                    {
                        Ext.MessageBox.show({
                            title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                            msg: json["SuccessMsg"],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            fn : function(){
                                if(callbackFunc) callbackFunc(json, true);
                            }
                        });
                    }
                    else
                    {
                        if(callbackFunc) callbackFunc(json, true);
                    }
                }
                else
                {
                    Ext.MessageBox.show({
                        title: (Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)),
                        msg: Lang.get(json["ErrorMsg"]),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        fn : function(){
                            //if(callbackFunc) callbackFunc(json, false);
                        }
                    });
                }
            }
        });
    },

    /**
     * 작업 수행 후 콜백 함수 호출((조회 함수를 콜백함수로 넣도록 이름을 이렇게 지었음)
     * @param maskTrg 마스킹 대상
     * @param url 요청 url
     * @param params 추가 파라미터
     * @param callFunc 콜백 함수
     * @param confirmYn 재조회할지 묻기 여부
     */
    actionAndSearch : function(maskTrg, url, params, callFunc, confirmYn, options){
        var me = this;
        me.action(maskTrg, url, params, function(result, successYn){
            if(successYn) {
                if(confirmYn)
                {
                    Ext.MessageBox.confirm((Util.isNull(me.titleText) ? '' : Lang.get(me.titleText)), Lang.get('CONFIRM_RESEARCH'), function(btn){
                        if(btn == "yes") {
                            callFunc();
                        }
                        else {
                            //me.commit();
                        }
                    });
                }
                else
                {
                    callFunc();
                }
            }
        }, false, options);
    },

    /**
     * 선택 여부
     * @param record
     */
    isSelectedRecord : function(record) {
        var me = this;
        return me.getSelectionModel().isSelected(record);
    },

    /**
     * 그리드의 컬럼 객체 가져오기
     * @param colName
     */
    getGridColumn : function(colName) {
        var me = this;
        var gridColumns = me.headerCt.getGridColumns();
        for(var n=0; n<gridColumns.length; n++) {
            var column = gridColumns[n];
            if(column.dataIndex == colName)
            {
                return column;
            }
        }
    },

    /**
     * 그리드의 컬럼 보이기/숨기기
     * @param colName
     */
    setColumnVisible : function(colName, visible) {
        var me = this;
        var gridColumns = me.headerCt.getGridColumns();
        for(var n=0; n<gridColumns.length; n++) {
            var column = gridColumns[n];
            if(column.dataIndex == colName)
            {
                column.setVisible(visible);
                break;
            }
        }
    },

    /**
     * 그리드의 컬럼 사이즈
     * @param colName
     */
    setColumnWidth : function(colName, width) {
        var me = this;
        var gridColumns = me.headerCt.getGridColumns();
        for(var n=0; n<gridColumns.length; n++) {
            var column = gridColumns[n];
            if(column.dataIndex == colName)
            {
                column.setWidth(width);
                break;
            }
        }
    },

    /**
     * popup 타입 컬럼에서 값 직접 수정 가능 여부
     * @param colName
     * @param editable
     */
    setColumnEditable : function(colName, editable) {
        var me = this;
        if(me.editForm) {
            var field = me.editForm.getForm().findField(colName);
            field.setEditable(editable);
        }else {
            var column = me.getGridColumn(colName);
            if(!Util.isNull(column)) {
                column.getEditor().setEditable(editable);
            }
        }
    },

    /**
     * 컬럼 disabled 설정
     * @param colName
     * @param disabled
     */
    setColumnDisabled : function(colName, disabled) {
        var me = this;
        if(me.editForm) {
            var field = me.editForm.getForm().findField(colName);
            field.setDisabled(disabled);
        }else{
            var column = me.getGridColumn(colName);
            if(!Util.isNull(column)) {
                column.getEditor().setDisabled(disabled);
            }
        }
    },

    /**
     * 컬럼 readonly 설정
     * @param colName
     * @param readOnly
     */
    setColumnReadOnly : function(colName, readOnly) {
        var me = this;
        if(me.editForm) {
            var field = me.editForm.getForm().findField(colName);
            field.setReadOnly(readOnly);
        }else{
            var column = me.getGridColumn(colName);
            if(!Util.isNull(column)) {
                column.getEditor().setReadOnly(readOnly);
            }
        }
    },

    /**
     * popup 타입 컬럼에서 트리거 숨기기 여부
     * @param colName
     * @param hide
     */
    setColumnHideTrigger : function(colName, hide) {
        var me = this;
        if(me.editForm) {
            var field = me.editForm.getForm().findField(colName);
            field.setHideTrigger(hide);
        }else{
            var column = me.getGridColumn(colName);
            if(!Util.isNull(column)) {
                column.getEditor().setHideTrigger(hide);
            }
        }
    },

    /**
     * 가장 나중에 선택한 행의 특정 컬럼 값 가져오기.
     */
    getSelectedRowData : function(colName, fromForm){
        var me = this;
        if(me.editForm && Util.nvl(fromForm, true)) {
            return me.editForm.getForm().findField(colName).getValue();
        }else if(Util.isNull(me.lastSelectedRow)) {
            return null;
        }else{
            return me.lastSelectedRow.data[colName];
        }
    },

    /**
     * 가장 나중에 선택한 행의 특정 컬럼 값 변경
     */
    setSelectedRowData : function(colName, value) {
        var me = this;
        if(me.editForm) {
            me.editForm.getForm().findField(colName).setValue(value);
        }else if(!Util.isNull(me.lastSelectedRow)) {
            me.lastSelectedRow.set(colName, value);
        }
    },

    /**
     * 선택된 모든 행의 특정 컬럼 값 가져오기.
     */
    getAllSelectedRowData : function(colName){
        var me = this;
        var selectedRows = me.getSelectionModel().getSelection();
        var values = [];
        if(selectedRows)
        {
            for(var n=0; n<selectedRows.length; n++)
            {
                if(colName)
                {
                    values.push(Util.nvl(selectedRows[n].data[colName], null));
                }
                else
                {
                    values.push(selectedRows[n]);
                }
            }
        }
        return values;
    },
    /**
     * 선택된 모든 행의 특정 컬럼 값 가져오기. 여러 개 선택된 경우 배열로 반환.
     */
    getAllSelectedRowData2 : function(colName){
        var me = this;
        var selectedRows = me.getSelectionModel().getSelection();
        if(selectedRows)
        {
            var values = [];
            for(var n=0; n<selectedRows.length; n++)
            {
                if(colName)
                {
                    values.push(Util.nvl(selectedRows[n].data[colName], null));
                }
                else
                {
                    values.push(selectedRows[n]);
                }
            }
            if(values.length == 0) {
                return null;
            }else{
                return values;
            }
        }
        else
        {
            return null;
        }
    },

    /**
     * 레코드 데이터를 복사해서 반환
     */
    copyRowData : function(record){
        var me = this;
        var ret = {};
        for(var n=0; n<me.columnDefine.length; n++)
        {
            var colName = Util.nvl(me.columnDefine[n].colName, me.columnDefine[n].header);
            ret[colName] = record.get(colName);
        }
        return ret;
    },

    /**
     * 선택한 행 갯수
     */
    selectedRowCount : function(){
        var me = this;
        var selectedRows = me.getSelectionModel().getSelection();
        return selectedRows.length;
    },

    /**
     * 지정한 상태의 데이터 행 갯수 반환
     * @param rowStatus I,U,D 조합
     */
    rowCount : function(rowStatus){
        var me = this;
        if(Util.isNull(rowStatus)) {
            return me.store.count();
        }
        var cnt = 0;
        me.store.each(function(record){
            if(rowStatus.indexOf(record.get('ROW_STATUS')) >= 0) {
                cnt++;
            }
        });
        return cnt;
    },

    /**
     * 지정한 행의 특정 컬럼 값 가져오기.
     * @param rowIdx 행 인덱스
     * @param colName 컬럼 명
     * @returns
     */
    getValue : function(rowIdx, colName){
        var me = this;
        var ret = null;
        try{
            ret = me.store.getAt(rowIdx).get(colName);
        }catch(e){
            console.log('CommonGrid.js : ' + e);
        }
        return ret;
    },

    /**
     * 지정한 행의 특정 컬럼 값 변경
     * @param rowIdx 행 인덱스
     * @param colName 컬럼 명
     * @param value 변경할 값
     */
    setValue : function(rowIdx, colName, value){
        var me = this;
        try{
            me.store.getAt(rowIdx).set(colName, value);
        }catch(e){
            console.log('CommonGrid.js : ' + e);
        }
    },

    /**
     * 그리드 데이터 초기화
     */
    reset : function(){
        var me = this;
        me.store.removeAll();
        me.resetTitleText();
        if(me.pageSize) {
            me.resetPageData();
        }
    },

    /**
     * 버튼 활성/비활성화
     */
    enableBtn : function(bool){
        var me = this;
        var buttons = me.query('button');
        for(var n=0; n<buttons.length; n++)
        {
            if(bool) buttons[n].enable();
            else buttons[n].disable();
        }
    },

    /**
     * 그리드 데이터 편집 상태를 읽기 상태로 변경
     */
    commit : function(){
        var me = this;
        var deleteList = [];
        me.store.each(function(record){
            if(record.get('ROW_STATUS') == 'D') {
                deleteList.push(record);
            }
            else{
                record.set('ROW_STATUS', 'R');
                record.set('ROW_STATUS_TXT', '');
            }
        });
        for(var n=0; n<deleteList.length; n++)
        {
            me.store.remove(deleteList[n]);
        }
        me.store.commitChanges();
    },

    commitSelectedRow : function(){
        var me = this;
        me.lastSelectedRow.set('ROW_STATUS', 'R');
        me.lastSelectedRow.set('ROW_STATUS_TXT', '');
        me.lastSelectedRow.commit();
    },


    /**
     * 페이지 네비게이터 생성
     */
    getPagingItems : function(){
        var me = this;

        me.paging = Util.nvl(me.paging, {});

        me.paging.rowsPerPageText = Lang.get('PAGING_ROWS_PER_PAGE'); //'Rows per page : ';
        me.paging.currentPageText = Lang.get('PAGING_CURRENT_PAGE'); //'Current Page : ';
        me.paging.afterPageText = Lang.get('PAGING_NAVI_TEXT'); //' / {0} Page';
        me.paging.firstText = Lang.get('PAGING_FIRST_PAGE'); //'First Page';
        me.paging.prevText = Lang.get('PAGING_PREVIOUS_PAGE'); //'Previous Page';
        me.paging.nextText = Lang.get('PAGING_NEXT_PAGE'); //'Next Page';
        me.paging.lastText = Lang.get('PAGING_LAST_PAGE'); //'Last Page';
        me.paging.currentPage = 1;

        return [
        {
            xtype: 'tbtext',
            text: me.paging.rowsPerPageText
        },
        {
            xtype: 'numberfield',
            id: me.id + 'PageSize',
            cls: Ext.baseCSSPrefix + 'tbar-page-number',
            allowDecimals: false,
            //hideTrigger: true,
            enableKeyEvents: true,
            keyNavEnabled: false,
            //selectOnFocus: true,
            submitValue: false,
            isFormField: false,
            disabled: true,
            width: 70,
            margins: '-1 2 3 2',
            validator : function(value){
                if(value < 1) return Lang.getRep('MSG_MIN_VALUE', [0]);
                else return true;
            },
            listeners: {
                scope: me,
                keydown: me.onPageSizeKeyDown,
                blur: me.onPageSizeBlur
            }
        },
        '-',
        {
            xtype: 'tbtext',
            text: me.paging.currentPageText
        },
        {
            xtype: 'numberfield',
            id: me.id + 'CurrentPage',
            cls: Ext.baseCSSPrefix + 'tbar-page-number',
            height : 20,
            allowDecimals: false,
            //hideTrigger: true,
            enableKeyEvents: true,
            keyNavEnabled: false,
            //selectOnFocus: true,
            submitValue: false,
            isFormField: false,
            disabled: true,
            width: 70,
            margins: '-1 2 3 2',
            validator : function(value){
                if(value < 1) return Lang.getRep('MSG_MIN_VALUE', [0]);
                else return true;
            },
            listeners: {
                scope: me,
                keydown: me.onPagingKeyDown,
                blur: me.onPagingBlur
            }
        },{
            xtype: 'tbtext',
            id: me.id + 'TotalPage',
            text: Ext.String.format(me.paging.afterPageText, 0)
        },
        '-',
        {
            id: me.id + 'FirstPage',
            tooltip: me.paging.firstText,
            overflowText: me.paging.firstText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
            disabled: true,
            handler: me.moveFirst,
            scope: me
        },{
            id: me.id + 'PrevPage',
            tooltip: me.paging.prevText,
            overflowText: me.paging.prevText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
            disabled: true,
            handler: me.movePrevious,
            scope: me
        },
        {
            id: me.id + 'NextPage',
            tooltip: me.paging.nextText,
            overflowText: me.paging.nextText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
            disabled: true,
            handler: me.moveNext,
            scope: me
        },{
            id: me.id + 'LastPage',
            tooltip: me.paging.lastText,
            overflowText: me.paging.lastText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
            disabled: true,
            handler: me.moveLast,
            scope: me
        }];
    },

    /**
     * 페이징 관련. private.
     */
    initPageData : function(totalCnt) {
        var me = this;
        me.paging.totalCount = totalCnt;
        me.store.firstNumberOfPage = 1;
        me.paging.lastPageSize = Util.nvl(me.paging.lastPageSize, me.pageSize);
        Ext.getCmp(me.id + 'PageSize').enable();
        Ext.getCmp(me.id + 'PageSize').setValue(me.paging.lastPageSize);
        Ext.getCmp(me.id + 'CurrentPage').enable();
        me.getPageData(1);
    },

    /**
     * 페이징 관련. private.
     */
    getPageData : function(pageNum){
        var me = this;
        me.paging.pageCount = Math.ceil(me.paging.totalCount / me.paging.lastPageSize);
        me.paging.currentPage = pageNum;
        me.paging.fromRecord = ((me.paging.currentPage - 1) * me.paging.lastPageSize) + 1;
        me.paging.toRecord = Math.min(me.paging.currentPage * me.paging.lastPageSize, me.paging.totalCount);
        Ext.getCmp(me.id + 'FirstPage').setDisabled(me.paging.currentPage <= 1);
        Ext.getCmp(me.id + 'PrevPage').setDisabled(me.paging.currentPage <= 1);
        Ext.getCmp(me.id + 'NextPage').setDisabled(me.paging.currentPage == me.paging.pageCount);
        Ext.getCmp(me.id + 'LastPage').setDisabled(me.paging.currentPage == me.paging.pageCount);
        Ext.getCmp(me.id + 'TotalPage').setText(Ext.String.format(me.paging.afterPageText, me.paging.pageCount));
        Ext.getCmp(me.id + 'CurrentPage').setValue(pageNum);
    },

    /**
     * 페이징 관련. private.
     */
    resetPageData : function(){
        var me = this;
        me.paging.totalCount = 0;
        me.store.firstNumberOfPage = 1;
        Ext.getCmp(me.id + 'PageSize').disable();
        Ext.getCmp(me.id + 'CurrentPage').disable();
        Ext.getCmp(me.id + 'CurrentPage').setValue('');
        Ext.getCmp(me.id + 'TotalPage').setText(Ext.String.format(me.paging.afterPageText, 0));
        Ext.getCmp(me.id + 'FirstPage').setDisabled(true);
        Ext.getCmp(me.id + 'PrevPage').setDisabled(true);
        Ext.getCmp(me.id + 'NextPage').setDisabled(true);
        Ext.getCmp(me.id + 'LastPage').setDisabled(true);
    },

    /**
     * 페이징 관련. private.
     */
    moveFirst : function(){
        var me = this;
        me.loadPage(1);
    },

    /**
     * 페이징 관련. private.
     */
    movePrevious : function(){
        var me = this;
        me.loadPage(me.paging.currentPage - 1);
    },

    /**
     * 페이징 관련. private.
     */
    onPagingKeyDown : function(field, e){
        var me = this;
        var k = e.getKey();
        var increment = e.shiftKey ? 10 : 1;
        var allowKeys = [e.LEFT, e.RIGHT, e.DELETE, e.BACKSPACE];

        var v = Ext.getCmp(me.id + 'CurrentPage').getValue();
        var pageNum = parseInt(v, 10);
        var validVal = true;

        if ( !v || isNaN(pageNum)) {
            validVal = false;
        }

        if (k == e.RETURN) {
            e.stopEvent();
            //TO DO : 로딩중에 엔터 치면 계속 먹힌다. 로딩 중에는 안먹히게 해야할텐데?
            if(validVal) {
                if(pageNum < 0 || pageNum > me.paging.pageCount) Ext.getCmp(me.id + 'CurrentPage').setValue(me.paging.currentPage);
                else me.loadPage(pageNum);
            }
        } else if (k == e.HOME || k == e.END) {
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : me.paging.pageCount;
            field.setValue(pageNum);
        } else if (k == e.UP || k == e.PAGE_UP || k == e.DOWN || k == e.PAGE_DOWN) {
            e.stopEvent();
            if (validVal) {
                if (k == e.DOWN || k == e.PAGE_DOWN) {
                    increment *= -1;
                }
                pageNum += increment;
                if (pageNum >= 1 && pageNum <= me.paging.pageCount) {
                    field.setValue(pageNum);
                }
            }
        }
        //else if( !(k >= 48 && k <= 57) && !(k >=96 && k <= 105) && !Ext.Array.contains(allowKeys, k)){
        //    e.stopEvent();
        //}
    },

    /**
     * 페이징 관련. private.
     */
    onPagingBlur : function(){
        var me = this;
        Ext.getCmp(me.id + 'CurrentPage').setValue(me.paging.currentPage);
    },

    /**
     * 페이징 관련. private.
     */
    onPageSizeKeyDown : function(field, e){
        var me = this;
        var k = e.getKey();
        var increment = e.shiftKey ? 10 : 1;
        var allowKeys = [e.LEFT, e.RIGHT, e.DELETE, e.BACKSPACE];

        var v = Ext.getCmp(me.id + 'PageSize').getValue();
        var pageSize = parseInt(v, 10);
        var validVal = true;

        if ( !v || isNaN(pageSize)) {
            validVal = false;
        }

        if (k == e.RETURN) {
            e.stopEvent();
            if(validVal) {
                me.paging.lastPageSize = pageSize;
                me.loadPage(1);
            }
        } else if (k == e.HOME || k == e.END) {
            e.stopEvent();
            pageSize = k == e.HOME ? 1 : me.paging.totalCount;
            field.setValue(pageSize);
        } else if (k == e.UP || k == e.PAGE_UP || k == e.DOWN || k == e.PAGE_DOWN) {
            e.stopEvent();
            if (validVal) {
                if (k == e.DOWN || k == e.PAGE_DOWN) {
                    increment *= -1;
                }
                pageSize += increment;
                if (pageSize >= 1 && pageSize <= me.paging.totalCount) {
                    field.setValue(pageSize);
                }
            }
        }
        //else if( !(k >= 48 && k <= 57) && !(k >=96 && k <= 105) && !Ext.Array.contains(allowKeys, k)){
        //    e.stopEvent();
        //}
    },

    /**
     * 페이징 관련. private.
     */
    onPageSizeBlur : function(){
        var me = this;
        Ext.getCmp(me.id + 'PageSize').setValue(me.paging.lastPageSize);
    },

    /**
     * 페이징 관련. private.
     */
    moveNext : function(){
        var me = this;
        me.loadPage(me.paging.currentPage + 1);
    },

    /**
     * 페이징 관련. private.
     */
    moveLast : function(){
        var me = this;
        me.loadPage(me.paging.pageCount);
    },

    /**
     * 페이징 관련. private.
     */
    loadPage : function(pageNum){
        var me = this;
        me.getPageData(pageNum);
        me.store.firstNumberOfPage = me.paging.fromRecord; //gridrownumber 에서 씀
        if(me.paging.onLoadPage) {
            me.paging.onLoadPage(me.paging.params); //그리드 팝업 입력 컬럼의 팝업 창 그리드에서 씀
        }
        else{
            me.search(me.paging.maskTrg, me.paging.searchUrl, me.paging.params, false, me.paging.callbackFunc);
        }
    },

    /**
     * 팝업창에서 그리드 데이터 추가, 수정하기.
     */
    popEditWin : function(record){
        var me = this;

        //폼 입력 창 열기
        var editForm = me.createForm( (Util.isNull(record) ? 'I' : 'U'), record);
        Ext.create('widget.window', {
            title: Util.nvl(Lang.get(me.titleText), CURRENT_MENUNAME_LANG) + ' ' + (Util.isNull(record) ? Lang.get('INSERT') : Lang.get('UPDATE')),
            id : me.id + 'PopEditWin',
            constrainHeader: true,
            autoShow : true,
            closable: true,
            modal : true,
            border : 1,
            //수정작업
            minWidth : Util.nvl(me.popEditWinConfig.minWidth, 355),
            width : Util.nvl(me.popEditWinConfig.fullYn, true) ? window.document.body.offsetWidth : Util.nvl(me.popEditWinConfig.width, window.document.body.offsetWidth/2),
            height: Util.nvl(me.popEditWinConfig.fullYn, true) ? window.document.body.offsetHeight : Util.nvl(me.popEditWinConfig.height, window.document.body.offsetHeight/2) ,
            fullYn : Util.nvl(me.popEditWinConfig.fullYn, true),
            layout : 'fit',
            items : [
                editForm
            ],
            listeners : {
                beforeclose : function(win){
                    viewPort.removeListener('resize', win.onViewPortResize);
                },
                close : function(){
                    me.editForm = null;
                },
                afterrender : function(win){
                    viewPort.addListener('resize', win.onViewPortResize);
                }
            },
            tools:[
                {
                   xtype : 'tool',
                   id: me.id + 'PopEditWinButton',
                   type: Util.nvl(me.popEditWinConfig.fullYn, true) == true ? 'restore' : 'maximize',
                   handler : function(){
                       Ext.getCmp(me.id + 'PopEditWin').doResize();
                   }
                }
            ],
            onViewPortResize : function(){
                var win = Ext.getCmp(me.id + 'PopEditWin');
                win.fullYn = false;
                win.doResize();
            },
            doResize : function(){
                var win = this;
                if(!win.fullYn){
                   win.setX(0);
                   win.setY(0);
                   win.setWidth(window.document.body.offsetWidth);
                   win.setHeight(window.document.body.offsetHeight);
                   win.fullYn = true;
                   Ext.getCmp(me.id + 'PopEditWinButton').setType('restore');
                }else{
                   win.setX((window.document.body.offsetWidth)/2 - Util.nvl(me.popEditWinConfig.width, window.document.body.offsetWidth/2)/2);
                   win.setY((window.document.body.offsetHeight)/2 - Util.nvl(me.popEditWinConfig.height, window.document.body.offsetHeight/2)/2);
                   win.setWidth(Util.nvl(me.popEditWinConfig.width, window.document.body.offsetWidth/2));
                   win.setHeight(Util.nvl(me.popEditWinConfig.height, window.document.body.offsetHeight/2));
                   win.fullYn = false;
                   Ext.getCmp(me.id + 'PopEditWinButton').setType('maximize');
                }
            }
        });
    },

    /**
     * 그리드 컬럼 설정으로 폼 만들기
     */
    createForm : function(IU, record, directBind){
        var me = this;
        //폼 필드 값과 바인딩용 레코드 생성. 값 반영시 그리드 레코드에 이 레코드의 값을 복사해 넣음.
        if(Util.isNull(record))
        {
            me.currentFormEditingTrgRecord = null;
            me.currentFormEditingOrgRecord = null;
            newRow = Ext.create(me.idPrefix + 'Model');
            newRow.set('ROW_STATUS_TXT', Lang.get('INSERT'));
            newRow.set('ROW_STATUS', 'I');
            me.currentFormEditingRecord = newRow;
        }
        else
        {
            //원본 그리드 레코드
            me.currentFormEditingTrgRecord = record;
            //원본 그리드 레코드 변경 후 저장 확인 메시지에서 취소시 다시 돌려놓기 위함.
            me.currentFormEditingOrgRecord = record.copy();
            Ext.data.Model.id(me.currentFormEditingOrgRecord);
            //폼 값 변경시 같이 변경되는 레코드. 원본 그리드 레코드 변경 위함.
            if(Util.nvl(directBind, false))
            {
                me.currentFormEditingRecord = record;
            }
            else
            {
                me.currentFormEditingRecord = record.copy();
                Ext.data.Model.id(me.currentFormEditingRecord);
            }
        }
        var defaultColumnsCnt = Util.nvl(me.popEditWinConfig.columnsCnt, 2); //열 갯수
        var recordStatus = 'I';
        if(!Util.isNull(record))
        {
            recordStatus = record.get('ROW_STATUS') == 'I' ? 'I' : 'U';
        }
        var fields = me.getEditFormFields(recordStatus);
        var items = [];
        if(me.popEditFieldset)
        {
            var fieldsByName = [];
            for(var f=0; f<fields.length; f++)
            {
                fieldsByName[fields[f].name] = fields[f];
            }
            for(var n=0; n<me.popEditFieldset.length; n++)
            {
                var fieldset = {
                    xtype : 'fieldset',
                    title : Lang.get(me.popEditFieldset[n].title),
                    hidden : me.popEditFieldset[n].hidden,
                    collapsed : me.popEditFieldset[n].collapsed,
                    collapsible: true,
                    minWidth : Util.nvl(me.popEditWinConfig.minWidth, 500),
                    //필드셋간격 top,right,buttom,left
                    padding : '10 10 10 10',
                    layout : {
                        type : Util.nvl(me.popEditWinConfig.layout, 'column'),
                        columns : defaultColumnsCnt
                            /*
                        ,
                        tdAttrs : {
                            style : {
                               paddingRight : '30px',
                               verticalAlign : 'top'
                            }
                        }*/
                    }
                };
                fieldset.items = [];
                for(var cols=0; cols<me.popEditFieldset[n].columns.length; cols++)
                {
                    if(typeof me.popEditFieldset[n].columns[cols] == 'number')
                    {
                        var colDefine = me.columnDefine[me.popEditFieldset[n].columns[cols]];
                        var fieldItem = fieldsByName[Util.nvl(colDefine.colName, colDefine.header)];
                        if(!Util.isNull(fieldItem)) fieldset.items.push(fieldItem);
                    }
                    else if(typeof me.popEditFieldset[n].columns[cols] == 'string')
                    {
                        var fieldItem = fieldsByName[me.popEditFieldset[n].columns[cols]];
                        if(!Util.isNull(fieldItem)) fieldset.items.push(fieldItem);
                    }
                }
                items.push(fieldset);
            }
        }
        else
        {
            items = fields;
        }

        var toolbarItems = [
            {
                xtype : 'tbtext',
                id : me.id + 'TitleText',
                text : (Util.isNull(me.popEditWinConfig.title) ? '' : '<span style="font-weight:bold;">[ ' + Lang.get(me.popEditWinConfig.title) + ' ]</span> ')
            },
            '->',
            {
                text: IU == 'I' ? Lang.get('INSERT') : Lang.get('UPDATE'),
                iconCls: IU == 'I' ? Util.buttonClsConfig('INSERT','') : Util.buttonClsConfig('UPDATE',''),
                hidden : Util.nvl(me.popEditWinConfig.hideIUBtn, false),
                handler : function(){
                    //밸리데이션 체크
                    if(!this.up('[xtype=form]').isValid()) return;
                    //추가일 경우 그리드에 신규 행 추가 후 폼 데이터 입력 후 닫기.
                    if(IU == 'I'){
                        var insertedRecords = me.store.insert(me.store.count(), me.currentFormEditingRecord);
                        me.getSelectionModel().select(insertedRecords[0]);
                        me.lastSelectedRow = insertedRecords[0];
                    //수정일 경우 그리드 해당 행 데이터 변경 후 닫기.
                    }else if(IU == 'U'){
                        for(var n=0; n<me.fieldsToBindGrid.length; n++){
                            record.set(me.fieldsToBindGrid[n], me.currentFormEditingRecord.get(me.fieldsToBindGrid[n]));
                        }
                    }
                    this.up('[xtype=window]').close();
                }
            },
            {
                text: Lang.get('SAVE'),
                iconCls: Util.buttonClsConfig('SAVE',''),
                hidden : Util.nvl(me.popEditWinConfig.hideSaveBtn, false),
                handler : function(){
                    //밸리데이션 체크
                    if(!this.up('[xtype=form]').isValid()) return;
                    //추가일 경우 그리드에 신규 행 추가 후 폼 데이터 입력 후 닫기.
                    if(IU == 'I'){
                        var insertedRecords = me.store.insert(me.store.count(), me.currentFormEditingRecord);
                        me.getSelectionModel().select(insertedRecords[0]);
                        me.lastSelectedRow = insertedRecords[0];
                    //수정일 경우 그리드 해당 행 데이터 변경 후 닫기.
                    }else if(IU == 'U'){
                        for(var n=0; n<me.fieldsToBindGrid.length; n++){
                            record.set(me.fieldsToBindGrid[n], me.currentFormEditingRecord.get(me.fieldsToBindGrid[n]));
                        }
                    }
                    //저장 함수 호출
                    me.popEditSaveFunction();
                }
            },
            {
                text: Lang.get('DELETE'),
                iconCls: Util.buttonClsConfig('DELETE',''),
                hidden : (IU == 'I' || recordStatus == 'I') ? true : Util.nvl(me.popEditWinConfig.hideDBtn, false),
                handler : function(){
                    //클릭시 해당 레코드 삭제로 상태 변경 후 그리드의 save 함수 호출.
                    record.set('ROW_DELETE', true);
                    //저장 함수 호출
                    me.popEditSaveFunction();
                }
            },
            {
                text: Lang.get('CANCEL'),
                iconCls: Util.buttonClsConfig('CANCEL',''),
                hidden : Util.nvl(me.popEditWinConfig.hideCancelBtn, false),
                handler : function(){
                    this.up('[xtype=window]').close();
                }
            }
        ];
        var formConfig = {
            xtype : 'form',
            title : '',
            id : me.id + 'EditForm',
            autoScroll : true,
            bodyCls : 'form-body',
            bodyStyle: 'padding:10px;',
            border  : 0,
            items : items,
            //상단 툴바
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock : 'top',
                    height : 28,
                    style : {
                        //background : '#c5d6ef'
                    },
                    items: Util.nvl(me.popEditWinConfig.toolbarItems, toolbarItems)
                }
            ],
            listeners : {
                afterrender : function(){
                    me.editForm = this;
                    me.editFormDataLoaded = false;
                    if(!Util.isNull(record)) {
                        //폼 생성 후 데이터 로드하기 때문에 이 때 이벤트 리스너가 작동한다.
                        //그러나 수정모드의 폼일 경우에는 데이터 로드가 다 되기 전까지 리스너 작동하면 안되기 때문에 suspendEvents, resumeEvents 를 썼지만 안되서 이렇게 함.
                        me.editForm.loadRecord(record);
                        me.editFormDataLoaded = true;
                        if(!Util.isNull(me.popEditFormAfterRender))
                        {
                        	me.popEditFormAfterRender();
                        }
                    }
                    else if(!Util.isNull(me.popEditNewRowDefaultSetFunction)) {
                        me.editFormDataLoaded = true;
                        me.popEditNewRowDefaultSetFunction();
                    }else{
                        me.editFormDataLoaded = true;
                    }
                }
            }
       };
       if(Util.isNull(me.popEditFieldset)) {
           formConfig.layout = {
               type : Util.nvl(me.popEditWinConfig.layout, 'column'),
               columns : defaultColumnsCnt,
               tdAttrs : {
                   style : {
                       paddingRight : '30px',
                       verticalAlign : 'top'
                   }
               }
           };
       }
       return formConfig;
    },

    /**
     * 추가, 수정 폼에 쓸 필드 만들기
     */
    getEditFormFields : function(IU){
        var me = this;
        var columnDefine = me.columnDefine;
        var fieldsToBindGrid = [];
        var fields = [];
        for(var n=0; n<columnDefine.length; n++)
        {
            var field = null;
            var fieldName = Util.nvl(columnDefine[n].colName, columnDefine[n].header);
            var readOnly = !( (IU == 'I' && Util.nvl(columnDefine[n].editable, true)) || (IU == 'U' && Util.nvl(columnDefine[n].editable, true) && Util.nvl(columnDefine[n].updatable, true)) ) ;
            //폼에서 사용 안하는 필드
            if(Util.nvl(columnDefine[n].editFormRemove, false)) {
                //안만듬.
            }
            //폼에서 사용 안하는 필드
            else if(Util.nvl(columnDefine[n].editFormHidden, false)) {
                field = {
                    xtype: 'hiddenfield'
                };
            }
            //숨김 필드
            else if(Util.nvl(columnDefine[n].hidden, false) && Util.nvl(columnDefine[n].editFormHidden, true))
            {
                field = {
                    xtype: 'hiddenfield'
                };
            }
            //일반 텍스트 필드일 경우
            else if(Util.nvl(columnDefine[n].type, 'string') == 'string')
            {
                field = {
                    xtype: Util.nvl(columnDefine[n].editFormTextArea, false) ? 'textarea' : 'textfield'
                };
            }
            //int 나 float 타입
            else if(columnDefine[n].type == 'int' || columnDefine[n].type == 'float' || columnDefine[n].type == 'number')
            {
                field = {
                    xtype: 'numberfield',
                    align: 'right',
                    decimalPrecision : Util.nvl(columnDefine[n].decimalPrecision)
                };
                if(!Util.isNull(columnDefine[n].minValue))
                {
                	field.minValue = columnDefine[n].minValue;
                }
                if(!Util.isNull(columnDefine[n].maxValue))
                {
                	field.maxValue = columnDefine[n].maxValue;
                }
            }
            //checkbox 타입
            else if(columnDefine[n].type == 'checkbox')
            {
                field = {
                    xtype: 'checkbox'
                };
            }
            //combobox 타입
            else if(columnDefine[n].type == 'combobox')
            {
                var comboStore = Util.isNull(columnDefine[n].comboStore) ? Util.createComboStore(columnDefine[n].comboParam) : columnDefine[n].comboStore;
                var valueField = Util.nvl(columnDefine[n].comboValueField, comboStore.model.getFields()[0].name);
                var displayField = Util.nvl(columnDefine[n].comboDisplayField, comboStore.model.getFields()[1].name);

                field = {
                    xtype : 'combobox',
                    store : comboStore,
                    valueField : valueField,
                    displayField : displayField,
                    editable : Util.nvl(columnDefine[n].valueEditable, false),
                    listeners: {
                        specialkey: function(field, e){
                            if (e.getKey() == e.DELETE) {
                                field.setValue('');
                            }
                        }
                    }
                };
            }
            //popup 타입
            else if(columnDefine[n].type == 'popup')
            {
                field = {
                    xtype : 'popSearchField',
                    editable : Util.nvl(columnDefine[n].valueEditable, false),
                    customPopupFunction : columnDefine[n].popupParam.customPopupFunction,
                    param : {
                        URL : columnDefine[n].popupParam.URL,
                        DBCOLUMN : columnDefine[n].popupParam.DBCOLUMN,
                        COLUMNDESCR_LANG : Lang.get(columnDefine[n].popupParam.TITLE),
                        MODULE : Util.nvl(columnDefine[n].popupParam.MODULE),
                        SQLPROP : columnDefine[n].popupParam.SQLPROP,
                        KEYPARAM : columnDefine[n].popupParam.KEYPARAM,
                        PARAM1 : columnDefine[n].popupParam.PARAM1,
                        PARAM2 : columnDefine[n].popupParam.PARAM2,
                        PARAM3 : columnDefine[n].popupParam.PARAM3,
                        PARAM4 : columnDefine[n].popupParam.PARAM4,
                        PARAM5 : columnDefine[n].popupParam.PARAM5,
                        PARAM6 : columnDefine[n].popupParam.PARAM6,
                        PARAM7 : columnDefine[n].popupParam.PARAM7,
                        PARAM8 : columnDefine[n].popupParam.PARAM8,
                        PARAM9 : columnDefine[n].popupParam.PARAM9,
                        PARAM10 : columnDefine[n].popupParam.PARAM10,
                        CODE_HEADER : columnDefine[n].popupParam.CODE_HEADER,
                        CODE_COLNAME : columnDefine[n].popupParam.CODE_COLNAME,
                        NAME_HEADER : columnDefine[n].popupParam.NAME_HEADER,
                        NAME_COLNAME : columnDefine[n].popupParam.NAME_COLNAME,
                        SELECTIONMODE : columnDefine[n].popupParam.SELECTIONMODE,
                        DYNAMICPARAM : columnDefine[n].popupParam.DYNAMICPARAM,
                        PAGESIZE : columnDefine[n].popupParam.PAGESIZE,
                        GRID : me,
                        RETURNROW : !Util.isNull(columnDefine[n].popupParam.CODENAMECOLUMN) || !Util.isNull(columnDefine[n].popupParam.afterGetRow),
                        CODENAMECOLUMN : columnDefine[n].popupParam.CODENAMECOLUMN,
                        DEFAULTADDROW : columnDefine[n].popupParam.DEFAULTADDROW,
                        AUTOSEARCH : columnDefine[n].popupParam.AUTOSEARCH,
                        afterGetRow : columnDefine[n].popupParam.afterGetRow,
                        setCodeNameColValue : function(nameVal) {
                            if(!Util.isNull(this.CODENAMECOLUMN)) {
                                Ext.getCmp(me.id + 'EditForm').getForm().findField(this.CODENAMECOLUMN).setValue(nameVal);
                                me.currentFormEditingRecord.set(this.CODENAMECOLUMN, nameVal);
                            }
                        }
                    }
                };
            }
            //날짜 타입
            else if(columnDefine[n].type == 'date')
            {
                field = {
                    xtype : 'datefield',
                    format : ClientData.getFormat(Util.nvl(columnDefine[n].dateRenderFormat, columnDefine[n].renderFormat))
                };
            }

            //입력, 수정 불가 컬럼일 경우
            if(!Util.isNull(field) && readOnly) field.fieldStyle = {
                background : '#efefef'
            };

            //입력, 수정 가능 컬럼의 경우 edit, beforeedit 리스너, 밸리데이터 추가
            if(!Util.isNull(field))
            {
                if(! me.editorConfig) me.editorConfig = {};
                if(! me.editorConfig.beforeeditListeners) me.editorConfig.beforeeditListeners = [];
                if(! me.editorConfig.editListeners) me.editorConfig.editListeners = [];

                field.listeners = Util.nvl(field.listeners, {});

                //그리드의 beforeedit 리스너 호출. boolean 값 리턴받아 false 면 블러.
                field.listeners.focus = function(thisField, evt, opts){
                    var ret = true;
                    if(me.currentFormEditingRecord != null)
                    {
                        for(var n=0; n<me.editorConfig.beforeeditListeners.length; n++)
                        {
                            var func = me.editorConfig.beforeeditListeners[n];
                            ret = func(me, me.currentFormEditingRecord, thisField.name, thisField.value, thisField);
                            if(!ret) {
                                if(thisField.triggerBlur) thisField.triggerBlur();
                                thisField.blur();
                                break;
                            }
                        }
                    }
                    return ret;
                };
                //그리드의 edit 리스너 호출
                field.listeners.change = function(thisField, newVal, oldVal, opts){
                    //폼 값 변경시 바인딩 레코드에 값 셋팅.
                    if(me.editFormDataLoaded && me.currentFormEditingRecord != null)
                    {
                        me.currentFormEditingRecord.set(thisField.name, newVal);
                        for(var n=0; n<me.editorConfig.editListeners.length; n++)
                        {
                            var func = me.editorConfig.editListeners[n];
                            func(me, me.currentFormEditingRecord, thisField.name, thisField.value);
                        }
                    }
                };

                //밸리데이터에 필수 입력 셋팅
                if(Util.nvl(columnDefine[n].required, false))
                {
                    if(! me.validator)
                    {
                        me.validator = {};
                    }
                    if(! me.validator[fieldName])
                    {
                        me.validator[fieldName] = [];
                    }
                    me.validator[fieldName].unshift(function(grid, record, headerName, value){
                        var retVal = true;
                        if(Util.isNull(value)) retVal = Lang.getRep('MSG_REQUIRED_FIELD_REP', [headerName]);
                        return retVal;
                    });
                }

                //기타 밸리데이터
                if(me.validator && me.validator[fieldName])
                {
                    field.validCheckFunctions = me.validator[fieldName];
                    field.validator = function(value)
                    {
                        var retVal = true;
                        if(this.validCheckFunctions && me.currentFormEditingRecord != null) {
                            for(var n=0; n<this.validCheckFunctions.length; n++)
                            {
                                retVal = this.validCheckFunctions[n](me, me.currentFormEditingRecord, this.fieldLabel, value);
                                if(retVal !== true) break;
                            }
                        }
                        return retVal;
                    };
                }
            }

            //필드 공통사항 설정. 필드 추가. 그리드에 바인딩할 대상 필드 설정.
            if(!Util.isNull(field)) {
                var labelWidth = Util.nvl(me.popEditWinConfig.labelWidth, 150);
                var fiedlWidth = Util.nvl(columnDefine[n].editFormFieldWidth, Util.nvl(me.popEditWinConfig.fieldWidth, 150));
                field.name = fieldName;
                //14.1.8 필수인 항목은 label뒤에 * 붙임.
                field.fieldLabel = Lang.get(Util.nvl(columnDefine[n].editFormLabel, columnDefine[n].header));
                if(Util.nvl(columnDefine[n].required, false)){
                    field.fieldLabel = field.fieldLabel + ' *';
                }
                field.labelWidth = labelWidth;
                field.labelSeparator = '';
                field.labelAlign = Util.nvl(me.popEditWinConfig.labelAlign, 'left');
                field.labelClsExtra = Util.nvl(columnDefine[n].required, false) ? 'form-required-fieldlabel' : '';
                //field.readOnly = readOnly;
                field.disabled = readOnly;
                field.disabledCls = ''; //'form-field-disabled';
                //길이수정
                field.width = fiedlWidth + labelWidth;
                field.colspan = Util.nvl(columnDefine[n].editFormColspan, 1);
                //필드간격 top,right,buttom,left / hidden = 0
                if(field.xtype == 'hiddenfield'){
                    field.margin = '0 0 0 0';
                }else{
                    field.margin = '0 30 10 0';
                }
                fields.push(field);
                fieldsToBindGrid.push(Util.nvl(columnDefine[n].colName, columnDefine[n].header));
            }
        }
        me.fieldsToBindGrid = fieldsToBindGrid;
        return fields;
    },

    /**
     * 에디트폼 필드 가져오기
     */
    getEditFormField : function(fieldName)
    {
        var me = this;
        if(me.editForm) {
            var field = me.editForm.getForm().findField(fieldName);
            return field;
        }
    },

    /**
     * 추가/수정 팝업 입력 창 사용시 edit 리스너에서 쓸 수 있도록 하기 위함.
     */
    setEditFormReadOnly : function(fieldName, readOnly){
        var me = this;
        if(me.editForm) {
            var field = me.editForm.getForm().findField(fieldName);
            field.setDisabled(readOnly);
            //field.setReadOnly(readOnly);
            if(readOnly) {
                field.setFieldStyle({
                    background : '#efefef'
                });
            }else{
                field.setFieldStyle({
                    background : '#ffffff'
                });
            }
        }
    },

    /**
     * 추가/수정 팝업 입력 창 사용시 edit 리스너에서 쓸 수 있도록 하기 위함.
     */
    setEditFormVisible : function(fieldName, visible){
        var me = this;
        if(me.editForm) {
            var field = me.editForm.getForm().findField(fieldName);
            field.setVisible(visible);
        }
    },

    /**
     * 리포트, 엑셀 등에 쓰기 위해 콤보 스토어를 json 데이터로 만듬.
     */
    setJsonDataFromCombo : function(json){
        var me = this;
        for(var n=0; n<me.comboColumns.length; n++)
        {
            var storeData = me.comboColumnStore[me.comboColumns[n]];
            var comboRecords = [];
            storeData.each(function(record){
                comboRecords.push(record.data);
            });
            json[me.comboColumns[n]] = comboRecords;
        }
    },

    /**
     * 리포트 등에 헤더 이름을 넘기기 위해
     */
    getHeaderNames : function(){
        var me = this;
        var ret = [];
        for(var n=0; n<me.columnDefine.length; n++){
            ret.push(me.columnDefine[n].header);
        }
        return ret;
    },

    /**
     * 조회조건 이용한 리포트
     */
    popReportSearch : function(params, reportSetting){
        var me = this;
        params = Util.nvl(params, {});
        params.USER_SESSION_ID = USER_SESSION_ID;
        params.CURRENT_MENUCODE = CURRENT_MENUCODE;
        params.REPORT_FILTERED_ROWS = "N";
        params.DS_JSONDATA = Util.nvl(params.DS_JSONNDATA, {});
        params.DS_JSONDATA.DS_SEARCHCONDITION = DS_SEARCHCONDITION.DS_SEARCHCONDITION;
        params.REPORT_COMBO_COLS = me.comboColumns.toString();
        me.setJsonDataFromCombo(params.DS_JSONDATA);

        Util.saveUserTempData(params, function(){
            me.showReportPopWin(reportSetting);
            /*
            Ext.defer(function(){
                Util.removeUserTempData(params.USER_SESSION_ID);
            }, 60000);
            */
        });
    },

    /**
     * 필터링된 그리드 데이터만 출력
     */
    popReportFilteredRows : function(params, reportSetting, filterCondition, validCheckYn){
        var me = this;
        var trgRows = me.getFilteredRows(filterCondition, Util.nvl(validCheckYn,true), true, true);
        if(trgRows === false) return;

        params = Util.nvl(params, {});
        params.USER_SESSION_ID = USER_SESSION_ID;
        params.CURRENT_MENUCODE = CURRENT_MENUCODE;
        params.REPORT_FILTERED_ROWS = "Y";
        params.DS_JSONDATA = Util.nvl(params.DS_JSONNDATA, {});
        params.DS_JSONDATA.DS_SAVE = trgRows;
        params.REPORT_COMBO_COLS = me.comboColumns.toString();
        //me.setJsonDataFromCombo(params.DS_JSONDATA);

        Util.saveUserTempData(params, function(){
            me.showReportPopWin(reportSetting);
            /*
            Ext.defer(function(){
                Util.removeUserTempData(params.USER_SESSION_ID);
            }, 60000);
            */
        });
    },

    /**
     * 선택한 행만 리포트 출력
     */
    popReportChecked : function(params, reportSetting, validCheckYn){
        var me = this;
        me.popReportFilteredRows(params, reportSetting, function(record){
            return me.getSelectionModel().isSelected(record);
        }, validCheckYn);
    },

    /**
     * 조회된 그리드 데이터 출력
     */
    popReportSearchedGrid : function(params, reportSetting, validCheckYn){
        var me = this;
        me.popReportFilteredRows(params, reportSetting, function(record){
            return true;
        }, validCheckYn);
    },

    /**
     * 리포트 팝업창 열기
     */
    showReportPopWin : function(reportSetting)
    {
        var me = this;

        Util.setReportArg(reportSetting);
        window.reportParams = reportSetting;

        var url = Util.nvl(reportSetting.popWinUrl, '/view/common/jsp/ajaxReport.jsp');
        var title = Util.nvl(Lang.get(reportSetting.popWinTitle), 'Report');
        var popWinOptions = Util.nvl(reportSetting.popWinOptions, '');

        window.open(url, title, popWinOptions);
    },

    /**
     * 엑셀 다운하기 위해 필요한 컬럼 정보 가져오기.
     */
    getColumnInfoForExcelDown : function(params)
    {
        var me = this;
        //시트 제목
        params.EXCEL_SHEET_TITLE = CURRENT_MENUNAME;
        //헤더
        params.EXCEL_HEADERCOLS = [];
        //헤더그룹 중첩 갯수
        params.EXCEL_HEADER_DEPTH = 1;
        //필수입력 헤더
        params.EXCEL_REQUIRED_HEADERS = '';
        //컬럼
        params.EXCEL_COLNAMES = [];
        //컬럼 너비
        params.EXCEL_COL_WIDTH = [];
        //입력 불가 컬럼
        params.EXCEL_EDIT_FALSE_COLS = '';
        //틀고정
        params.EXCEL_FIXED_COLS = me.fixedCols;
        //날짜타입
        params.EXCEL_DATE_COLS = me.dateColumns.toString();
        //날짜타입 포멧
        params.EXCEL_DATE_COLS_FORMAT = '';
        //숫자타입
        params.EXCEL_NUMBER_COLS = '';
        //정렬
        params.EXCEL_COL_ALIGN = [];
        //숨김 여부
        params.EXCEL_COL_HIDDEN = '';
        //콤보
        params.EXCEL_COL_COMBOCOLS = me.comboColumns.toString();
        //체크박스
        params.EXCEL_COL_CHECKCOLS = me.checkboxColumns.toString();

        //그리드에 보여지는 최하위 헤더에 해당하는 컬럼정의 순서대로 가져오기.
        var trgCols = me.headerCt.getVisibleGridColumns();
        var cols = [];
        for(var n=0; n<trgCols.length; n++)
        {
            var col = me.columnDefines[trgCols[n].dataIndex];
            if(!Util.isNull(col)) {
                col.width = trgCols[n].width;
                cols.push(col);
            }
        }

        if(me.columnGroup)
        {
            params.EXCEL_HEADER_DEPTH = me.getMaxColumnGroupDepth();
            for(var n=0; n<params.EXCEL_HEADER_DEPTH-1; n++)
            {
                params['EXCEL_HEADER_GROUP_' + n] = [];
            }
        }

        for(var n=0; n<cols.length; n++)
        {
            //넘버러, 선택 체크박스 제외
            if(cols[n].type == 'gridrownumber') continue;
            //헤더
            params.EXCEL_HEADERCOLS.push(cols[n].header);
            //컬럼
            params.EXCEL_COLNAMES.push(Util.nvl(cols[n].colName, cols[n].header));
            //컬럼 너비
            params.EXCEL_COL_WIDTH.push(Util.nvl(cols[n].width, Util.nvl(me.defaultColWidth,100)));
            //정렬
            params.EXCEL_COL_ALIGN.push(Util.nvl(cols[n].align, 'left'));
            //상위 헤더들 값 구하기
            me.setParentHeaderTextArr(params, Util.nvl(cols[n].colName, cols[n].header), cols[n].header);
        }

        params.EXCEL_HEADERCOLS = params.EXCEL_HEADERCOLS.toString();
        params.EXCEL_COLNAMES = params.EXCEL_COLNAMES.toString();
        params.EXCEL_COL_WIDTH = params.EXCEL_COL_WIDTH.toString();
        params.EXCEL_COL_ALIGN = params.EXCEL_COL_ALIGN.toString();

        for(var n=0; n<params.EXCEL_HEADER_DEPTH-1; n++)
        {
            params['EXCEL_HEADER_GROUP_' + n] = params['EXCEL_HEADER_GROUP_' + n].toString();
        }

        //console.log(params);
    },

    /**
     * 헤더 중첩 최대 갯수 구하기. 엑셀 다운로드용.
     */
    getMaxColumnGroupDepth : function()
    {
        var me = this;
        var maxDepth = 1;
        for(var n=0; n<me.columnGroup.length; n++)
        {
            var depth = me.getColGroupDepth(me.columnGroup[n], 1);
            if(depth > maxDepth) maxDepth = depth;
        }
        me.columnGroupDepth = maxDepth;
        return me.columnGroupDepth;
    },

    /**
     * 특정 컬럼 그룹의 중첩 갯수 구하기. 엑셀 다운로드용.
     */
    getColGroupDepth : function(colGroup, currentDepth)
    {
        var me = this;
        if(colGroup.columns)
        {
            if(Ext.isArray(colGroup.columns))
            {
                var maxDepth = 1;
                for(var n=0; n<colGroup.columns.length; n++)
                {
                    var depth = me.getColGroupDepth(colGroup.columns[n], 1);
                    if(depth > maxDepth) maxDepth = depth;
                }
                currentDepth += maxDepth;
            }
            else
            {
                currentDepth += me.getColGroupDepth(colGroup.columns, currentDepth);
            }
        }
        return currentDepth;
    },

    /**
     * 최하위 컬럼 정의로 상위 헤더들의 텍스트 리스트를 생성한다. 엑셀 다운로드용.
     */
    setParentHeaderTextArr : function(paramsForExcelDown, colName, header)
    {
        var me = this;
        if(me.columnGroup)
        {
            for(var n=0; n<me.columnGroup.length; n++)
            {
                var tempArr = [];
                if(me.isColNameInGroup(me.columnGroup[n], colName, tempArr))
                {
                    //console.log(tempArr);
                    for(var d=0; d<params.EXCEL_HEADER_DEPTH-1; d++)
                    {
                        var headerText = header;
                        if(!Util.isNull(tempArr[d]))
                        {
                            headerText = tempArr[d];
                        }
                        params['EXCEL_HEADER_GROUP_' + d].push(headerText);
                    }
                }
            }
        }
    },

    /**
     * 특정 컬럼 그룹에 colName 이 있는지 체크. 엑셀 다운로드용.
     */
    isColNameInGroup : function(colGroupDefine, colName, tempArr)
    {
        var me = this;
        if(colGroupDefine.colName == colName)
        {
            return true;
        }
        else if(colGroupDefine.columns)
        {
            if(Ext.isArray(colGroupDefine.columns))
            {
                for(var cols=0; cols<colGroupDefine.columns.length; cols++)
                {
                    if(typeof colGroupDefine.columns[cols] == 'string')
                    {
                        if(colGroupDefine.columns[cols] == colName)
                        {
                            tempArr.unshift(colGroupDefine.header);
                            return true;
                        }
                    }
                    else if(typeof colGroupDefine.columns[cols] == 'number')
                    {
                        var columnDefine = me.columnDefine[colGroupDefine.columns[cols]];
                        if(Util.nvl(columnDefine.colName, columnDefine.header) == colName)
                        {
                            tempArr.unshift(colGroupDefine.header);
                            return true;
                        }
                    }
                    else if(colGroupDefine.columns[cols].header && colGroupDefine.columns[cols].columns)
                    {
                        if(me.isColNameInGroup(colGroupDefine.columns[cols], colName, tempArr))
                        {
                            tempArr.unshift(colGroupDefine.header);
                            return true;
                        }
                    }
                }
            }
        }
    },

    /**
     * 조회 조건 이용하여 엑셀 다운
     */
    downExcelSearch : function(url, param){
        var me = this;

        params = Util.nvl(param, {});
        params.USER_SESSION_ID = USER_SESSION_ID;
        params.CURRENT_MENUCODE = CURRENT_MENUCODE;
        params.CURRENT_MENUNAME = CURRENT_MENUNAME;
        params.DOWN_EXCEL_FILTERED_ROWS = "N";
        params.DS_JSONDATA = Util.nvl(params.DS_JSONNDATA, {});
        params.DS_JSONDATA.DS_SEARCHCONDITION = DS_SEARCHCONDITION.DS_SEARCHCONDITION;
        params.SEARCH_URL = url;

        me.setJsonDataFromCombo(params.DS_JSONDATA);
        me.getColumnInfoForExcelDown(params);

        Util.saveUserTempData(params, function(){
            Util.excelDownLoad();
        });
    },

    /**
     * 필터링된 그리드 데이터만 엑셀 다운
     */
    downExcelFilteredRows : function(param, filterCondition, validCheckYn){
        var me = this;
        var trgRows = me.getFilteredRows(filterCondition, Util.nvl(validCheckYn,true), true, true);
        if(trgRows === false) return;

        params = Util.nvl(param, {});
        params.USER_SESSION_ID = USER_SESSION_ID;
        params.CURRENT_MENUCODE = CURRENT_MENUCODE;
        params.CURRENT_MENUNAME = CURRENT_MENUNAME;
        params.DOWN_EXCEL_FILTERED_ROWS = "Y";
        params.DS_JSONDATA = Util.nvl(params.DS_JSONNDATA, {});
        params.DS_JSONDATA.DS_SAVE = trgRows;

        //me.setJsonDataFromCombo(params.DS_JSONDATA);
        me.getColumnInfoForExcelDown(params, true);

        Util.saveUserTempData(params, function(){
            Util.excelDownLoad();
        });
    },

    /**
     * 선택된 그리드 엑셀 다운
     */
    downExcelChecked : function(param, validCheckYn){
        var me = this;
        me.downExcelFilteredRows(param, function(record){
            return me.getSelectionModel().isSelected(record);
        }, validCheckYn);
    },

    /**
     * 조회된 그리드 엑셀 다운
     */
    downExcelSearched : function(param, validCheckYn){
        var me = this;
        me.downExcelFilteredRows(param, function(record){
            return true;
        }, validCheckYn);
    },

    /**
     * 엑셀 업로드 후 그리드에 로드
     */
    loadExcelData : function(param) {
        var me = this;
        Ext.Loader.loadScript({url : '/view/common/js/sheetjs/vc-excel-read.js', onLoad : function(){ExcelLoader.selectFile(me);}});
    }
});

/********************************************************************************************************
 * Common Grid Store
 ********************************************************************************************************/
Ext.define('VC.store.CommonGridStore', {
    extend : 'Ext.data.Store',
    listeners : {
        update : function(store, record, operation, modifiedFieldNames, eOpts){
            if(modifiedFieldNames)
            {
                if(Ext.Array.contains(['ROW_STATUS','ROW_STATUS_TXT','_SELECT_ROW_'], modifiedFieldNames[0])) return; //이건 사용자가 변경하는 값이 아니므로.

				try{
                	store.bindedGrid.getView().refreshNode(store.indexOf(record));
                }catch(e){
                	// 데이터에 <![CDATA[ > ]]> 같은 문자열 있으면 에러난다..
                }

                //삭제 클릭시 신규 추가행이면 없앰. 서버에서 로드했던 데이터는 상태 D 로 변경.
                if(record.get('ROW_DELETE'))
                {
                    if(record.get('ROW_STATUS') == 'I')
                    {
                        store.bindedGrid.focus(); //해당 행에 수정 중인 필드가 있을 경우 삭제해도 에디터가 그대로 남아있다. 포커스 아웃해주어야 없어진다.
                        store.remove(record);
                        store.bindedGrid.resetTitleText(null, store.count());
                        if(store.bindedGrid.editForm) {
                            store.bindedGrid.editForm.getForm().reset(true);
                        }
                        //store.bindedGrid.getView().refresh(false); //중간에 있는 행이 삭제되서 없어졌을 때 넘버링 다시 하는 거. 근데 너무 느리다.
                    }
                    else
                    {
                        record.set('ROW_STATUS','D');
                        record.set('ROW_STATUS_TXT', Lang.get('DELETE'));
                    }
                }
                //신규 추가한 행이 아닐 경우 변경된 값이 있으면 U
                else if(record.get('ROW_STATUS') != 'I')
                {
                    var isDirty = false;
                    for(elem in record.getChanges())
                    {
                        if(elem != 'ROW_STATUS' && elem != 'ROW_STATUS_TXT')
                        {
                            isDirty = true;
                            break;
                        }
                    }
                    if(isDirty)
                    {
                        record.set('ROW_STATUS','U');
                        record.set('ROW_STATUS_TXT', Lang.get('UPDATE'));
                    }
                    else
                    {
                        record.set('ROW_STATUS','R');
                        record.set('ROW_STATUS_TXT', '');
                    }
                }
            }
        }
    }
});

