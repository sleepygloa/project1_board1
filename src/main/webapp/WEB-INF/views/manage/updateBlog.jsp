<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="col-xs-w100">
	<div class="col-xs-w100">
		<a id="updateBlogTextBox" type="button" class="btn btn-sm btn-info pull-left" >글상자</a>
		<a id="updateBlogImg" type="button" class="btn btn-sm btn-info pull-left" >이미지</a>
		<a id="updateBlogs" type="button" class="btn btn-sm btn-info pull-left" >미정</a>
		
	
		<a id="updateBlogSaveBtn" type="button" class="btn btn-sm btn-info pull-right" >저장하기</a>
		<a id="updateBlogCancelBtn" type="button" class="btn btn-sm btn-info pull-right" >메인으로</a>
	</div>


	<div class="col-xs-w100" style="margin-bottom:20px;">
		<div class="col-xs-w20">
			<select id="updateBlogTitle" class="col-xs-w100">
			</select>
		</div>
		<div class="col-xs-w80">
			<input type="text" class="col-xs-w100"/>
		</div>
	</div>
	
	
	<div id="updateBloxViewArea" class="col-xs-w100">
	
	</div>
<!--	<div class="form-control">
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
						<button id="insertMenuCloseBtn" type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
						<button id="insertMenuAddBtn" type="button" class="btn btn-primary" data-dismiss="modal">추가</button>
					</div>
				</div>
			</div>
		</div>
	</div> -->
</div>

<script src="/js/views/manage/updateBlog.js"></script>
