//COMMON START
/**
 * 페이지 로드시 실행.
 */
function InitPage() {
  // iframe sheet 진행표시줄 문제해결위해 iframe 이고 화면에 iframe 이 없다면 dummy iframe 생성
  try{
    if(parent.document.getElementsByName(window.name)[0].tagName == 'IFRAME' &&
       document.getElementsByTagName('IFRAME').length == 0 &&
       isSheetExistsInPage() &&
       !window.dialogArguments)
    {
      document.body.appendChild($E("iframe", {style:{display:"none"}}));
    }
  }catch(e){}
  
  // element formatting
  applyElementFormat();


  // 버튼/탭 사이즈 조절
  if(window.Page)applyElementAutoSizeBtnTab({lang_cd:Page.LANG_CD});

  if(typeof(LoadPage) == "function") LoadPage();

  $('object').each(function(index){
    var elem = $(this);
    if(elem.parent().css("height") != "100%")
    {
      displayElement(elem,false);
      displayElement(elem,true);
    }
  });

  //FireFox는 window.event가 없어서 추가 
  if($.browser.mozilla){
    $.each(["mousedown", "mouseover", "mouseout", "mousemove", "mousedrag", "click", "dblclick"], function(i, eventName){
      window.addEventListener(eventName, function(e){
        window.event = e;
      });
    });
  }
}

/**
 * JQuery 객체의 함수 확장
 */
jQuery.fn.extend({
  /**
   * 속성이 undefiend 일 경우 빈 문자열 반환
   */
  attr2: function( name, value ) {
      var $tmp;
    $tmp = jQuery.access( this, name, value, true, jQuery.attr );
    return ($tmp == undefined)? "" : $tmp;
  },
  /**
   * 값이 undefiend 일 경우 빈 문자열 반환
   */
  val2: function( value ) {
    var hooks, ret, isFunction,
      elem = this[0];
    var rreturn = /\r/g;

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined && (ret = hooks.get( elem, "value" )) !== "undefined" ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret == "undefined" ? "" : ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return "";
    }

    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var self = jQuery(this), val;

      if ( this.nodeType !== 1 ) {
        return "";
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  },

});

/**
 * 시트 존재 여부
 */
function isSheetExistsInPage()
{
  var objects = document.getElementsByTagName('OBJECT');
  for ( var n = 0, nlen = objects.length; n < nlen; n++ )
  {
    if ( objects[n].classid == ibsheet_classid)
    {
      return true;
    }
  }
  return false;
}

/**
 * 2013.12.10 Format
 * Element Formatting
 */
