<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- <script src="//code.jquery.com/jquery.min.js"></script> -->

<section>
	<form id="mainBlogUpdateForm" name="mainBlogUpdateForm" onsubmit="return false;" enctype="multipart/form-data">
		<div class="container" style="padding-top:100px;">
			<div class="search-form clearfix">
	        	<div class="search-controls col-md-12" >
					<!-- Modal -->
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
					        <button type="button" class="btn btn-primary" id="insertMenuAddBtn">추가</button>
					      </div>
					    </div>
					  </div>
					</div>
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
							<span class="span-info input-group-addon" data-toggle="modal" data-target="#myModal">메뉴명</span>
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
				<div class="search-controls col-md-12">
					<div class="form-group">
						<button class="form-group col-xs-2" id="updateBlogAddText">글상자</button>
						<button class="form-group col-xs-2" id="updateBlogAddCode">코드</button>
						<button class="form-group col-xs-2" id="updateBlogAddImg">이미지</button>
						<button class="form-group col-xs-2" id="updateBlogRemove">컨텐츠삭제</button>
						<input type="file" id="blogUpdateImgInput" style="display:none"/>
						<button class="form-group col-xs-1" id="typping">글</button>
						<button class="form-group col-xs-1" id="typingView">뷰</button>
					</div>
				</div>

	        	<div class="search-controls col-md-12" >
					<!-- 내용 -->
					<div class="form-group col-md-12" id="sortable">
						<textarea id="dddd">dfsfs</textarea>
					</div>
					<div class="form-group col-md-12" id="sortableView" style="display:none">
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
