var MainUpdateBlogContentJs = function(){
	"use strict";
	var contentLength = 0;
	var focusIdx = -1;

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
		    var str = '<div id="row_'+contentLength+'">';
		    str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
		    str += '<input type="hidden" id="type_'+contentLength+'" value="text" />'
	        str += '<textarea id="text_'+contentLength+'" class="form-control col-md-12"  style="min-height:100px;" ></textarea>'
	        str += '</div>';
			$('#sortable').append(str);
			contentLength++;
		});

		//코드추가
		$('#updateBlogAddCode').click(function(){
            var str = '<div id="row_'+contentLength+'">';
            str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
            str += '<input type="hidden" id="type_'+contentLength+'" value="code" />'
            str += '<textarea id="text_'+contentLength+'" class="form-control col-md-12"  style="min-height:100px; background:black; color:white;"></textarea>'
            str += '</div>';
			$('#sortable').append(str);
			contentLength++;
		});

		//이미지추가
		$('#updateBlogAddImg').click(function(){
            var str = '<div id="row_'+contentLength+'">';
            str += '<input type="hidden" id="idx_'+contentLength+'" value="'+contentLength+'" />'
            str += '<input type="hidden" id="type_'+contentLength+'" value="img" />'
            str += '<img id="text_'+contentLength+'" src="#" alt="your image" />'
            str += '</div>';
			$('#sortable').append(str);
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
		        }
		        reader.readAsDataURL(input.files[0]);
		    }
		}
		
		//삭제
		$('#updateBlogRemove').click(function(){
		    $('#focusIdx').remove();
		});

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
			getSortableView();
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

		

		var dataDt = [];
		for(var i = 0; i < contentLength; i++){
			var dataList = {};
			var textareaVal = $('#text_'+i).val();
			var typeVal = $('#type_'+i).val();
			if(textareaVal == ''){
				textareaVal = 'file';
				formData.append(i, $('#text_'+i)[0].files[0]);
			}
			dataList = {
					idx : idx,
					i   : i,
					type 	: typeVal,
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
					dataDt  : dataDt
			}
		}else{
			data = {
					title : $('#insertBlogTitleDropdown option:selected').text(),
					subject : $('#updateBlogContentSubject').val(),
					dataDt  : dataDt
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

	function getSortableView(){
		$('#sortableView').empty();
		for(var i = 0; i < contentLength; i++){
			var sortableInId = '#text_'+i;
			var tagName = $(sortableInId).prop('tagName');
			if(tagName == 'IMG'){
				var str = $('#row_'+i).html();
				console.log(str);
				$('#sortableView').append(str);
			}else{
				var type = $('#type_'+i).val();
				var textStr = $('#text_'+i).val();
				$('#text_'+i).text(textStr);
				var str = '<div>';
				if(type == 'code'){
					str += '<pre>'+textStr+'</pre>'
				}else{
					str += '<pre>'+textStr+'</pre>'
				}
				str += '</div>'
				
//				var str = $('#row_'+i).html();
				console.log(str);
				$('#sortableView').append(str);
			}
		}
		$('#sortableView').attr('disabled', 'disabled');
	}

}();

$(document).ready(function(){
	MainUpdateBlogContentJs.init();
})