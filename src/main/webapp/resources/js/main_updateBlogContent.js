
var MainUpdateBlogContentJs = function(){
	"use strict";
	var contentLength = 0;
	
	return {
		init : function(){
			
			insertBlogTitleDropdown();
			
			loadingViewBlogContent();
			
			updateBlogContentEvent();
		}
	}
	
	function loadingViewBlogContent(){
		$.ajax({
			url	 : '/main/viewBlogContent',
			data : mainData,
			type : "POST",
			success : function(result){
				if(result.map){
					var map = result.map;
					idx = map.IDX;
//					$('#updateBlogContentTitle').text(map.TITLE);
					$('#updateBlogContentSubject').val(map.SUBJECT);
					$('#sortable').append(map.CONTENT);
					contentLength = map.CONTENTLENGTH;
					var list = result.list;
				}else{
					$('#sortable').text('');
				}
			}
		})
	}
	
	function updateBlogContentEvent(){
		
		  $(".zeta-menu li").hover(function(){
			    $('ul:first',this).show();
			  }, function(){
			/*     $('ul:first',this).hide(); */
			  });
			 /*  $(".zeta-menu>li:has(ul)>a").each( function() {
			    $(this).html( $(this).html()+' &or;' );
			  });
			  $(".zeta-menu ul li:has(ul)")
			    .find("a:first")
			    .append("<p style='float:right;margin:-3px'>&#9656;</p>"); */
		
		$('#updateBlogContentCancelBtn').click(function(){
			window.location.href="/";
		})
		
		$('#updateBlogContentSaveBtn').click(function(){
			save();
		});
		
		//파일업로드
		$('#updateBlogFileUploadBtn').click(function(){
			$('#updateBlogFileUpload').trigger('click');
		});
		//파일업로드 내용변경시 텍스트변경
		$('#updateBlogFileUpload').on('change', function(){
			var fileValue = $('#updateBlogFileUpload').val().split("\\");
			var fileName = fileValue[fileValue.length-1]; // 파일명

			$('#updateBlogFileUploadText').val(fileName);
		});
		
		//메뉴 추가 버튼
		$('#insertMenuAddBtn').click(function(){
			var insertValue = $('#insertMenu').val();
			$('#insertBlogTitleDropdown').prepend('<option value="0" id="insertBlogComboAdd">'+insertValue+'</option>');
		});
		
		//글상자추가
		$('#updateBlogAddText').click(function(){
			$('#sortable').append(
					'<div><textarea id="text_'+contentLength+'" class="blogText form-control col-md-12"  style="height:100px;" ></textarea></div>'
			);
			contentLength++;
		});
		
		//코드추가
		$('#updateBlogAddCode').click(function(){
			$('#sortable').append(
					'<div><textarea id="text_'+contentLength+'" class=" blogCode form-control col-md-12" style="background:black; color:white;height:100px;" ></textarea></div>'
			);
			contentLength++;
		});
		
		//이미지추가
		$('#updateBlogAddImg').click(function(){
			$('#sortable').append('<div><img id="text_'+contentLength+'" src="#" alt="your image" /></div>');
			contentLength++;
			$('#blogUpdateImgInput').trigger('click');
		});
		
		$("#blogUpdateImgInput").change(function(){
		    readURL(this);
		});
		
		function readURL(input) {
		    if (input.files && input.files[0]) {
		        var reader = new FileReader();
		        reader.onload = function (e) {
		            $('#text_'+(contentLength-1)).attr('src', e.target.result);
//		            $('#textView_'+(contentLength-1)).attr('src', e.target.result);
		        }
		        reader.readAsDataURL(input.files[0]);
		    }
		}
		//타이핑 화면
		$('#typping').on('click', function(e){
			e.preventDefault();
			$('#sortable').css('display', 'block');
			$('#sortableView').css('display', 'none');
		});
		//뷰 화면
		$('#typingView').on('click', function(e){
			e.preventDefault();
			$('#sortable').css('display', 'none');
			$('#sortableView').css('display', 'block');
//			getSortableView();
		});
	}
	//글쓰기 드롭다운 리스
	  function insertBlogTitleDropdown(){
		  $.ajax({
			  url : "/main/getBlogTitleDropdown",
			  success : function(result){
				  $('#insertBlogTitleDropdown').empty();
				  var options = '';
				  console.log(result.list);
				  if(result.list){
					  var list = result.list;
					  var count = list.length * 10;
					  var listValue = 0;
					  for(var i in list){
						  if(listValue != count){
							  listValue += 10;
						  }
						  options += '<option value="'+listValue+'" >'+list[i].NAME+'</option>';
					  }  
				  }
				  $('#insertBlogTitleDropdown').append(options);
			  }
		  })
	  }

	function save(){
		var form = $('mainBlogUpdateForm')[0];
		var formData = new FormData(form);
		
		formData.append('file', $('#blogUpdateImgInput')[0].files[0]);
		
		var dataDt = [];
		for(var i = 0; i < contentLength; i++){
			var dataList = {};
			var textareaVal = $('#text_'+i).val();
			console.log(textareaVal);
			if(textareaVal == ''){
				textareaVal = 'file';
			}
			dataList = {
					idx : idx,
					i   : i,
					content : textareaVal
			}
			dataDt.push(dataList);
		}
		var data = {}

		if(idx != ''){
			data = {
					idx		: idx,
					title 	: $('#insertBlogTitleDropdown option:selected').text(),
					subject : $('#updateBlogContentSubject').val(),
//					content : $('#sortable').html().trim(),
//					content : $('#updateBlogContentContent').val(),
					contentLength : contentLength,
					dataDt  : dataDt
			}
		}else{
			data = {
					title : $('#insertBlogTitleDropdown option:selected').text(),
					subject : $('#updateBlogContentSubject').val(),
					content : $('#sortable').html().trim(),
//					content : $('#updateBlogContentContent').val(),
					contentLength : contentLength
			}
		}	

		$.ajax({
			url 	: "/main/saveBlogContent",
			type	: 'POST',
//			data    : formData,
			data	: JSON.stringify(data),
//			contentType : false,
//			processData : false,
			contentType : "application/json, charset=utf-8",
			async 	: false,
			success	: function(result){
				$.ajax({
					url 	: "/main/saveBlogFileUpload",
					type	: 'POST',
					data    : formData,
					contentType : false,
					processData : false,
					async 	: false,
					success	: function(){
						if(result.SUCCESS){
							alert(result.SUCCESS);
							window.location.href="/";
						}
					}
				})	
			}
		})
	}
	
//	function getSortableView(){
//		$('#sortableView').empty();
//		for(var i = 0; i < contentLength; i++){
//			var sortableInId = '#text_'+i;
//			var tagName = $(sortableInId).prop('tagName');
//			if(tagName == 'IMG'){
//				$('#sortableView').append('<div><img id="textView_'+contentLength+'" src="#" alt="your image" /></div>');
//			}else{
//				$('#sortableView').append('<div><div id="textView_'+contentLength+' ></div></div>');
//			}
//		}
//	}
	
}();

$(document).ready(function(){
	MainUpdateBlogContentJs.init();
})