function applyElementFormat()
{
  $(".format").each(function(index)
  {
    var element = $(this);
    if(element.attr("__formatapplied")) return;
    element.attr("__formatapplied", true);
    
   var df_Type = Util.getFormat('DF_YMD').toUpperCase();
   var df_Value = "";
      if(df_Type =="Y.M.D"){
	   df_Value = "ymdDateFulStop";  
	  }else if(df_Type =="Y/M/D"){
	   df_Value = "ymdDateSolidus";  
	  }else if(df_Type =="Y-M-D"){
	   df_Value = "ymdDateHyphen";  
	  }else if(df_Type == "M.D.Y"){
	   df_Value = "mdyDateFulStop";
	  }else if(df_Type =="M/D/Y"){
	   df_Value = "mdyDateSolidus";  
	  }else if(df_Type =="M-D-Y"){
	   df_Value = "dmyDateHyphen";  
	  }else if(df_Type == "D.M.Y"){
	   df_Value = "dmyDateFulStop";
	  }else if(df_Type == "D/M/Y"){
	   df_Value = "dmyDateSolidus";  
	  }else if(df_Type == "D-M-Y"){
	   df_Value = "dmyDateHyphen";  
	  }
	
	//data_format 속성에 따라 스타일 적용.
    element.attr("data_format",df_Value);
    var elementAttr = element.attr("data_format");
    
    switch ( elementAttr )
    {
    case "ymdDateFulStop":
    {
        applyStyle(element, "left", "disabled", "####.##.##".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;
    case "ymdDateSolidus":
    {
        applyStyle(element, "left", "disabled", "####/##/##".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;
    case "ymdDateHyphen":
    {
        applyStyle(element, "left", "disabled", "####-##-##".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;      
      case "mdyDateFulStop":
      {
        applyStyle(element, "left", "disabled", "##.##.####".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;
      case "mdyDateSolidus":
      {
        applyStyle(element, "left", "disabled", "##/##/####".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;
      case "mdyDateHyphen":
      {
        applyStyle(element, "left", "disabled", "##-##-####".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;
      case "dmyDateFulStop":
      {
        applyStyle(element, "left", "disabled", "##.##.####".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;
      case "dmyDateSolidus":
      {
        applyStyle(element, "left", "disabled", "##/##/####".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;
      case "dmyDateHyphen":
      {
        applyStyle(element, "left", "disabled", "##-##-####".length);
        element.setValue = function(val)
        {
          element.value = formatValue(val, elementAttr);
        };
      }
      break;      
    }
    
    if ( element.attr("onkeyupchange") ) element.attr("onkeyupchange", new Function(element.attr("onkeyupchange")));
    if ( element.attr("onkeyupmaxlength") ) element.attr("onkeyupmaxlength", new Function(element.attr("onkeyupmaxlength")));
    if ( element.attr("onblurchange") ) element.attr("onblurchange", new Function(element.attr("onblurchange")));

    //onkeyup 이벤트 바인드
    element.bind('keyup', function()
    {
      if ( element.val() != element.attr("_pvalue") )
      {
        formatInput(element);
        element.attr("_pvalue", element.val());
        if ( element.attr("onkeyupchange") ) eval(element.attr("onkeyupchange"));
        if ( element.val().length == element.attr("maxLength") ) if ( element.attr("onkeyupmaxlength") ) eval(element.attr("onkeyupmaxlength"));
      }
    });
    
    //onfocus 이벤트 바인드
    element.bind('focus', function()
    {
      element.attr("_fvalue", element.val());
      formatInput(element);
      element[0].select();
    });
    
    //onblur 이벤트 바인드
    element.bind('blur', function()
    {
      formatInput(element);
      if ( element.val() != element.attr("_fvalue") ) if ( element.attr("onblurchange") ) eval(element.attr("onblurchange"));
    });
  
  });
}

/**
 * null 체크
 * @param x
 * @return
 */
function isNull(x)
{
  return x == null || x == "";
}

/**
 * 문자열이 null 또는 ''일 경우 default 문자열로 대체
 * @param s
 * @param d
 * @return
 */
function nvl(s, d)
{
	return (s == null || s == "" || s == undefined ) ? (d == null ? "" : d) : s;
}

/**
 * 문자열의 quoto 에 역슬래시 추가
 * @param str
 * @return
 */
function quoto(str)
{
  return str ? str.replace(/'/g, '\\\'').replace(/"/g, '\\\"') : str;
}

/**
 * 배열 안에 값이 있는지 여부
 * @param o
 * @param arr
 * @return
 */
function isinarr(o, arr)
{
  for ( var n = 0; n < arr.length; n++ )
  {
    if ( o == arr[n] )
    {
      return true;
    }
  }
  return false;
}

//COMMON END
/**
 * form 의 element 들의 validation check
 * @param f
 * @param bJustCheck
 * @return
 */
function checkForm(f, bJustCheck)
{
  f = (typeof f == "string")? $("#" + f)[0] : ((f)? $(f):$("form")[0]);
  var input;
  for ( var n = 0, sz = f.elements.length; n < sz; n++ )
  {
    input = f.elements[n];
    if ( ! input.name && ! input.id ) continue;
    switch ( input.type )
    {
      case "button":
      case "image":
      case "submit":
      case "reset": continue;
    }
    if ( ! checkInput(input, bJustCheck) ) return false;
  }
  return true;	
}
/**
 * form element validation check
 * @param input
 * @param bJustCheck
 * @return
 */
function checkInput(input, bJustCheck)
{
  input = typeof input == "string" ? $("#" + input) : $(input);
  var str = input.val2();
  if ( str )
  {
	//날짜
	if ( $(input).attr2("data_format") && ! checkFormatInput(input, true) ) return false;
 
  }
  return true;
}
/**
 * element select focus
 * @param input
 * @return
 */
function input_selectfocus(input)
{
  input = typeof input == "string" ? $("#" + input) : $(input);    
  try { if(input.attr("type") != "file") input.focus(); } catch(e) {alert(e);}
}
/**
 * 문자열 포매팅
 * @param str
 * @param data_format
 * @param point_count
 * @return
 */
function formatValue(str, data_format, point_count)
{
  var rv = "";
  switch ( data_format )
  {
    case "ymdDateFulStop": rv = formatValueMask(str, "####.##.##"); break;
    case "ymdDateSolidus": rv = formatValueMask(str, "####/##/##"); break;  
    case "ymdDateHyphen": rv = formatValueMask(str, "####-##-##"); break;  
    case "mdyDateFulStop": rv = formatValueMask(str, "##.##.####"); break;
    case "mdyDateSolidus": rv = formatValueMask(str, "##/##/####"); break;  
    case "mdyDateHyphen": rv = formatValueMask(str, "##-##-####"); break; 
    case "dmyDateFulStop": rv = formatValueMask(str, "##.##.####"); break;
    case "dmyDateSolidus": rv = formatValueMask(str, "##/##/####"); break;  
    case "dmyDateHyphen": rv = formatValueMask(str, "##-##-####"); break;   
    {
      var sign = str.substr(0, 1) == "-" ? "-" : "";
      rv = sign + formatComma(str.replace(/\D/g, ""));
    }
    break;
    case "dfFloat+":
    {
      var pointidx = str.indexOf(".");
      var pointbelow = ( pointidx >= 0 ) ? "."+ str.substr(pointidx).replace(/\D/g, "") : "";
      var numvalue = formatComma(str.substr(0, pointidx >= 0 ? pointidx : str.length).replace(/\D/g, ""));
      if ( point_count != null)
      {
        numvalue = numvalue == "" ? "0" : numvalue;
        pointbelow = rpad(pointbelow || ".", point_count+1, "0");
      }
      rv = numvalue + pointbelow;
    }
    break;
    //case "dfEmail":
    default:          rv = str; break;
  }
  return rv;
}
/**
 * element format check
 * @param input
 * @param bShowMsg
 * @return
 */
function checkFormatInput(input, bShowMsg)
{
  input = typeof input == "string" ? $("#" + input) : $(input);  
  var check = checkFormatValue(input.val2(), input.attr2("data_format"));
  if ( ! check && bShowMsg )
  {
    alert( (input.attr2("korname") ? input.attr2("korname")+" " : "") + getFormatErrMsg(input.attr2("data_format")));
    input_selectfocus(input);
  }
  return check;
}
/**
 * 문자열 format check
 * @param str
 * @param data_format
 * @param bShowMsg
 * @return
 */
function checkFormatValue(str, data_format, bShowMsg)
{
  var numstr;
  var check = false;
  var check2="";
  switch ( data_format )
  {
    //Y.M.D포맷
    case "ymdDateFulStop":
    {
      check = /^\d{4}\.\d{2}\.\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(0, 4));
      var mm = Number(numstr.substr(4, 2))-1;
      var dd = Number(numstr.substr(6, 2));
      var dt = new Date(yy, mm, dd);
      check = yy == dt.getFullYear() && mm == dt.getMonth() && dd == dt.getDate();
    }
    break;
  //Y/M/D포맷
    case "ymdDateSolidus":
    {
      check = /^\d{4}\/\d{2}\/\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(0, 4));
      var mm = Number(numstr.substr(4, 2))-1;
      var dd = Number(numstr.substr(6, 2));
      var dt = new Date(yy, mm, dd);
      check = yy == dt.getFullYear() && mm == dt.getMonth() && dd == dt.getDate();
    }
    break; 
    //Y-M-D포맷
    case "ymdDateHyphen":
    {
      check = /^\d{4}\-\d{2}\-\d{2}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(0, 4));
      var mm = Number(numstr.substr(4, 2))-1;
      var dd = Number(numstr.substr(6, 2));
      var dt = new Date(yy, mm, dd);
      check = yy == dt.getFullYear() && mm == dt.getMonth() && dd == dt.getDate();
    }
    break;     
  //m.d.Y포맷일때 
    case "mdyDateFulStop":
    {
      check = /^\d{2}\.\d{2}\.\d{4}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(4, 8));
      var mm = Number(numstr.substr(0, 2))-1;
      var dd = Number(numstr.substr(2, 2));
      var dt = new Date(yy, mm, dd);
      check =  mm == dt.getMonth() && dd == dt.getDate() &&  yy == dt.getFullYear();
    }
    break;
  //m/d/Y포맷일때 
    case "mdyDateSolidus":
    {
      check = /^\d{2}\/\d{2}\/\d{4}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(4, 8));
      var mm = Number(numstr.substr(0, 2))-1;
      var dd = Number(numstr.substr(2, 2));
      var dt = new Date(yy, mm, dd);
      check =  mm == dt.getMonth() && dd == dt.getDate() &&  yy == dt.getFullYear();
    }
    break;
    //m-d-Y포맷일때 
    case "mdyDateHyphen":
    {
      check = /^\d{2}\-\d{2}\-\d{4}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(4, 8));
      var mm = Number(numstr.substr(0, 2))-1;
      var dd = Number(numstr.substr(2, 2));
      var dt = new Date(yy, mm, dd);
      check =  mm == dt.getMonth() && dd == dt.getDate() &&  yy == dt.getFullYear();
    }
    break; 
    //d.m.Y포맷일때 
    case "dmyDateFulStop":
    {
      check = /^\d{2}\.\d{2}\.\d{4}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(4, 8));
      var mm = Number(numstr.substr(2, 2))-1;
      var dd = Number(numstr.substr(0, 2));
      var dt = new Date(yy, mm, dd);
      check =  dd == dt.getDate() && mm == dt.getMonth() &&  yy == dt.getFullYear();
    }
    break;
  //d/m/Y포맷일때 
    case "dmyDateSolidus":
    {
      check = /^\d{2}\/\d{2}\/\d{4}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(4, 8));
      var mm = Number(numstr.substr(2, 2))-1;
      var dd = Number(numstr.substr(0, 2));
      var dt = new Date(yy, mm, dd);
      check =  dd == dt.getDate() && mm == dt.getMonth() &&  yy == dt.getFullYear();
    }
    break;
    //d-m-Y포맷일때 
    case "dmyDateHyphen":
    {
      check = /^\d{2}\-\d{2}\-\d{4}$/.test(str);
      if ( ! check ) break;
      numstr = str.replace(/\D/g, "");
      var yy = Number(numstr.substr(4, 8));
      var mm = Number(numstr.substr(2, 2))-1;
      var dd = Number(numstr.substr(0, 2));

      var dt = new Date(yy, mm, dd);
      check =  dd == dt.getDate() && mm == dt.getMonth() &&  yy == dt.getFullYear();
    }
    break;     
  }
  if ( ! check && bShowMsg )
  {
    alert(getFormatErrMsg(data_format));
  }
  return check;  
}
/**
 * 포맷 체크 에러메시지
 * @param data_format
 * @return
 
function getFormatErrMsg(data_format)
{
  var rv = "";
  switch ( data_format )
  {
    case "ymdDateFulStop": rv = "올바른 날짜(년월일) 형식이 아닙니다.\n\n(2013.02.28) 형태로 입력해 주시기 바랍니다."; break;  
    case "ymdDateSolidus": rv = "올바른 날짜(년월일) 형식이 아닙니다.\n\n(2013/02/28) 형태로 입력해 주시기 바랍니다."; break;  
    case "ymdDateHyphen": rv = "올바른 날짜(년월일) 형식이 아닙니다.\n\n(2013-02-28) 형태로 입력해 주시기 바랍니다."; break;  
    case "mdyDateFulStop": rv = "올바른 날짜(월일년) 형식이 아닙니다.\n\n(02.28.2013) 형태로 입력해 주시기 바랍니다."; break;
    case "mdyDateSolidus": rv = "올바른 날짜(월일년) 형식이 아닙니다.\n\n(02/28/2013) 형태로 입력해 주시기 바랍니다."; break;
    case "mdyDateHyphen": rv = "올바른 날짜(월일년) 형식이 아닙니다.\n\n(02-28-2013) 형태로 입력해 주시기 바랍니다."; break;
    case "dmyDateFulStop": rv = "올바른 날짜(일월년) 형식이 아닙니다.\n\n(28.02.2013) 형태로 입력해 주시기 바랍니다."; break;
    case "dmyDateSolidus": rv = "올바른 날짜(일월년) 형식이 아닙니다.\n\n(28/02/2013) 형태로 입력해 주시기 바랍니다."; break;
    case "dmyDateHyphen": rv = "올바른 날짜(일월년) 형식이 아닙니다.\n\n(28-02-2013) 형태로 입력해 주시기 바랍니다."; break;   
  }
  return rv;
}
*/
/**
 * 포맷 제거한 원 데이터
 * @param str
 * @param data_format
 * @return
 */
function restoreValue(str, data_format)
{
  var rv = "";
  switch ( data_format )
  {
    case "ymdDateFulStop":
    case "ymdDateSolidus":
    case "ymdDateHyphen":
    case "mdyDateFulStop":
    case "mdyDateSolidus":
    case "mdyDateHyphen":
    case "dmyDateFulStop":
    case "dmyDateSolidus":
    case "dmyDateHyphen":    	
  }
  return rv;
}
/**
 * element 의 포맷 안된 원데이터
 * @param input
 * @param data_format
 * @return
 */
// display 용 값이 아닌 DB에 넣을 값을 가져온다.
function getNormalValue(input, data_format)
{
  input = typeof input == "string" ? $("#" + input) : $(input); 
  return restoreValue(input.val2(), data_format || input.attr2("data_format"));
}
/**
 * element value 를 포매팅한다.
 * @param input
 * @param data_format
 * @return
 */
function formatInput(input, data_format)
{
  input = typeof input == "string" ? $("#" + input) : $(input);
  input.val(formatValue(input.val(), nvl(data_format, input.attr2("data_format"))) );
}

function formatInput2(input, data_format)
{
  return formatValue(input, data_format);
}
/**
 * element 에 str 을 data_format 에 맞게 세팅한다.
 * @param input
 * @param str
 * @param data_format default 는 input 의 data_format
 * @return
 */
function inputSetFormatValue(input, str, data_format)
{
  input = typeof input == "string" ? $("#" + input) : $(input);
  input.val(formatValue(str, data_format || input.attr2("data_format")) );
}

//getUnformat = getNormalValue;
//formatThis = formatInput;
/**
 * 형식화된 숫자 문자열을 포매팅
 * @param str
 * @param format
 * @return
 */
function formatValueMask(str, format)
{
  var rv = "";
  var numcount = countChr(format, '#');
  str = str.replace(/\D/g, "").substr(0, numcount);
  var chrAt;
  var validx = 0;
  for ( var n = 0; n < format.length; n++ )
  {
    chrAt = format.charAt(n);
    rv += ( chrAt == '#' ) ? str.charAt(validx++) : chrAt;
    if ( validx >= str.length ) break;
  }
  return rv;
}
/**
 * 문자열에서 chr 포함 갯수
 * @param str
 * @param chr
 * @return
 */
function countChr(str, chr)
{
  var count = 0;
  var length = str.length;
  for ( var n = 0; n < length; n++ )
  {
    if ( chr == str.charAt(n) ) count++;
  }
  return count;
}

/**
 * 숫자 문자열에 ,(콤마)
 * @param numstr
 * @return
 */
function formatComma(numstr)
{
  numstr = deletePrecedingZero(numstr.replace(/\D/g, ""));// 선행하는 zero 를 지운다.
  var rv = "";
  var idx = 0;
  for ( var n = numstr.length - 1; n >= 0; n-- )
  {
    if ( idx != 0 && idx % 3 == 0 ) rv = "," + rv;
    rv = numstr.charAt(n) + rv;
    idx++;
  }
  return rv;
}
/**
 * val 이 from, to 에 속하는지 체크
 * @param val
 * @param from
 * @param to
 * @return
 */
function between(val, from, to, not_include_from, not_include_to)
{
  if ( !(val >= from && val <= to) ) return false;
  if ( not_include_from && val == from ) return false;
  if ( not_include_to && val == to ) return false;
  return true;
}


/**
 * 선행하는 0 제거
 * @param numstr
 * @return
 */
function deletePrecedingZero(numstr)
{
  var replaced = numstr.replace(/^0+/, "");
  return numstr && ! replaced ? "0" : replaced;
}
/**
 * 텍스트정렬, 한영입력, 최대글자수제하 스타일 적용
 * @param e
 * @param textAlign
 * @param imeMode
 * @param maxLength
 * @return
 */
function applyStyle(e, textAlign, imeMode, maxLength)
{
  e = typeof e == "string" ? $("#" + e) : $(e);
  if ( textAlign ) e.css({textAlign: textAlign});
  if ( imeMode ) e.css({imeMode: imeMode});
  if ( maxLength != null )
  {
    e.attr("maxLength", maxLength);
    e.attr("size", maxLength + 2);
  }
}
  
/**
 * 월의 마지막 일 YMD
 */
function lastDay(ym)
{
  var ymd = addYmd(ym.substr(0, 6)+"01", "M", 1);
  return addYmd(ymd, "D", -1);
}
getMonthLastYmd = lastDay;

function getDateFromat2(df_Type){

    //var df_Type = Util.getFormat('DF_YMD').toUpperCase();
   // var df_Value = "";
	var df_Value = "";
		  if(df_Type =="Y.M.D"){
		   df_Value = "ymdDateFulStop";  
		  }else if(df_Type =="Y/M/D"){
		   df_Value = "ymdDateSolidus";  
		  }else if(df_Type =="Y-M-D"){
		   df_Value = "ymdDateHyphen";  
		  }else if(df_Type == "M.D.Y"){
		   df_Value = "mdyDateFulStop";
		  }else if(df_Type =="M/D/Y"){
		   df_Value = "mdyDateSolidus";  
		  }else if(df_Type =="M-D-Y"){
		   df_Value = "dmyDateHyphen";  
		  }else if(df_Type == "D.M.Y"){
		   df_Value = "dmyDateFulStop";
		  }else if(df_Type == "D/M/Y"){
		   df_Value = "dmyDateSolidus";  
		  }else if(df_Type == "D-M-Y"){
		   df_Value = "dmyDateHyphen";  
		  }
	  	//data_format 속성에 따라 스타일 적용.
   // element.attr("data_format",df_Value);
    //var elementAttr = element.attr("data_format");
	return df_Value;

}

