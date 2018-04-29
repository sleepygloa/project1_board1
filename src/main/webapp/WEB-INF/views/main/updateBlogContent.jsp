<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script>
 CKEDITOR.replace( 'updateBlogContentContent');
</script>

<script src="//code.jquery.com/jquery.min.js"></script>

<section>
	<form id="mainBlogUpdateForm" name="mainBlogUpdateForm" onsubmit="return false;" enctype="multipart/form-data">
		<div class="container" style="padding-top:100px;">
			<div class="col-xs-12">
				<a id="updateBlogContentTitle" type="button" class="btn btn-default"></a>
				<input id="updateBlogContentSubject" type="text" value="" />
				<div class='zeta-menu-bar'><!-- 나중에 참고 할 수 있는 주석 처리 -->
					<ul class="zeta-menu" >
					  <li><a href="#" id="updateBlogFileUploadBtn">파일 업로드</a>
					    <ul id="zeta-li">
						</ul>
					 </li>
					<!--     <li><a href="#">3번 메뉴</a>
					      <ul>
					        <li><a href="#">3-A 메뉴</a></li>
					        <li><a href="#">3-B 메뉴</a></li>
					      </ul>
					    </li> 
					    <li><a href="#">4번 메뉴</a></li>  -->
					  </ul>
				</div>
	<%-- 				<div id="fileDiv" class="col-xs-2">
						<p class="col-xs-12" style="height:50px;">
							<input type="hidden" id="IDX" name="IDX_${var.index }" value="${row.IDX }" >
							<a href="#this" id="name_${var.index }" name="name_${var.index }">${row.ORIGINAL_FILE_NAME }  (${row.FILE_SIZE }kb)</a>
						</p>
					</div> --%>
			</div>
			<div class="col-xs-12">
				<div>
					<textarea id="updateBlogContentContent" name="updateBlogContentContent" class="col-xs-12" rows="50" style="border:none"
					onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}">
					</textarea>
				</div>
			</div>
			<div class="col-xs-12">
				<button id="updateBlogContentSaveBtn" type="button" class="btn btn-default" >수정하기</button>
				<button id="updateBlogContentCancelBtn" type="button" class="btn btn-default" >메인으로</button>
			</div>
		</div>
	</form>
</section>

<script src="/resources/js/main_updateBlogContent.js"></script>
<!-- <script src="/resources/js/ckeditor5-build-classic/ckeditorSetting.js"></script> -->
