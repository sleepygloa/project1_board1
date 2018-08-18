<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<div class="form-control">
	<span data-toggle="modal" data-target="#myModal">추</span>
	<select class="form-control input-sm" id="insertBlogTitleDropdown"></select>
</div>
<div id="viewBlogSubject" class="form-control">
	<input id="updateBlogContentSubject" type="text" class="input-sm inputWhite" placeholder="제목" />
</div>
<div class="form-control" >
	<span class="spanWhite" id="updateBlogFileUploadBtn">파일업로드</span>
	<input id="updateBlogFileUpload" type="file" value="" style="display:none"/>
	<input id="updateBlogFileUploadText" type="text" class="form-control input-sm inputWhite" disabled />
</div>
<div class="form-control">
	<button class="form-group col-xs-2" id="updateBlogAddText">글상자</button>
	<button class="form-group col-xs-2" id="updateBlogAddCode">코드</button>
	<button class="form-group col-xs-2" id="updateBlogAddImg">이미지</button>
	<button class="form-group col-xs-2" id="updateBlogRemove">컨텐츠삭제</button>
	<input type="file" id="blogUpdateImgInput" style="display:none"/>
	<button class="form-group col-xs-1" id="typping">글</button>
	<button class="form-group col-xs-1" id="typingView">뷰</button>
</div>
<div id="sortable" class="form-control" >
</div>
<div id="sortableView" style="display:none;">
</div>
<div class="form-control">
	<!-- 버튼 -->
	<button id="updateBlogContentSaveBtn" type="button" class="btn btn-sm btn-info" >저장하기</button>
	<button id="updateBlogContentCancelBtn" type="button" class="btn btn-sm btn-info" >메인으로</button>
</div>

<div class="form-control">
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">메뉴 추가</h4>
				</div>
				<div class="modal-body">
					<input type="text" class="form-group" id="insertMenu"/>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
					<button type="button" class="btn btn-primary" id="insertMenuAddBtn" data-dismiss="modal">추가</button>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/resources/js/manage/blog/main_updateBlogContent.js"></script>
