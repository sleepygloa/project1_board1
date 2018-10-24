<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="col-lg-12">
	<div class="form-control col-lg-12" style="height:50px;">
<!-- 		<div class="col-lg-6 pull-left" >
			<a href="#" class="btn btn-outline-success btn-sm pull-right" data-toggle="modal" data-target="#myModal">추가</a>
			<select class="form-control col-lg-11 input-sm" id="updateBlogTitleCombo"></select>
		</div> -->
<!-- 		<div class="col-lg-6 pull-left">
			<a href="#" id="updateBlogFileUploadBtn" class="btn btn-outline-success btn-sm pull-left">파일업로드</a>
			<input id="updateBlogFileUpload" type="file" value="" style="display:none"/>
			<input id="updateBlogFileUploadText" type="text" class="form-control col-lg-10 input-sm inputWhite" disabled style="background:white;" />
		</div> -->
	</div>
<!-- 	<div id="viewBlogSubject" class="form-control col-lg-12">
		<input id="updateBlogSubject" type="text" class="col-lg-12 inputWhite blog-subject" placeholder="제목" />
	</div>
	<div class="form-control col-lg-12">
		<a href="#" id="updateBlogAddText" class="btn btn-outline-success btn-sm">글상자</a>
		<a href="#" id="updateBlogAddCode" class="btn btn-outline-success btn-sm">코드</a>
		<a href="#" id="updateBlogAddImg" class="btn btn-outline-success btn-sm">이미지</a>
		<a href="#" id="updateBlogRemove" class="btn btn-outline-success btn-sm">컨텐츠삭제</a>
		<input type="file" id="blogUpdateImgInput" style="display:none"/>
		<a href="#" id="typping" class="btn btn-outline-success btn-sm">글</a>
		<a href="#" id="typingView" class="btn btn-outline-success btn-sm">뷰</a>
	</div>
	<div id="sortable" class="form-control col-lg-12" >
	</div>
	<div id="sortableView" style="display:none;">
	</div> -->
	<div class="form-control col-lg-12">
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
</div>



<script src="/resources/js/manage/blog/blogContentsUpdate.js"></script>
