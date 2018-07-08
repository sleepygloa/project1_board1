<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<input id="viewBlogContentIdx" type="hidden" value="" /> 
<div id="viewBlogSubject" class="form-control">
	<input id="viewBlogContentSubject" type="text" class="col-xs-12 input-sm inputWhite"  disabled />
</div>
<div class="form-control">
	<span class="spanWhite" id="updateBlogFileUploadBtn">파일업로드</span>
	<input id="updateBlogFileUpload" type="file" value="" style="display:none"/>
	<input id="updateBlogFileUploadText" type="text" class="form-control input-sm inputWhite" disabled />
</div>
<div id="viewBlogContentContent" class="form-control" >
</div>
<div class="form-control">
	<!-- 버튼 -->
	<button id="viewBlogContentUpdateBtn" type="button" class="btn btn-sm btn-info" style="display:none">수정하기</button>
	<button id="viewBlogContentCancelBtn" type="button" class="btn btn-sm btn-info" >메인으로</button>
</div>

<script src="/resources/js/main_viewBlogContent.js"></script>