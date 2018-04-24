<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script>
CKEDITOR.replace( 'editor1', {//해당 이름으로 된 textarea에 에디터를 적용
	            width:'100%',
	            height:'400px',
	            filebrowserImageUploadUrl: '/community/imageUpload' //여기 경로로 파일을 전달하여 업로드 시킨다.
	        });
	         
	         
	        CKEDITOR.on('dialogDefinition', function( ev ){
	            var dialogName = ev.data.name;
	            var dialogDefinition = ev.data.definition;
	          
	            switch (dialogName) {
	                case 'image': //Image Properties dialog
	                    //dialogDefinition.removeContents('info');
	                    dialogDefinition.removeContents('Link');
	                    dialogDefinition.removeContents('advanced');
	                    break;
	            }
	        });
</script>
<section>
	<div class="container" style="padding-top:100px;">
		<div class="col-xs-12">
			<a id="updateBlogContentTitle" type="button" class="btn btn-default"></a>
			<input id="updateBlogContentSubject" type="text" value=""/>
		</div>
		<div class="col-xs-12">
			<div>
				<textarea id="editor1" name="editor1" class="col-xs-12" rows="50" style="border:none"
				onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}">
				</textarea>
			</div>
		</div>
		<div class="col-xs-12">
			<button id="updateBlogContentSaveBtn" type="button" class="btn btn-default" >수정하기</button>
			<button id="updateBlogContentCancelBtn" type="button" class="btn btn-default" >메인으로</button>
		</div>
	</div>
</section>

<script src="/resources/js/main_updateBlogContent.js"></script>
<!-- <script src="/resources/js/ckeditor5-build-classic/ckeditorSetting.js"></script> -->
