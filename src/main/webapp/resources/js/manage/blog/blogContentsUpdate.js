// function fnImgWidthChg(data){
//	var per = data.width+'%';
//	$('#text_'+data.length).attr('width', per);
//	console.log(data.length);
//	console.log(data.width);
//}
//
//function fnImgController(length){
//	$('.imgContWidth_'+length).css('display', 'block');
//}
//
//function fnRvImgController(length){
//	$('.imgContWidth_'+length).css('display', 'none');
//}

//function fnSaveIdx(i){
//	focusIdx = i;
//}

//function resize(obj) {
//	  obj.style.height = "1px";
//	  obj.style.height = (12+obj.scrollHeight)+"px";
//	}

//var focusIdx = -1;
var updateIdx = '';
var MainUpdateBlogContentJs = function(){
	"use strict";
//	var contentLength = 0;

	return {
		init : function(){

//			updateBlogTitleCombo();

//			loadingViewBlogContent();

//			updateBlogContentEvent();
		}
	}

//	function loadingViewBlogContent(){
//		$.ajax({
//			url	 : '/manage/blog/viewBlog',
//			data : blogData,
//			type : "POST",
//			success : function(result){
//				console.log(result);
//				if(result.map){
//					var list = result.map;
//					updateIdx = list[0].IDX;
////					$('#updateBlogContentTitle').text(map.TITLE);
//					$('#updateBlogSubject').val(list[0].SUBJECT);
//
//
////					$('select[id=updateBlogTitleCombo]').find("option[text='"+list[0].TITLE+"']").attr("selected","selected");
//					for(var i = 0; i < list.length; i++){
//						var str = '';
//						if(list[i].TYPE == 'IMG'){
//							addImgArea();
//							$('#text_'+i).attr('src', list[i].CONTENT);
//							$('#text_'+i).attr('width', ''+list[i].IMGWIDTHSCALE+'%');
//						}else if(list[i].TYPE == 'CODE'){
//							addCodeTextArea();
//							$('#text_'+i).text(list[i].CONTENT);
//						}else{
//							addTextArea(list[i].CONTENT);
//							$('#text_'+i).text(list[i].CONTENT);
//						}
//					}
//					contentLength = list.length;
//				}else{
//					$('#sortable').text('');
//				}
//			}
//		})
//	}

	function updateBlogContentEvent(){

//		$('#updateBlogContentCancelBtn').click(function(){
//			window.location.href="/";
//		})

		$('#updateBlogContentSaveBtn').click(function(){
			save();
		});

		//파일업로드
//		$('#updateBlogFileUploadBtn').click(function(){
//			$('#updateBlogFileUpload').trigger('click');
//		});
		//파일업로드 내용변경시 텍스트변경
//		$('#updateBlogFileUpload').on('change', function(){
//			var fileValue = $('#updateBlogFileUpload').val().split("\\");
//			var fileName = fileValue[fileValue.length-1]; // 파일명
//
//			$('#updateBlogFileUploadText').val(fileName);
//		});

		//메뉴 추가 버튼
		$('#insertMenuAddBtn').click(function(){
			var insertValue = $('#insertMenu').val();
			$('#updateBlogTitleCombo').prepend('<option value="0" id="insertBlogComboAdd">'+insertValue+'</option>');
		});

//		//글상자추가
//		$('#updateBlogAddText').click(function(){
//			addTextArea();
//		});
//
//		//코드추가
//		$('#updateBlogAddCode').click(function(){
//			addCodeTextArea();
//		});
//
//		//이미지추가
//		$('#updateBlogAddImg').click(function(){
//			addImgArea();
//			$('#blogUpdateImgInput').trigger('click');
//		});

//		$("#blogUpdateImgInput").change(function(){
//		    readURL(this);
//		});
//
//		function readURL(input) {
//		    if (input.files && input.files[0]) {
//		        var reader = new FileReader();
//		        reader.onload = function (e) {
//		            $('#text_'+(contentLength-1)).attr('src', e.target.result);
//		        }
//		        reader.readAsDataURL(input.files[0]);
//		    }
//		}

//		//삭제
//		$('#updateBlogRemove').click(function(){
//			$('#row_'+focusIdx).remove();
//		});

//		//타이핑 화면
//		$('#typping').on('click', function(e){
//			e.preventDefault();
//			$('#sortable').css('display', 'block');
//			$('#sortableView').css('display', 'none');
//		});
//		//뷰 화면
//		$('#typingView').on('click', function(e){
//			e.preventDefault();
//			$('#sortable').css('display', 'none');
//			$('#sortableView').css('display', 'block');
//			getSortableView();
//		});
	}
//
//	//글쓰기상자
//	function addTextArea(){
//	    var str = '<div id="row_'+contentLength+'" onclick="fnSaveIdx('+contentLength+');">';
//	    str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
//	    str += '<input type="hidden" id="type_'+contentLength+'" value="TEXT" />'
//        str += '<textarea id="text_'+contentLength+'" class="form-control col-md-12"  style="min-height:150px;" onchange="resize('+this+')" ></textarea>'
//        str += '</div>';
//		$('#sortable').append(str);
//		contentLength++;
//	}
//	//코드상자
//	function addCodeTextArea(){
//        var str = '<div id="row_'+contentLength+'" onclick="fnSaveIdx('+contentLength+');">';
//        str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
//        str += '<input type="hidden" id="type_'+contentLength+'" value="CODE" />'
//        str += '<textarea id="text_'+contentLength+'" class="form-control col-md-12"  style="min-height:150px; background:gray; color:white;"></textarea>'
//        str += '</div>';
//		$('#sortable').append(str);
//		contentLength++;
//	}
//	//이미지상자
//	function addImgArea(){
//        var str = '<div id="row_'+contentLength+'" onmouseover="fnImgController('+contentLength+');" onmouseleave="fnRvImgController('+contentLength+')" onclick="fnSaveIdx('+contentLength+');">';
//        str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
//        str += '<input type="hidden" id="type_'+contentLength+'" value="IMG" />'
//        str += '<img id="text_'+contentLength+'" src="#" alt="your image" width="" />'
//        str += '<button class="col-xs-1 imgContWidth_'+contentLength+'" onclick="fnImgWidthChg({length : '+contentLength+', width : 10})" style="display:none">10%</button>'
//        str += '<button class="col-xs-1 imgContWidth_'+contentLength+'" onClick="fnImgWidthChg({length : '+contentLength+', width : 25})" style="display:none">25%</button>'
//        str += '<button class="col-xs-1 imgContWidth_'+contentLength+'" onClick="fnImgWidthChg({length : '+contentLength+', width : 50})" style="display:none">50%</button>'
//        str += '<button class="col-xs-1 imgContWidth_'+contentLength+'" onClick="fnImgWidthChg({length : '+contentLength+', width : 75})" style="display:none">75%</button>'
//        str += '<button class="col-xs-1 imgContWidth_'+contentLength+'" onClick="fnImgWidthChg({length : '+contentLength+', width : 100})" style="display:none">100%</button>'
//        str += '</div>';
//		$('#sortable').append(str);
//		contentLength++;
//
//	}

//	//글쓰기 드롭다운 리스
//	function updateBlogTitleCombo(){
//		  $.ajax({
//			  url : "/manage/blog/getBlogTitleDropdown",
//			  success : function(result){
//				  $('#updateBlogTitleCombo').empty();
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
//				  $('#updateBlogTitleCombo').append(options);
//			  }
//		  })
//	  }

//	function save(){
//		var form = $('mainBlogUpdateForm')[0];
//		var formData = new FormData(form);
//
//		if($('#updateBlogFileUploadText').val() != ''){
//			formData.append('file_0', $('#updateBlogFileUpload')[0].files[0]);
//		}
//
//		var dataDt = [];
//		var count = 0;
//		for(var i = 0; i < contentLength; i++){
//			if($('#row_'+i).val() != undefined){
//				var dataList = {};
//				var textareaVal = $('#text_'+i).val();
//				var typeVal = $('#type_'+i).val();
//				var imgWidthScale = $('#text_'+i).attr('width');
//
//				if(typeVal == 'IMG'){
//					textareaVal = $('#text_'+i).attr('src');
//					if(imgWidthScale != ''){
//						imgWidthScale = fnReplaceOnlyNum(imgWidthScale);
//					}
//				}
//				dataList = {
//						idx 			: updateIdx,
//						i   			: i-count,
//						type 			: typeVal,
//						content 		: textareaVal,
//						imgWidthScale 	: imgWidthScale
//				}
//				dataDt.push(dataList);
//			}else{
//				count++;
//			}
//		}
//
//		var data = {}
//
//		if(updateIdx != ''){
//			data = {
//					idx		: updateIdx,
//					title 	: $('#updateBlogTitleCombo option:selected').text(),
//					subject : $('#updateBlogSubject').val(),
//					dataDt  : dataDt
//			}
//		}else{
//			data = {
//					title : $('#updateBlogTitleCombo option:selected').text(),
//					subject : $('#updateBlogSubject').val(),
//					dataDt  : dataDt
//			}
//		}
//		$.ajax({
//			url 	: "/manage/blog/saveBlog",
//			type	: 'POST',
////			data    : formData,
//			data	: JSON.stringify(data),
////			contentType : false,
////			processData : false,
//			contentType : "application/json, charset=utf-8",
//			async 	: false,
//			success	: function(result){
//				if($('#updateBlogFileUploadText').val() != ''){
//					$.ajax({
//						url 	: "/manage/blog/saveBlogFileUpload",
//						type	: 'POST',
//						data    : formData,
//						contentType : false,
//						processData : false,
//						async 	: false,
//						success	: function(){
//							if(result.SUCCESS){
//								alert(result.SUCCESS);
//
//							}
//						}
//					})
//				}
//
//				window.location.href="/";
//			}
//		})
//	}

//	function getSortableView(){
//		$('#sortableView').empty();
//		for(var i = 0; i < contentLength; i++){
//			var sortableInId = '#text_'+i;
//			var tagName = $(sortableInId).prop('tagName');
//			if(tagName == 'IMG'){
//				var str = $('#row_'+i).html();
//				console.log(str);
//				$('#sortableView').append(str);
//			}else{
//				var type = $('#type_'+i).val();
//				var textStr = $('#text_'+i).val();
//				$('#text_'+i).text(textStr);
//				var str = '<div>';
//				if(type == 'code'){
//					str += '<pre>'+textStr+'</pre>'
//				}else{
//					str += '<pre>'+textStr+'</pre>'
//				}
//				str += '</div>'
//
////				var str = $('#row_'+i).html();
//				console.log(str);
//				$('#sortableView').append(str);
//			}
//		}
//		$('#sortableView').attr('disabled', 'disabled');
//	}
	function fnReplaceOnlyNum(str){
	    var res;
	    res = str.replace(/[^0-9]/g,"");
	    return res;
	}

}();

$(document).ready(function(){
	MainUpdateBlogContentJs.init();
})