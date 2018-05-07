<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- <script src="//code.jquery.com/jquery.min.js"></script> -->

<section>
	<form id="mainBlogUpdateForm" name="mainBlogUpdateForm" onsubmit="return false;" enctype="multipart/form-data">
		<div class="container" style="padding-top:100px;">
			<div class="search-form clearfix">
	        	<div class="search-controls col-md-12" >
					<!-- 고객사 -->
	<!-- 				<div class="form-group col-md-p20" id="assetCompNmGroup">
						<div class="input-group input-group-sm" >
							<span class="span-info  input-group-addon">고객사명</span>
							<input type="text" class="form-control input-sm" id="preventiveCheckListCompNm" >
						</div>
					</div> -->
					<!-- 메뉴명 -->
					<div class="form-group col-md-2">
						<div class="input-group input-group-sm">
							<span class="span-info  input-group-addon">메뉴명</span>
							<select class="form-control input-sm" id="insertBlogTitleDropdown">
							</select>
						</div>
					</div>
					<!-- 제목 -->
					<div class="form-group col-md-6">
						<div class="input-group input-group-sm" >
							<span class="span-info  input-group-addon">제목</span>
							<input type="text" class="form-control input-sm" id="updateBlogContentSubject" >
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


	        	<div class="search-controls col-md-12" >
					<!-- 내용 -->
					<div class="form-group col-md-12">
						<div class="input-group input-group-sm">
							<span class="span-info  input-group-addon">내용</span>
							<label></label>
							<textarea id="updateBlogContentContent" name="updateBlogContentContent" class="form-control col-md-12" 
							rows="50" style="height:500px;"
							onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}">
							</textarea>
						</div>
					</div>
				</div>
			</div>
			
        	<div class="search-button-group col-md-12" >
   				<div class="form-group col-md-12">
					<!-- 버튼 -->
					<button id="updateBlogContentSaveBtn" type="button" class="btn btn-sm btn-info" >저장하기</button>
					<button id="updateBlogContentCancelBtn" type="button" class="btn btn-sm btn-info" >메인으로</button>
				</div>
			</div>
		</div>
	</form>
</section>

<script src="/resources/js/main_updateBlogContent.js"></script>
