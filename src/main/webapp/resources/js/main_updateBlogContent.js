var gfv_count = 0;

function fn_addaFile(i){
	var findId = '#file_'+(i);
	console.log(findId);
	$(findId).trigger('click');
}

function fn_deleteFile(obj){
	obj.parent().remove();
	gfv_count--;
}

var MainUpdateBlogContentJs = function(){
	"use strict";
	
	return {
		init : function(){
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
				var map = result.map;
				idx = map.IDX;
				$('#updateBlogContentTitle').text(map.TITLE);
				$('#updateBlogContentSubject').val(map.SUBJECT);
				$('#updateBlogContentContent').text(map.CONTENT);
				
				var list = result.list;
				var str = '';
				if(list != undefined){
					for (var i = 0; i < list.length; i++){
						str += 
							"<li>"
							+	"<span id='file_text_"+i+"'>"+list[i].ORIGINAL_FILE_NAME+"</span>"
							+	"<input type='hidden' id='idx_"+(i)+"' name='idx_"+(i)+"' style='display:none;' value='"+list[i].IDX+"' />"
							+	"<input type='file' id='file_"+(i)+"' name='file_"+(i)+"' style='display:none;' />"
							+	"<a href='#' id='delete_"+(i)+"' ><i class='fa fa-minus'></i></a>"
						+	"</li>";
						gfv_count++;
					}
					$("#zeta-li").append(str);
					
					for(var i = 0; i < gfv_count; i++){
						$("#delete_"+(i)).on("click", function(e){ //삭제 버튼
							e.preventDefault();
							fn_deleteFile($(this));
						});
					}
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
			fn_addFile();
		});
		//파일 삭제
		$("i[name^='delete']").on("click", function(e){ //삭제 버튼
			e.preventDefault();
			fn_deleteFile($(this));
		});
		
	}
	
	function save(){
		var form = $('mainBlogUpdateForm')[0];
		var formData = new FormData(form);
		var flag = false;
		var j = 0;
		for(var i = 0; i < $('input[id^=file_]').length; i++){
			if($('input[id^=file_]')[i] != undefined){
				console.log($('#file_'+j)[0].files[0]);
				console.log($('#file_'+j).val());
				if($('input[id=idx_'+j+']').val() != undefined){
					formData.append('idx_'+j, $('#idx_'+j).val());
					formData.append('file_'+j, $('#file_'+j)[0].files[0]);
					j++;
					
					continue;
				}else{
					var id = 'file_' + j;
					formData.append(id, $('#'+id)[0].files[0]);
					console.log('파일추가되었습 넘버 : '+j);
					console.log('파일추가되었습 넘버 : '+formData.get(id));
				j++;
				}
			}else{
				j++;
			}
			
		}
		formData.append("j", j);
		formData.append('idx', idx);
		formData.append('subject', $('#updateBlogContentSubject').val());
		formData.append('content', $('#updateBlogContentContent').val());
		formData.append('s_userId', s_userId);
		
		
		$.ajax({
			url 	: "/main/saveBlogContent",
			type	: 'POST',
			data	: formData,
			contentType : false,
			processData : false,
			async 	: false,
			success	: function(result){
				if(result.SUCCESS){
					alert(result.SUCCESS);
					
					window.location.href="/";
				}
			}
		})
	}
	
	function fn_addFile(){
		var i = gfv_count;
		var str = 
				"<li>"
				+	"<span id='file_text_"+i+"'></span>"
				+	"<input type='file' id='file_"+(i)+"' name='file_"+(i)+"' style='display:none;'>"
				+	"<a href='#' id='add_"+(i)+"' name='add_"+(i)+"' onclick='fn_addaFile("+i+")'><i class='fa fa-plus'></i></a>"
				+	"<a href='#' id='delete_"+(i)+"' ><i class='fa fa-minus'></i></a>";
			+	"</li>";
		$("#zeta-li").append(str);
		$("#delete_"+(i)).on("click", function(e){ //삭제 버튼
			e.preventDefault();
			fn_deleteFile($(this));
		});
		$('#file_'+i).on('change', function(){
			var fileValue = $("#file_"+i).val().split("\\");
			var fileName = fileValue[fileValue.length-1]; // 파일명

			var fileText = '#file_text_'+(i);
			$('#file_text_'+i).text(fileName);
		});
		gfv_count++;
	}
	
}();

$(document).ready(function(){
	MainUpdateBlogContentJs.init();
})