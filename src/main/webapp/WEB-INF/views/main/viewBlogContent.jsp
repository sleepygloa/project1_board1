<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<section>
	<form id="mainBlogUpdateForm" name="mainBlogUpdateForm" onsubmit="return false;" enctype="multipart/form-data">
		<div class="container" style="padding-top:100px;">
			<div class="search-form clearfix">
	        	<div class="search-controls col-md-12" >
					<!-- 메뉴명 -->
					<div class="form-group col-md-3">
						<div class="input-group input-group-sm">
							<span class="span-info  input-group-addon">메뉴명</span>
							<input id="viewBlogContentTitle" type="text" class="form-control input-sm" disabled />
						</div>
					</div>
					<!-- 제목 -->
					<div class="form-group col-md-5">
						<div class="input-group input-group-sm" >
							<span class="span-info  input-group-addon">제목</span>
							<input type="text" class="form-control input-sm" id="viewBlogContentSubject" disabled >
						</div>
					</div>
					<!-- 파일업로드  -->
					<div class="form-group col-md-4">
						<div class="input-group input-group-sm" >
							<span class="span-info  input-group-addon" id="updateBlogFileUploadBtn">파일업로드</span>
							<input id="updateBlogFileUpload" type="file" value="" style="display:none"/>
							<input id="updateBlogFileUploadText" type="text" class="form-control input-sm" disabled />
						</div>
					</div>
				</div>
			<input id="viewBlogContentIdx" type="hidden" value="" /> 

	        	<div class="search-controls col-md-12" >
					<!-- 내용 -->
					<div id="viewBlogContentContent" class="form-group col-md-12" >
					</div>
				</div>
			</div>
			
        	<div class="search-button-group col-md-12" >
   				<div class="form-group col-md-12">
					<!-- 버튼 -->
					<button id="viewBlogContentUpdateBtn" type="button" class="btn btn-sm btn-info" style="display:none">수정하기</button>
					<button id="viewBlogContentCancelBtn" type="button" class="btn btn-sm btn-info" >메인으로</button>
				</div>
			</div>
		</div>
	</form>
</section>

<script src="/resources/js/main_viewBlogContent.js"></script>