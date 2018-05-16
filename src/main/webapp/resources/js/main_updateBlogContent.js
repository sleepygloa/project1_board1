var MainUpdateBlogContentJs = function(){
	"use strict";
	
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
					$('#updateBlogContentContent').text(map.CONTENT);
					
					var list = result.list;
					
				}else{
					$('#updateBlogContentContent').text('');
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
//		var form = $('mainBlogUpdateForm')[0];
//		var formData = new FormData(form);
//		
//		formData.append('file_0', $('#updateBlogFileUpload')[0].files[0]);
//		formData.append('title', $('#insertBlogTitleDropdown option:selected').text());
//		formData.append('subject', $('#updateBlogContentSubject').val());
//		formData.append('content', $('#updateBlogContentContent').val());
//		if(idx != ''){
//			formData.append('idx', idx);
//		}
		
		var data = {}

		if(idx != ''){
			data = {
					idx		: idx,
					title 	: $('#insertBlogTitleDropdown option:selected').text(),
					subject : $('#updateBlogContentSubject').val(),
					content : $('#updateBlogContentContent').val()
			}
		}else{
			data = {
					title : $('#insertBlogTitleDropdown option:selected').text(),
					subject : $('#updateBlogContentSubject').val(),
					content : $('#updateBlogContentContent').val()
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
				if(result.SUCCESS){
					alert(result.SUCCESS);
					window.location.href="/";
				}
			}
		})
	}
	
}();

$(document).ready(function(){
	MainUpdateBlogContentJs.init();
})