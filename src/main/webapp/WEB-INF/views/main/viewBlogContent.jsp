<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<section>
	<div class="container" style="padding-top:100px;">
		<div class="col-xs-12">
			<input id="viewBlogContentIdx" type="hidden" value="" /> 
			<span id="viewBlogContentTitle" ></span>
			<span id="viewBlogContentSubject" ></span>
		</div>
		<div class="col-xs-12">
			<div id="viewBlogContentContent">
			
			</div>
		</div>
		<div class="col-xs-12">
			<button id="viewBlogContentUpdateBtn" type="button" class="btn btn-default" style="display:none">수정하기</button>
			<button id="viewBlogContentCancelBtn" type="button" class="btn btn-default" >메인으로</button>
		</div>
		<div class="form-group" id="viewBlogReContentArea" >
			<table class="table table-hover col-xs-8" >
				<tbody>
				
				</tbody>
			</table>
		</div>
	</div>
</section>

<script src="/resources/js/main_viewBlogContent.js"></script>