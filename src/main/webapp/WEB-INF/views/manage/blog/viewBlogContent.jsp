<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="col-lg-12">
	<input id="viewBlogContentIdx" type="hidden" value="" /> 
	<div id="viewBlogSubject" class="form-control">
		<input id="viewBlogContentSubject" type="text" class="col-lg-12 inputWhite"  disabled />
	</div>
	<div class="form-control">
		<span class="spanWhite" id="updateBlogFileUploadBtn">파일업로드</span>
		<input id="updateBlogFileUpload" type="file" value="" style="display:none"/>
		<input id="updateBlogFileUploadText" type="text" class="col-lg-12 inputWhite" disabled />
	</div>
	<div id="viewBlogContentContent" class="form-control" >
	</div>
	<div class="form-control">
		<!-- 버튼 -->
		<button id="viewBlogContentDeleteBtn" type="button" class="btn btn-sm btn-info" style="display:none">삭제하기</button>
		<button id="viewBlogContentUpdateBtn" type="button" class="btn btn-sm btn-info" style="display:none">수정하기</button>
		<button id="viewBlogContentCancelBtn" type="button" class="btn btn-sm btn-info" >메인으로</button>
	</div>
	<div id="blogRe" >
	</div>
</div>


<script src="/resources/js/manage/blog/blogContentsView.js"></script>