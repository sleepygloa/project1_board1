
function blogChileListToggle(count){
	var listCss = $('.blogSubject_'+count);
	if(listCss.is(":visible")){
		listCss.css('display', 'none');
	}else{
		listCss.css('display', 'block');
	}

}
var blogJs = function(){
	"use strict";
	
	var proCd = "";
	var proNm = "blog";

	var $grid = $('#blogGrid');
	
	
	var contentLength = 0;
	var focusIdx = -1;
	function fnSaveIdx(i){
		focusIdx = i;
	}
	
	var programData = {
			idx			: -1,
			focusIdx	: -1,
			contentLength	: 0,
	}

	return {
		init : function(){

			fnEvents();
			
			fnList();

		}
	}
	
	function fnEvents(){
		
//		//글상자추가
//		$('#blogTextBox').click(function(){
//			fnAddTextBox($(this));
//		});
		
//		
//		$('#'+proNm+'SaveBtn').click(function(){
//			fnSave();
//		})
//		
	}

	  function fnList(){
			$grid.fnList({
				programId 	: 'blog',
				programNm 	: '블로그',
//				editable	: true,
				url 		: '/ctrl/manage/blog/',
				colName		: ['IDX', 'TITLE', 'SUBJECT'],
				colOption	: [
					{id:'IDX', 		title:'순번', width:"50px"},
					{id:'TITLE', 	title:'분류',width:"150px"},
					{id:'SUBJECT', 	title:'제목',width:"500px"}
				],
				viewContents : true,
				viewContentsRe : true,
				btn			: ['add', 'update', 'save']
			});

	  }
//
//	  
//	  function fnAddTextBox(el){
//			var str = '<div id="row_'+contentLength+'" class="col-xs-w100" onclick="fnSaveIdx('+contentLength+');">';
//			str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
//			str += '<input type="hidden" id="type_'+contentLength+'" value="TEXT" />'
//			str += '<textarea id="text_'+contentLength+'" class="col-xs-w100"  style="min-height:100px;" onchange="resize('+el+')" ></textarea>'
//			str += '</div>';
//			$('#blogViewArea').append(str);
//			contentLength++;
//		}
//	  
//	  
//	  //글저장
//	  function fnSave(){
//	        //글저장
//		  var url = 'update'+ tableInitData.uProgramId;
//
//
////			var form = $('mainBlogUpdateForm')[0];
////			var formData = new FormData(form);
////
////			if($('#'+programId+'FileUploadText').val() != ''){
////				formData.append('file_0', $('#'+ tableInitData.programId+'FileUpload')[0].files[0]);
////			}
//			
//
//			var dataDt = [];
//			var count = 0;
//			for(var i = 0; i < contentLength; i++){
//				console.log('row_'+i);
//				
//				//글(컨텐츠) 가 작성된 개수, 있을 때.
//				if($('#row_'+i).val() != undefined){
//					
//					//데이터 세팅
//					var initData = {
//							text		: $('#text_'+i).val(),
//							type			: $('#type_'+i).val(),
//							imgWidthScale	: $('#text_'+i).attr('width')
//					}
//					
//
//					//이미지 일 경우
//					if(initData.type == 'IMG'){
//						initData.text = $('#text_'+i).attr('src');
//						if(initData.imgWidthScale != ''){
//							initData.imgWidthScale = initData.imgWidthScale.replace(/[^0-9]/g,"");
//						}
//					}
//					
//					//바인딩
//					var	dataList = {
//							idx 			: programData.idx,
//							i   			: i-count,
//							type 			: initData.type,
//							content 		: initData.text,
//							imgWidthScale 	: initData.imgWidthScale,
//					}
//					dataDt.push(dataList);
//				}else{
//					count++;
//				}
//			}
//
//			var sendData = {
//				title : $('#'+tableInitData.programId+'Title option:selected').text(),
//				subject : $('#'+tableInitData.programId+'Subject').val(),
//				dt_data  : dataDt
//			}
//
//			if(programData.idx != ''){
//				sendData["idx"]= programData.idx;
//			}
//			
//console.log(sendData);
//			
//			$.ajax({
//				url 	: tableInitData.url + "save" + tableInitData.uProgramId + "Contents",
//				type	: 'POST',
////				data    : formData,
//				data	: JSON.stringify(sendData),
////				contentType : false,
////				processData : false,
//				contentType : "application/json, charset=utf-8",
//				async 	: false,
//				success	: function(result){
////					if($('#'+programId+'FileUploadText').val() != ''){
////						$.ajax({
////							url 	: tableInitData.url + "/save"+tableInitData.uProgramId+"FileUpload",
////							type	: 'POST',
////							data    : formData,
////							contentType : false,
////							processData : false,
////							async 	: false,
////							success	: function(){
////								if(result.SUCCESS){
////									alert(result.SUCCESS);
////
////								}
////							}
////						})
////					}
//
////					window.location.href="/";
//				}
//			})
//
//	  }

}();

$(document).ready(function(){
	blogJs.init();
})