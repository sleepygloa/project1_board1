<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="col-lg-12" style="margin-bottom:100px;">
	<div id="viewBlogSubject" class="form-control">
		<input id="blogSubject" type="text" class="col-lg-12 inputWhite viewInput"  disabled />
	</div>
	<div class="form-control">
		<span class="spanWhite col-lg-1" id="updateBlogFileUploadBtn">파일업로드</span>
		<input id="updateBlogFileUpload" type="file" value="" style="display:none"/>
		<input id="updateBlogFileUploadText" type="text" class="col-lg-10 inputWhite viewInput" disabled />
	</div>
	<div id="viewBlogContainer" class="form-control viewContentContainer" >
	</div>
	<div class="form-control">
		<!-- 버튼 -->
		<a href="#" id="blogDeleteBtn" class="btn btn-outline-success btn-sm" style="display:none;">삭제</a>
		<a href="#" id="blogModifyBtn" class="btn btn-outline-success btn-sm" style="display:none;">수정</a>
		<a href="#" id="blogCancelBtn" class="btn btn-outline-success btn-sm" >메인</a>
	</div>
	<div id="blogRe" class="re-container" >
	</div>
</div>

