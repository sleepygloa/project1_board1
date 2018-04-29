<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<section>
	<div class="container" style="padding-top:100px;">
		<div class="col-xs-12">
			<input id="viewBlogContentIdx" type="hidden" value="" /> 
			<span id="viewBlogContentTitle" style="display:inline-block"></span>
			<span id="viewBlogContentSubject" style="display:inline-block"></span>
			<div class='zeta-menu-bar'><!-- 나중에 참고 할 수 있는 주석 처리 -->
				<ul class="zeta-menu" >
				  <li><a href="#" id="updateBlogFileUploadBtn">파일 업로드</a>
				    <ul id="zeta-li">
					</ul>
				 </li>
				<!--     <li><a href="#">3번 메뉴</a>
				      <ul>
				        <li><a href="#">3-A 메뉴</a></li>
				        <li><a href="#">3-B 메뉴</a></li>
				      </ul>
				    </li> 
				    <li><a href="#">4번 메뉴</a></li>  -->
				  </ul>
			</div>
<%-- 				<div id="fileDiv" class="col-xs-2">
					<p class="col-xs-12" style="height:50px;">
						<input type="hidden" id="IDX" name="IDX_${var.index }" value="${row.IDX }" >
						<a href="#this" id="name_${var.index }" name="name_${var.index }">${row.ORIGINAL_FILE_NAME }  (${row.FILE_SIZE }kb)</a>
					</p>
				</div> --%>
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