<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="col-lg-12">
	<div id="viewBlogSubject" class="form-control">
		<input id="blogSubject" type="text" class="col-lg-12 inputWhite"  disabled />
	</div>
	<div class="form-control">
		<span class="spanWhite" id="updateBlogFileUploadBtn">파일업로드</span>
		<input id="updateBlogFileUpload" type="file" value="" style="display:none"/>
		<input id="updateBlogFileUploadText" type="text" class="col-lg-12 inputWhite" disabled />
	</div>
	<div id="viewBlogContainer" class="form-control" >
	</div>
	<div class="form-control">
		<!-- 버튼 -->
		<a id="blogDeleteBtn" type="button" class="btn btn-sm btn-info" style="display:none">삭제하기</a>
		<a id="blogModifyBtn" type="button" class="btn btn-sm btn-info" style="display:none">수정하기</a>
		<a id="blogCancelBtn" type="button" class="btn btn-sm btn-info" >메인으로</a>
	</div>
	<div id="blogRe" class="re-container" >
	</div>
</div>

